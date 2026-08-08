import { Request, Response } from 'express';
import { PharmacyService } from '../services/pharmacy.service';
import { sendSuccess, sendError } from '../utils/response';

const pharmacyService = new PharmacyService();

export class PharmacyController {
  async addDrug(req: Request, res: Response) {
    try {
      const drug = await pharmacyService.addDrug(req.body);
      sendSuccess(res, 201, 'Drug added', { drug });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getDrugs(req: Request, res: Response) {
    try {
      const { search, category, page, limit } = req.query;
      const result = await pharmacyService.getDrugs({
        search: search as string,
        category: category as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async updateDrug(req: Request, res: Response) {
    try {
      const drug = await pharmacyService.updateDrug(req.params.id, req.body);
      sendSuccess(res, 200, 'Drug updated', { drug });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async dispense(req: Request, res: Response) {
    try {
      const { prescriptionId, patientId, items } = req.body;
      const sale = await pharmacyService.dispense({
        prescriptionId,
        patientId,
        pharmacistId: req.user!.id,
        items,
      });
      sendSuccess(res, 201, 'Medications dispensed', { sale });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getSales(req: Request, res: Response) {
    try {
      const { patientId, page, limit } = req.query;
      const result = await pharmacyService.getSales({
        patientId: patientId as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getLowStockDrugs(req: Request, res: Response) {
    try {
      const drugs = await pharmacyService.getLowStockDrugs();
      sendSuccess(res, 200, undefined, { drugs });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async getExpiringDrugs(req: Request, res: Response) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const drugs = await pharmacyService.getExpiringDrugs(days);
      sendSuccess(res, 200, undefined, { drugs });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await pharmacyService.getStats();
      sendSuccess(res, 200, undefined, { stats });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}

export const pharmacyController = new PharmacyController();
