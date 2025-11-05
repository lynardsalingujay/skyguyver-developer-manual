# call_validation_logs Table

## Overview

Call validation logging and audit trail. This table stores detailed records of all incoming call validation attempts, including subscription checks, routing decisions, and usage statistics for monitoring and analytics purposes.

## Schema

| Column Name       | Data Type                   | Constraints       | Default           | Description                                        |
| ----------------- | --------------------------- | ----------------- | ----------------- | -------------------------------------------------- |
| id                | uuid                        | PRIMARY KEY       | gen_random_uuid() | Unique identifier for the validation log           |
| client_id         | text                        | NULL              | -                 | Reference to the client (if found)                |
| client_name       | text                        | NULL              | -                 | Display name of the client                         |
| phone_number      | text                        | NULL              | -                 | Called phone number (business number)              |
| caller_number     | text                        | NULL              | -                 | Calling phone number (customer number)             |
| call_id           | text                        | NULL              | -                 | Twilio CallSid or external call identifier         |
| assistant_id      | uuid                        | NULL              | -                 | AI assistant assigned to handle the call           |
| allowed           | boolean                     | NOT NULL          | -                 | Whether the call was allowed to proceed            |
| reason            | text                        | NOT NULL          | -                 | Reason for allowing or blocking the call           |
| calls_used        | integer                     | NULL              | -                 | Current month calls used by client                 |
| calls_limit       | integer                     | NULL              | -                 | Monthly call limit for the plan                    |
| calls_remaining   | integer                     | NULL              | -                 | Remaining calls in current period                  |
| minutes_used      | numeric(10, 2)              | NULL              | -                 | Current month minutes used by client               |
| minutes_limit     | integer                     | NULL              | -                 | Monthly minute limit for the plan                  |
| minutes_remaining | numeric(10, 2)              | NULL              | -                 | Remaining minutes in current period                |
| plan_name         | text                        | NULL              | -                 | Name of the client's subscription plan             |
| is_suspended      | boolean                     | NULL              | -                 | Whether the client account was suspended           |
| is_active         | boolean                     | NULL              | -                 | Whether the client subscription was active         |
| created_at        | timestamp with time zone    | NULL              | now()             | When the validation attempt was logged             |

## Relationships

### Foreign Keys

- `client_id` → `client_subscriptions.client_id` (soft reference)
- `assistant_id` → `assistants.id` (if assistants table exists)
- `plan_name` → `subscription_plans.name` (soft reference)

### Referenced By

- May be referenced by analytics and reporting systems

## Indexes

- `idx_validation_logs_client_id` on `client_id`
- `idx_validation_logs_phone_number` on `phone_number`
- `idx_validation_logs_created_at` on `created_at`
- `idx_validation_logs_allowed` on `allowed`
- `idx_validation_logs_client_created` on `client_id, created_at DESC` (composite)

## Row Level Security (RLS)

**RLS Enabled:** Yes/No

### Policies

#### Policy Name: `clients_can_view_own_validation_logs`

- **Command:** SELECT
- **Role:** authenticated
- **Using:** `auth.jwt() ->> 'client_id' = client_id`
- **Description:** Clients can view their own call validation logs

#### Policy Name: `admin_can_view_all_validation_logs`

- **Command:** SELECT
- **Role:** service_role
- **Using:** `true`
- **Description:** Admin users can view all validation logs for monitoring

## Triggers

### Trigger Name: `cleanup_old_validation_logs`

- **Event:** SCHEDULE (daily/weekly)
- **Function:** `cleanup_old_logs()`
- **Description:** Automatically removes validation logs older than retention period

### Trigger Name: `update_validation_stats`

- **Event:** INSERT
- **Function:** `update_client_validation_metrics()`
- **Description:** Updates aggregated validation statistics for reporting

## Usage Examples

### Log a successful call validation

```sql
INSERT INTO call_validation_logs (
  client_id,
  client_name,
  phone_number,
  caller_number,
  call_id,
  assistant_id,
  allowed,
  reason,
  calls_used,
  calls_limit,
  calls_remaining,
  minutes_used,
  minutes_limit,
  minutes_remaining,
  plan_name,
  is_suspended,
  is_active
)
VALUES (
  'client-123',
  'John Doe Business',
  '+6491234567',
  '+6497654321',
  'CA1234567890abcdef',
  'assistant-uuid-here',
  true,
  'Active subscription',
  45,
  100,
  55,
  125.5,
  1000,
  874.5,
  'Basic',
  false,
  true
);
```

### Log a blocked call attempt

