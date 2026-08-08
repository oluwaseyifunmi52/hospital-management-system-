"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrStaff = exports.isStaff = exports.isHealthcareWorker = exports.isReceptionist = exports.isLaboratory = exports.isPharmacist = exports.isNurse = exports.isAdmin = exports.isPatient = exports.isDoctor = exports.checkOwnership = exports.authorize = void 0;
const response_1 = require("../utils/response");
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendError)(res, 401, 'Authentication required.');
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            (0, response_1.sendError)(res, 403, 'You do not have permission to access this resource.');
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const checkOwnership = (req, resourceUserId) => {
    if (!req.user)
        return false;
    return req.user.id === resourceUserId || req.user.role === 'admin';
};
exports.checkOwnership = checkOwnership;
exports.isDoctor = (0, exports.authorize)('doctor');
exports.isPatient = (0, exports.authorize)('patient');
exports.isAdmin = (0, exports.authorize)('admin');
exports.isNurse = (0, exports.authorize)('nurse');
exports.isPharmacist = (0, exports.authorize)('pharmacist');
exports.isLaboratory = (0, exports.authorize)('laboratory');
exports.isReceptionist = (0, exports.authorize)('receptionist');
exports.isHealthcareWorker = (0, exports.authorize)('doctor', 'nurse', 'pharmacist', 'laboratory', 'radiologist');
exports.isStaff = (0, exports.authorize)('doctor', 'nurse', 'receptionist', 'pharmacist', 'laboratory', 'radiologist', 'accountant', 'ambulance_driver');
exports.isAdminOrStaff = (0, exports.authorize)('admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'laboratory', 'radiologist', 'accountant', 'ambulance_driver');
//# sourceMappingURL=role.middleware.js.map