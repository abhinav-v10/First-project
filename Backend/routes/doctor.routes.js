import { Router } from 'express';
import {
    addDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
} from '../controllers/doctor.controller.js';

const router = Router();

// @route   POST /doctors
// @desc    Add a new doctor
router.post('/', addDoctor);

// @route   GET /doctors
// @desc    Get all doctors
router.get('/', getAllDoctors);

// @route   GET /doctors/:doctorId
// @desc    Get a single doctor by ID
router.get('/:doctorId', getDoctorById);

// @route   PUT /doctors/:doctorId
// @desc    Update a doctor
router.put('/:doctorId', updateDoctor);

// @route   DELETE /doctors/:doctorId
// @desc    Delete a doctor
router.delete('/:doctorId', deleteDoctor);

export default router;
