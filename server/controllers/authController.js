const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res,next) => {
  try {
    const { name, email, password, role, specialization, licenseNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return ApiResponse.error(res, 'User already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      specialization,
      licenseNumber,
    });

    const token = generateToken(user._id);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
    // return ApiResponse.error(res, error.message, 500);
  }
};

// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, 'Account is deactivated', 403);
    }

    const token = generateToken(user._id);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
    // return ApiResponse.error(res, error.message, 500);
  }
};

// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res,next) => {
  try {
    const user = await User.findById(req.user.id);
    return ApiResponse.success(res, user);
  } catch (error) {
    next(error);
    // return ApiResponse.error(res, error.message, 500);
  }
};
