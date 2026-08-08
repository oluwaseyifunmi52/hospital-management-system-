"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorController = exports.DoctorController = void 0;
const doctor_service_1 = require("../services/doctor.service");
const response_1 = require("../utils/response");
class DoctorController {
    async getProfile(req, res, next) {
        try {
            const profile = await doctor_service_1.doctorService.getProfile(req.user.id);
            if (!profile) {
                (0, response_1.sendError)(res, 404, 'Doctor profile not found');
                return;
            }
            (0, response_1.sendSuccess)(res, 200, undefined, profile);
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const profile = await doctor_service_1.doctorService.updateProfile(req.user.id, req.body);
            (0, response_1.sendSuccess)(res, 200, 'Profile updated', profile);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async updateAvailability(req, res, next) {
        try {
            const { availabilityStatus } = req.body;
            const profile = await doctor_service_1.doctorService.updateAvailability(req.user.id, availabilityStatus);
            (0, response_1.sendSuccess)(res, 200, 'Availability updated', profile);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async getDoctors(req, res, next) {
        try {
            const { specialty, department, search, page, limit } = req.query;
            const result = await doctor_service_1.doctorService.getDoctors({
                specialty: specialty,
                department: department,
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
    async getDoctorById(req, res, next) {
        try {
            const doctor = await doctor_service_1.doctorService.getDoctorById(req.params.id);
            (0, response_1.sendSuccess)(res, 200, undefined, doctor);
        }
        catch (error) {
            (0, response_1.sendError)(res, 404, error.message);
        }
    }
}
exports.DoctorController = DoctorController;
exports.doctorController = new DoctorController();
//# sourceMappingURL=doctor.controller.js.map