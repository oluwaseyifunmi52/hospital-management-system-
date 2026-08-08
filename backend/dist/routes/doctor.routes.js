"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/public', doctor_controller_1.doctorController.getDoctors);
router.get('/public/:id', doctor_controller_1.doctorController.getDoctorById);
// Authenticated doctor routes
router.get('/profile', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)('doctor'), doctor_controller_1.doctorController.getProfile);
router.put('/profile', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)('doctor'), doctor_controller_1.doctorController.updateProfile);
router.patch('/profile/availability', auth_middleware_1.authenticate, (0, role_middleware_1.authorize)('doctor'), doctor_controller_1.doctorController.updateAvailability);
exports.default = router;
//# sourceMappingURL=doctor.routes.js.map