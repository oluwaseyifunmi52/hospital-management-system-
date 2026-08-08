import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/generateToken';
import User from '../models/User';
import { IUser } from '../types';
import { sendError } from '../utils/response';

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

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'Access denied. No token provided.');
      return;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      sendError(res, 401, 'User not found.');
      return;
    }
    
    if (!user.isActive) {
      sendError(res, 403, 'Account is deactivated. Please contact administrator.');
      return;
    }
    
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };
    req.currentUser = user;
    
    next();
  } catch (error) {
    if ((error as any).name === 'TokenExpiredError') {
      sendError(res, 401, 'Token expired.');
      return;
    }
    if ((error as any).name === 'JsonWebTokenError') {
      sendError(res, 401, 'Invalid token.');
      return;
    }
    sendError(res, 500, 'Authentication error.');
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    const user = await User.findById(decoded.id);
    
    if (user && user.isActive) {
      req.user = {
        id: user._id.toString(),
        role: user.role,
      };
      req.currentUser = user;
    }
    
    next();
  } catch (error) {
    next();
  }
};
