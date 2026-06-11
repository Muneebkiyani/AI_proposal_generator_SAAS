import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { User } from '../models/User.js';

const router = Router();

function publicUser(doc) {
  return {
    id: doc._id.toString(),
    email: doc.email,
    role: doc.role,
    plan: doc.plan,
    proposalsUsedThisMonth: doc.proposalsUsedThisMonth,
    usageMonthKey: doc.usageMonthKey,
    accessRestricted: doc.accessRestricted,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

router.use(authRequired, requireRole('super_admin'));

router.post('/admins', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Email and password (min 8 chars) required' });
  }
  const normalized = String(email).toLowerCase();
  const exists = await User.findOne({ email: normalized });
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.create({
    email: normalized,
    passwordHash,
    role: 'admin',
    usageMonthKey: '',
  });
  return res.status(201).json({ user: publicUser(admin) });
});

router.get('/admins', async (_req, res) => {
  const list = await User.find({ role: 'admin' }).sort({ createdAt: -1 }).lean();
  return res.json({ users: list.map(publicUser) });
});

router.get('/users', async (_req, res) => {
  const list = await User.find({ role: 'user' }).sort({ createdAt: -1 }).lean();
  return res.json({ users: list.map(publicUser) });
});

router.patch('/users/:id', async (req, res) => {
  const { accessRestricted, plan } = req.body || {};
  const user = await User.findOne({ _id: req.params.id, role: 'user' });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (typeof accessRestricted === 'boolean') user.accessRestricted = accessRestricted;
  if (plan === 'free' || plan === 'pro') user.plan = plan;
  await user.save();
  return res.json({ user: publicUser(user) });
});

export default router;
