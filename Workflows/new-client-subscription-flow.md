# New Client Subscription Flow & Lifecycle

## Overview

This document outlines the complete flow and lifecycle for new client subscriptions in the Skyguyver voice AI platform.

### Scenario: John's Coffee Shop Subscribes

**Client Details:**

- Business: John's Coffee Shop
- Phone: +6421234567
- Plan: Pro Plan ($49/month, 500 calls, 2000 minutes)
- Subscribe Date: November 15, 2025

---

## 📅 Month 1: November 15 - December 14, 2025

### STEP 1: Client Signs Up (November 15, 2025)

**Insert into `client_subscriptions`:**

```sql
INSERT INTO client_subscriptions (
  client_id,
  client_name,
  client_email,
  phone_number,
  plan_name,
  monthly_minute_limit,
  is_active,
  current_period_start,
  current_period_end,
  assistant_id,
  -- Usage counters start at 0
  current_month_calls,
  current_month_minutes,
  current_month_cost,
  alert_at_percentage,
  alert_sent,
  is_suspended,
  created_at
) VALUES (
  'client_john_coffee',
  'John''s Coffee Shop',
  'john@coffeeshop.com',
  '+6421234567',
  'Pro',
  2000, -- From subscription_plans.monthly_minute_limit
  true,
  '2025-11-15 00:00:00+13', -- Subscription starts
  '2025-12-14 23:59:59+13', -- 30 days later
  '68abfc4c-764f-4444-8f54-1137108d0dd1', -- Vapi assistant ID
  0, -- Zero calls initially
  0, -- Zero minutes initially
  0, -- Zero cost initially
  80, -- Send alert at 80% usage
  false, -- No alert sent yet
  false, -- Not suspended
  now()
);
```

**Database State After Signup:**

| Field                 | Value                |
| --------------------- | -------------------- |
| client_id             | `client_john_coffee` |
| client_name           | John's Coffee Shop   |
| phone_number          | `+6421234567`        |
| plan_name             | `Pro`                |
| monthly_minute_limit  | 2000                 |
| monthly_call_limit    | 500 (from plan)      |
| current_month_calls   | **0**                |
| current_month_minutes | **0**                |
| current_month_cost    | **$0.00**            |
| current_period_start  | `2025-11-15`         |
| current_period_end    | `2025-12-14`         |
| is_active             | `true`               |
| alert_sent            | `false`              |

---

### STEP 2: First Call (November 16, 2025 - 10:30 AM)

**Customer calls:** +6421234567

