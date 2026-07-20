/**
 * PocketBase Backup Utility
 * 
 * Creates and manages backups of PocketBase database.
 * 
 * Usage:
 *   npx tsx scripts/pocketbase-backup.ts --create
 *   npx tsx scripts/pocketbase-backup.ts --list
 *   npx tsx scripts/pocketbase-backup.ts --restore backup_2024-01-01.zip
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// ==================== CONFIGURATION ====================

const PB_DIR = path.join(process.cwd(), 'pb');
const PB_EXECUTABLE = path.join(PB_DIR, 'pocketbase.exe');
const DATA_DIR = path.join(PB_DIR, 'data');
const BACKUP_DIR = path.join(PB_DIR, 'backups');

// ==================== TYPES ====================

interface BackupInfo {
  filename: string;
  size: number;
  createdAt: Date;
  collections: string[];
}

// ==================== HELPER FUNCTIONS ====================

function ensureBackupDir(): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`Created backup directory: ${BACKUP_DIR}`);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// ==================== BACKUP FUNCTIONS ====================

/**
 * Create a backup of the PocketBase database
 */
function createBackup(): BackupInfo {
  ensureBackupDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup_${timestamp}.zip`;
  const backupPath = path.join(BACKUP_DIR, filename);

  console.log(`\n📦 Creating backup: ${filename}`);
  console.log(`   Source: ${DATA_DIR}`);
  console.log(`   Destination: ${backupPath}`);

  try {
    // Create zip archive of the data directory
    execSync(`powershell -Command "Compress-Archive -Path '${DATA_DIR}\\*' -DestinationPath '${backupPath}' -Force"`, {
      stdio: 'inherit',
    });

    const stats = fs.statSync(backupPath);

    console.log(`   ✅ Backup created successfully!`);
    console.log(`   Size: ${formatFileSize(stats.size)}`);

    return {
      filename,
      size: stats.size,
      createdAt: new Date(),
      collections: [], // Would need to read from backup to get this
    };
  } catch (error) {
    console.error(`   ❌ Backup failed:`, error);
    throw error;
  }
}

/**
 * List all available backups
 */
function listBackups(): BackupInfo[] {
  ensureBackupDir();

  console.log(`\n📋 Available backups:`);
  console.log(`   Directory: ${BACKUP_DIR}\n`);

  const files = fs.readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith('backup_') && file.endsWith('.zip'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log('   No backups found.');
    return [];
  }

  const backups: BackupInfo[] = files.map((file) => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);

    // Extract date from filename
    const dateStr = file.replace('backup_', '').replace('.zip', '');
    const createdAt = new Date(dateStr.replace(/-/g, (match, offset) => {
      return offset === 0 ? '' : match;
    }));

    return {
      filename: file,
      size: stats.size,
      createdAt: createdAt,
      collections: [],
    };
  });

  // Print table
  console.log('   ┌─────────────────────────────────────────────────────────┐');
  console.log('   │ Filename                                                │');
  console.log('   ├─────────────────────────────────────────────────────────┤');

  backups.forEach((backup) => {
    console.log(`   │ ${backup.filename.padEnd(55)} │`);
  });

  console.log('   └─────────────────────────────────────────────────────────┘');
  console.log(`\n   Total: ${backups.length} backup(s)`);

  return backups;
}

/**
 * Restore from a backup
 */
function restoreBackup(filename: string): void {
  const backupPath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(backupPath)) {
    console.error(`\n❌ Backup not found: ${filename}`);
    process.exit(1);
  }

  console.log(`\n⚠️  Warning: This will overwrite the current database!`);
  console.log(`   Backup: ${filename}`);
  console.log(`   Target: ${DATA_DIR}`);

  // In a real implementation, you'd want to prompt for confirmation
  // For now, we'll just proceed

  try {
    // Stop PocketBase if running
    console.log(`\n   Stopping PocketBase server...`);
    try {
      execSync('taskkill /F /IM pocketbase.exe', { stdio: 'ignore' });
    } catch {
      // Process might not be running
    }

    // Clear current data
    console.log(`   Clearing current data...`);
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
    fs.mkdirSync(DATA_DIR, { recursive: true });

    // Extract backup
    console.log(`   Extracting backup...`);
    execSync(`powershell -Command "Expand-Archive -Path '${backupPath}' -DestinationPath '${DATA_DIR}' -Force"`, {
      stdio: 'inherit',
    });

    console.log(`\n   ✅ Backup restored successfully!`);
    console.log(`   Start PocketBase with: npm run pocketbase:serve`);
  } catch (error) {
    console.error(`\n   ❌ Restore failed:`, error);
    process.exit(1);
  }
}

/**
 * Delete old backups
 */
function cleanupBackups(keepDays: number = 30): void {
  ensureBackupDir();

  console.log(`\n🧹 Cleaning up backups older than ${keepDays} days...`);

  const files = fs.readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith('backup_') && file.endsWith('.zip'));

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - keepDays);

  let deletedCount = 0;

  files.forEach((file) => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);

    if (stats.mtime < cutoffDate) {
      fs.unlinkSync(filePath);
      console.log(`   Deleted: ${file}`);
      deletedCount++;
    }
  });

  console.log(`\n   ✅ Cleanup complete. Deleted ${deletedCount} backup(s).`);
}

// ==================== CLI ====================

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--create') || args.includes('-c')) {
    createBackup();
  } else if (args.includes('--list') || args.includes('-l')) {
    listBackups();
  } else if (args.includes('--restore') || args.includes('-r')) {
    const restoreIndex = args.indexOf('--restore') !== -1
      ? args.indexOf('--restore')
      : args.indexOf('-r');
    const filename = args[restoreIndex + 1];
    if (!filename) {
      console.error('Please provide a backup filename to restore.');
      process.exit(1);
    }
    restoreBackup(filename);
  } else if (args.includes('--cleanup')) {
    const daysIndex = args.indexOf('--days');
    const days = daysIndex !== -1 ? parseInt(args[daysIndex + 1]) : 30;
    cleanupBackups(days);
  } else {
    console.log(`
PocketBase Backup Utility

Usage:
  npx tsx scripts/pocketbase-backup.ts --create    Create a new backup
  npx tsx scripts/pocketbase-backup.ts --list      List all backups
  npx tsx scripts/pocketbase-backup.ts --restore <filename>  Restore from backup
  npx tsx scripts/pocketbase-backup.ts --cleanup   Delete old backups (default: 30 days)

Examples:
  npx tsx scripts/pocketbase-backup.ts --create
  npx tsx scripts/pocketbase-backup.ts --list
  npx tsx scripts/pocketbase-backup.ts --restore backup_2024-01-01T00-00-00-000Z.zip
  npx tsx scripts/pocketbase-backup.ts --cleanup --days 7
    `);
  }
}

main();
