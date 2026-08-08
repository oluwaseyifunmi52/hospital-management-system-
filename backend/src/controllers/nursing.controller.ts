import { Request, Response } from 'express';
import { NursingService } from '../services/nursing.service';
import { sendSuccess, sendError } from '../utils/response';

const nursingService = new NursingService();

export class NursingController {
  async recordVitals(req: Request, res: Response) {
    try {
      const vitals = await nursingService.recordVitals({
        ...req.body,
        recordedBy: req.user!.id,
      });
      sendSuccess(res, 201, 'Vitals recorded', { vitals });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getVitalsByPatient(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      const vitals = await nursingService.getVitalsByPatient(
        req.params.patientId,
        limit ? parseInt(limit as string) : 50
      );
      sendSuccess(res, 200, undefined, { vitals });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async addNursingNote(req: Request, res: Response) {
    try {
      const note = await nursingService.addNursingNote({
        ...req.body,
        nurseId: req.user!.id,
      });
      sendSuccess(res, 201, 'Note added', { note });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getNursingNotesByPatient(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      const notes = await nursingService.getNursingNotesByPatient(
        req.params.patientId,
        limit ? parseInt(limit as string) : 50
      );
      sendSuccess(res, 200, undefined, { notes });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }
}

export const nursingController = new NursingController();