**Pre-Call Check (n8n Workflow #1):**

```javascript
// Query result from Supabase:
{
  client_id: 'client_john_coffee',
  plan_name: 'Pro',
  monthly_call_limit: 500,
  monthly_minute_limit: 2000,
  current_month_calls: 0,
  current_month_minutes: 0,
  is_active: true,
  is_suspended: false,
  current_period_end: '2025-12-14T23:59:59+13'
}

// Decision: ✅ ALLOW CALL
// Reason: 0/500 calls used, 0/2000 minutes used
```

**Call Completes:** 3.5 minutes, cost $0.15

**Post-Call Update (n8n Workflow #2):**

Insert into `user_sessions`:

```sql
INSERT INTO user_sessions (
  call_id,
  assistant_id,
  phone_number_id,
  business_number,
  customer_number,
  started_at_utc,
  started_at_nz,
  ended_at_utc,
  ended_at_nz,
  duration_minutes,
  duration_seconds,
  cost_total,
  call_summary,
  sentiment
) VALUES (
  '019a24f7-95dc-755a-a05c-f7364e45bce8',
  '68abfc4c-764f-4444-8f54-1137108d0dd1',
  '5c171998-3537-4d67-86a4-e5216db27ec2',
  '+6421234567',
  '+64273003519',
  '2025-11-15T21:30:00Z',
  '2025-11-16 10:30:00',
  '2025-11-15T21:33:30Z',
  '2025-11-16 10:33:30',
  3.5,
  210,
  0.15,
  'Customer inquired about opening hours and menu',
  'positive'
);
```

Update `client_subscriptions`:

```sql
UPDATE client_subscriptions
SET
  current_month_calls = current_month_calls + 1,        -- 0 + 1 = 1
  current_month_minutes = current_month_minutes + 3.5,  -- 0 + 3.5 = 3.5
  current_month_cost = current_month_cost + 0.15,       -- 0 + 0.15 = 0.15
  updated_at = now()
WHERE phone_number = '+6421234567';
```

**Database State After First Call:**

| Field                 | Before | After                          |
| --------------------- | ------ | ------------------------------ |
| current_month_calls   | 0      | **1**                          |
| current_month_minutes | 0      | **3.5**                        |
| current_month_cost    | $0.00  | **$0.15**                      |
| Usage %               | 0%     | **0.2% calls, 0.175% minutes** |

---

### STEP 3: Throughout November (Nov 16-30)

John receives **120 calls** averaging 4 minutes each.

**Running totals by end of November:**

| Metric                | Value                 | Limit | Usage % |
| --------------------- | --------------------- | ----- | ------- |
| Calls                 | **120**               | 500   | **24%** |
| Minutes               | **480**               | 2000  | **24%** |
| Cost                  | **$18.50**            | N/A   | N/A     |
| Period Days Remaining | **14 days**           | N/A   | N/A     |
| Alert Sent?           | **No** (only at 80%+) |       |         |

**Database State (Nov 30):**

```javascript
{
  client_id: 'client_john_coffee',
  current_month_calls: 120,
  current_month_minutes: 480,
  current_month_cost: 18.50,
  current_period_start: '2025-11-15',
  current_period_end: '2025-12-14',
  alert_sent: false,
  is_active: true
}
```

---

### STEP 4: December 1-14 (Finishing First Billing Period)

John receives **300 more calls**, totaling 1200 minutes.

**December 10, 2025 - 80% Alert Triggered:**

| Metric  | Value    | Limit | Usage %    |
| ------- | -------- | ----- | ---------- |
| Calls   | **400**  | 500   | **80%** 🟠 |
| Minutes | **1600** | 2000  | **80%** 🟠 |

**Email Alert Sent:**

```
Subject: Usage Alert - 80% of Your Pro Plan Used

Hi John,

You've used 80% of your Pro plan limits:
- Calls: 400 / 500 (80%)
- Minutes: 1,600 / 2,000 (80%)

Your current billing period ends on December 14, 2025.
Remaining: 4 days

To avoid service interruption, consider upgrading to Enterprise plan.
```

Update database:

```sql
UPDATE client_subscriptions
SET alert_sent = true
WHERE client_id = 'client_john_coffee';
```

**December 14, 2025 - End of Period:**

| Metric  | Final Value           |
| ------- | --------------------- |
| Calls   | **420** / 500 (84%)   |
| Minutes | **1680** / 2000 (84%) |
| Cost    | **$63.50**            |

---

## 📅 Month 2: December 15, 2025 - January 14, 2026

### STEP 5: Automatic Reset (December 15, 2025 at 00:00)

**Cron Job Runs:** `SELECT reset_monthly_usage();`

**Before Reset:**

```javascript
{
  client_id: 'client_john_coffee',
  current_month_calls: 420,
  current_month_minutes: 1680,
  current_month_cost: 63.50,
  current_period_start: '2025-11-15',
  current_period_end: '2025-12-14', // EXPIRED
  alert_sent: true
}
```

**Reset Logic:**

```sql
UPDATE client_subscriptions
SET
  current_month_calls = 0,              -- Reset to 0
  current_month_minutes = 0,            -- Reset to 0
  current_month_cost = 0,               -- Reset to 0
  alert_sent = false,                   -- Reset alert flag
  last_reset_at = now(),
  current_period_start = '2025-12-15',  -- New period starts
  current_period_end = '2026-01-14',    -- 30 days later
  updated_at = now()
WHERE client_id = 'client_john_coffee'
AND current_period_end < CURRENT_DATE;
```

**Log Reset (optional):**

```sql
INSERT INTO subscription_reset_logs (
  client_id,
  client_name,
  plan_name,
  calls_used_before_reset,
  minutes_used_before_reset,
  cost_before_reset
) VALUES (
  'client_john_coffee',
  'John''s Coffee Shop',
  'Pro',
  420,
  1680,
  63.50
);
```

**After Reset:**

```javascript
{
  client_id: 'client_john_coffee',
  current_month_calls: 0,           // ✅ RESET
  current_month_minutes: 0,         // ✅ RESET
  current_month_cost: 0,            // ✅ RESET
  current_period_start: '2025-12-15', // ✅ NEW PERIOD
  current_period_end: '2026-01-14',   // ✅ NEW END DATE
  alert_sent: false,                // ✅ RESET
  is_active: true                   // ✅ STILL ACTIVE
}
```

---

### STEP 6: Second Billing Period Begins (Dec 15 onwards)

**First call of new period (Dec 15, 2025 - 9:00 AM):**

Pre-call check sees:

```javascript
{
  current_month_calls: 0,  // Fresh start!
  current_month_minutes: 0,
  monthly_call_limit: 500,
  monthly_minute_limit: 2000,
  current_period_end: '2026-01-14'
}
// ✅ ALLOW CALL - Full quota available again
```

Call completes, usage updates:

```javascript
{
  current_month_calls: 1,
  current_month_minutes: 4.2,
  current_month_cost: 0.18
}
```

---

## 📊 Complete Timeline Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│ SUBSCRIPTION LIFECYCLE: John's Coffee Shop                      │
└─────────────────────────────────────────────────────────────────┘

Nov 15                                           Dec 14    Dec 15
  │                                                 │         │
  ├─ SIGNUP (Pro Plan)                             │         │
  │  • Calls: 0/500                                │         │
  │  • Minutes: 0/2000                             │         │
  │                                                │         │
Nov 16                                             │         │
  │                                                │         │
  ├─ First Call ✅                                 │         │
  │  • Calls: 1/500 (0.2%)                        │         │
  │                                                │         │
Nov 30                                             │         │
  │                                                │         │
  ├─ Usage: 120/500 (24%)                         │         │
  │  • No alerts yet                               │         │
  │                                                │         │
Dec 10                                             │         │
  │                                                │         │
  ├─ 🟠 ALERT SENT (80% usage)                    │         │
  │  • Calls: 400/500                              │         │
  │  • Minutes: 1600/2000                          │         │
  │                                                │         │
Dec 14                                             │         │
  │                                                │         │
  └─ PERIOD ENDS                                   │         │
     • Final: 420 calls, 1680 min, $63.50         │         │
                                                   │         │
                                    AUTOMATIC RESET ─┘         │
                                                               │
Dec 15                                                         │
  │                                                            │
  ├─ NEW PERIOD STARTS                                        │
  │  • Calls: 0/500 ✅ (RESET)                                │
  │  • Minutes: 0/2000 ✅ (RESET)                             │
  │  • Cost: $0.00 ✅ (RESET)                                 │
  │                                                            │
Dec 16+                                                        │
  │                                                            │
  └─ Service continues normally...                            │
     Usage tracking restarts from 0                           │

```

---

## 📋 Database State Comparison

### `client_subscriptions` Table - Side by Side:

| Field                 | Nov 15 (Signup)      | Dec 14 (End Period 1) | Dec 15 (Start Period 2) |
| --------------------- | -------------------- | --------------------- | ----------------------- |
| client_id             | `client_john_coffee` | `client_john_coffee`  | `client_john_coffee`    |
| plan_name             | `Pro`                | `Pro`                 | `Pro`                   |
| monthly_minute_limit  | 2000                 | 2000                  | 2000                    |
| current_month_calls   | **0**                | **420**               | **0** ✅                |
| current_month_minutes | **0**                | **1680**              | **0** ✅                |
| current_month_cost    | **$0.00**            | **$63.50**            | **$0.00** ✅            |
| current_period_start  | `2025-11-15`         | `2025-11-15`          | **`2025-12-15`** ✅     |
| current_period_end    | `2025-12-14`         | `2025-12-14`          | **`2026-01-14`** ✅     |
| alert_sent            | `false`              | `true`                | **`false`** ✅          |
| is_active             | `true`               | `true`                | `true`                  |
| last_reset_at         | `2025-11-15`         | `2025-11-15`          | **`2025-12-15`** ✅     |

---

## 🔄 What Happens Each Month?

### Automatic Process (No Manual Intervention):

1. **Daily Cron Job** runs at midnight (00:00)
2. **Checks:** Is `current_period_end < CURRENT_DATE`?
3. **If YES:**
   - Reset `current_month_calls = 0`
   - Reset `current_month_minutes = 0`
   - Reset `current_month_cost = 0`
   - Reset `alert_sent = false`
   - Update `current_period_start = old_period_end`
   - Update `current_period_end = old_period_end + 1 month`
   - Log to `subscription_reset_logs`
4. **If NO:** Do nothing, client still in current period

### Client Never Unsubscribes - What Happens?

**Month 3, 4, 5... onwards:**

- ✅ Same process repeats automatically
- ✅ Usage resets every 30 days
- ✅ Client continues receiving service
- ✅ No manual intervention needed
- ✅ Full audit trail in logs

---

## 🎯 Key Takeaways

### Schema is Good! Just Add:

1. ✅ `monthly_call_limit` column
2. ✅ `billing_cycle` column
3. ✅ Optionally rename `monthly_minutes` → `monthly_minute_limit`

### Client Lifecycle is Automatic:

1. **Signup** → Entry created with limits
2. **Usage** → Counters increment with each call
3. **Alert** → Sent at 80% usage
4. **Reset** → Automatic when period expires
5. **Continue** → Next period starts fresh
6. **Repeat** → Forever (until client cancels)

### No Manual Work Required:

- ❌ No need to manually reset usage
- ❌ No need to manually extend periods
- ❌ No need to manually clear alerts
- ✅ Everything handled by cron job

Would you like me to create the complete n8n workflow JSON files with this understanding?
