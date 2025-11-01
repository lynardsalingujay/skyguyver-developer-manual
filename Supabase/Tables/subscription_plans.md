# subscription_plans Table

## Overview

Subscription plan definitions and pricing tiers. This table stores the master configuration for all available subscription plans, including pricing, limits, and billing cycles.

## Schema

| Column Name          | Data Type                | Constraints                | Default   | Description                                 |
| -------------------- | ------------------------ | -------------------------- | --------- | ------------------------------------------- |
| id                   | bigserial                | PRIMARY KEY                | -         | Unique identifier for the subscription plan |
| name                 | text                     | NOT NULL, UNIQUE           | -         | Unique name of the subscription plan        |
| monthly_minute_limit | integer                  | NOT NULL                   | -         | Monthly minute allowance for this plan      |
| price                | numeric(10, 2)           | NULL                       | -         | Monthly price for the plan (in NZD)         |
| created_at           | timestamp with time zone | NULL                       | now()     | When the plan was created                   |
| monthly_call_limit   | integer                  | NOT NULL                   | 100       | Maximum number of calls per month           |
| billing_cycle        | text                     | NOT NULL, CHECK constraint | 'monthly' | Billing frequency (monthly or annual)       |

## Relationships

### Foreign Keys

None

### Referenced By

- `client_subscriptions.plan_name` → `subscription_plans.name`
  - Used to link client subscriptions to their plan configurations

## Indexes

- `idx_subscription_plans_name` on `name`

## Row Level Security (RLS)

**RLS Enabled:** Yes/No

### Policies

#### Policy Name: `public_can_view_plans`

- **Command:** SELECT
- **Role:** anon, authenticated
- **Using:** `true`
- **Description:** All users can view available subscription plans

#### Policy Name: `admin_can_manage_plans`

- **Command:** INSERT, UPDATE, DELETE
- **Role:** service_role
- **Using:** `true`
- **Description:** Only admin/service role can modify subscription plans

## Triggers

### Trigger Name: `update_updated_at`

- **Event:** UPDATE
- **Function:** `update_updated_at_column()`
- **Description:** Automatically updates the updated_at timestamp when a row is modified (if updated_at column is added)

## Usage Examples

### Create a new subscription plan

```sql
INSERT INTO subscription_plans (
  name,
  monthly_minute_limit,
  price,
  monthly_call_limit,
  billing_cycle
)
VALUES (
  'Starter',
  50,
  99.00,
  100,
  'monthly'
);
```

### Retrieve all available plans

```sql
SELECT *
FROM subscription_plans
ORDER BY price ASC;
```

### Update plan pricing

```sql
UPDATE subscription_plans
SET
  price = 89.00,
  monthly_minute_limit = 60
WHERE name = 'Starter';
```

### Get plan details by name

```sql
SELECT *
FROM subscription_plans
WHERE name = 'Pro';
```

### Create annual billing version of existing plan

```sql
INSERT INTO subscription_plans (
  name,
  monthly_minute_limit,
  price,
  monthly_call_limit,
  billing_cycle
)
SELECT
  name || ' Annual',
  monthly_minute_limit * 12,
  price * 12 * 0.85, -- 15% annual discount
  monthly_call_limit * 12,
  'annual'
FROM subscription_plans
WHERE name = 'Pro' AND billing_cycle = 'monthly';
```

## API Integration

### JavaScript/TypeScript Example

```typescript
// Get all available plans
const { data: plans, error } = await supabase
  .from("subscription_plans")
  .select("*")
  .order("price", { ascending: true });

// Get specific plan details
const { data: plan, error } = await supabase
  .from("subscription_plans")
  .select("*")
  .eq("name", "Basic")
  .single();

// Create new plan (admin only)
const { data, error } = await supabase.from("subscription_plans").insert({
  name: "Enterprise",
  monthly_minute_limit: 5000,
  price: 1299.0,
  monthly_call_limit: 1000,
  billing_cycle: "monthly",
});

// Update plan pricing
const { data, error } = await supabase
  .from("subscription_plans")
  .update({
    price: 179.0,
    monthly_minute_limit: 120,
  })
  .eq("name", "Basic");

// Get plans with client subscription counts
const { data, error } = await supabase.from("subscription_plans").select(`
    *,
    client_subscriptions:client_subscriptions(count)
  `);
```

## Business Logic

- Plan names must be unique across the system
- Billing cycles are restricted to 'monthly' or 'annual' only
- Monthly call limits provide an additional control mechanism beyond minutes
- Price is stored in NZD with 2 decimal precision for accurate billing
- Plans serve as templates for client subscriptions
- Historical plan data is preserved even if plans are discontinued
- Annual plans typically offer discounted rates compared to monthly equivalents

## Security Considerations

- Plan information is generally public for marketing purposes
- Only admin users should be able to create, modify, or delete plans
- Plan changes should not automatically affect existing client subscriptions
- Audit logging should track all plan modifications
- Consider versioning for plan changes that affect existing customers
- Validate pricing changes to prevent accidental negative or zero prices

## Migration History

- **v1.0.0** (2025-11-02): Initial table creation with basic plan structure
- **v1.1.0** (2025-11-02): Added monthly_call_limit for additional usage control
- **v1.2.0** (2025-11-02): Added billing_cycle support for annual plans
- **v1.3.0** (2025-11-02): Added check constraint for billing_cycle validation

## Notes

- The table uses bigserial for scalability as plan IDs may be referenced frequently
- Plan names are used as foreign keys in client_subscriptions for readability
- Price field allows NULL to support free plans or plans with custom pricing
- Default monthly_call_limit of 100 provides reasonable baseline for most plans
- Check constraint ensures data integrity for billing_cycle values
- Consider adding description field for marketing copy in future versions

## Related Documentation

- [Client Subscriptions Table](./client_subscriptions.md)
- [Pricing Strategy](../../pricing.md)
- [Billing Integration](../billing-integration.md)
- [Plan Management API](../api/plan-management.md)
