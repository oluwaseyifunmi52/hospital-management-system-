import nodemailer from 'nodemailer';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: config.email.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };
  
  await transporter.sendMail(mailOptions);
};

export const generateVerificationEmail = (otp: string): string => {
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

export const generatePasswordResetEmail = (resetUrl: string): string => {
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

export const generateStaffApprovalEmail = (firstName: string, email: string, tempPassword: string): string => {
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

export const generateStaffRejectionEmail = (firstName: string, rejectionReason: string): string => {
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
