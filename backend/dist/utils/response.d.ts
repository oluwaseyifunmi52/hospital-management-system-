import { Response } from 'express';
export declare const sendSuccess: (res: Response, statusCode?: number, message?: string, data?: any) => void;
export declare const sendError: (res: Response, statusCode: number | undefined, message: string, errors?: any, code?: string) => void;
export declare const sendPaginated: (res: Response, data: any[], total: number, page: number, limit: number, message?: string) => void;
export declare class AppError extends Error {
    statusCode: number;
    code: string;
    errors?: any;
    constructor(message: string, statusCode?: number, code?: string, errors?: any);
}
//# sourceMappingURL=response.d.ts.map