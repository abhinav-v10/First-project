import Doctor from '../models/doctor.model.js';

/**
 * @desc    Add a new doctor
 * @route   POST /doctors
 */
export const addDoctor = async (req, res) => {
    try {
        const { name, email, phone, department, designation } = req.body;

        // Check if a doctor with the same email already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({
                success: false,
                message: 'A doctor with this email already exists',
            });
        }

        const doctor = await Doctor.create({
            name,
            email,
            phone,
            department,
            designation,
        });

        res.status(201).json({
            success: true,
            message: 'Doctor added successfully',
            data: doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add doctor',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all doctors
 * @route   GET /doctors
 */
export const getAllDoctors = async (_req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message,
        });
    }
};

/**
 * @desc    Get a single doctor by ID
 * @route   GET /doctors/:doctorId
 */
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor',
            error: error.message,
        });
    }
};

/**
 * @desc    Update a doctor
 * @route   PUT /doctors/:doctorId
 */
export const updateDoctor = async (req, res) => {
    try {
        const { name, email, phone, department, designation } = req.body;

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.doctorId,
            { name, email, phone, department, designation },
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update doctor',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete a doctor
 * @route   DELETE /doctors/:doctorId
 */
export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete doctor',
            error: error.message,
        });
    }
};
