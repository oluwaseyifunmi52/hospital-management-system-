import { Router } from 'express';
import { pharmacyController } from '../controllers/pharmacy.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/drugs', authenticate, authorize('pharmacist', 'admin'), pharmacyController.addDrug);
router.get('/drugs', authenticate, pharmacyController.getDrugs);
router.patch('/drugs/:id', authenticate, authorize('pharmacist', 'admin'), pharmacyController.updateDrug);
router.post('/dispense', authenticate, authorize('pharmacist'), pharmacyController.dispense);
router.get('/sales', authenticate, pharmacyController.getSales);
router.get('/low-stock', authenticate, authorize('pharmacist', 'admin'), pharmacyController.getLowStockDrugs);
router.get('/expiring', authenticate, authorize('pharmacist', 'admin'), pharmacyController.getExpiringDrugs);
router.get('/stats', authenticate, authorize('pharmacist', 'admin'), pharmacyController.getStats);

export default router;
