import { Request, Response, NextFunction } from 'express';
export declare class PatientController {
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAppointments(req: Request, res: Response, next: NextFunction): Promise<void>;
    createAppointment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPrescriptions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const patientController: PatientController;
//# sourceMappingURL=patient.controller.d.ts.map