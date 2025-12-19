const Patient = require('../models/Patient');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { patientId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .populate('assignedDoctor', 'name email')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    ApiResponse.paginated(res, patients, page, limit, total);
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', 'name email specialization');

    if (!patient) {
      return ApiResponse.error(res, 'Patient not found', 404);
    }

    ApiResponse.success(res, patient);
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res) => {
  try {
    const patientData = {
      ...req.body,
      assignedDoctor: req.user.id
    };

    const patient = await Patient.create(patientData);
    ApiResponse.success(res, patient, 'Patient created successfully', 201);
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return ApiResponse.error(res, 'Patient not found', 404);
    }

    ApiResponse.success(res, patient, 'Patient updated successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return ApiResponse.error(res, 'Patient not found', 404);
    }

    ApiResponse.success(res, null, 'Patient deleted successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};
