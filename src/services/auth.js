const { getPage } = require('./browser');
const config = require('../config');
const { logStep, logError } = require('./logger');

async function login() {
  const page = await getPage();
  const { url, username, password } = config.biotime;

  logStep('auth', 'STEP 1/5 navigate to login page', { url });
  await page.goto(url, { waitUntil: 'networkidle' });

  logStep('auth', 'STEP 2/5 fill username');
  await page.fill('input[name="username"]', username);

  logStep('auth', 'STEP 3/5 fill password');
  await page.fill('input[name="password"]', password);

  logStep('auth', 'STEP 4/5 submit login form');
  await page.click('button[type="submit"]');

  logStep('auth', 'STEP 5/5 wait for dashboard');
  try {
    await page.waitForSelector('.dashboard', { timeout: 10000 });
    logStep('auth', 'login successful');
  } catch (error) {
    logError('auth', 'wait dashboard after login', error);
    throw error;
  }
}

module.exports = { login };
