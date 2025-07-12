import express from 'express';
import { getJobById, getJobs } from '../controllers/jobController.js';

const router = express.Router();

// Route to get all job listings
router.get('/', getJobs);

// Route to get a single job by its ID
router.get('/:id', getJobById);

export default router;
