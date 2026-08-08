import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, authorize('patient', 'receptionist', 'admin'), appointmentController.create);
router.get('/stats', authenticate, appointmentController.getStats);
router.get('/patient/:patientId', authenticate, appointmentController.getByPatient);
router.get('/doctor/:doctorId', authenticate, appointmentController.getByDoctor);
router.get('/:id', authenticate, appointmentController.getById);
router.patch('/:id/status', authenticate, appointmentController.updateStatus);
router.patch('/:id/cancel', authenticate, appointmentController.cancel);

export default router;
