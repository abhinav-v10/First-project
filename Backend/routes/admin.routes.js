import { Router } from 'express';
import { adminGetAllFeedback } from '../controllers/admin.controller.js';

const router = Router();

// @route   GET /admin/feedback
// @desc    View all feedback (admin overview)
router.get('/feedback', adminGetAllFeedback);

export default router;
