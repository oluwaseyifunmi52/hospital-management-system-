import { Request, Response, NextFunction } from 'express';
export declare const authorize: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const checkOwnership: (req: Request, resourceUserId: string) => boolean;
export declare const isDoctor: (req: Request, res: Response, next: NextFunction) => void;
export declare const isPatient: (req: Request, res: Response, next: NextFunction) => void;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const isNurse: (req: Request, res: Response, next: NextFunction) => void;
export declare const isPharmacist: (req: Request, res: Response, next: NextFunction) => void;
export declare const isLaboratory: (req: Request, res: Response, next: NextFunction) => void;
export declare const isReceptionist: (req: Request, res: Response, next: NextFunction) => void;
export declare const isHealthcareWorker: (req: Request, res: Response, next: NextFunction) => void;
export declare const isStaff: (req: Request, res: Response, next: NextFunction) => void;
export declare const isAdminOrStaff: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map