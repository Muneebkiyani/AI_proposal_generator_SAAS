import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { User } from './src/models/User.js';

async function seedUser() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/proposal_saas';
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const email = 'customer@test.com'.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      console.log('User already exists');
    } else {
      const passwordHash = await bcrypt.hash('customer123456', 12);
      await User.create({
        email,
        passwordHash,
        role: 'user',
        plan: 'free',
        usageMonthKey: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      });
      console.log('Test customer created successfully!');
    }
  } catch (err) {
    console.error('Error seeding user:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedUser();
