const { chromium } = require('playwright');
const { logStep } = require('./logger');

let browser;
let context;
let page;

async function getPage() {
  if (!browser) {
    logStep('browser', 'STEP 1/3 launch browser');
    browser = await chromium.launch({ headless: true }); // set false for debugging
  }
  if (!context) {
    logStep('browser', 'STEP 2/3 create context');
    context = await browser.newContext();
  }
  if (!page) {
    logStep('browser', 'STEP 3/3 create page');
    page = await context.newPage();
  }
  return page;
}

async function closeBrowser() {
  logStep('browser', 'closing browser resources');
  if (browser) await browser.close();
  browser = null;
  context = null;
  page = null;
}

module.exports = { getPage, closeBrowser };
