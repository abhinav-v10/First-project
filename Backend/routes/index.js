import { Router } from 'express';

import patientRoutes from './patient.routes.js';
import doctorRoutes from './doctor.routes.js';
import feedbackRoutes from './feedback.routes.js';
import adminRoutes from './admin.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
