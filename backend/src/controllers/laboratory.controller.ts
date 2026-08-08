import { Request, Response } from 'express';
import { LaboratoryService } from '../services/laboratory.service';
import { sendSuccess, sendError } from '../utils/response';

const laboratoryService = new LaboratoryService();

export class LaboratoryController {
  async requestTest(req: Request, res: Response) {
    try {
      const { patientId, doctorId, appointmentId, testName, testType, priority, notes } = req.body;
      const test = await laboratoryService.requestTest({
        patientId,
        doctorId,
        appointmentId,
        testName,
        testType,
        priority,
        notes,
      });
      sendSuccess(res, 201, 'Test requested', { test });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getTestsByPatient(req: Request, res: Response) {
    try {
      const { status, page, limit } = req.query;
      const result = await laboratoryService.getTestsByPatient(req.params.patientId, {
        status: status as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getTestsForLab(req: Request, res: Response) {
    try {
      const { status, search, page, limit } = req.query;
      const result = await laboratoryService.getTestsForLab({
        status: status as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async updateTestStatus(req: Request, res: Response) {
    try {
      const test = await laboratoryService.updateTestStatus(req.params.id, req.body.status);
      sendSuccess(res, 200, 'Status updated', { test });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async addResult(req: Request, res: Response) {
    try {
      const result = await laboratoryService.addResult({
        labTestId: req.params.id,
        patientId: req.body.patientId,
        performedBy: req.user!.id,
        results: req.body.results,
        conclusion: req.body.conclusion,
      });
      sendSuccess(res, 201, 'Results added', { result });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getResultsByTest(req: Request, res: Response) {
    try {
      const result = await laboratoryService.getResultsByTest(req.params.testId);
      sendSuccess(res, 200, undefined, { result });
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }

  async getResultsByPatient(req: Request, res: Response) {
    try {
      const results = await laboratoryService.getResultsByPatient(req.params.patientId);
      sendSuccess(res, 200, undefined, { results });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await laboratoryService.getStats();
      sendSuccess(res, 200, undefined, { stats });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}

export const laboratoryController = new LaboratoryController();
