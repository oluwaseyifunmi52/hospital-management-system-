import { Request, Response } from 'express';
import { MedicalRecordService } from '../services/medical-record.service';
import { sendSuccess, sendError } from '../utils/response';

const medicalRecordService = new MedicalRecordService();

export class MedicalRecordController {
  async create(req: Request, res: Response) {
    try {
      const record = await medicalRecordService.create({
        ...req.body,
        doctorId: req.user!.id,
      });
      sendSuccess(res, 201, 'Record created', { record });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getByPatient(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      const result = await medicalRecordService.getByPatient(
        req.params.patientId,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      );
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const record = await medicalRecordService.getById(req.params.id);
      sendSuccess(res, 200, undefined, { record });
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const record = await medicalRecordService.update(req.params.id, req.body);
      sendSuccess(res, 200, 'Record updated', { record });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async createPrescription(req: Request, res: Response) {
    try {
      const prescription = await medicalRecordService.createPrescription({
        ...req.body,
        doctorId: req.user!.id,
      });
      sendSuccess(res, 201, 'Prescription created', { prescription });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getPrescriptionsByPatient(req: Request, res: Response) {
    try {
      const prescriptions = await medicalRecordService.getPrescriptionsByPatient(req.params.patientId);
      sendSuccess(res, 200, undefined, { prescriptions });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getPrescriptionById(req: Request, res: Response) {
    try {
      const prescription = await medicalRecordService.getPrescriptionById(req.params.id);
      sendSuccess(res, 200, undefined, { prescription });
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const doctorId = req.query.doctorId as string;
      const stats = await medicalRecordService.getStats(doctorId);
      sendSuccess(res, 200, undefined, { stats });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}

export const medicalRecordController = new MedicalRecordController();
