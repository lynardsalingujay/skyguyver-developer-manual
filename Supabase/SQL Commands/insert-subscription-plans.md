Perfect! Here's the revised SQL insert based on your actual pricing structure:

## SQL Insert for Your Subscription Plans

```sql
-- Insert subscription plans with your actual pricing and limits
INSERT INTO public.subscription_plans (
  name,
  monthly_minute_limit,
  price,
  monthly_call_limit,
  billing_cycle
) VALUES
-- Starter plan - $99 for 50 mins
('Starter', 50, 99.00, 25, 'monthly'),

-- Basic plan - $173 for 100 mins
('Basic', 100, 173.00, 50, 'monthly'),

-- Essentials plan - $299 for 250 mins
('Essentials', 250, 299.00, 125, 'monthly'),

-- Pro plan - $650 for 2000 mins
('Pro', 2000, 650.00, 500, 'monthly'),

-- Annual plans (assuming similar structure with appropriate discounts)
('Starter Annual', 50, 990.00, 25, 'annual'),      -- ~8% discount (10 months price)
('Basic Annual', 100, 1730.00, 50, 'annual'),      -- ~8% discount
('Essentials Annual', 250, 2990.00, 125, 'annual'),-- ~8% discount
('Pro Annual', 2000, 6500.00, 500, 'annual');      -- ~8% discount
```

## Alternative - With Estimated Call Limits Based on Your Usage Descriptions

If you want more precise call limits based on your descriptions:

```sql
-- More accurate call limits based on your business descriptions
INSERT INTO public.subscription_plans (
  name,
  monthly_minute_limit,
  price,
  monthly_call_limit,
  billing_cycle
) VALUES
-- Starter: "low-volume testing" - approx 2 mins/call = 25 calls
('Starter', 50, 99.00, 25, 'monthly'),

-- Basic: "20-30 calls/week" = 80-120 calls/month
('Basic', 100, 173.00, 100, 'monthly'),

-- Essentials: "100+ calls/month"
('Essentials', 250, 299.00, 125, 'monthly'),

-- Pro: "500+ calls/month" with 2000 mins = approx 4 mins/call
('Pro', 2000, 650.00, 500, 'monthly'),

-- Annual versions
('Starter Annual', 50, 990.00, 25, 'annual'),
('Basic Annual', 100, 1730.00, 100, 'annual'),
('Essentials Annual', 250, 2990.00, 125, 'annual'),
('Pro Annual', 2000, 6500.00, 500, 'annual');
```

## Just Monthly Plans (Simplified)

If you only want the monthly plans for now:

```sql
-- Core monthly plans only
INSERT INTO public.subscription_plans (
  name,
  monthly_minute_limit,
  price,
  monthly_call_limit,
  billing_cycle
) VALUES
('Starter', 50, 99.00, 25, 'monthly'),
('Basic', 100, 173.00, 100, 'monthly'),
('Essentials', 250, 299.00, 125, 'monthly'),
('Pro', 2000, 650.00, 500, 'monthly');
```

## Verify After Inserting

```sql
-- Check all plans with cost per minute calculation
SELECT
  name,
  monthly_minute_limit,
  price,
  monthly_call_limit,
  billing_cycle,
  ROUND(price / monthly_minute_limit, 2) as cost_per_minute,
  created_at
FROM public.subscription_plans
ORDER BY monthly_minute_limit;
```

## Key Points Based on Your Pricing:

1. **Starter**: $99 → ~$1.98/min (included minutes)
2. **Basic**: $173 → ~$1.73/min
3. **Essentials**: $299 → ~$1.20/min
4. **Pro**: $650 → ~$0.33/min (much better value at scale)

5. **Overage Rates**: You'll need to handle these in your application logic since they're not in the table schema

   - Starter/Basic/Essentials: $0.35-$0.40/min overage
   - Pro: $0.14/min overage

6. **Call Limits**: I've estimated based on your usage descriptions, but you can adjust these numbers based on your actual average call duration data.

The insert above will give you a solid foundation that matches your actual business pricing!

---

reference: sql commands - deepseek
