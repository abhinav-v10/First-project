import Patient from '../models/patient.model.js';

/**
 * @desc    Create a new patient
 * @route   POST /patients
 */
export const createPatient = async (req, res) => {
    try {
        const { name, email, phone, gender, age } = req.body;

        const patient = await Patient.create({ name, email, phone, gender, age });

        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            data: patient,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create patient',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all patients
 * @route   GET /patients
 */
export const getAllPatients = async (_req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients',
            error: error.message,
        });
    }
};
