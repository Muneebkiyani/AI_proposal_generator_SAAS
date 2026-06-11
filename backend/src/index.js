import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import proposalsRoutes from './routes/proposals.js';
import billingRoutes from './routes/billing.js';
import superAdminRoutes from './routes/superAdmin.js';
import staffAdminRoutes from './routes/staffAdmin.js';
import { lemonsqueezyWebhookRouter, ensureBootstrapSuperAdmin } from './routes/webhooks.js';

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).length < 16) {
  console.error(
    '[api] Set JWT_SECRET in backend/.env (at least 16 characters) before starting.',
  );
  process.exit(1);
}

app.use(
  cors({
    origin: clientOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  }),
);

app.use('/api/webhooks/lemonsqueezy', express.raw({ type: 'application/json' }), lemonsqueezyWebhookRouter);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/admin', staffAdminRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proposal_saas';

mongoose
  .connect(uri)
  .then(async () => {
    await ensureBootstrapSuperAdmin();
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => console.log(`API listening on ${port}`));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
