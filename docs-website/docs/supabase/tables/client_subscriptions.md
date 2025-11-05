# client_subscriptions Table

## Overview

Tracks each client's subscription, usage, and billing information.

## Schema

| Column Name           | Data Type                | Constraints           | Default | Description                                  |
| --------------------- | ------------------------ | --------------------- | ------- | -------------------------------------------- |
| id                    | bigserial                | PRIMARY KEY           | -       | Unique identifier for the subscription       |
| client_id             | text                     | NOT NULL, UNIQUE      | -       | Reference to the client (unique identifier)  |
| plan_name             | text                     | NOT NULL, FOREIGN KEY | -       | Name of the subscription plan                |
| monthly_minute_limit  | integer                  | NOT NULL              | -       | Monthly minute allowance for the plan        |
| is_active             | boolean                  | NULL                  | true    | Whether subscription is currently active     |
| current_period_start  | timestamp with time zone | NULL                  | -       | Start date of the current billing period     |
| current_period_end    | timestamp with time zone | NULL                  | -       | End date of the current billing period       |
| created_at            | timestamp with time zone | NULL                  | now()   | When the subscription was created            |
| updated_at            | timestamp with time zone | NULL                  | now()   | When the subscription was last updated       |
| phone_number          | text                     | NULL, UNIQUE          | -       | Associated phone number for the subscription |
| current_month_calls   | integer                  | NULL                  | 0       | Number of calls made in the current month    |
| current_month_minutes | numeric(10, 2)           | NULL                  | 0       | Total minutes used in the current month      |
| current_month_cost    | numeric(10, 4)           | NULL                  | 0       | Total cost accrued in the current month      |
| is_suspended          | boolean                  | NULL                  | false   | Whether the subscription is suspended        |
| suspension_reason     | text                     | NULL                  | -       | Reason for suspension if applicable          |
| alert_at_percentage   | integer                  | NULL                  | 80      | Percentage of limit at which to send alerts  |
| alert_sent            | boolean                  | NULL                  | false   | Whether usage alert has been sent            |
| last_reset_at         | timestamp with time zone | NULL                  | now()   | When usage counters were last reset          |
| client_name           | text                     | NULL                  | -       | Display name of the client                   |
| client_email          | text                     | NULL                  | -       | Email address of the client                  |
| assistant_id          | uuid                     | NULL                  | -       | Reference to associated assistant            |

## Relationships

### Foreign Keys

- `plan_name` → `subscription_plans.name`
  - ON DELETE: RESTRICT
  - ON UPDATE: CASCADE

### Referenced By

List any tables that reference this table.

## Indexes

- `idx_client_subs_client_id` on `client_id`
- `idx_client_subs_active` on `is_active`
- `idx_client_subs_phone` on `phone_number`
- `idx_client_subscriptions_client_id` on `client_id`
- `idx_client_subscriptions_phone_number` on `phone_number`
- `idx_client_subscriptions_active` on `is_active, is_suspended`
- `idx_client_subscriptions_period_end` on `current_period_end`
- `idx_client_subscriptions_plan_name` on `plan_name`

## Row Level Security (RLS)

**RLS Enabled:** Yes/No

### Policies

#### Policy Name: `clients_can_view_own_subscription`

- **Command:** SELECT
- **Role:** authenticated
- **Using:** `auth.jwt() ->> 'client_id' = client_id`
- **Description:** Clients can view their own subscription details

#### Policy Name: `clients_can_update_own_subscription`

- **Command:** UPDATE
- **Role:** authenticated
- **Using:** `auth.jwt() ->> 'client_id' = client_id`
- **Description:** Clients can update their own subscription information

## Triggers

### Trigger Name: `reset_monthly_usage`

- **Event:** SCHEDULE (monthly)
- **Function:** `reset_subscription_usage()`
- **Description:** Automatically resets monthly usage counters at the beginning of each billing period

### Trigger Name: `update_updated_at`

- **Event:** UPDATE
- **Function:** `update_updated_at_column()`
- **Description:** Automatically updates the updated_at timestamp when a row is modified

## Usage Examples

### Create a new subscription

