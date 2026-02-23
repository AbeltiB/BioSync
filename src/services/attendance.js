const { getPage } = require('./browser');
const config = require('../config');
const { logStep } = require('./logger');

async function fetchAttendance(startDate, endDate) {
  const page = await getPage();

  logStep('attendance', 'STEP 1/5 navigate attendance page', { startDate, endDate });
  await page.goto(`${config.biotime.url}/attendance`, { waitUntil: 'networkidle' });

  logStep('attendance', 'STEP 2/5 fill date filters');
  await page.fill('#start_date', startDate); // YYYY-MM-DD
  await page.fill('#end_date', endDate);

  logStep('attendance', 'STEP 3/5 trigger search');
  await page.click('#search');

  logStep('attendance', 'STEP 4/5 wait results table');
  await page.waitForSelector('#attendance-table tbody tr');

  logStep('attendance', 'STEP 5/5 scrape records');
  const records = await page.$$eval('#attendance-table tbody tr', rows =>
    rows.map(row => {
      const cols = row.querySelectorAll('td');
      return {
        employeeId: cols[0]?.innerText,
        name: cols[1]?.innerText,
        checkIn: cols[2]?.innerText,
        checkOut: cols[3]?.innerText,
      };
    })
  );

  logStep('attendance', 'records fetched', { count: records.length });
  return records;
}

module.exports = { fetchAttendance };
