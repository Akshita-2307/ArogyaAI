const Joi = require('joi');

const aiResultSchema = Joi.object({
  risk_level: Joi.string().valid('low', 'moderate', 'high', 'critical').required(),
  risk_explanation: Joi.string().allow('').max(1000).default(''),
  summary: Joi.string().allow('').max(1000).default(''),
  possible_conditions: Joi.array().items(Joi.string().max(200)).max(10).default([]),
  recommendations: Joi.array().items(Joi.string().max(300)).max(10).default([]),
  red_flags: Joi.array().items(Joi.string().max(300)).max(10).default([]),
  confidence_score: Joi.number().min(0).max(1).default(0.5),
  clinical_reasoning: Joi.string().allow('').max(5000).default(''),
  suggested_tests: Joi.array().items(Joi.string().max(200)).max(20).allow(null).default(null),
  detected_medicines: Joi.array().items(Joi.string().max(200)).max(30).default([]),
  // Optional error/fallback markers
  error: Joi.string().allow('').optional(),
  fallback: Joi.string().allow('').optional(),
}).unknown(false);

function validateAiResult(aiResult) {
  const { error, value } = aiResultSchema.validate(aiResult || {}, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) return { ok: false, error, value: null };

  // Ensure at least some content exists besides risk level
  const hasAnyContent =
    (value.summary && value.summary.trim().length > 0) ||
    (value.risk_explanation && value.risk_explanation.trim().length > 0) ||
    (value.possible_conditions && value.possible_conditions.length > 0) ||
    (value.recommendations && value.recommendations.length > 0);

  if (!hasAnyContent) {
    return { ok: false, error: new Error('Empty AI result'), value: null };
  }

  return { ok: true, error: null, value };
}

module.exports = { validateAiResult };

