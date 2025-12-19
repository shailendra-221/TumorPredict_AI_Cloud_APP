const mongoose = require('mongoose');

const mriImageSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
  type: String,
  required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: Number,
  mimeType: String,
  scanDate: {
    type: Date,
    default: Date.now
  },
  scanType: {
    type: String,
    enum: ['T1', 'T2', 'FLAIR', 'DWI', 'Contrast'],
    required: true
  },
  metadata: {
    modalitty: String,
    manufacturer: String,
    model: String,
    sliceThickness: Number,
    pixelSpacing: [Number],
    imageSize: {
      width: Number,
      height: Number
    }
  },
  processingStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed'],
    default: 'Pending'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  analysisCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MRIImage', mriImageSchema);