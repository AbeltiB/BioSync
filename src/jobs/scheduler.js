const cron = require('node-cron');
const { login } = require('../services/auth');
const { fetchAttendance } = require('../services/attendance');
const { uploadShifts } = require('../services/shifts');
const { generateRandomShifts } = require('./shiftGenerator'); // you'll implement this

// Run every Sunday at 2:00 AM
cron.schedule('0 2 * * 0', async () => {
  console.log('Running weekly attendance fetch and shift upload...');

  try {
    await login();

    // Fetch last week's attendance (adjust dates as needed)
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const startDate = lastWeek.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const attendance = await fetchAttendance(startDate, endDate);
    // Store attendance somewhere (e.g., database, file)
    console.log(`Fetched ${attendance.length} records`);

    // Generate and upload random shifts for next week
    const shifts = generateRandomShifts(); // implement based on your logic
    for (const shift of shifts) {
      await uploadShifts(shift);
    }
    console.log(`Uploaded ${shifts.length} shifts`);

  } catch (err) {
    console.error('Weekly job failed:', err);
  }
});

console.log('Cron jobs scheduled');