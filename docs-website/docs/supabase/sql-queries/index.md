# SQL Queries & Commands

## Overview

This section contains SQL queries, commands, and scripts used for database management and operations in the SkyGuyver platform.

## Categories

### Data Management

- [User Data Removal](./user-data-removal) - Scripts for removing users and related data
- [Data Cleanup](./data-cleanup) - General cleanup and maintenance queries
- [Data Migration](./data-migration) - Scripts for data migration and transformation

### Analytics & Reporting

- [Usage Reports](./usage-reports) - Queries for generating usage statistics
- [Customer Analytics](./customer-analytics) - Customer behavior and metrics
- [System Health](./system-health) - Database performance and health checks

### Maintenance

- [Database Optimization](./database-optimization) - Performance tuning queries
- [Index Management](./index-management) - Index creation and maintenance
- [Backup Scripts](./backup-scripts) - Database backup and restore operations

## Usage Guidelines

### Safety First

- **Always test on staging** before running on production
- **Create backups** before destructive operations
- **Use transactions** for multi-step operations
- **Document the purpose** and impact of each query

### Documentation Standards

- Include clear descriptions of what each query does
- Specify which tables are affected
- Note any prerequisites or dependencies
- Include rollback procedures where applicable

## Quick Reference

### Common Operations

```sql
-- Check table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;

-- View active connections
SELECT * FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size(current_database()));
```

### Safety Checks

```sql
-- Always verify data before deletion
SELECT COUNT(*) FROM table_name WHERE condition;

-- Use transactions for safety
BEGIN;
-- Your queries here
-- COMMIT; or ROLLBACK;
```

## Getting Started

1. **Browse by category** to find relevant queries
2. **Read documentation** before executing any script
3. **Test on staging** environment first
4. **Keep backups** of important data
5. **Document modifications** you make to existing queries
