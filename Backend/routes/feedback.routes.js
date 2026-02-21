import { Router } from 'express';
import {
    submitFeedback,
    getAllFeedback,
    getFeedbackByDoctor,
} from '../controllers/feedback.controller.js';

const router = Router();

// @route   POST /feedback
// @desc    Submit new feedback for a doctor
router.post('/', submitFeedback);

// @route   GET /feedback
// @desc    Get all feedback entries
router.get('/', getAllFeedback);

// @route   GET /feedback/doctor/:doctorId
// @desc    Get all feedback for a specific doctor
router.get('/doctor/:doctorId', getFeedbackByDoctor);

export default router;
