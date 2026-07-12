import express from 'express';
import { requireAuth, requireRole, isSuperAdmin } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', requireAuth, userController.getAllUsers);
router.get('/:id', requireAuth, userController.getUserById);
router.post('/', isSuperAdmin, userController.createUser);
router.put('/:id', requireAuth, userController.updateUser);
router.delete('/:id', isSuperAdmin, userController.deleteUser);
router.put('/:id/password', requireAuth, userController.changePassword);
router.post('/:id/deactivate', isSuperAdmin, userController.deactivateUser);
router.post('/:id/activate', isSuperAdmin, userController.activateUser);

export default router;
