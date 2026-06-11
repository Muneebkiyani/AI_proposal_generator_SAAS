import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/subscribe', authRequired, requireRole('user'), async (req, res) => {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  if (!apiKey || !variantId) {
    return res.status(500).json({ error: 'Billing is not configured' });
  }
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) {
    return res.status(500).json({ error: 'LEMONSQUEEZY_STORE_ID missing' });
  }

  const r = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: user.email,
            custom: { user_id: user._id.toString() },
          },
          product_options: {},
        },
        relationships: {
          store: { data: { type: 'stores', id: String(storeId) } },
          variant: { data: { type: 'variants', id: String(variantId) } },
        },
      },
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    return res.status(502).json({ error: 'Checkout create failed', details: t });
  }
  const payload = await r.json();
  const url = payload?.data?.attributes?.url;
  if (!url) return res.status(502).json({ error: 'Checkout URL missing' });
  return res.json({ checkoutUrl: url });
});

export default router;
