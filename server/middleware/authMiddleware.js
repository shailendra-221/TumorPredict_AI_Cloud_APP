const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

// Protect Routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(res, 'Not authorized to access this route', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    next();
  } catch (error) {
    return ApiResponse.error(res, 'Not authorized to access this route', 401);
  }
};

// Role Authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        'User role not authorized to access this route',
        403
      );
    }
    next();
  };
};
