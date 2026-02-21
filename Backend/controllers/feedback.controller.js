import Feedback from '../models/feedback.model.js';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';

/**
 * @desc    Submit new feedback for a doctor
 * @route   POST /feedback
 *
 * Flow:
 *   1. Validate that the doctor exists
 *   2. Optionally create a patient record if details are provided
 *   3. Save the feedback document
 *   4. Recalculate the doctor's averageRating and totalFeedbacks
 */
export const submitFeedback = async (req, res) => {
    try {
        const { doctorId, rating, comment, patient: patientData } = req.body;

        // 1. Verify the doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        // 2. Optionally create a patient if details are provided
        let patientId = null;
        if (patientData && Object.keys(patientData).length > 0) {
            const newPatient = await Patient.create(patientData);
            patientId = newPatient._id;
        }

        // 3. Save the feedback
        const feedback = await Feedback.create({
            doctor: doctorId,
            patient: patientId,
            rating,
            comment,
        });

        // 4. Recalculate doctor's average rating and total feedback count
        const stats = await Feedback.aggregate([
            { $match: { doctor: doctor._id } },
            {
                $group: {
                    _id: '$doctor',
                    averageRating: { $avg: '$rating' },
                    totalFeedbacks: { $sum: 1 },
                },
            },
        ]);

        if (stats.length > 0) {
            doctor.averageRating = Math.round(stats[0].averageRating * 10) / 10; // round to 1 decimal
            doctor.totalFeedbacks = stats[0].totalFeedbacks;
            await doctor.save();
        }

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all feedback entries
 * @route   GET /feedback
 */
export const getAllFeedback = async (_req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('doctor', 'name department')
            .populate('patient', 'name email')
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

/**
 * @desc    Get all feedback for a specific doctor
 * @route   GET /feedback/doctor/:doctorId
 */
export const getFeedbackByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Verify the doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        const feedbacks = await Feedback.find({ doctor: doctorId })
            .populate('patient', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            doctor: { name: doctor.name, department: doctor.department },
            data: feedbacks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback for doctor',
            error: error.message,
        });
    }
};
