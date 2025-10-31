# user_sessions Table

## Overview

Voice call sessions and interaction records. This table stores detailed information about each voice call, including timing, costs, outcomes, and conversation analysis.

## Schema

| Column Name      | Data Type                | Constraints  | Default           | Description                                 |
| ---------------- | ------------------------ | ------------ | ----------------- | ------------------------------------------- |
| id               | uuid                     | PRIMARY KEY  | gen_random_uuid() | Unique identifier for the session           |
| call_id          | uuid                     | NULL, UNIQUE | -                 | Unique identifier for the voice call        |
| assistant_id     | uuid                     | NOT NULL     | -                 | Reference to the AI assistant used          |
| phone_number_id  | uuid                     | NULL         | -                 | Reference to the phone number configuration |
| business_number  | text                     | NULL         | -                 | Business phone number used for the call     |
| customer_number  | text                     | NULL         | -                 | Customer phone number                       |
| started_at_utc   | timestamp with time zone | NULL         | -                 | Call start time in UTC                      |
| started_at_nz    | timestamp with time zone | NULL         | -                 | Call start time in New Zealand timezone     |
| ended_at_utc     | timestamp with time zone | NULL         | -                 | Call end time in UTC                        |
| ended_at_nz      | timestamp with time zone | NULL         | -                 | Call end time in New Zealand timezone       |
| ended_reason     | text                     | NULL         | -                 | Reason the call ended                       |
| duration_minutes | numeric(10, 2)           | NULL         | -                 | Call duration in minutes                    |
| duration_seconds | numeric(10, 3)           | NULL         | -                 | Call duration in seconds                    |
| cost_total       | numeric(10, 4)           | NULL         | -                 | Total cost of the call                      |
| type             | text                     | NULL         | -                 | Type of call (inbound, outbound, etc.)      |
| server_messages  | jsonb                    | NULL         | -                 | Server-side messages and events             |
| user_id          | text                     | NULL         | -                 | User identifier                             |
| session_id       | text                     | NULL, UNIQUE | -                 | Session identifier from the voice platform  |
| source           | text                     | NULL         | -                 | Source of the call or session               |
| metadata         | jsonb                    | NULL         | -                 | Additional metadata about the call          |
| client_id        | text                     | NULL         | -                 | Reference to the client                     |
| created_at       | timestamp with time zone | NULL         | now()             | When the record was created                 |
| call_summary     | text                     | NULL         | -                 | AI-generated summary of the call            |
| call_transcript  | text                     | NULL         | -                 | Full transcript of the conversation         |
| sentiment        | text                     | NULL         | -                 | Detected sentiment of the call              |
| call_outcome     | text                     | NULL         | -                 | Outcome or result of the call               |
| keywords         | text[]                   | NULL         | -                 | Extracted keywords from the conversation    |

## Relationships

### Foreign Keys

- `assistant_id` → `assistants.id` (if assistants table exists)
- `phone_number_id` → `phone_numbers.id` (if phone_numbers table exists)
- `client_id` → `client_subscriptions.client_id`

### Referenced By

- May be referenced by billing or analytics tables

## Indexes

- `idx_user_sessions_assistant_id` on `assistant_id`
- `idx_user_sessions_call_id` on `call_id`
- `idx_user_sessions_customer_number` on `customer_number`
- `idx_user_sessions_started_at_utc` on `started_at_utc`
- `idx_user_sessions_ended_at_utc` on `ended_at_utc`
- `idx_user_sessions_started_at_nz` on `started_at_nz`
- `idx_user_sessions_ended_at_nz` on `ended_at_nz`
- `idx_user_sessions_phone_number_id` on `phone_number_id`
- `idx_user_sessions_client_id` on `client_id`
- `ux_user_sessions_session_id` on `session_id` (UNIQUE)
- `idx_user_sessions_summary_search` on `to_tsvector('english', call_summary)` (GIN)
- `idx_user_sessions_transcript_search` on `to_tsvector('english', call_transcript)` (GIN)
- `idx_user_sessions_sentiment` on `sentiment`
- `idx_user_sessions_call_outcome` on `call_outcome`

## Row Level Security (RLS)

**RLS Enabled:** Yes/No

### Policies

#### Policy Name: `clients_can_view_own_sessions`

- **Command:** SELECT
- **Role:** authenticated
- **Using:** `auth.jwt() ->> 'client_id' = client_id`
- **Description:** Clients can view their own call sessions

#### Policy Name: `assistants_can_view_assigned_sessions`

- **Command:** SELECT
- **Role:** service_role
- **Using:** `assistant_id = auth.jwt() ->> 'assistant_id'`
- **Description:** Assistants can view sessions assigned to them

## Triggers

### Trigger Name: `update_client_usage_on_session_end`

- **Event:** UPDATE
- **Function:** `update_client_monthly_usage()`
- **Description:** Updates client subscription usage when a session ends

### Trigger Name: `generate_call_analytics`

- **Event:** INSERT/UPDATE
- **Function:** `process_call_analytics()`
- **Description:** Processes call data for sentiment analysis and keyword extraction

## Usage Examples

### Create a new call session

```sql
INSERT INTO user_sessions (
  call_id,
  assistant_id,
  phone_number_id,
  business_number,
  customer_number,
  started_at_utc,
  started_at_nz,
  type,
  client_id,
  session_id
)
VALUES (
  gen_random_uuid(),
  'assistant-uuid-here',
  'phone-number-uuid-here',
  '+6491234567',
  '+6497654321',
  NOW(),
  NOW() AT TIME ZONE 'Pacific/Auckland',
  'inbound',
  'client-123',
  'session-abc123'
);
```

