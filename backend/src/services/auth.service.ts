import User from '../models/User';
import StaffRequest from '../models/StaffRequest';
import { generateTokens } from '../utils/generateToken';
import { generateOTP, hashOTP, compareOTP, generateResetToken } from '../utils/otp';
import { sendEmail, generateVerificationEmail, generatePasswordResetEmail, generateStaffApprovalEmail, generateStaffRejectionEmail } from '../utils/email';
import { config } from '../config/env';
import { IUser } from '../types';

export class AuthService {
  async registerPatient(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
  }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new Error('Email already registered');
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      ...data,
      role: 'patient',
      otp: await hashOTP(otp),
      otpExpires,
    });

    try {
      await sendEmail({
        to: data.email,
        subject: 'SmartCare - Email Verification',
        html: generateVerificationEmail(otp),
      });
    } catch {
      console.error('Failed to send verification email');
    }

    return { user, message: 'Account created. Please verify your email.' };
  }

  async staffRegister(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingRequest = await StaffRequest.findOne({ email: data.email, status: 'pending' });
    if (existingRequest) {
      throw new Error('A pending registration request already exists for this email');
    }

    await StaffRequest.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role,
    });

    return { message: 'Registration request submitted. Waiting for admin approval.' };
  }

  async login(email: string, password: string, rememberMe?: boolean) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = generateTokens(user);

    if (rememberMe) {
      user.refreshTokens.push({
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    } else {
      user.refreshTokens.push({
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }
    await user.save();

    return { tokens, user };
  }

  async refreshToken(refreshToken: string) {
    const { verifyRefreshToken } = await import('../utils/generateToken');
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user) {
      throw new Error('User not found');
    }

    const tokenExists = user.refreshTokens.some((t: any) => t.token === refreshToken);
    if (!tokenExists) {
      throw new Error('Invalid refresh token');
    }

    user.refreshTokens = user.refreshTokens.filter((t: any) => t.token !== refreshToken);
    await user.save();

    const tokens = generateTokens(user);

    user.refreshTokens.push({
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    const user = await User.findById(userId).select('+refreshTokens');
    if (!user) return;

    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    } else {
      user.refreshTokens = [];
    }
    await user.save();
  }

  async verifyEmail(email: string, otp: string) {
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email already verified');
    }

    if (!user.otp || !user.otpExpires) {
      throw new Error('No verification code found. Please request a new one.');
    }

    if (user.otpExpires < new Date()) {
      throw new Error('Verification code expired. Please request a new one.');
    }

    const isValid = await compareOTP(otp, user.otp);
    if (!isValid) {
      throw new Error('Invalid verification code');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async resendOTP(email: string) {
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email already verified');
    }

    const otp = generateOTP();
    user.otp = await hashOTP(otp);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: 'SmartCare - Email Verification',
        html: generateVerificationEmail(otp),
      });
    } catch {
      console.error('Failed to send verification email');
    }

    return { message: 'Verification code sent' };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const { token, hashedToken } = generateResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: 'SmartCare - Password Reset',
        html: generatePasswordResetEmail(resetUrl),
      });
    } catch {
      console.error('Failed to send reset email');
    }

    return { message: 'If the email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, password: string) {
    const crypto = await import('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    return { message: 'Password reset successful' };
  }

  async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const authService = new AuthService();
