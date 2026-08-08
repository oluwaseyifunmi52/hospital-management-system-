import { Router } from 'express';
import { wardController } from '../controllers/ward.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, authorize('admin'), wardController.createWard);
router.get('/', authenticate, wardController.getWards);
router.get('/beds', authenticate, wardController.getBeds);
router.get('/admissions', authenticate, wardController.getActiveAdmissions);
router.get('/admissions/patient/:patientId', authenticate, wardController.getPatientAdmissions);
router.get('/stats', authenticate, wardController.getStats);
router.get('/:id', authenticate, wardController.getWardById);
router.post('/admit', authenticate, authorize('doctor', 'admin', 'nurse'), wardController.admitPatient);
router.patch('/:id/discharge', authenticate, authorize('doctor', 'admin'), wardController.dischargePatient);

export default router;
