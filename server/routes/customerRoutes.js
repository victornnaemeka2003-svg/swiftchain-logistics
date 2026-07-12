import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as customerController from '../controllers/customerController.js';

const router = express.Router();

router.get('/', requireAuth, customerController.getAllCustomers);
router.get('/:id', requireAuth, customerController.getCustomerById);
router.post('/', requireRole('Super Admin', 'Admin', 'Manager'), customerController.createCustomer);
router.put('/:id', requireRole('Super Admin', 'Admin', 'Manager'), customerController.updateCustomer);
router.delete('/:id', requireRole('Super Admin', 'Admin'), customerController.deleteCustomer);
router.get('/:id/shipments', requireAuth, customerController.getCustomerShipments);
router.get('/:id/profile', requireAuth, customerController.getCustomerProfile);

export default router;
