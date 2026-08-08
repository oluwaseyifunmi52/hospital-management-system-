import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
            currentUser?: IUser;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map