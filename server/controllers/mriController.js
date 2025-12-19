const MRIImage = require('../models/MriImage');
const cloudStorageService = require('../services/cloudStorageService');
const ApiResponse = require('../utils/apiResponse');

// @desc    Upload MRI image
// @route   POST /api/mri/upload
// @access  Private
exports.uploadMRI = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'Please upload a file', 400);
    }

    const { patientId, scanType } = req.body;

    // Upload to S3
    // const uploadResult = await cloudStorageService.uploadFile(
    //   req.file.buffer,
    //   req.file.originalname,
    //   req.file.mimetype
    // );
    const uploadResult = await cloudStorageService.uploadFile(
  req.file.buffer,
  req.file.originalname
);

    // Create MRI record
    const mriImage = await MRIImage.create({
  patient: patientId,
  imageUrl: uploadResult.secure_url,
  cloudinaryPublicId: uploadResult.public_id,
  fileName: req.file.originalname,
  fileSize: uploadResult.bytes,
  mimeType: req.file.mimetype,
  scanType,
  uploadedBy: req.user.id
});
    // const mriImage = await MRIImage.create({
    //   patient: patientId,
    //   imageUrl: uploadResult.Location,
    //   s3Key: uploadResult.Key,
    //   fileName: req.file.originalname,
    //   fileSize: req.file.size,
    //   mimeType: req.file.mimetype,
    //   scanType,
    //   uploadedBy: req.user.id
    // });

    await mriImage.populate('patient', 'firstName lastName patientId');

    ApiResponse.success(res, mriImage, 'MRI image uploaded successfully', 201);
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

// @desc    Get MRI images for patient
// @route   GET /api/mri/patient/:patientId
// @access  Private
exports.getPatientMRIs = async (req, res) => {
  try {
    const mriImages = await MRIImage.find({ patient: req.params.patientId })
      .populate('uploadedBy', 'name email')
      .sort('-createdAt');

    ApiResponse.success(res, mriImages);
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

// @desc    Get single MRI image
// @route   GET /api/mri/:id
// @access  Private
exports.getMRI = async (req, res) => {
  try {
    const mriImage = await MRIImage.findById(req.params.id)
      .populate('patient', 'firstName lastName patientId')
      .populate('uploadedBy', 'name email');

    if (!mriImage) {
      return ApiResponse.error(res, 'MRI image not found', 404);
    }

    ApiResponse.success(res, mriImage);
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};

// @desc    Delete MRI image
// @route   DELETE /api/mri/:id
// @access  Private
exports.deleteMRI = async (req, res) => {
  try {
    const mriImage = await MRIImage.findById(req.params.id);

    if (!mriImage) {
      return ApiResponse.error(res, 'MRI image not found', 404);
    }

    // Delete from S3
    // await cloudStorageService.deleteFile(mriImage.s3Key);
    await cloudStorageService.deleteFile(mriImage.cloudinaryPublicId);

    // Delete from database
    await mriImage.deleteOne();

    ApiResponse.success(res, null, 'MRI image deleted successfully');
  } catch (error) {
    ApiResponse.error(res, error.message, 500);
  }
};