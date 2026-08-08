"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaffRejectionEmail = exports.generateStaffApprovalEmail = exports.generatePasswordResetEmail = exports.generateVerificationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.config.email.host,
    port: env_1.config.email.port,
    secure: false,
    auth: {
        user: env_1.config.email.user,
        pass: env_1.config.email.pass,
    },
});
const sendEmail = async (options) => {
    const mailOptions = {
        from: env_1.config.email.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
const generateVerificationEmail = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .otp-box { background: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
        .otp { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
        .footer { text-align: center; padding: 10px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SmartCare</h1>
          <p>Email Verification</p>
        </div>
        <div class="content">
          <p>Thank you for registering with SmartCare.</p>
          <p>Your verification code is:</p>
          <div class="otp-box">
            <div class="otp">${otp}</div>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SmartCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.generateVerificationEmail = generateVerificationEmail;
const generatePasswordResetEmail = (resetUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 10px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SmartCare</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <p>You requested a password reset for your SmartCare account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SmartCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.generatePasswordResetEmail = generatePasswordResetEmail;
const generateStaffApprovalEmail = (firstName, email, tempPassword) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .credentials { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 10px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SmartCare</h1>
          <p>Staff Registration Approved</p>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>Your staff registration has been approved! You can now login to your SmartCare account.</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${tempPassword}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login.</p>
          <p>If you have any questions, please contact the administrator.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SmartCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.generateStaffApprovalEmail = generateStaffApprovalEmail;
const generateStaffRejectionEmail = (firstName, rejectionReason) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { text-align: center; padding: 10px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SmartCare</h1>
          <p>Staff Registration Update</p>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>We regret to inform you that your staff registration request has been declined.</p>
          <p><strong>Reason:</strong> ${rejectionReason || 'No specific reason provided'}</p>
          <p>If you believe this is an error, please contact the administrator.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SmartCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.generateStaffRejectionEmail = generateStaffRejectionEmail;
//# sourceMappingURL=email.js.map