"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
class AuthController {
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.registerPatient(req.body);
            (0, response_1.sendSuccess)(res, 201, result.message, { user: result.user });
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async staffRegister(req, res, next) {
        try {
            const result = await auth_service_1.authService.staffRegister(req.body);
            (0, response_1.sendSuccess)(res, 201, result.message);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password, rememberMe } = req.body;
            const result = await auth_service_1.authService.login(email, password, rememberMe);
            (0, response_1.sendSuccess)(res, 200, 'Login successful', {
                tokens: result.tokens,
                user: result.user,
            });
        }
        catch (error) {
            (0, response_1.sendError)(res, 401, error.message);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                (0, response_1.sendError)(res, 400, 'Refresh token required');
                return;
            }
            const tokens = await auth_service_1.authService.refreshToken(refreshToken);
            (0, response_1.sendSuccess)(res, 200, 'Token refreshed', tokens);
        }
        catch (error) {
            (0, response_1.sendError)(res, 401, error.message);
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await auth_service_1.authService.logout(req.user.id, refreshToken);
            (0, response_1.sendSuccess)(res, 200, 'Logged out');
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const { email, otp } = req.body;
            const result = await auth_service_1.authService.verifyEmail(email, otp);
            (0, response_1.sendSuccess)(res, 200, result.message);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async resendOTP(req, res, next) {
        try {
            const { email } = req.body;
            const result = await auth_service_1.authService.resendOTP(email);
            (0, response_1.sendSuccess)(res, 200, result.message);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const result = await auth_service_1.authService.forgotPassword(email);
            (0, response_1.sendSuccess)(res, 200, result.message);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            const result = await auth_service_1.authService.resetPassword(token, password);
            (0, response_1.sendSuccess)(res, 200, result.message);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async getMe(req, res, next) {
        try {
            const user = await auth_service_1.authService.getMe(req.user.id);
            (0, response_1.sendSuccess)(res, 200, undefined, user);
        }
        catch (error) {
            (0, response_1.sendError)(res, 404, error.message);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map