# Data Cleanup Scripts

## Overview

General database cleanup and maintenance queries for the SkyGuyver platform.

## Common Cleanup Operations

### Remove Old Session Data

```sql
-- Delete user sessions older than 30 days
DELETE FROM user_sessions
WHERE created_at < NOW() - INTERVAL '30 days';

-- Check how many records will be deleted first
SELECT COUNT(*) as old_sessions_count
FROM user_sessions
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Clean Up Orphaned Records

```sql
-- Find assistants without valid users
SELECT a.id, a.user_id, a.name
FROM assistants a
LEFT JOIN auth.users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Remove orphaned assistants (be careful!)
DELETE FROM assistants
WHERE user_id NOT IN (SELECT id FROM auth.users);
```

### Archive Old Audit Logs

```sql
-- Move old audit logs to archive table
INSERT INTO audit_logs_archive
SELECT * FROM audit_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- Then delete from main table
DELETE FROM audit_logs
WHERE created_at < NOW() - INTERVAL '90 days';
```

## Usage Tracking Cleanup

### Reset Monthly Usage Counters

```sql
-- Reset usage counters for new billing period
UPDATE client_subscriptions
SET
    current_month_calls = 0,
    current_month_minutes = 0,
    current_month_cost = 0,
    alert_sent = false,
    last_reset_at = NOW()
WHERE current_period_end < NOW();
```

## Maintenance Schedules

### Daily Cleanup

- Remove temporary files and cache
- Clean up expired sessions

### Weekly Cleanup

- Archive old audit logs
- Clean up orphaned records

### Monthly Cleanup

- Reset usage counters
- Archive old user sessions
- Database optimization

**Status:** Active  
**Last Updated:** November 6, 2025
