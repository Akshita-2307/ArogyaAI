const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symptoms: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    triageResult: {
      isEmergency: Boolean,
      severity: String,
      flags: [mongoose.Schema.Types.Mixed],
      recommendation: mongoose.Schema.Types.Mixed,
    },
    aiAnalysis: {
      risk_level: String,
      summary: String,
      risk_explanation: String,
      clinical_reasoning: String,
      suggested_tests: [String],
      conditions: [String],
      recommendations: [String],
      red_flags: [String],
      confidence: Number,
      detected_symptoms: [String],
      recommended_specialist: String,
      drug_interactions: {
        has_interactions: Boolean,
        has_high_severity: Boolean,
        interactions: [mongoose.Schema.Types.Mixed],
        summary: String,
        checked_medicines: [String],
      },
    },
    drugInteractions: {
      hasInteractions: Boolean,
      hasHighSeverity: Boolean,
      hasModerateSeverity: Boolean,
      highSeverityCount: Number,
      moderateSeverityCount: Number,
      interactions: [mongoose.Schema.Types.Mixed],
      summary: String,
      checkedMedicines: [String],
    },
    combinedRiskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      required: true,
    },
    files: [
      {
        originalName: String,
        fileName: String,
        fileUrl: String,
        fileType: String,
        mimetype: String,
        fileSize: Number,
        category: String,
      },
    ],
    userContext: {
      age: Number,
      gender: String,
      medicalHistory: [String],
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'pending'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ combinedRiskLevel: 1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
