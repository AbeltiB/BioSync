const express = require('express');
const { fetchAttendance } = require('../services/attendance');
const { uploadShift, uploadShifts, uploadShiftsXlsBuffer } = require('../services/shifts');
const { login } = require('../services/auth');
const { logStep, logError } = require('../services/logger');

const router = express.Router();
const rawXlsBody = express.raw({
  type: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
  ],
  limit: '20mb',
});

router.post('/login', async (req, res) => {
  try {
    logStep('api', 'manual login requested');
    await login();
    return res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    logError('api', 'manual login', err);
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Ensure logged in before any operation except explicit /login
router.use(async (req, res, next) => {
  try {
    logStep('api', 'auto-login middleware');
    await login();
    next();
  } catch (err) {
    logError('api', 'auto-login middleware', err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

router.post('/fetch-attendance', async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate required' });
  }
  try {
    logStep('api', 'fetch-attendance endpoint called', { startDate, endDate });
    const records = await fetchAttendance(startDate, endDate);
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    logError('api', 'fetch-attendance endpoint', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-shifts', async (req, res) => {
  const shifts = req.body.shifts;
  if (!Array.isArray(shifts)) {
    return res.status(400).json({ error: 'shifts array required' });
  }
  try {
    logStep('api', 'upload-shifts endpoint called', { shifts: shifts.length });
    for (const shift of shifts) {
      await uploadShift(shift);
    }
    res.json({ success: true, uploaded: shifts.length });
  } catch (err) {
    logError('api', 'upload-shifts endpoint', err);
    res.status(500).json({ error: err.message });
  }
});

// endpoint ready to receive shift XLS from another system
router.post('/upload-shifts-xls', rawXlsBody, async (req, res) => {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    return res.status(400).json({
      error:
        'XLS/XLSX binary payload required. Use Content-Type application/vnd.ms-excel or application/octet-stream.',
    });
  }

  try {
    logStep('api', 'upload-shifts-xls endpoint called', {
      bytes: req.body.length,
      contentType: req.headers['content-type'],
    });
    await uploadShiftsXlsBuffer(req.body, req.headers['x-file-name'] || 'shifts.xls');
    return res.json({ success: true, uploaded: true });
  } catch (err) {
    logError('api', 'upload-shifts-xls endpoint', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