```sql
INSERT INTO call_validation_logs (
  client_id,
  client_name,
  phone_number,
  caller_number,
  call_id,
  allowed,
  reason,
  plan_name,
  is_suspended,
  is_active
)
VALUES (
  'client-456',
  'Suspended Client',
  '+6491234568',
  '+6497654322',
  'CA1234567890abcdfg',
  false,
  'Account suspended - Payment overdue',
  'Pro',
  true,
  false
);
```

### Get validation statistics by client

```sql
SELECT 
  client_id,
  client_name,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE allowed = true) as successful_attempts,
  COUNT(*) FILTER (WHERE allowed = false) as blocked_attempts,
  ROUND(
    COUNT(*) FILTER (WHERE allowed = true) * 100.0 / COUNT(*), 2
  ) as success_rate
FROM call_validation_logs
WHERE created_at >= DATE_TRUNC('month', NOW())
  AND client_id IS NOT NULL
GROUP BY client_id, client_name
ORDER BY total_attempts DESC;
```

### Get recent blocked calls with reasons

```sql
SELECT 
  client_name,
  phone_number,
  caller_number,
  reason,
  plan_name,
  is_suspended,
  is_active,
  created_at
FROM call_validation_logs
WHERE allowed = false
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Get daily call volume trends

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE allowed = true) as allowed_calls,
  COUNT(*) FILTER (WHERE allowed = false) as blocked_calls
FROM call_validation_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## API Integration

### JavaScript/TypeScript Example

```typescript
// Log a validation attempt
const { data, error } = await supabase.from("call_validation_logs").insert({
  client_id: "client-123",
  client_name: "John Doe Business",
  phone_number: "+6491234567",
  caller_number: "+6497654321",
  call_id: "CA1234567890abcdef",
  assistant_id: "assistant-uuid",
  allowed: true,
  reason: "Active subscription",
  calls_used: 45,
  minutes_used: 125.5,
  minutes_limit: 1000,
  plan_name: "Basic",
  is_suspended: false,
  is_active: true
});

// Get client validation history
const { data: logs, error } = await supabase
  .from("call_validation_logs")
  .select("*")
  .eq("client_id", "client-123")
  .order("created_at", { ascending: false })
  .limit(50);

// Get validation statistics
const { data: stats, error } = await supabase
  .from("call_validation_logs")
  .select("allowed, reason")
  .gte("created_at", "2025-11-01")
  .eq("client_id", "client-123");

// Search by phone number
const { data: phoneHistory, error } = await supabase
  .from("call_validation_logs")
  .select("*")
  .eq("phone_number", "+6491234567")
  .order("created_at", { ascending: false });

// Get blocked calls analysis
const { data: blockedAnalysis, error } = await supabase.rpc("analyze_blocked_calls", {
  start_date: "2025-11-01",
  end_date: "2025-11-30"
});
```

## Business Logic

- Every incoming call validation attempt is logged regardless of outcome
- Logs capture complete subscription state at time of validation
- Usage statistics provide snapshot for trend analysis
- Blocking reasons enable identification of common issues
- Call IDs link validation logs to actual call sessions
- Retention policies prevent unlimited log growth
- Analytics feed business intelligence and monitoring systems

## Security Considerations

- Logs may contain sensitive phone number information
- Implement appropriate data retention policies
- Consider anonymization for long-term analytics
- Monitor for unusual validation patterns that might indicate attacks
- Ensure proper access controls for sensitive validation data
- Log cleanup should preserve audit trail requirements
- Consider encryption for stored phone numbers

## Migration History

- **v1.0.0** (2025-11-03): Initial table creation with basic validation logging
- **v1.1.0** (2025-11-03): Added usage statistics fields for analytics
- **v1.2.0** (2025-11-03): Added composite index for client-specific queries
- **v1.3.0** (2025-11-03): Added assistant_id for AI routing analytics

## Notes

- Table uses UUID primary key for scalability and security
- Soft references to other tables allow logging even if related data is deleted
- Numeric fields use appropriate precision for minute tracking
- Composite index optimizes common client history queries
- NULL values allowed for cases where client lookup fails
- Created_at index enables efficient time-based queries and cleanup

## Related Documentation

- [Client Subscriptions Table](./client_subscriptions.md)
- [User Sessions Table](./user_sessions.md)
- [Subscription Plans Table](./subscription_plans.md)
- [Twilio Incoming Call Workflow](../../n8n/workflow-twilio-incoming-call.md)
- [Call Analytics and Reporting](../analytics.md)