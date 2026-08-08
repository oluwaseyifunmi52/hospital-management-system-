import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Authentication required.');
      return;
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 403, 'You do not have permission to access this resource.');
      return;
    }
    
    next();
  };
};

export const checkOwnership = (req: Request, resourceUserId: string): boolean => {
  if (!req.user) return false;
  return req.user.id === resourceUserId || req.user.role === 'admin';
};

export const isDoctor = authorize('doctor');
export const isPatient = authorize('patient');
export const isAdmin = authorize('admin');
export const isNurse = authorize('nurse');
export const isPharmacist = authorize('pharmacist');
export const isLaboratory = authorize('laboratory');
export const isReceptionist = authorize('receptionist');

export const isHealthcareWorker = authorize(
  'doctor',
  'nurse',
  'pharmacist',
  'laboratory',
  'radiologist'
);

export const isStaff = authorize(
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'laboratory',
  'radiologist',
  'accountant',
  'ambulance_driver'
);

export const isAdminOrStaff = authorize(
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'laboratory',
  'radiologist',
  'accountant',
  'ambulance_driver'
);
