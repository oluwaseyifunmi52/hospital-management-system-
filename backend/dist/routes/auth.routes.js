"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.authController.register);
router.post('/staff-register', auth_controller_1.authController.staffRegister);
router.post('/login', auth_controller_1.authController.login);
router.post('/refresh-token', auth_controller_1.authController.refreshToken);
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.authController.logout);
router.post('/verify-email', auth_controller_1.authController.verifyEmail);
router.post('/resend-otp', auth_controller_1.authController.resendOTP);
router.post('/forgot-password', auth_controller_1.authController.forgotPassword);
router.post('/reset-password', auth_controller_1.authController.resetPassword);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.authController.getMe);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map