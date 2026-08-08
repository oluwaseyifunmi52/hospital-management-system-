import { Router } from 'express';
import { nursingController } from '../controllers/nursing.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/vitals', authenticate, authorize('nurse', 'doctor'), nursingController.recordVitals);
router.get('/vitals/patient/:patientId', authenticate, nursingController.getVitalsByPatient);
router.post('/notes', authenticate, authorize('nurse'), nursingController.addNursingNote);
router.get('/notes/patient/:patientId', authenticate, nursingController.getNursingNotesByPatient);

export default router;
