import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';

const router = Router();

// @route   GET /analytics
// @desc    Fetch dashboard analytics
router.get('/', getAnalytics);

export default router;
