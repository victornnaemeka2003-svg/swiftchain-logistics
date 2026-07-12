import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as warehouseController from '../controllers/warehouseController.js';

const router = express.Router();

router.get('/', requireAuth, warehouseController.getAllWarehouses);
router.get('/:id', requireAuth, warehouseController.getWarehouseById);
router.post('/', requireRole('Super Admin', 'Admin', 'Manager'), warehouseController.createWarehouse);
router.put('/:id', requireRole('Super Admin', 'Admin', 'Manager'), warehouseController.updateWarehouse);
router.delete('/:id', requireRole('Super Admin', 'Admin'), warehouseController.deleteWarehouse);
router.get('/:id/inventory', requireAuth, warehouseController.getWarehouseInventory);
router.post('/:id/inventory', requireRole('Super Admin', 'Admin', 'Manager'), warehouseController.addInventory);

export default router;
