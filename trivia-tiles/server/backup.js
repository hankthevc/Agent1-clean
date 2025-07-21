const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

/**
 * ==============================================================================
 * Automated Backup Script
 * ==============================================================================
 *
 * This script schedules and performs daily backups of critical data.
 *
 * How it works:
 * - It uses `node-cron` to schedule a task to run every day at 2:00 AM.
 * - The backup task copies a source file (e.g., a database or JSON file) to a
 *   timestamped file in a dedicated backup directory.
 * - It ensures the backup directory exists before attempting to write to it.
 *
 * To use in production:
 * - Update `SOURCE_FILE_PATH` to point to your production database file.
 * - Ensure the process running this script has read/write permissions for the
 *   source and backup directories.
 * - Integrate this script into your main server process (e.g., in `index.js`).
 *
 * ==============================================================================
 */

// The path to the file that needs to be backed up.
// In a real application, this would be your database file (e.g., leaderboard.db).
const SOURCE_FILE_PATH = path.join(__dirname, '../public/puzzles.json');

// The directory where backups will be stored.
const BACKUP_DIR = path.join(__dirname, 'backups');

/**
 * Creates a timestamped backup of the source file.
 */
const performBackup = async () => {
  try {
    // Ensure the backup directory exists.
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    // Create a timestamp for the backup file.
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFileName = `puzzles-backup-${timestamp}.json`;
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);

    // Copy the source file to the backup location.
    await fs.copyFile(SOURCE_FILE_PATH, backupFilePath);
    console.log(`Successfully created backup: ${backupFileName}`);

  } catch (error) {
    console.error('Error performing backup:', error);
  }
};

/**
 * Schedules the backup to run daily at 2:00 AM.
 * The cron pattern is "minute hour day-of-month month day-of-week".
 * See https://crontab.guru/ for help building cron schedules.
 */
const scheduleBackup = () => {
  // Runs every day at 2:00 AM.
  cron.schedule('0 2 * * *', () => {
    console.log('Running scheduled daily backup...');
    performBackup();
  }, {
    scheduled: true,
    timezone: "America/New_York" // Example: Use a specific timezone
  });

  console.log('Backup job scheduled. Will run every day at 2:00 AM.');
};

// Export the functions to be used in the main server file.
module.exports = { scheduleBackup, performBackup }; 