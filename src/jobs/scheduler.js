const cron = require('node-cron');
const { login } = require('../services/auth');
const { uploadShiftsXlsBuffer } = require('../services/shifts');
const config = require('../config');
const { logStep, logError } = require('../services/logger');

async function fetchShiftsXlsFromEndpoint() {
  const endpoint = config.external?.shiftsEndpoint;
  const token = config.external?.token;

  if (!endpoint) {
    throw new Error('EXTERNAL_SHIFTS_ENDPOINT is not configured');
  }

  logStep('scheduler', 'STEP 1/3 fetch XLS from external endpoint', { endpoint });
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`External endpoint failed with status ${response.status}`);
  }

  logStep('scheduler', 'STEP 2/3 read response as arrayBuffer');
  const arrayBuffer = await response.arrayBuffer();

  logStep('scheduler', 'STEP 3/3 convert to Node buffer');
  return Buffer.from(arrayBuffer);
}

async function runScheduledShiftSync() {
  logStep('scheduler', 'weekly job started');
  await login();
  const xlsBuffer = await fetchShiftsXlsFromEndpoint();
  await uploadShiftsXlsBuffer(xlsBuffer, 'cron-shifts.xls');
  logStep('scheduler', 'weekly job finished');
}

// Run every Sunday at 2:00 AM
cron.schedule('0 2 * * 0', async () => {
  try {
    await runScheduledShiftSync();
  } catch (err) {
    logError('scheduler', 'weekly job', err);
  }
});

logStep('scheduler', 'cron jobs scheduled');

module.exports = { runScheduledShiftSync, fetchShiftsXlsFromEndpoint };
