import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

router.get('/shipments/pdf', requireAuth, reportController.generateShipmentReportPdf);
router.get('/shipments/csv', requireAuth, reportController.generateShipmentReportCsv);
router.get('/revenue/pdf', requireAuth, reportController.generateRevenueReportPdf);
router.get('/revenue/csv', requireAuth, reportController.generateRevenueReportCsv);
router.get('/customer/pdf', requireAuth, reportController.generateCustomerReportPdf);
router.get('/customer/csv', requireAuth, reportController.generateCustomerReportCsv);
router.get('/delivery/pdf', requireAuth, reportController.generateDeliveryReportPdf);
router.get('/driver/pdf', requireAuth, reportController.generateDriverPerformanceReportPdf);

export default router;
