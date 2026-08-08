import { IUser } from './index';

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
