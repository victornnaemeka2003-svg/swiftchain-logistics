import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', requireAuth, dashboardController.getDashboardStats);
router.get('/recent-activity', requireAuth, dashboardController.getRecentActivity);
router.get('/revenue-chart', requireAuth, dashboardController.getRevenueChart);
router.get('/shipment-chart', requireAuth, dashboardController.getShipmentChart);

export default router;
