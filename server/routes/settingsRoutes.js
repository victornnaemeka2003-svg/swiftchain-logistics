import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', requireAuth, settingsController.getAllSettings);
router.get('/:key', requireAuth, settingsController.getSettingByKey);
router.post('/', requireRole('Super Admin', 'Admin'), settingsController.updateSetting);
router.post('/bulk', requireRole('Super Admin', 'Admin'), settingsController.bulkUpdateSettings);

export default router;
