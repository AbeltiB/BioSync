const { getPage } = require('./browser');

async function uploadShifts(shiftData) {
  const page = await getPage();

  await page.goto(`${config.biotime.url}/shifts`, { waitUntil: 'networkidle' });

  // Click "Add" or "Upload" button
  await page.click('#upload-shifts');

  // Fill form (adjust selectors)
  await page.selectOption('#employee-select', shiftData.employeeId);
  await page.fill('#shift-date', shiftData.date);
  await page.selectOption('#shift-type', shiftData.type);

  // Submit
  await page.click('#save');
  await page.waitForSelector('.success-message', { timeout: 5000 });

  console.log(`Shift uploaded for employee ${shiftData.employeeId}`);
}

module.exports = { uploadShifts };