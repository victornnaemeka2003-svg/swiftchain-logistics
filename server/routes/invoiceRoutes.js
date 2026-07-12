import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as invoiceController from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/', requireAuth, invoiceController.getAllInvoices);
router.get('/:id', requireAuth, invoiceController.getInvoiceById);
router.post('/', requireRole('Super Admin', 'Admin', 'Manager'), invoiceController.createInvoice);
router.put('/:id', requireRole('Super Admin', 'Admin', 'Manager'), invoiceController.updateInvoice);
router.get('/:id/print', requireAuth, invoiceController.printInvoice);
router.post('/:id/pay', requireAuth, invoiceController.recordPayment);

export default router;
