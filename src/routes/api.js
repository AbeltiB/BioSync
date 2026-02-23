const express = require('express');
const { fetchAttendance } = require('../services/attendance');
const { uploadShifts } = require('../services/shifts');
const { login } = require('../services/auth');
const router = express.Router();

// Ensure logged in before any operation (you may want to handle session expiry)
router.use(async (req, res, next) => {
  try {
    await login(); // will reuse existing session if cookies still valid
    next();
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// POST /api/fetch-attendance
router.post('/fetch-attendance', async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate required' });
  }
  try {
    const records = await fetchAttendance(startDate, endDate);
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upload-shifts
router.post('/upload-shifts', async (req, res) => {
  const shifts = req.body.shifts; // array of shift objects
  if (!Array.isArray(shifts)) {
    return res.status(400).json({ error: 'shifts array required' });
  }
  try {
    for (const shift of shifts) {
      await uploadShifts(shift);
    }
    res.json({ success: true, uploaded: shifts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;