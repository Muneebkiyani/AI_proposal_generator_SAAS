import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
    },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    proposalsUsedThisMonth: { type: Number, default: 0 },
    usageMonthKey: { type: String, default: '' },
    accessRestricted: { type: Boolean, default: false },
    lemonSqueezyCustomerId: { type: String, default: null },
    lemonSqueezySubscriptionId: { type: String, default: null },
    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
