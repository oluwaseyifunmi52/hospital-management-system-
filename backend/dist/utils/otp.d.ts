export declare const generateOTP: (length?: number) => string;
export declare const hashOTP: (otp: string) => Promise<string>;
export declare const compareOTP: (candidateOTP: string, hashedOTP: string) => Promise<boolean>;
export declare const generateResetToken: () => {
    token: string;
    hashedToken: string;
};
//# sourceMappingURL=otp.d.ts.map