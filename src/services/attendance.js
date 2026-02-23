const { getPage } = require('./browser');

async function fetchAttendance(startDate, endDate) {
  const page = await getPage();

  // Navigate to attendance page (adjust URL/path)
  await page.goto(`${config.biotime.url}/attendance`, { waitUntil: 'networkidle' });

  // Set date range (example, adjust selectors)
  await page.fill('#start_date', startDate); // YYYY-MM-DD
  await page.fill('#end_date', endDate);
  await page.click('#search');

  // Wait for results table
  await page.waitForSelector('#attendance-table tbody tr');

  // Scrape data
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

  console.log(`Fetched ${records.length} attendance records`);
  return records;
}

module.exports = { fetchAttendance };