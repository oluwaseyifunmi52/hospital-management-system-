import { Request, Response, NextFunction } from 'express';
export declare class DoctorController {
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDoctors(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDoctorById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const doctorController: DoctorController;
//# sourceMappingURL=doctor.controller.d.ts.map