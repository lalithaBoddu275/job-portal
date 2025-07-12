import jwt from 'jsonwebtoken';
import Company from '../models/company.js';

export const protectCompany = async (req, res, next) => {
  let token;

  // ✅ Check if token is present in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]; // get the token part only
  } else if (req.headers.token) {
    token = req.headers.token; // optional fallback
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id).select('-password');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    req.company = company;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: error.message,
    });
  }
};
