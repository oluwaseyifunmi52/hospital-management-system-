"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const response_1 = require("../utils/response");
class AdminController {
    async getStaffRequests(req, res, next) {
        try {
            const { status, search, page, limit } = req.query;
            const result = await admin_service_1.adminService.getStaffRequests({
                status: status,
                search: search,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 10,
            });
            (0, response_1.sendSuccess)(res, 200, undefined, result);
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
    async getStaffRequest(req, res, next) {
        try {
            const request = await admin_service_1.adminService.getStaffRequest(req.params.id);
            (0, response_1.sendSuccess)(res, 200, undefined, request);
        }
        catch (error) {
            (0, response_1.sendError)(res, 404, error.message);
        }
    }
    async approveStaffRequest(req, res, next) {
        try {
            const result = await admin_service_1.adminService.approveStaffRequest(req.params.id, req.user.id);
            (0, response_1.sendSuccess)(res, 200, result.message);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async rejectStaffRequest(req, res, next) {
        try {
            const { rejectionReason } = req.body;
            const result = await admin_service_1.adminService.rejectStaffRequest(req.params.id, req.user.id, rejectionReason || 'Does not meet requirements');
            (0, response_1.sendSuccess)(res, 200, result.message);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async getUsers(req, res, next) {
        try {
            const { role, search, page, limit } = req.query;
            const result = await admin_service_1.adminService.getUsers({
                role: role,
                search: search,
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 10,
            });
            (0, response_1.sendSuccess)(res, 200, undefined, result);
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
    async toggleUserActive(req, res, next) {
        try {
            const result = await admin_service_1.adminService.toggleUserActive(req.params.id);
            (0, response_1.sendSuccess)(res, 200, result.message, { user: result.user });
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
//# sourceMappingURL=admin.controller.js.map