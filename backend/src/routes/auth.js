import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { User } from '../models/User.js';
import { authRequired } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../services/mail.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const router = Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function publicUser(doc) {
  return {
    id: doc._id.toString(),
    email: doc.email,
    role: doc.role,
    plan: doc.plan,
    proposalsUsedThisMonth: doc.proposalsUsedThisMonth,
    usageMonthKey: doc.usageMonthKey,
    accessRestricted: doc.accessRestricted,
  };
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Valid email and password (min 8 chars) required' });
  }
  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: String(email).toLowerCase(),
    passwordHash,
    role: 'user',
    usageMonthKey: currentMonthKey(),
  });
  const token = signToken(user._id.toString());
  return res.status(201).json({ token, user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user._id.toString());
  return res.json({ token, user: publicUser(user) });
});

router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Google credential required' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    let user = await User.findOne({ email });
    if (!user) {
      // Create user
      user = await User.create({
        email,
        role: 'user',
        usageMonthKey: currentMonthKey(),
      });
    }

    const token = signToken(user._id.toString());
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(401).json({ error: 'Invalid Google credential' });
  }
});

router.get('/me', authRequired, async (req, res) => {
  const full = await User.findById(req.user.id).lean();
  if (!full) return res.status(404).json({ error: 'Not found' });
  return res.json({ user: publicUser(full) });
});

const forgotResponse = {
  ok: true,
  message: 'If that email is registered, you will receive reset instructions shortly.',
};

router.post('/forgot-password', async (req, res) => {
  const emailRaw = req.body?.email;
  const email = emailRaw ? String(emailRaw).toLowerCase().trim() : '';
  if (!email || !email.includes('@')) {
    return res.json(forgotResponse);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json(forgotResponse);
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetTokenHash = crypto.createHash('sha256').update(token, 'utf8').digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const appBase = (process.env.APP_URL || process.env.CLIENT_ORIGIN || 'http://localhost:3000').replace(
    /\/$/,
    '',
  );
  const resetUrl = `${appBase}/auth/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  } catch (err) {
    console.error('[auth] password reset email failed', err);
  }

  return res.json(forgotResponse);
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password || String(password).length < 8) {
    return res.status(400).json({ error: 'Valid token and password (min 8 chars) required' });
  }

  const tokenHash = crypto.createHash('sha256').update(String(token).trim(), 'utf8').digest('hex');
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ error: 'Reset link is invalid or has expired' });
  }

  user.passwordHash = await bcrypt.hash(String(password), 12);
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
  await user.save();

  return res.json({ ok: true, message: 'Password updated. You can sign in now.' });
});

export default router;
