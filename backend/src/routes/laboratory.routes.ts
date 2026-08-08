import { Router } from 'express';
import { laboratoryController } from '../controllers/laboratory.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/tests', authenticate, authorize('doctor', 'nurse', 'admin'), laboratoryController.requestTest);
router.get('/tests/patient/:patientId', authenticate, laboratoryController.getTestsByPatient);
router.get('/tests', authenticate, authorize('laboratory', 'admin', 'doctor'), laboratoryController.getTestsForLab);
router.patch('/tests/:id/status', authenticate, authorize('laboratory', 'admin'), laboratoryController.updateTestStatus);
router.post('/tests/:id/results', authenticate, authorize('laboratory', 'admin'), laboratoryController.addResult);
router.get('/results/test/:testId', authenticate, laboratoryController.getResultsByTest);
router.get('/results/patient/:patientId', authenticate, laboratoryController.getResultsByPatient);
router.get('/stats', authenticate, authorize('laboratory', 'admin'), laboratoryController.getStats);

export default router;
