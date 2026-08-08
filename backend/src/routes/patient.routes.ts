import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('patient'));

router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);
router.get('/appointments', patientController.getAppointments);
router.post('/appointments', patientController.createAppointment);
router.get('/medical-records', patientController.getMedicalRecords);
router.get('/prescriptions', patientController.getPrescriptions);

export default router;
