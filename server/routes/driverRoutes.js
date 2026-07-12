import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as driverController from '../controllers/driverController.js';

const router = express.Router();

router.get('/', requireAuth, driverController.getAllDrivers);
router.get('/:id', requireAuth, driverController.getDriverById);
router.post('/', requireRole('Super Admin', 'Admin', 'Manager'), driverController.createDriver);
router.put('/:id', requireRole('Super Admin', 'Admin', 'Manager'), driverController.updateDriver);
router.delete('/:id', requireRole('Super Admin', 'Admin'), driverController.deleteDriver);
router.get('/:id/shipments', requireAuth, driverController.getDriverShipments);

export default router;
