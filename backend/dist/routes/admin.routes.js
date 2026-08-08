"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, role_middleware_1.authorize)('admin'));
router.get('/staff-requests', admin_controller_1.adminController.getStaffRequests);
router.get('/staff-requests/:id', admin_controller_1.adminController.getStaffRequest);
router.patch('/staff-requests/:id/approve', admin_controller_1.adminController.approveStaffRequest);
router.patch('/staff-requests/:id/reject', admin_controller_1.adminController.rejectStaffRequest);
router.get('/users', admin_controller_1.adminController.getUsers);
router.patch('/users/:id/toggle-active', admin_controller_1.adminController.toggleUserActive);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map