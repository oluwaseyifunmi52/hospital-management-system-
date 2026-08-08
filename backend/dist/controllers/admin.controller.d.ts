import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    getStaffRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStaffRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    approveStaffRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    rejectStaffRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleUserActive(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const adminController: AdminController;
//# sourceMappingURL=admin.controller.d.ts.map