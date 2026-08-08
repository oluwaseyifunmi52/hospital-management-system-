import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';

const notificationService = new NotificationService();

export class NotificationController {
  async getByUser(req: Request, res: Response) {
    try {
      const { isRead, page, limit } = req.query;
      const result = await notificationService.getByUser(req.user!.id, {
        isRead: isRead !== undefined ? isRead === 'true' : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const notification = await notificationService.markAsRead(req.params.id);
      sendSuccess(res, 200, 'Marked as read', { notification });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      await notificationService.markAllAsRead(req.user!.id);
      sendSuccess(res, 200, 'All marked as read');
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const result = await notificationService.getUnreadCount(req.user!.id);
      sendSuccess(res, 200, undefined, result);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await notificationService.delete(req.params.id);
      sendSuccess(res, 200, 'Notification deleted');
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }
}
