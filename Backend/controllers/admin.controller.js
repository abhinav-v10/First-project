import Feedback from '../models/feedback.model.js';

/**
 * @desc    View all feedback (admin overview)
 * @route   GET /admin/feedback
 */
export const adminGetAllFeedback = async (_req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('doctor', 'name department designation')
            .populate('patient', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message,
        });
    }
};
