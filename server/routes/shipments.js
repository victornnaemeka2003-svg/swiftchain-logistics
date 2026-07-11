import express from 'express';
import * as shipmentController from '../controllers/shipmentController.js';
import { isAuthenticated, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', isAuthenticated, requireRole('super_admin', 'admin', 'manager'), shipmentController.createShipment);
router.get('/list', isAuthenticated, shipmentController.getShipments);
router.get('/track/:trackingNumber', shipmentController.getShipmentByTrackingNumber);
router.put('/:shipmentId/status', isAuthenticated, requireRole('super_admin', 'admin', 'staff'), shipmentController.updateShipmentStatus);
router.delete('/:shipmentId', isAuthenticated, requireRole('super_admin', 'admin', 'manager'), shipmentController.deleteShipment);

export default router;
