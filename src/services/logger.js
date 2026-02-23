function formatContext(context = {}) {
  const entries = Object.entries(context).filter(([, v]) => v !== undefined);
  if (!entries.length) return '';
  return ` | ${entries.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ')}`;
}

function logStep(scope, step, context = {}) {
  console.log(`[${new Date().toISOString()}] [${scope}] ${step}${formatContext(context)}`);
}

function logError(scope, step, error, context = {}) {
  console.error(
    `[${new Date().toISOString()}] [${scope}] ${step} FAILED${formatContext({
      ...context,
      error: error?.message || String(error),
    })}`
  );
}

module.exports = { logStep, logError };
