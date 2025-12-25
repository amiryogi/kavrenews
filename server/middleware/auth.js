import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'कृपया पहिले लग इन गर्नुहोस्',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'प्रयोगकर्ता फेला परेन',
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'तपाईंको खाता निष्क्रिय छ',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'अमान्य टोकन',
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'तपाईंलाई यो कार्य गर्न अनुमति छैन',
      });
    }
    next();
  };
};
