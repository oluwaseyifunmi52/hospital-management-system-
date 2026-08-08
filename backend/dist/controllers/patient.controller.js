"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientController = exports.PatientController = void 0;
const Patient_1 = __importDefault(require("../models/Patient"));
const Appointment_1 = __importDefault(require("../models/Appointment"));
const MedicalRecord_1 = __importDefault(require("../models/MedicalRecord"));
const Prescription_1 = __importDefault(require("../models/Prescription"));
const response_1 = require("../utils/response");
class PatientController {
    async getProfile(req, res, next) {
        try {
            const patient = await Patient_1.default.findOne({ user: req.user.id });
            (0, response_1.sendSuccess)(res, 200, undefined, patient);
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const patient = await Patient_1.default.findOneAndUpdate({ user: req.user.id }, req.body, { new: true, upsert: true });
            (0, response_1.sendSuccess)(res, 200, 'Profile updated', patient);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async getAppointments(req, res, next) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const query = { patient: req.user.id };
            if (status)
                query.status = status;
            const total = await Appointment_1.default.countDocuments(query);
            const appointments = await Appointment_1.default.find(query)
                .populate('doctor', 'firstName lastName')
                .sort({ date: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            (0, response_1.sendSuccess)(res, 200, undefined, {
                data: appointments,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
    async createAppointment(req, res, next) {
        try {
            const appointment = await Appointment_1.default.create({
                ...req.body,
                patient: req.user.id,
            });
            (0, response_1.sendSuccess)(res, 201, 'Appointment created', appointment);
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message);
        }
    }
    async getMedicalRecords(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const total = await MedicalRecord_1.default.countDocuments({ patient: req.user.id });
            const records = await MedicalRecord_1.default.find({ patient: req.user.id })
                .populate('doctor', 'firstName lastName')
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            (0, response_1.sendSuccess)(res, 200, undefined, {
                data: records,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
    async getPrescriptions(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const total = await Prescription_1.default.countDocuments({ patient: req.user.id });
            const prescriptions = await Prescription_1.default.find({ patient: req.user.id })
                .populate('doctor', 'firstName lastName')
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            (0, response_1.sendSuccess)(res, 200, undefined, {
                data: prescriptions,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            (0, response_1.sendError)(res, 500, error.message);
        }
    }
}
exports.PatientController = PatientController;
exports.patientController = new PatientController();
//# sourceMappingURL=patient.controller.js.map