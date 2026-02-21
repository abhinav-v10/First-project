import { Router } from 'express';
import { createPatient, getAllPatients } from '../controllers/patient.controller.js';

const router = Router();

// @route   POST /patients
// @desc    Create a new patient (optional — supports anonymous feedback)
router.post('/', createPatient);

// @route   GET /patients
// @desc    Get all patients
router.get('/', getAllPatients);

export default router;
