interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const generateVerificationEmail: (otp: string) => string;
export declare const generatePasswordResetEmail: (resetUrl: string) => string;
export declare const generateStaffApprovalEmail: (firstName: string, email: string, tempPassword: string) => string;
export declare const generateStaffRejectionEmail: (firstName: string, rejectionReason: string) => string;
export {};
//# sourceMappingURL=email.d.ts.map