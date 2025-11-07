import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUnifiedDashboard,
  getInterviewerRequests,
  acceptInterviewRequest,
  declineInterviewRequest,
} from '../controllers/dashboard.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get unified dashboard data (candidate + interviewer views)
router.get('/unified', getUnifiedDashboard);

// Get interviewer-specific requests
router.get('/interviewer/requests', getInterviewerRequests);

// Accept interview request
router.post('/interviewer/requests/:id/accept', acceptInterviewRequest);

// Decline interview request
router.post('/interviewer/requests/:id/decline', declineInterviewRequest);

export default router;
