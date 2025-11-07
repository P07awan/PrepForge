import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
} from '../controllers/payment.controller';

const router = Router();

// Webhook (no authentication)
router.post('/webhook', handleWebhook);

// All other routes require authentication
router.use(authenticate);

// Create checkout session
router.post(
  '/checkout',
  [
    body('subscription').isIn(['BASIC', 'PREMIUM', 'ENTERPRISE']),
  ],
  createCheckoutSession
);

// Get payment history
router.get('/history', getPaymentHistory);

export default router;
