"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const User_1 = __importDefault(require("../models/User"));
const StaffRequest_1 = __importDefault(require("../models/StaffRequest"));
const generateToken_1 = require("../utils/generateToken");
const otp_1 = require("../utils/otp");
const email_1 = require("../utils/email");
const env_1 = require("../config/env");
class AuthService {
    async registerPatient(data) {
        const existing = await User_1.default.findOne({ email: data.email });
        if (existing) {
            throw new Error('Email already registered');
        }
        const otp = (0, otp_1.generateOTP)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const user = await User_1.default.create({
            ...data,
            role: 'patient',
            otp: await (0, otp_1.hashOTP)(otp),
            otpExpires,
        });
        try {
            await (0, email_1.sendEmail)({
                to: data.email,
                subject: 'SmartCare - Email Verification',
                html: (0, email_1.generateVerificationEmail)(otp),
            });
        }
        catch {
            console.error('Failed to send verification email');
        }
        return { user, message: 'Account created. Please verify your email.' };
    }
    async staffRegister(data) {
        const existingUser = await User_1.default.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const existingRequest = await StaffRequest_1.default.findOne({ email: data.email, status: 'pending' });
        if (existingRequest) {
            throw new Error('A pending registration request already exists for this email');
        }
        await StaffRequest_1.default.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            role: data.role,
        });
        return { message: 'Registration request submitted. Waiting for admin approval.' };
    }
    async login(email, password, rememberMe) {
        const user = await User_1.default.findOne({ email }).select('+password');
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
        const tokens = (0, generateToken_1.generateTokens)(user);
        if (rememberMe) {
            user.refreshTokens.push({
                token: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
        }
        else {
            user.refreshTokens.push({
                token: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
        }
        await user.save();
        return { tokens, user };
    }
    async refreshToken(refreshToken) {
        const { verifyRefreshToken } = await Promise.resolve().then(() => __importStar(require('../utils/generateToken')));
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User_1.default.findById(decoded.id).select('+refreshTokens');
        if (!user) {
            throw new Error('User not found');
        }
        const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
        if (!tokenExists) {
            throw new Error('Invalid refresh token');
        }
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
        await user.save();
        const tokens = (0, generateToken_1.generateTokens)(user);
        user.refreshTokens.push({
            token: tokens.refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await user.save();
        return tokens;
    }
    async logout(userId, refreshToken) {
        const user = await User_1.default.findById(userId).select('+refreshTokens');
        if (!user)
            return;
        if (refreshToken) {
            user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
        }
        else {
            user.refreshTokens = [];
        }
        await user.save();
    }
    async verifyEmail(email, otp) {
        const user = await User_1.default.findOne({ email }).select('+otp +otpExpires');
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
        const isValid = await (0, otp_1.compareOTP)(otp, user.otp);
        if (!isValid) {
            throw new Error('Invalid verification code');
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return { message: 'Email verified successfully' };
    }
    async resendOTP(email) {
        const user = await User_1.default.findOne({ email }).select('+otp +otpExpires');
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isVerified) {
            throw new Error('Email already verified');
        }
        const otp = (0, otp_1.generateOTP)();
        user.otp = await (0, otp_1.hashOTP)(otp);
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        try {
            await (0, email_1.sendEmail)({
                to: email,
                subject: 'SmartCare - Email Verification',
                html: (0, email_1.generateVerificationEmail)(otp),
            });
        }
        catch {
            console.error('Failed to send verification email');
        }
        return { message: 'Verification code sent' };
    }
    async forgotPassword(email) {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent.' };
        }
        const { token, hashedToken } = (0, otp_1.generateResetToken)();
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();
        const resetUrl = `${env_1.config.clientUrl}/reset-password?token=${token}`;
        try {
            await (0, email_1.sendEmail)({
                to: email,
                subject: 'SmartCare - Password Reset',
                html: (0, email_1.generatePasswordResetEmail)(resetUrl),
            });
        }
        catch {
            console.error('Failed to send reset email');
        }
        return { message: 'If the email exists, a reset link has been sent.' };
    }
    async resetPassword(token, password) {
        const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User_1.default.findOne({
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
    async getMe(userId) {
        const user = await User_1.default.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map