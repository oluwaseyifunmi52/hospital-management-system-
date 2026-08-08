import { Request, Response, NextFunction } from 'express';
import { doctorService } from '../services/doctor.service';
import { sendSuccess, sendError } from '../utils/response';

export class DoctorController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await doctorService.getProfile(req.user!.id);
      if (!profile) {
        sendError(res, 404, 'Doctor profile not found');
        return;
      }
      sendSuccess(res, 200, undefined, profile);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await doctorService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, 200, 'Profile updated', profile);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async updateAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { availabilityStatus } = req.body;
      const profile = await doctorService.updateAvailability(req.user!.id, availabilityStatus);
      sendSuccess(res, 200, 'Availability updated', profile);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { specialty, department, search, page, limit } = req.query;
      const result = await doctorService.getDoctors({
        specialty: specialty as string,
        department: department as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.getDoctorById(req.params.id);
      sendSuccess(res, 200, undefined, doctor);
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }
}

export const doctorController = new DoctorController();
