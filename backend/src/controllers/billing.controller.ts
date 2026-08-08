import { Request, Response } from 'express';
import { BillingService } from '../services/billing.service';
import { sendSuccess, sendError } from '../utils/response';

const billingService = new BillingService();

export class BillingController {
  async createInvoice(req: Request, res: Response) {
    try {
      const invoice = await billingService.createInvoice({
        ...req.body,
        createdBy: req.user!.id,
      });
      sendSuccess(res, 201, 'Invoice created', { invoice });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getInvoices(req: Request, res: Response) {
    try {
      const { patientId, status, page, limit } = req.query;
      const result = await billingService.getInvoices({
        patientId: patientId as string,
        status: status as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getInvoiceById(req: Request, res: Response) {
    try {
      const invoice = await billingService.getInvoiceById(req.params.id);
      sendSuccess(res, 200, undefined, { invoice });
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }

  async recordPayment(req: Request, res: Response) {
    try {
      const payment = await billingService.recordPayment({
        ...req.body,
        processedBy: req.user!.id,
      });
      sendSuccess(res, 201, 'Payment recorded', { payment });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getPaymentsByInvoice(req: Request, res: Response) {
    try {
      const payments = await billingService.getPaymentsByInvoice(req.params.invoiceId);
      sendSuccess(res, 200, undefined, { payments });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getPaymentsByPatient(req: Request, res: Response) {
    try {
      const payments = await billingService.getPaymentsByPatient(req.params.patientId);
      sendSuccess(res, 200, undefined, { payments });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const stats = await billingService.getStats();
      sendSuccess(res, 200, undefined, { stats });
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
}
