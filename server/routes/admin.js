import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { isAuthenticated, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard/stats', isAuthenticated, adminController.getDashboardStats);
router.get('/users', isAuthenticated, requireRole('super_admin', 'admin'), adminController.getUsers);
router.post('/users/create', isAuthenticated, requireRole('super_admin'), adminController.createUser);
router.get('/audit-logs', isAuthenticated, requireRole('super_admin', 'admin'), adminController.getAuditLogs);

export default router;
