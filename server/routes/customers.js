import express from 'express';
import * as customerController from '../controllers/customerController.js';
import { isAuthenticated, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', isAuthenticated, requireRole('super_admin', 'admin', 'manager'), customerController.createCustomer);
router.get('/list', isAuthenticated, customerController.getCustomers);
router.get('/:customerId', isAuthenticated, customerController.getCustomer);
router.put('/:customerId', isAuthenticated, requireRole('super_admin', 'admin', 'manager'), customerController.updateCustomer);
router.delete('/:customerId', isAuthenticated, requireRole('super_admin', 'admin', 'manager'), customerController.deleteCustomer);

export default router;
