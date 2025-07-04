# Data Retention and Cleanup Documentation

## Overview

The Hotspot Portal includes a comprehensive data retention system that automatically manages data lifecycle, cleanup procedures, and archiving. This system helps maintain optimal performance, comply with data protection regulations, and manage storage costs.

## Key Components

### 1. DataRetentionManager Class
- **Location**: `api/classes/DataRetentionManager.php`
- **Purpose**: Core retention logic and cleanup operations
- **Features**: Configurable retention periods, automated archiving, safety measures

### 2. CLI Cleanup Script
- **Location**: `database/cleanup.php`
- **Purpose**: Command-line interface for running cleanup operations
- **Features**: Dry-run mode, detailed logging, cron job integration

### 3. Configuration System
- **Default Config**: Built into DataRetentionManager class
- **Custom Config**: `api/config/retention.php` (auto-generated)
- **Features**: Flexible retention periods, safety settings, archive options

## Default Retention Policies

| Data Type | Retention Period | Action |
|-----------|------------------|--------|
| Unverified Users | 30 days | Archive then delete |
| Inactive Sessions | 7 days | Delete |
| Soft-deleted Users | 90 days | Archive then permanently delete |
| Rate Limit Files | 1 day | Delete |
| Archive Files | 180 days | Delete |

## Cleanup Operations

### 1. Unverified User Cleanup
- **Target**: Users who registered but never verified their email
- **Safety**: Preserves data from last 24 hours
- **Archive**: Creates JSON backup before deletion
- **Batch Size**: 100 records per run

### 2. Inactive Session Cleanup
- **Target**: Expired or terminated sessions
- **Criteria**: Sessions older than retention period with status 'expired' or 'terminated'
- **No Archive**: Sessions are deleted without archiving

### 3. Soft-deleted User Cleanup
- **Target**: Users marked as deleted (soft delete)
- **Archive**: Creates backup before permanent deletion
- **Cascade**: Also removes associated sessions

### 4. File Cleanup
- **Rate Limit Files**: Removes old rate limiting cache files
- **Archive Files**: Removes old backup files based on retention period

### 5. Database Optimization
- **Operation**: Runs OPTIMIZE TABLE on main tables
- **Frequency**: After each cleanup run
- **Purpose**: Reclaim storage space and improve performance

## Usage

### Command Line Interface

```bash
# Show help
php database/cleanup.php --help

# Preview cleanup (dry run)
php database/cleanup.php --dry-run

# Show current statistics
php database/cleanup.php --stats

# Show configuration
php database/cleanup.php --config

# Run cleanup with confirmation
php database/cleanup.php

# Run cleanup without prompts (automated)
php database/cleanup.php --force --quiet

# Run with detailed output
php database/cleanup.php --verbose
```

### Cron Job Setup

Add to crontab for automated daily cleanup:

```bash
# Edit crontab
crontab -e

# Add daily cleanup at 2 AM
0 2 * * * cd /path/to/hotspot && php database/cleanup.php --force --quiet

# Alternative: Weekly cleanup on Sundays
0 2 * * 0 cd /path/to/hotspot && php database/cleanup.php --force --quiet
```

### API Integration

The retention system can be integrated with the admin dashboard through API calls:

```php
// Initialize retention manager
$retentionManager = new DataRetentionManager();

// Get statistics
$stats = $retentionManager->getRetentionStatistics();

// Run cleanup (dry run)
$result = $retentionManager->runCleanup(true);

// Update configuration
$newConfig = ['unverified_user_retention' => 45];
$retentionManager->updateConfig($newConfig);
```

## Configuration Options

### Retention Periods (days)
- `unverified_user_retention`: Delete unverified users (default: 30)
- `inactive_session_retention`: Delete inactive sessions (default: 7)
- `deleted_user_retention`: Permanently delete soft-deleted users (default: 90)
- `rate_limit_cleanup`: Clean rate limit files (default: 1)
- `backup_retention`: Keep archive files (default: 180)

### Archive Settings
- `archive_enabled`: Enable archiving (default: true)
- `archive_before_delete`: Archive before deletion (default: true)
- `archive_path`: Archive directory path

### Cleanup Settings
- `batch_size`: Records processed per batch (default: 100)
- `max_execution_time`: Maximum script runtime (default: 300 seconds)
- `cleanup_schedule`: Cleanup frequency (daily/weekly/monthly)