### End a call session with analytics

```sql
UPDATE user_sessions
SET
  ended_at_utc = NOW(),
  ended_at_nz = NOW() AT TIME ZONE 'Pacific/Auckland',
  ended_reason = 'completed',
  duration_minutes = 5.5,
  duration_seconds = 330.5,
  cost_total = 2.75,
  call_summary = 'Customer inquiry about product pricing',
  sentiment = 'positive',
  call_outcome = 'information_provided',
  keywords = ARRAY['pricing', 'product', 'inquiry']
WHERE call_id = 'call-uuid-here';
```

### Search call sessions by content

```sql
SELECT *
FROM user_sessions
WHERE to_tsvector('english', call_summary) @@ plainto_tsquery('english', 'pricing support')
   OR to_tsvector('english', call_transcript) @@ plainto_tsquery('english', 'pricing support');
```

### Get sessions by date range and client

```sql
SELECT *
FROM user_sessions
WHERE client_id = 'client-123'
  AND started_at_utc >= '2025-11-01'
  AND started_at_utc < '2025-12-01'
ORDER BY started_at_utc DESC;
```

### Aggregate call statistics by client

```sql
SELECT
  client_id,
  COUNT(*) as total_calls,
  SUM(duration_minutes) as total_minutes,
  SUM(cost_total) as total_cost,
  AVG(duration_minutes) as avg_duration
FROM user_sessions
WHERE started_at_utc >= DATE_TRUNC('month', NOW())
GROUP BY client_id;
```

## API Integration

### JavaScript/TypeScript Example

```typescript
// Start a new call session
const { data, error } = await supabase.from("user_sessions").insert({
  call_id: crypto.randomUUID(),
  assistant_id: "assistant-uuid",
  phone_number_id: "phone-uuid",
  business_number: "+6491234567",
  customer_number: "+6497654321",
  started_at_utc: new Date().toISOString(),
  started_at_nz: new Date().toLocaleString("en-NZ", {
    timeZone: "Pacific/Auckland",
  }),
  type: "inbound",
  client_id: "client-123",
  session_id: "session-abc123",
});

// End call session with analytics
const { data, error } = await supabase
  .from("user_sessions")
  .update({
    ended_at_utc: new Date().toISOString(),
    ended_at_nz: new Date().toLocaleString("en-NZ", {
      timeZone: "Pacific/Auckland",
    }),
    ended_reason: "completed",
    duration_minutes: 5.5,
    duration_seconds: 330.5,
    cost_total: 2.75,
    call_summary: "Customer inquiry about product pricing",
    sentiment: "positive",
    call_outcome: "information_provided",
    keywords: ["pricing", "product", "inquiry"],
  })
  .eq("call_id", callId);

// Search sessions by content
const { data, error } = await supabase
  .from("user_sessions")
  .select("*")
  .textSearch("call_summary", "pricing support", {
    type: "websearch",
    config: "english",
  });

// Get client call history
const { data, error } = await supabase
  .from("user_sessions")
  .select("*")
  .eq("client_id", "client-123")
  .gte("started_at_utc", "2025-11-01")
  .order("started_at_utc", { ascending: false });

// Get call analytics aggregates
const { data, error } = await supabase.rpc("get_client_call_analytics", {
  client_id: "client-123",
  start_date: "2025-11-01",
  end_date: "2025-11-30",
});
```

## Business Logic

- Call sessions track the complete lifecycle from start to end
- Dual timezone support (UTC and New Zealand) for accurate time tracking
- Automatic cost calculation based on duration and rate plans
- Real-time usage updates to client subscription counters
- AI-powered call analysis including sentiment and keyword extraction
- Full-text search capabilities on call summaries and transcripts
- Session data feeds into billing and analytics systems
- Call outcomes categorization for business intelligence

## Security Considerations

- Call transcripts may contain sensitive customer information - ensure proper encryption
- Implement data retention policies for voice recordings and transcripts
- Access control based on client ownership and assistant assignment
- Phone numbers should be validated and sanitized before storage
- Monitor for unusual call patterns that might indicate system abuse
- Ensure compliance with telecommunications privacy regulations
- Implement audit logging for all session data access
- Consider data anonymization for analytics while preserving business value

## Migration History

- **v1.0.0** (2025-11-01): Initial table creation with basic call tracking
- **v1.1.0** (2025-11-01): Added dual timezone support (UTC and NZ)
- **v1.2.0** (2025-11-01): Added call analytics fields (summary, transcript, sentiment)
- **v1.3.0** (2025-11-01): Added full-text search indexes for content discovery
- **v1.4.0** (2025-11-01): Added keywords array and call outcome tracking

## Notes

- The table supports both UUID and text identifiers for maximum integration flexibility
- JSONB fields allow for extensible metadata without schema changes
- Dual timezone storage accommodates global operations with local time needs
- Full-text search indexes enable powerful content discovery and analytics
- High precision numeric types ensure accurate cost and duration tracking
- Keywords array supports machine learning and business intelligence applications

## Related Documentation

- [Client Subscriptions Table](./client_subscriptions.md)
- [Voice Call Management](../../Vapi/)
- [Call Analytics and Reporting](../analytics.md)
- [Billing Integration](../billing-integration.md)
- [AI Assistant Configuration](../ai-assistants.md)
