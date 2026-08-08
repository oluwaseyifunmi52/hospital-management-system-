import { Response } from 'express';

interface SuccessResponse {
  success: true;
  message?: string;
  data?: any;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
  code?: string;
}

interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = (res: Response, statusCode: number = 200, message?: string, data?: any): void => {
  const response: SuccessResponse = {
    success: true,
  };
  
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number = 500, message: string, errors?: any, code?: string): void => {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  
  if (errors) response.errors = errors;
  if (code) response.code = code;
  
  res.status(statusCode).json(response);
};

export const sendPaginated = (
  res: Response,
  data: any[],
  total: number,
  page: number,
  limit: number,
  message?: string
): void => {
  const pagination: PaginationResponse = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
  
  const response: SuccessResponse = {
    success: true,
    data: {
      data,
      pagination,
    },
  };
  
  if (message) response.message = message;
  
  res.status(200).json(response);
};

export class AppError extends Error {
  statusCode: number;
  code: string;
  errors?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'ERROR', errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
