import Feedback from '../models/feedback.model.js';
import Doctor from '../models/doctor.model.js';

/**
 * @desc    Fetch dashboard analytics
 * @route   GET /analytics
 *
 * Returns:
 *   - totalFeedbacks:         Total number of feedback entries
 *   - averageHospitalRating:  Average rating across all feedback
 *   - doctorWiseSummary:      Per-doctor rating breakdown
 *   - departmentWiseSummary:  Per-department rating breakdown
 */
export const getAnalytics = async (_req, res) => {
    try {
        // --- Overall stats ---
        const overallStats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    totalFeedbacks: { $sum: 1 },
                    averageHospitalRating: { $avg: '$rating' },
                },
            },
        ]);

        const totalFeedbacks = overallStats[0]?.totalFeedbacks ?? 0;
        const averageHospitalRating =
            Math.round((overallStats[0]?.averageHospitalRating ?? 0) * 10) / 10;

        // --- Doctor-wise rating summary ---
        const doctorWiseSummary = await Feedback.aggregate([
            {
                $group: {
                    _id: '$doctor',
                    averageRating: { $avg: '$rating' },
                    totalFeedbacks: { $sum: 1 },
                },
            },
            {
                // Populate doctor details
                $lookup: {
                    from: 'doctors', // Mongoose collection name (lowercase + plural)
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doctor',
                },
            },
            { $unwind: '$doctor' },
            {
                $project: {
                    _id: 0,
                    doctorId: '$doctor._id',
                    name: '$doctor.name',
                    department: '$doctor.department',
                    averageRating: { $round: ['$averageRating', 1] },
                    totalFeedbacks: 1,
                },
            },
            { $sort: { averageRating: -1 } },
        ]);

        // --- Department-wise rating summary ---
        const departmentWiseSummary = await Feedback.aggregate([
            {
                // Join with doctors to get department info
                $lookup: {
                    from: 'doctors',
                    localField: 'doctor',
                    foreignField: '_id',
                    as: 'doctorInfo',
                },
            },
            { $unwind: '$doctorInfo' },
            {
                $group: {
                    _id: '$doctorInfo.department',
                    averageRating: { $avg: '$rating' },
                    totalFeedbacks: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    department: '$_id',
                    averageRating: { $round: ['$averageRating', 1] },
                    totalFeedbacks: 1,
                },
            },
            { $sort: { averageRating: -1 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalFeedbacks,
                averageHospitalRating,
                doctorWiseSummary,
                departmentWiseSummary,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message,
        });
    }
};
