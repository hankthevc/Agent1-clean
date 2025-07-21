const Sentry = require('@sentry/node');
const { scheduleBackup } = require('./backup');

/**
 * ==============================================================================
 * Sentry Initialization
 * ==============================================================================
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

/**
 * ==============================================================================
 * Server Entry Point
 * ==============================================================================
 *
 * This file represents the main entry point for the backend server processes.
 * For this example, its only responsibility is to start the automated
 * backup schedule.
 *
 * To run this server:
 * `node trivia-tiles/server/index.js`
 *
 * In a full-fledged Express server, you would also initialize your API routes,
 * database connections, and other middleware here.
 *
 * ==============================================================================
 */

console.log('Starting server process...');

// Wrap the main server logic in a Sentry transaction to capture performance data
// and any potential errors during initialization.
const transaction = Sentry.startTransaction({
  op: "server.initialization",
  name: "Server Startup",
});

try {
  // Initialize the scheduled backup job.
  scheduleBackup();
  console.log('Server process started successfully.');
} catch (e) {
  Sentry.captureException(e);
  console.error('Failed to start server process:', e);
  process.exit(1);
} finally {
  transaction.finish();
}

// In a real application, you would have your server listening here.
// For example:
//
// const express = require('express');
// const app = express();
// const PORT = 3001;
//
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// }); 