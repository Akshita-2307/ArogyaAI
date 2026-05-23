const express = require('express');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../middlewares/upload');
const { protect } = require('../middlewares/auth');
const Analysis = require('../models/Analysis');
const Report = require('../models/Report');

const router = express.Router();

router.use(protect);

function isSafeFilename(filename) {
  if (!filename || typeof filename !== 'string') return false;
  if (filename.includes('..')) return false;
  if (filename.includes('/') || filename.includes('\\')) return false;
  // Only allow typical upload filename characters.
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

async function canAccessFile(req, filename) {
  // Admin can access all uploaded files
  if (req.user?.role === 'admin') return true;

  // Allow if file is referenced by an analysis belonging to the user
  const analysis = await Analysis.findOne({
    user: req.user.id,
    'files.fileName': filename,
  }).select('_id').lean();
  if (analysis) return true;

  // Allow if file is referenced by a report belonging to the user
  const report = await Report.findOne({
    user: req.user.id,
    $or: [{ fileName: filename }, { fileUrl: { $regex: new RegExp(filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) } }],
  }).select('_id').lean();
  if (report) return true;

  return false;
}

router.get('/images/:filename', (req, res, next) => {
  (async () => {
    const { filename } = req.params;
    if (!isSafeFilename(filename)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid filename' });
    }
    if (!(await canAccessFile(req, filename))) {
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    const filePath = path.join(UPLOAD_DIR, 'images', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found',
      });
    }

    return res.sendFile(filePath);
  })().catch(next);
});

router.get('/prescriptions/:filename', (req, res, next) => {
  (async () => {
    const { filename } = req.params;
    if (!isSafeFilename(filename)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid filename' });
    }
    if (!(await canAccessFile(req, filename))) {
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    const filePath = path.join(UPLOAD_DIR, 'prescriptions', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found',
      });
    }

    return res.sendFile(filePath);
  })().catch(next);
});

module.exports = router;
