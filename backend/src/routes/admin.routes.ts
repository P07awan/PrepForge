import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getAllUsers,
  getAllInterviews,
  getSystemStats,
  updateUserRole,
  deleteUser,
} from '../controllers/admin.controller';

const router = Router();

// All routes require admin authentication
router.use(authenticate, authorize('ADMIN'));

// Get all users
router.get('/users', getAllUsers);

// Get all interviews
router.get('/interviews', getAllInterviews);

// Get system statistics
router.get('/stats', getSystemStats);

// Update user role
router.put('/users/:id/role', updateUserRole);

// Delete user
router.delete('/users/:id', deleteUser);

export default router;
