import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import {
  scheduleLiveInterview,
  getLiveInterview,
  getUserLiveInterviews,
  joinInterview,
  completeInterview,
} from '../controllers/liveInterview.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Schedule new live interview
router.post(
  '/',
  [
    body('interviewType').isIn(['TECHNICAL', 'HR', 'APTITUDE', 'BEHAVIORAL', 'DOMAIN_SPECIFIC', 'CODING', 'SYSTEM_DESIGN']),
    body('topic').trim().notEmpty(),
    body('scheduledAt').isISO8601(),
    body('duration').isInt({ min: 30, max: 180 }),
  ],
  scheduleLiveInterview
);

// Get specific live interview
router.get('/:id', getLiveInterview);

// Get user's live interviews
router.get('/', getUserLiveInterviews);

// Join interview (generates WebRTC tokens)
router.post('/:id/join', joinInterview);

// Complete interview (interviewer only)
router.post('/:id/complete', authorize('INTERVIEWER', 'ADMIN'), completeInterview);

export default router;
