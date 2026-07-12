import express from 'express';
import { requireAuth, requireRole, isSuperAdmin } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', requireAuth, authController.getCurrentUser);

export default router;
