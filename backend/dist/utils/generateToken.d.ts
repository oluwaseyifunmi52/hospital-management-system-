import { IUser } from '../types';
export declare const generateAccessToken: (userId: string, role: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => {
    id: string;
    role: string;
};
export declare const verifyRefreshToken: (token: string) => {
    id: string;
};
export declare const generateTokens: (user: IUser) => {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=generateToken.d.ts.map