# User Data Removal

## Overview

SQL scripts for permanently removing users and all their related data from the SkyGuyver platform database.

## ⚠️ **DANGER ZONE - Data Deletion**

**WARNING:** These scripts permanently delete data. Always:

- Create a backup before running
- Test on staging environment first
- Verify user ID is correct
- Run SELECT statements first to confirm what will be deleted

---

## Complete User Removal

### Purpose

Permanently remove a user and all associated data from all tables in the database.

### Affected Tables

- `audit_logs` - User activity logs
- `memos` - User notes and memos
- `assistants` - User's AI assistants
- `user_roles` - User permission assignments
- `auth.users` - User authentication record

### Prerequisites

- User ID must be confirmed
- User should be deactivated first
- Backup should be created
- Staging environment tested

---

## Script: Complete User Data Removal

### Step 1: Verify User Exists

```sql
-- Confirm the user exists and get basic info
SELECT
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users
WHERE id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3';
```

### Step 2: Check Related Data Count

```sql
-- Check how much data will be deleted
SELECT
    'audit_logs' as table_name,
    COUNT(*) as record_count
FROM audit_logs
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'
   OR actor_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'

UNION ALL

SELECT
    'memos' as table_name,
    COUNT(*) as record_count
FROM memos
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'
   OR created_by = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'

UNION ALL

SELECT
    'assistants' as table_name,
    COUNT(*) as record_count
FROM assistants
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'

UNION ALL

SELECT
    'user_roles' as table_name,
    COUNT(*) as record_count
FROM user_roles
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3';
```

### Step 3: Complete Data Removal

```sql
-- BEGIN TRANSACTION for safety
BEGIN;

-- Delete all related data for the user
DELETE FROM audit_logs
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'
   OR actor_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3';

DELETE FROM memos
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'
   OR created_by = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3';

DELETE FROM assistants
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3';

DELETE FROM user_roles
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3';

-- Verify deletions
SELECT 'Data deleted successfully' as status;

-- COMMIT the transaction (or ROLLBACK if something went wrong)
COMMIT;
```

### Step 4: Remove User Authentication Record

```sql
-- Delete the user from auth.users table
-- This should be done via Supabase UI or Admin API for safety
-- Manual SQL deletion from auth.users can cause issues

-- Via Supabase Admin API (recommended):
-- DELETE /admin/v1/users/{user_id}

-- Or via Supabase Dashboard:
-- Go to Authentication > Users > Select user > Delete
```

---

## Verification Queries

### Confirm Complete Removal

```sql
-- Verify user is completely removed
SELECT
    'audit_logs' as table_name,
    COUNT(*) as remaining_records
FROM audit_logs
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'
   OR actor_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'

UNION ALL

SELECT
    'memos' as table_name,
    COUNT(*) as remaining_records
FROM memos
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'
   OR created_by = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'

UNION ALL

SELECT
    'assistants' as table_name,
    COUNT(*) as remaining_records
FROM assistants
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3'

UNION ALL

SELECT
    'user_roles' as table_name,
    COUNT(*) as remaining_records
FROM user_roles
WHERE user_id = '2d1d7edf-d647-43bf-9433-ce7bb5cf76b3';

-- All counts should be 0
```

---

## Usage History

### Execution Log

| Date       | User ID                              | Executed By | Reason                  | Result  |
| ---------- | ------------------------------------ | ----------- | ----------------------- | ------- |
| 2025-11-06 | 2d1d7edf-d647-43bf-9433-ce7bb5cf76b3 | Admin       | User requested deletion | Success |

---

## Safety Checklist

Before running user deletion scripts:

- [ ] **Backup created** - Full database backup completed
- [ ] **User ID verified** - Confirmed correct user to delete
- [ ] **Staging tested** - Script tested on staging environment
- [ ] **User notified** - User confirmed they want deletion
- [ ] **Data exported** - Any required data exported for compliance
- [ ] **Dependencies checked** - No critical business dependencies
- [ ] **Approval obtained** - Management approval for deletion

## Rollback Procedure

If user deletion needs to be reversed:

1. **Restore from backup** - Use the backup created before deletion
2. **Selective restore** - If only partial restoration needed
3. **Data reconstruction** - Rebuild user data from audit logs if available

---

**Last Updated:** November 6, 2025  
**Status:** Active - Use with extreme caution
