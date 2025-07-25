import Company from "../models/company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/job.js";
import JobApplication from "../models/jobApplication.js";
import User from "../models/user.js"; // ✅ Required to fetch Clerk-based users

// ---------------- Register Company ----------------
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;
 
  if (!name || !email || !password || !imageFile) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  if (!imageFile.mimetype.startsWith("image/")) {
    return res.status(400).json({ success: false, message: "Only image files allowed" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ success: false, message: "Company already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("Error in registerCompany:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ---------------- Login Company ----------------
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get Company Data ----------------
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Post Job ----------------
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company._id;

  if (!title || !description || !location || !salary || !level || !category) {
    return res.status(400).json({ success: false, message: "Missing job details" });
  }

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      level,
      category,
      companyId,
      date: Date.now(),
      visible: true,
    });

    await newJob.save();

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get Applicants for a Job ----------------
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    const applications = await JobApplication.find({ companyId }).populate('jobId');

    const applicationsWithUser = await Promise.all(
      applications.map(async (app) => {
        const user = await User.findById(app.userId);
        return {
          ...app.toObject(),
          userId: user, // manually attach full user object
        };
      })
    );

    return res.json({ success: true, applications: applicationsWithUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get Posted Jobs ----------------
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Change Job Application Status ----------------
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    await JobApplication.findOneAndUpdate({ _id: id }, { status });
    res.status(200).json({ success: true, message: "Status changed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Change Job Visibility ----------------
export const changeVisiblity = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company?._id;

    if (!companyId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No company info" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!job.companyId || companyId.toString() !== job.companyId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized: Job does not belong to the company" });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error("Error in changeVisiblity:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