### Safety Settings
- `require_confirmation`: Require manual confirmation (default: true)
- `max_delete_per_run`: Maximum deletions per run (default: 1000)
- `preserve_recent_data`: Always preserve last 24 hours (default: true)

## Archive System

### Archive Format
Archives are stored as JSON files with metadata:

```json
{
  "metadata": {
    "reason": "unverified_cleanup",
    "timestamp": "2024-01-15 02:00:00",
    "total_users": 25,
    "retention_policy": {...}
  },
  "users": [...]
}
```

### Archive Files
- **Naming**: `users_archive_{reason}_{timestamp}.json`
- **Location**: `api/archives/` directory
- **Content**: Complete user records with metadata
- **Retention**: Automatically cleaned up after backup_retention period

## Safety Measures

### 1. Recent Data Protection
- Always preserves data from last 24 hours
- Prevents accidental deletion of new records
- Configurable via `preserve_recent_data` setting

### 2. Batch Processing
- Processes records in small batches
- Prevents memory issues and timeouts
- Allows for interruption and resumption

### 3. Dry Run Mode
- Preview operations without making changes
- Shows exactly what would be deleted
- Recommended before first-time use

### 4. Confirmation Prompts
- Interactive confirmation for manual runs
- Can be disabled for automated scripts
- Shows total records to be affected

### 5. Error Handling
- Comprehensive error logging
- Graceful failure handling
- Transaction rollback on critical errors

## Monitoring and Logging

### Log Levels
- **INFO**: General operations and status
- **WARNING**: Non-critical issues
- **ERROR**: Failures and critical problems
- **SUCCESS**: Successful operations

### Log Locations
- CLI output with timestamps and colors
- ErrorHandler class for persistent logging
- Archive metadata for operation history

### Monitoring Commands
```bash
# Check what would be cleaned up
php database/cleanup.php --stats

# Test cleanup without changes
php database/cleanup.php --dry-run --verbose

# Check current configuration
php database/cleanup.php --config
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure web server has write access to temp and archive directories
   - Check file permissions for cleanup script

2. **Memory Issues**
   - Reduce batch_size in configuration
   - Increase PHP memory_limit if needed

3. **Timeout Issues**
   - Increase max_execution_time in configuration
   - Run cleanup more frequently with smaller batches

4. **Archive Directory Issues**
   - Ensure archive_path directory exists and is writable
   - Check disk space for archive files

### Recovery Procedures

1. **Restore from Archives**
   - Archive files contain complete user data
   - Can be imported back to database if needed
   - Use custom scripts for data restoration

2. **Database Recovery**
   - Regular database backups recommended
   - Test recovery procedures periodically
   - Keep multiple backup copies

## Best Practices

### 1. Regular Monitoring
- Check cleanup statistics weekly
- Monitor archive file sizes
- Review error logs regularly

### 2. Configuration Management
- Start with conservative retention periods
- Adjust based on business requirements
- Document configuration changes

### 3. Testing
- Always test with --dry-run first
- Test in staging environment
- Verify backup procedures work

### 4. Automation
- Set up automated cron jobs
- Use --quiet mode for automated runs
- Monitor automated run results

### 5. Compliance
- Ensure retention periods meet legal requirements
- Document data handling procedures
- Keep audit trail of cleanup operations

## Legal and Compliance Considerations

### GDPR Compliance
- Automatic deletion supports "right to be forgotten"
- Archive system provides audit trail
- Configurable retention periods for compliance

### Data Protection
- Archives contain sensitive data - secure storage required
- Consider encryption for archive files
- Regular cleanup of archive files

### Audit Requirements
- All operations are logged with timestamps
- Archive metadata provides operation history
- CLI output can be redirected to audit logs

## Migration and Updates

### Updating Retention Policies
1. Use `updateConfig()` method or edit `api/config/retention.php`
2. Test new settings with dry-run mode
3. Monitor results after implementation

### Database Schema Changes
- Retention system adapts to schema changes automatically
- Archive format may need updates for new fields
- Test thoroughly after any schema modifications

### Version Upgrades
- Backup configuration before upgrades
- Test cleanup operations after upgrades
- Review any new retention features or changes 