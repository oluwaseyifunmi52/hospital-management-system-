import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/response';

export class AdminController {
  async getStaffRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, search, page, limit } = req.query;
      const result = await adminService.getStaffRequests({
        status: status as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async getStaffRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await adminService.getStaffRequest(req.params.id);
      sendSuccess(res, 200, undefined, request);
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }

  async approveStaffRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.approveStaffRequest(req.params.id, req.user!.id);
      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async rejectStaffRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { rejectionReason } = req.body;
      const result = await adminService.rejectStaffRequest(
        req.params.id,
        req.user!.id,
        rejectionReason || 'Does not meet requirements'
      );
      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { role, search, page, limit } = req.query;
      const result = await adminService.getUsers({
        role: role as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async toggleUserActive(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.toggleUserActive(req.params.id);
      sendSuccess(res, 200, result.message, { user: result.user });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }
}

export const adminController = new AdminController();
