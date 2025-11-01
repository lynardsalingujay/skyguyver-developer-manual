Here's how to truncate both tables and get a completely fresh state:

## Method 1: Single Query for Both Tables

```sql
TRUNCATE TABLE
  public.subscription_plans,
  public.client_subscriptions
RESTART IDENTITY CASCADE;
```

## Method 2: Separate Queries (if you prefer)

**Step 1:** Truncate child table first

```sql
TRUNCATE TABLE public.client_subscriptions RESTART IDENTITY CASCADE;
```

**Step 2:** Truncate parent table

```sql
TRUNCATE TABLE public.subscription_plans RESTART IDENTITY CASCADE;
```

## Method 3: With Verification

```sql
-- Truncate both tables
TRUNCATE TABLE
  public.subscription_plans,
  public.client_subscriptions
RESTART IDENTITY CASCADE;

-- Verify both tables are empty
SELECT
  (SELECT COUNT(*) FROM public.subscription_plans) as plans_count,
  (SELECT COUNT(*) FROM public.client_subscriptions) as subscriptions_count;

-- Verify sequences are reset
SELECT
  (SELECT last_value FROM subscription_plans_id_seq) as plans_seq,
  (SELECT last_value FROM client_subscriptions_id_seq) as subs_seq;
```

## After Truncating - Recreate Your Subscription Plans

Since you'll need `subscription_plans` data for the foreign key constraint, here's a script to recreate basic plans:

```sql
-- Insert basic subscription plans
INSERT INTO public.subscription_plans (name, description, price, created_at) VALUES
('basic', 'Basic Plan', 19.99, NOW()),
('premium', 'Premium Plan', 49.99, NOW()),
('enterprise', 'Enterprise Plan', 199.99, NOW());

-- Verify the plans were inserted
SELECT * FROM public.subscription_plans;
```

## Complete Clean Slate Script

If you want everything in one go:

```sql
-- Step 1: Truncate both tables
TRUNCATE TABLE
  public.subscription_plans,
  public.client_subscriptions
RESTART IDENTITY CASCADE;

-- Step 2: Recreate subscription plans
INSERT INTO public.subscription_plans (name, description, price, created_at) VALUES
('basic', 'Basic Plan - 300 minutes', 19.99, NOW()),
('premium', 'Premium Plan - 1000 minutes', 49.99, NOW()),
('enterprise', 'Enterprise Plan - 5000 minutes', 199.99, NOW());

-- Step 3: Verify everything
SELECT 'Subscription Plans:' as check_message;
SELECT * FROM public.subscription_plans;

SELECT 'Client Subscriptions:' as check_message;
SELECT COUNT(*) as remaining_records FROM public.client_subscriptions;
```

## Important Notes:

1. **Order matters** - `client_subscriptions` has a foreign key to `subscription_plans`, so:

   - When truncating: Truncate `client_subscriptions` first (or use the single query with both)
   - When inserting: Insert into `subscription_plans` first

2. **The CASCADE option** in the single query handles the foreign key dependency automatically

3. **RESTART IDENTITY** resets the auto-incrementing IDs back to 1

The **single query approach (Method 1)** is recommended as it's the cleanest and handles all dependencies automatically.
