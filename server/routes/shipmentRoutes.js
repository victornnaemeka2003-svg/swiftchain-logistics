import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as shipmentController from '../controllers/shipmentController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/shipments' });

router.get('/', requireAuth, shipmentController.getAllShipments);
router.get('/:id', requireAuth, shipmentController.getShipmentById);
router.get('/track/:trackingNumber', shipmentController.getShipmentByTracking);
router.post('/', requireRole('Super Admin', 'Admin', 'Manager'), shipmentController.createShipment);
router.put('/:id', requireRole('Super Admin', 'Admin', 'Manager'), shipmentController.updateShipment);
router.delete('/:id', requireRole('Super Admin', 'Admin'), shipmentController.deleteShipment);
router.post('/:id/duplicate', requireRole('Super Admin', 'Admin', 'Manager'), shipmentController.duplicateShipment);
router.post('/:id/upload-documents', upload.array('documents', 5), shipmentController.uploadShipmentDocuments);
router.get('/:id/print-label', requireAuth, shipmentController.printShippingLabel);
router.get('/:id/invoice', requireAuth, shipmentController.generateInvoice);

export default router;
