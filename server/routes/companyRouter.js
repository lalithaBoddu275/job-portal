import express from 'express';
const router = express.Router();
import {
    registerCompany,
    loginCompany,
    getCompanyData,
    postJob,
    getCompanyJobApplicants,
    getCompanyPostedJobs,
    changeJobApplicationStatus,
    changeVisiblity,
  } from '../controllers/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middlewares/authMiddleware.js';
  

// Register a company
router.post('/register',upload.single('image'), registerCompany);

// Company login
router.post('/login', loginCompany);

// Get company data
router.get('/company',protectCompany, getCompanyData);

// Post a job 
router.post('/post-job',protectCompany,  postJob);

// Get applicant data of a company
router.get('/applicants',protectCompany,  getCompanyJobApplicants);

// Get company job list
router.get('/list-jobs',protectCompany,  getCompanyPostedJobs);

// Change application status
router.post('/change-status',protectCompany,  changeJobApplicationStatus);

// Change applications visibility
router.post('/change-visibility', protectCompany, changeVisiblity);


export default router;