```sql
INSERT INTO client_subscriptions (
  client_id,
  plan_name,
  monthly_minute_limit,
  phone_number,
  client_name,
  client_email,
  current_period_start,
  current_period_end
)
VALUES (
  'client-123',
  'Basic Plan',
  1000,
  '+1234567890',
  'John Doe',
  'john@example.com',
  NOW(),
  NOW() + INTERVAL '1 month'
);
```

### Retrieve active subscriptions

```sql
SELECT *
FROM client_subscriptions
WHERE is_active = true
  AND is_suspended = false
  AND current_period_end > NOW();
```

### Update usage statistics

```sql
UPDATE client_subscriptions
SET
  current_month_calls = current_month_calls + 1,
  current_month_minutes = current_month_minutes + 5.5,
  current_month_cost = current_month_cost + 0.25,
  updated_at = NOW()
WHERE client_id = 'client-123';
```

### Suspend a subscription

```sql
UPDATE client_subscriptions
SET
  is_suspended = true,
  suspension_reason = 'Payment overdue',
  updated_at = NOW()
WHERE client_id = 'client-123';
```

### Reset monthly usage

```sql
UPDATE client_subscriptions
SET
  current_month_calls = 0,
  current_month_minutes = 0,
  current_month_cost = 0,
  alert_sent = false,
  last_reset_at = NOW(),
  updated_at = NOW()
WHERE current_period_end < NOW();
```

## API Integration

### JavaScript/TypeScript Example

```typescript
// Create a subscription
const { data, error } = await supabase.from("client_subscriptions").insert({
  client_id: "client-123",
  plan_name: "Basic Plan",
  monthly_minute_limit: 1000,
  phone_number: "+1234567890",
  client_name: "John Doe",
  client_email: "john@example.com",
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
});

// Get subscription by client ID
const { data, error } = await supabase
  .from("client_subscriptions")
  .select("*")
  .eq("client_id", "client-123")
  .eq("is_active", true)
  .single();

// Update usage statistics
const { data, error } = await supabase
  .from("client_subscriptions")
  .update({
    current_month_calls: 50,
    current_month_minutes: 125.5,
    current_month_cost: 15.75,
  })
  .eq("client_id", "client-123");

// Check if usage alert should be sent
const { data, error } = await supabase
  .from("client_subscriptions")
  .select("*")
  .eq("is_active", true)
  .eq("alert_sent", false)
  .gte("current_month_minutes", supabase.rpc("calculate_alert_threshold"));
```

## Business Logic

- Monthly usage counters reset automatically at the beginning of each billing period
- Usage alerts are sent when consumption reaches the configured percentage threshold (default 80%)
- Subscriptions can be suspended for various reasons (payment issues, abuse, etc.)
- Each client can have only one active subscription at a time (enforced by unique client_id)
- Phone numbers must be unique across all subscriptions
- Subscription plans are referenced from the subscription_plans table
- Usage tracking includes calls, minutes, and cost for comprehensive billing

## Security Considerations

- Client IDs should be securely generated and non-guessable
- Implement rate limiting for subscription modifications
- Monitor for unusual usage patterns that might indicate abuse
- Validate phone number formats and prevent duplicate registrations
- Ensure proper authentication before allowing subscription access
- Log all subscription changes for audit purposes
- Implement proper authorization checks for suspension/activation operations

## Migration History

- **v1.0.0** (2025-11-01): Initial table creation with basic subscription fields
- **v1.1.0** (2025-11-01): Added usage tracking fields (current_month_calls, current_month_minutes, current_month_cost)
- **v1.2.0** (2025-11-01): Added suspension functionality and alert system
- **v1.3.0** (2025-11-01): Added client information fields and assistant integration

## Notes

- The table uses bigserial for the primary key to handle large numbers of subscriptions
- Usage counters are reset monthly based on the billing period
- Alert thresholds are configurable per subscription for flexible usage monitoring
- Suspension functionality allows for temporary service interruption without data loss
- Phone number uniqueness ensures no conflicts in voice service routing
- Client information is denormalized for performance in high-frequency usage tracking

## Related Documentation

- [Subscription Plans Table](./subscription_plans.md)
- [Usage Tracking System](../usage-tracking.md)
- [Billing and Payments](../billing-payments.md)
- [Client Management](../client-management.md)
- [Voice Service Integration](../../Vapi/)
