import { Request, Response, NextFunction } from 'express';
import Patient from '../models/Patient';
import Appointment from '../models/Appointment';
import MedicalRecord from '../models/MedicalRecord';
import Prescription from '../models/Prescription';
import { sendSuccess, sendError } from '../utils/response';

export class PatientController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await Patient.findOne({ user: req.user!.id });
      sendSuccess(res, 200, undefined, patient);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await Patient.findOneAndUpdate(
        { user: req.user!.id },
        req.body,
        { new: true, upsert: true }
      );
      sendSuccess(res, 200, 'Profile updated', patient);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query: any = { patient: req.user!.id };
      if (status) query.status = status;

      const total = await Appointment.countDocuments(query);
      const appointments = await Appointment.find(query)
        .populate('doctor', 'firstName lastName')
        .sort({ date: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      sendSuccess(res, 200, undefined, {
        data: appointments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await Appointment.create({
        ...req.body,
        patient: req.user!.id,
      });
      sendSuccess(res, 201, 'Appointment created', appointment);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const total = await MedicalRecord.countDocuments({ patient: req.user!.id });
      const records = await MedicalRecord.find({ patient: req.user!.id })
        .populate('doctor', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      sendSuccess(res, 200, undefined, {
        data: records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async getPrescriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const total = await Prescription.countDocuments({ patient: req.user!.id });
      const prescriptions = await Prescription.find({ patient: req.user!.id })
        .populate('doctor', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      sendSuccess(res, 200, undefined, {
        data: prescriptions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}

export const patientController = new PatientController();
