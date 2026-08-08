import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import User from '../models/User';

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@smartcare.com' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    const admin = await User.create({
      email: 'admin@smartcare.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    console.log('Admin account created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
