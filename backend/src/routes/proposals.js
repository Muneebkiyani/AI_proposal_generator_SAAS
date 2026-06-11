import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { generateProposal } from '../services/ai.js';

const router = Router();

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

router.post('/generate', authRequired, async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Only customer accounts can generate proposals' });
  }
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (user.accessRestricted) {
    return res.status(403).json({ error: 'Your access has been restricted. Contact support.' });
  }

  const month = currentMonthKey();
  if (user.usageMonthKey !== month) {
    user.usageMonthKey = month;
    user.proposalsUsedThisMonth = 0;
  }

  const freeLimit = Number(process.env.FREE_PROPOSALS_PER_MONTH || 5);
  if (user.plan === 'free' && user.proposalsUsedThisMonth >= freeLimit) {
    return res.status(402).json({
      error: 'Monthly free limit reached',
      code: 'LIMIT',
      limit: freeLimit,
    });
  }

  const { jobDescription, mySkills } = req.body || {};
  if (!jobDescription || !mySkills) {
    return res.status(400).json({ error: 'jobDescription and mySkills are required' });
  }

  try {
    const proposal = await generateProposal({ jobDescription, mySkills });
    user.proposalsUsedThisMonth += 1;
    await user.save();
    return res.json({ proposal, proposalsUsedThisMonth: user.proposalsUsedThisMonth });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: e.message || 'AI generation failed' });
  }
});

export default router;
