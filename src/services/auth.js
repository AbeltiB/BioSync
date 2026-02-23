const { getPage } = require('./browser');
const config = require('../config');

async function login() {
  const page = await getPage();
  const { url, username, password } = config.biotime;

  console.log(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Adjust selectors to match BioTime 8.0 login page
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard or element indicating success
  await page.waitForSelector('.dashboard', { timeout: 10000 });

  console.log('Login successful');
  // Cookies are automatically stored in context
}

module.exports = { login };