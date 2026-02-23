const { chromium } = require('playwright');

let browser;
let context;
let page;

async function getPage() {
  if (!browser) {
    browser = await chromium.launch({ headless: true }); // set false for debugging
  }
  if (!context) {
    context = await browser.newContext();
  }
  if (!page) {
    page = await context.newPage();
  }
  return page;
}

async function closeBrowser() {
  if (browser) await browser.close();
  browser = null;
  context = null;
  page = null;
}

module.exports = { getPage, closeBrowser };