import { Router } from 'express';
import { doctorController } from '../controllers/doctor.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/public', doctorController.getDoctors);
router.get('/public/:id', doctorController.getDoctorById);

// Authenticated doctor routes
router.get('/profile', authenticate, authorize('doctor'), doctorController.getProfile);
router.put('/profile', authenticate, authorize('doctor'), doctorController.updateProfile);
router.patch('/profile/availability', authenticate, authorize('doctor'), doctorController.updateAvailability);

export default router;
