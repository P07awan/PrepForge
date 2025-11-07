import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { chatbotController } from '../controllers/chatbot.controller';

const router = Router();

// Chatbot endpoint - requires authentication
router.post('/', authenticate, chatbotController);

export default router;
