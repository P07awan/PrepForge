import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserInterviews,
  getUserStats,
  findUserByEmail,
} from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user's interview history
router.get('/interviews', getUserInterviews);

// Get user statistics
router.get('/stats', getUserStats);

// Lookup user by email
router.get('/lookup', findUserByEmail);

export default router;
