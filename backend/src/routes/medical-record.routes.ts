import { Router } from 'express';
import { medicalRecordController } from '../controllers/medical-record.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/', authenticate, authorize('doctor', 'admin'), medicalRecordController.create);
router.get('/patient/:patientId', authenticate, medicalRecordController.getByPatient);
router.get('/stats', authenticate, medicalRecordController.getStats);
router.get('/:id', authenticate, medicalRecordController.getById);
router.patch('/:id', authenticate, authorize('doctor', 'admin'), medicalRecordController.update);

router.post('/prescriptions', authenticate, authorize('doctor'), medicalRecordController.createPrescription);
router.get('/prescriptions/patient/:patientId', authenticate, medicalRecordController.getPrescriptionsByPatient);
router.get('/prescriptions/:id', authenticate, medicalRecordController.getPrescriptionById);

export default router;
