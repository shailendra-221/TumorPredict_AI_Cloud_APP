 

const mongoose = require('mongoose');

const tumourAnalysisSchema = new mongoose.Schema({
  mriImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MRIImage',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  detectionResults: {
    tumourDetected: {
      type: Boolean,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    location: {
      x: Number,
      y: Number,
      z: Number
    },
    size: {
      volume: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number
      }
    }
  },
  phenotypeCharacteristics: {
    shape: String,
    texture: String,
    intensity: Number,
    heterogeneity: Number,
    enhancement: String
  },
  // FIXED: Changed from String to Object with nested properties
  classification: {
    type: {
      type: String,
      enum: ['Glioblastoma', 'Astrocytoma', 'Oligodendroglioma', 'Meningioma', 'Metastasis', 'Other']
    },
    grade: {
      type: String,
      enum: ['Grade I', 'Grade II', 'Grade III', 'Grade IV', 'Unknown']
    },
    malignancy: {
      type: String,
      enum: ['Benign', 'Low-grade malignant', 'High-grade malignant', 'Unknown']
    }
  },
  biomarkers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Biomarker'
  }],
  riskAssessment: {
    progressionRisk: {
      type: String,
      enum: ['Low', 'Moderate', 'High']
    },
    recurrenceRisk: {
      type: String,
      enum: ['Low', 'Moderate', 'High']
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  analysisDate: {
    type: Date,
    default: Date.now
  },
  analyzedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
tumourAnalysisSchema.index({ patient: 1, createdAt: -1 });
tumourAnalysisSchema.index({ mriImage: 1 });

module.exports = mongoose.model('TumourAnalysis', tumourAnalysisSchema);