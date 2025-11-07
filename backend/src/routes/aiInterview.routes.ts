import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  createAIInterview,
  getAIInterview,
  getUserAIInterviews,
  submitResponse,
  completeInterview,
} from '../controllers/aiInterview.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create new AI interview
router.post(
  '/',
  [
    body('interviewType').isIn(['TECHNICAL', 'HR', 'APTITUDE', 'BEHAVIORAL', 'DOMAIN_SPECIFIC', 'CODING', 'SYSTEM_DESIGN']),
    body('topic').trim().notEmpty(),
    body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
    body('duration').isInt({ min: 15, max: 120 }),
  ],
  createAIInterview
);

// Get specific AI interview
router.get('/:id', getAIInterview);

// Get user's AI interviews
router.get('/', getUserAIInterviews);

// Submit response to a question
router.post('/:id/responses', submitResponse);

// Complete interview
router.post('/:id/complete', completeInterview);

export default router;
