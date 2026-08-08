import { Router } from 'express';
import { billingController } from '../controllers/billing.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.post('/invoices', authenticate, authorize('admin', 'receptionist', 'accountant'), billingController.createInvoice);
router.get('/invoices', authenticate, billingController.getInvoices);
router.get('/invoices/:id', authenticate, billingController.getInvoiceById);
router.post('/payments', authenticate, authorize('admin', 'accountant'), billingController.recordPayment);
router.get('/payments/invoice/:invoiceId', authenticate, billingController.getPaymentsByInvoice);
router.get('/payments/patient/:patientId', authenticate, billingController.getPaymentsByPatient);
router.get('/stats', authenticate, authorize('admin', 'accountant'), billingController.getStats);

export default router;
