import { Request, Response } from 'express';
import { WardService } from '../services/ward.service';
import { sendSuccess, sendError } from '../utils/response';

const wardService = new WardService();

export class WardController {
  async createWard(req: Request, res: Response) {
    try {
      const ward = await wardService.createWard(req.body);
      sendSuccess(res, 201, 'Ward created', { ward });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getWards(req: Request, res: Response) {
    try {
      const wards = await wardService.getWards();
      sendSuccess(res, 200, undefined, { wards });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async getWardById(req: Request, res: Response) {
    try {
      const result = await wardService.getWardById(req.params.id);
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }

  async getBeds(req: Request, res: Response) {
    try {
      const { wardId } = req.query;
      const beds = await wardService.getBeds(wardId as string);
      sendSuccess(res, 200, undefined, { beds });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async admitPatient(req: Request, res: Response) {
    try {
      const admission = await wardService.admitPatient(req.body);
      sendSuccess(res, 201, 'Patient admitted', { admission });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async dischargePatient(req: Request, res: Response) {
    try {
      const { dischargeSummary } = req.body;
      const admission = await wardService.dischargePatient(req.params.id, dischargeSummary);
      sendSuccess(res, 200, 'Patient discharged', { admission });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getActiveAdmissions(req: Request, res: Response) {
    try {
      const { wardId, page, limit } = req.query;
      const result = await wardService.getActiveAdmissions({
        wardId: wardId as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getPatientAdmissions(req: Request, res: Response) {
    try {
      const admissions = await wardService.getPatientAdmissions(req.params.patientId);
      sendSuccess(res, 200, undefined, { admissions });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await wardService.getStats();
      sendSuccess(res, 200, undefined, { stats });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}

export const wardController = new WardController();
