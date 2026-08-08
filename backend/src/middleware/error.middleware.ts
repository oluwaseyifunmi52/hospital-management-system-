import { Request, Response, NextFunction } from 'express';
import { sendError, AppError } from '../utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);
  
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors, err.code);
    return;
  }
  
  if (err.name === 'ValidationError') {
    sendError(res, 400, 'Validation error', err.message);
    return;
  }
  
  if (err.name === 'CastError') {
    sendError(res, 400, 'Invalid ID format');
    return;
  }
  
  if ((err as any).code === 11000) {
    sendError(res, 409, 'Duplicate field value');
    return;
  }
  
  sendError(res, 500, 'Internal server error');
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};
