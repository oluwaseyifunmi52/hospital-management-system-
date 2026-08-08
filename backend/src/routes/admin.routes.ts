import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/staff-requests', adminController.getStaffRequests);
router.get('/staff-requests/:id', adminController.getStaffRequest);
router.patch('/staff-requests/:id/approve', adminController.approveStaffRequest);
router.patch('/staff-requests/:id/reject', adminController.rejectStaffRequest);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/toggle-active', adminController.toggleUserActive);

export default router;
