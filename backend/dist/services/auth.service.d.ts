import { IUser } from '../types';
export declare class AuthService {
    registerPatient(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        dateOfBirth: Date;
        gender: string;
    }): Promise<{
        user: import("mongoose").Document<unknown, {}, IUser> & IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        message: string;
    }>;
    staffRegister(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
    login(email: string, password: string, rememberMe?: boolean): Promise<{
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
        user: import("mongoose").Document<unknown, {}, IUser> & IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string): Promise<void>;
    verifyEmail(email: string, otp: string): Promise<{
        message: string;
    }>;
    resendOTP(email: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<import("mongoose").Document<unknown, {}, IUser> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map