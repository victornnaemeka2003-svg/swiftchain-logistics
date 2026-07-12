import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as trackingController from '../controllers/trackingController.js';

const router = express.Router();

router.get('/', requireAuth, trackingController.getAllTrackingEvents);
router.get('/:id', requireAuth, trackingController.getTrackingEventById);
router.get('/shipment/:shipmentId', requireAuth, trackingController.getShipmentTrackingEvents);
router.post('/', requireRole('Super Admin', 'Admin', 'Manager', 'Staff'), trackingController.createTrackingEvent);
router.put('/:id', requireRole('Super Admin', 'Admin', 'Manager'), trackingController.updateTrackingEvent);
router.delete('/:id', requireRole('Super Admin', 'Admin'), trackingController.deleteTrackingEvent);

export default router;
