import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { sendSuccess, sendError } from '../utils/response';

const appointmentService = new AppointmentService();

export class AppointmentController {
  async create(req: Request, res: Response) {
    try {
      const { patientId, doctorId, date, time, type, reason } = req.body;
      const appointment = await appointmentService.create({
        patientId,
        doctorId,
        date,
        time,
        type,
        reason,
      });
      sendSuccess(res, 201, 'Appointment created', { appointment });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const appointment = await appointmentService.getById(req.params.id);
      sendSuccess(res, 200, undefined, { appointment });
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }

  async getByPatient(req: Request, res: Response) {
    try {
      const { status, page, limit } = req.query;
      const result = await appointmentService.getByPatient(req.params.patientId, {
        status: status as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getByDoctor(req: Request, res: Response) {
    try {
      const { status, date, page, limit } = req.query;
      const result = await appointmentService.getByDoctor(req.params.doctorId, {
        status: status as string,
        date: date as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const appointment = await appointmentService.updateStatus(
        req.params.id,
        status,
        req.user!.id
      );
      sendSuccess(res, 200, 'Status updated', { appointment });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const appointment = await appointmentService.cancel(
        req.params.id,
        req.user!.id
      );
      sendSuccess(res, 200, 'Appointment cancelled', { appointment });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const doctorId = req.query.doctorId as string;
      const stats = await appointmentService.getStats(doctorId);
      sendSuccess(res, 200, undefined, { stats });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}

export const appointmentController = new AppointmentController();
