import { Router } from 'express';
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

router.use(authRequired, requireRole('admin'));

router.get('/users', async (_req, res) => {
  const list = await User.find({ role: 'user' }).sort({ createdAt: -1 }).lean();
  return res.json({ users: list.map(publicUser) });
});

router.patch('/users/:id', async (req, res) => {
  const { accessRestricted } = req.body || {};
  const user = await User.findOne({ _id: req.params.id, role: 'user' });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (typeof accessRestricted === 'boolean') user.accessRestricted = accessRestricted;
  await user.save();
  return res.json({ user: publicUser(user) });
});

export default router;
