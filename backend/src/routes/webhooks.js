import crypto from 'crypto';
import express from 'express';
import bcrypt from 'bcryptjs';

import { User } from '../models/User.js';

export const lemonsqueezyWebhookRouter = express.Router();

function verify(rawBodyBuf, signingSecret, signatureHex) {
  if (!signatureHex || !signingSecret) return false;
  const hmac = crypto.createHmac('sha256', signingSecret);
  hmac.update(rawBodyBuf);
  const digest = hmac.digest('hex');
  try {
    const a = Buffer.from(digest, 'utf8');
    const b = Buffer.from(String(signatureHex).trim(), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function normEvent(name) {
  return String(name || '')
    .trim()
    .toLowerCase();
}

function flattenCustomObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  return { ...obj };
}

function extractUserIdFromCustomArray(customArr) {
  const hit = Array.isArray(customArr) ? customArr.find((item) => item?.key === 'user_id') : null;
  if (hit?.value) return String(hit.value);
  return null;
}

function extractUserIds(body) {
  const ids = new Set();

  const metaCd = flattenCustomObject(body?.meta?.custom_data);
  if (metaCd.user_id) ids.add(String(metaCd.user_id));

  const attrsCheckout = body?.data?.attributes?.checkout_data?.custom;
  const fromCheckout = extractUserIdFromCustomArray(attrsCheckout);
  if (fromCheckout) ids.add(fromCheckout);

  const nestedCustom = body?.data?.attributes?.first_order?.checkout_custom;
  if (nestedCustom?.user_id) ids.add(String(nestedCustom.user_id));

  return [...ids];
}

function includedCustomers(body) {
  const rows = {};
  for (const row of body?.included ?? []) {
    const typeStr = row?.type || '';
    const id = row?.id != null ? String(row.id) : null;
    if (!id) continue;
    if (typeStr.includes('customers') || typeStr === 'customers') {
      rows[id] = row.attributes || {};
    }
  }
  return rows;
}

function includedSubscriptions(body) {
  const rows = {};
  for (const row of body?.included ?? []) {
    const typeStr = row?.type || '';
    const id = row?.id != null ? String(row.id) : null;
    if (!id) continue;
    if (typeStr.includes('subscriptions') || typeStr === 'subscriptions') {
      rows[id] = row.attributes || {};
    }
  }
  return rows;
}

function idsFromRelationships(node) {
  if (!node?.data) return [];
  const d = node.data;
  return (Array.isArray(d) ? d : [d])
    .map((x) => (x?.id ? String(x.id) : null))
    .filter(Boolean);
}

async function findUserViaCustomIds(ids) {
  for (const id of ids) {
    const candidate = await User.findById(id);
    if (candidate) return candidate;
  }
  return null;
}

async function findUserViaEmails(...emails) {
  const seen = new Set();
  const queue = [];

  function push(candidate) {
    if (!candidate && candidate !== '') return;
    let value = candidate;
    if (typeof candidate === 'object') {
      value = candidate.email || candidate.user_email;
    }
    if (!value || typeof value !== 'string') return;
    const email = value.trim().toLowerCase();
    if (!email.includes('@')) return;
    if (seen.has(email)) return;
    seen.add(email);
    queue.push(email);
  }

  emails.forEach((item) => {
    if (!item) return;
    push(item);
  });

  while (queue.length > 0) {
    const email = queue.shift();
    const hit = await User.findOne({ email });
    if (hit) return hit;
  }

  return null;
}

async function resolveUser(body, attrs) {
  let user = await findUserViaCustomIds(extractUserIds(body));
  if (user) return user;

  const customers = includedCustomers(body);
  const subsById = includedSubscriptions(body);

  const customerIds = [...new Set(idsFromRelationships(body?.data?.relationships?.customer))];
  const subscriptionRelationIds = idsFromRelationships(body?.data?.relationships?.subscription);

  for (const cid of customerIds) {
    const cust = customers[cid];
    user = await findUserViaEmails(
      cust?.email,
      cust?.user_email,
      cust?.billing_address,
      cust?.billing_address?.email,
    );
    if (user) return user;

    user = await User.findOne({ lemonSqueezyCustomerId: cid });
    if (user) return user;
  }

  for (const sid of subscriptionRelationIds) {
    user = await User.findOne({ lemonSqueezySubscriptionId: sid });
    if (user) return user;

    const attrsSub = subsById[sid] || {};
    user = await findUserViaEmails(
      attrsSub.user_email,
      attrsSub.customer_email,
      attrsSub.billing_address,
      attrsSub.billing_address?.email,
    );
    if (user) return user;

    if (attrsSub.customer_id) {
      user = await User.findOne({ lemonSqueezyCustomerId: String(attrsSub.customer_id) });
      if (user) return user;
    }
  }

  for (const cust of Object.values(customers)) {
    user = await findUserViaEmails(
      cust?.email,
      cust?.user_email,
      cust?.billing_address,
      cust?.billing_address?.email,
    );
    if (user) return user;
  }

  user = await findUserViaEmails(
    attrs?.user_email,
    attrs?.email,
    attrs?.billing_address?.email,
    attrs?.checkout_data?.email,
    attrs?.checkout_data?.billing_address?.email,
  );

  return user || null;
}

async function persistProUpgrade(user, attrs, subscriptions, subscriptionIdHint) {
  const subs = subscriptions || {};
  user.plan = 'pro';

  if (attrs?.customer_id) {
    user.lemonSqueezyCustomerId = String(attrs.customer_id);
  }

  let subId =
    attrs?.subscription_id ||
    attrs?.first_subscription_id ||
    subscriptionIdHint ||
    null;

  if (!subId) {
    const firstKey = Object.keys(subs)[0];
    subId = firstKey || subId;
  }

  if (subId) {
    user.lemonSqueezySubscriptionId = String(subId);
    if (!user.lemonSqueezyCustomerId && subs[String(subId)]?.customer_id) {
      user.lemonSqueezyCustomerId = String(subs[String(subId)].customer_id);
    }
  }

  await user.save();
}

async function downgradeSubscription(attrs, subscriptionGuess) {
  const subId = attrs?.subscription_id || attrs?.subscriptionId || subscriptionGuess;
  if (!subId) return false;
  const target = await User.findOne({
    lemonSqueezySubscriptionId: String(subId),
  });
  if (!target) return false;
  target.plan = 'free';
  await target.save();
  return true;
}

lemonsqueezyWebhookRouter.post('/', async (req, res) => {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const sigHeader = req.get('x-signature') || req.get('X-Signature');
  const raw = req.body;
  const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(String(raw));

  if (!secret || !verify(buf, secret, sigHeader || '')) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let body;
  try {
    body = JSON.parse(buf.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const eventName = normEvent(
    body?.meta?.event_name || body?.data?.attributes?.event_name || body?.event_name || '',
  );
  const attrs = body?.data?.attributes || {};
  const subscriptionsBundle = includedSubscriptions(body);
  const relationshipSubIds = idsFromRelationships(body?.data?.relationships?.subscription);

  try {
    const upgradeNames = new Set([
      'subscription_created',
      'subscription_resumed',
      'subscription_payment_success',
      'subscription_payment_recovered',
      'order_created',
    ]);

    const downgradeNames = new Set([
      'subscription_cancelled',
      'subscription_expired',
      'subscription_paused_payment_failed',
      'subscription_unpaid_manual',
      'subscription_unpaid_invoices',
    ]);

    const statusNorm = `${attrs.status || ''}`.toLowerCase();
    let treatAsUpgrade = upgradeNames.has(eventName);
    let treatAsDowngrade = downgradeNames.has(eventName);

    if (eventName === 'subscription_updated') {
      if (
        statusNorm.includes('active') ||
        statusNorm.includes('on_trial') ||
        statusNorm.includes('trialing')
      ) {
        treatAsUpgrade = true;
      }
      if (
        statusNorm.includes('expired') ||
        statusNorm.includes('unpaid') ||
        statusNorm.includes('paused_payment_failed')
      ) {
        treatAsDowngrade = true;
      }
    }

    if (eventName.includes('invoice_paid') || eventName.includes('payment_success')) {
      treatAsUpgrade = true;
    }

    if (treatAsDowngrade) {
      treatAsUpgrade = false;
    }

    if (treatAsUpgrade) {
      const userCandidate = await resolveUser(body, attrs);
      if (userCandidate) {
        const primarySub =
          attrs.subscription_id ||
          attrs.first_subscription_id ||
          relationshipSubIds[0] ||
          Object.keys(subscriptionsBundle)[0] ||
          null;
        await persistProUpgrade(userCandidate, attrs, subscriptionsBundle, primarySub);
      }
    }

    if (treatAsDowngrade) {
      await downgradeSubscription(attrs, relationshipSubIds[0]);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Webhook handling failed' });
  }
});

export async function ensureBootstrapSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.toLowerCase()?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!email || !password) return;
  const anySuper = await User.exists({ role: 'super_admin' });
  if (anySuper) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    email,
    passwordHash,
    role: 'super_admin',
    usageMonthKey: '',
    plan: 'free',
    accessRestricted: false,
  });
}
