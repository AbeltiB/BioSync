const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { getPage } = require('./browser');
const config = require('../config');
const { logStep } = require('./logger');

async function uploadShift(shiftData) {
  const page = await getPage();

  logStep('shifts', 'STEP 1/6 navigate to shifts page', { employeeId: shiftData.employeeId, date: shiftData.date });
  await page.goto(`${config.biotime.url}/shifts`, { waitUntil: 'networkidle' });

  logStep('shifts', 'STEP 2/6 click upload/add shift');
  await page.click('#upload-shifts');

  logStep('shifts', 'STEP 3/6 select employee');
  await page.selectOption('#employee-select', String(shiftData.employeeId));

  logStep('shifts', 'STEP 4/6 fill date');
  await page.fill('#shift-date', shiftData.date);

  logStep('shifts', 'STEP 5/6 select shift type');
  await page.selectOption('#shift-type', shiftData.type);

  logStep('shifts', 'STEP 6/6 submit and wait success');
  await page.click('#save');
  await page.waitForSelector('.success-message', { timeout: 5000 });

  logStep('shifts', 'shift uploaded', { employeeId: shiftData.employeeId });
}

async function uploadShifts(shifts = []) {
  for (const shift of shifts) {
    await uploadShift(shift);
  }
  return shifts.length;
}

async function uploadShiftsXlsBuffer(buffer, originalName = 'shifts.xls') {
  const page = await getPage();
  const tmpFile = path.join(os.tmpdir(), `${Date.now()}-${originalName}`);

  logStep('shifts-xls', 'STEP 1/6 write incoming XLS buffer to temp file', { tmpFile });
  await fs.writeFile(tmpFile, buffer);

  try {
    logStep('shifts-xls', 'STEP 2/6 navigate to shifts import page');
    await page.goto(`${config.biotime.url}/shifts/import`, { waitUntil: 'networkidle' });

    logStep('shifts-xls', 'STEP 3/6 set file input with XLS');
    await page.setInputFiles('input[type="file"]', tmpFile);

    logStep('shifts-xls', 'STEP 4/6 click upload/import');
    await page.click('#import-submit');

    logStep('shifts-xls', 'STEP 5/6 wait for import result');
    await page.waitForSelector('.success-message', { timeout: 15000 });

    logStep('shifts-xls', 'STEP 6/6 XLS shifts import completed');
    return { success: true };
  } finally {
    logStep('shifts-xls', 'cleanup temp file');
    await fs.rm(tmpFile, { force: true });
  }
}

module.exports = { uploadShift, uploadShifts, uploadShiftsXlsBuffer };
