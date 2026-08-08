import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerPatient(req.body);
      sendSuccess(res, 201, result.message, { user: result.user });
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async staffRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.staffRegister(req.body);
      sendSuccess(res, 201, result.message);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, rememberMe } = req.body;
      const result = await authService.login(email, password, rememberMe);
      sendSuccess(res, 200, 'Login successful', {
        tokens: result.tokens,
        user: result.user,
      });
    } catch (error: any) {
      sendError(res, 401, error.message);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        sendError(res, 400, 'Refresh token required');
        return;
      }
      const tokens = await authService.refreshToken(refreshToken);
      sendSuccess(res, 200, 'Token refreshed', tokens);
    } catch (error: any) {
      sendError(res, 401, error.message);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(req.user!.id, refreshToken);
      sendSuccess(res, 200, 'Logged out');
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyEmail(email, otp);
      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.resendOTP(email);
      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      sendSuccess(res, 200, undefined, user);
    } catch (error: any) {
      sendError(res, 404, error.message);
    }
  }
}

export const authController = new AuthController();
