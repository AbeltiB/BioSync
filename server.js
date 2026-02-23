const app = require('./src/app');
const config = require('./src/config');
require('./src/jobs/scheduler'); // load cron jobs

app.listen(config.port, () => {
  console.log(`BioSync service running on port ${config.port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  const { closeBrowser } = require('./src/services/browser');
  await closeBrowser();
  process.exit();
});