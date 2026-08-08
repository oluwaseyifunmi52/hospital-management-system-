"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, role_middleware_1.authorize)('patient'));
router.get('/profile', patient_controller_1.patientController.getProfile);
router.put('/profile', patient_controller_1.patientController.updateProfile);
router.get('/appointments', patient_controller_1.patientController.getAppointments);
router.post('/appointments', patient_controller_1.patientController.createAppointment);
router.get('/medical-records', patient_controller_1.patientController.getMedicalRecords);
router.get('/prescriptions', patient_controller_1.patientController.getPrescriptions);
exports.default = router;
//# sourceMappingURL=patient.routes.js.map