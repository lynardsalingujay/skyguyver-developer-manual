# Twilio Incoming Call Workflow

## Overview

This n8n workflow handles incoming Twilio calls by validating client subscriptions and routing calls to Vapi.ai. It performs real-time subscription status checks, usage validation, and call routing decisions while logging all validation attempts for monitoring and analytics.

## Workflow Details

- **Name**: `twilio-incoming-call`
- **Type**: Webhook-triggered workflow
- **Purpose**: Call validation and routing for Twilio-to-Vapi integration
- **Status**: Active

## Nodes Overview

### 1. Webhook (Entry Point)

- **Type**: `n8n-nodes-base.webhook`
- **Method**: POST
- **Path**: `/twilio-incoming-call`
- **Purpose**: Receives incoming call data from Twilio
- **Webhook ID**: `08beeef0-a25d-4ed7-9aaa-9ac6a48d61e0`

### 2. Supabase - Check Client Status

- **Type**: `n8n-nodes-base.supabase`
- **Operation**: GET
- **Table**: `client_subscriptions`
- **Purpose**: Look up client subscription by phone number
- **Filter**: `phone_number = \{\{ $json.body.To \}\}`
- **Always Output Data**: Yes

### 3. Code in JavaScript

- **Type**: `n8n-nodes-base.code`
- **Purpose**: Main business logic for call validation and routing decisions
- **Key Functions**:
  - Extract Twilio call data (CallSid, From, To)
  - Validate client subscription status
  - Check suspension, active status, and billing period
  - Generate appropriate TwiML responses
  - Prepare logging data

### 4. Respond to Webhook

- **Type**: `n8n-nodes-base.respondToWebhook`
- **Content-Type**: `text/xml`
- **Purpose**: Return TwiML response to Twilio
- **Response Code**: 200

### 5. Create a row (Logging)

- **Type**: `n8n-nodes-base.supabase`
- **Operation**: INSERT
- **Table**: `call_validation_logs`
- **Purpose**: Log all call validation attempts for monitoring

## Business Logic Flow

### 1. Call Reception

- Twilio sends incoming call data via webhook
- Extract caller number (`From`), called number (`To`), and `CallSid`

### 2. Client Lookup

- Query `client_subscriptions` table by phone number
- Check if client exists for the called number

### 3. Validation Checks

The workflow performs the following validations:

#### Client Not Found

- **Response**: "Number not configured" message
- **Action**: Hangup call
- **TwiML**: Error message with Polly voice

#### Client Found - Status Checks

- **Suspension Check**: `is_suspended = true`
- **Active Check**: `is_active = false`
- **Period Check**: `current_period_end < now()`

### 4. Routing Decisions

#### Call Blocked (Any validation fails)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">We're sorry, this service is temporarily unavailable. Please try again later or contact the business directly.</Say>
  <Pause length="1"/>
  <Hangup/>
</Response>
```

#### Call Allowed (All validations pass)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Redirect method="POST">https://api.vapi.ai/twilio/inbound_call</Redirect>
</Response>
```

### 5. Logging

All validation attempts are logged to `call_validation_logs` with:

- Client information
- Call details (CallSid, numbers)
- Validation results
- Usage statistics
- Timestamps

## Data Flow

```
Twilio Call → Webhook → Supabase Lookup → JavaScript Validation → TwiML Response
                                                                    ↓
                                                              Supabase Logging
```

## Input Data Structure

### Twilio Webhook Data

```json
{
  "query": {
    "To": "+6491234567",
    "From": "+6497654321",
    "CallSid": "CA1234567890abcdef"
  },
  "body": {
    "To": "+6491234567",
    "From": "+6497654321",
    "CallSid": "CA1234567890abcdef"
  }
}
```

## Output Data Structure

### Successful Validation

```json
{
  "twiml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
  "allow_call": true,
  "reason": "Active subscription",
  "client_id": "client-123",
  "client_name": "John Doe",
  "plan_name": "Basic",
  "assistant_id": "assistant-uuid",
  "called_number": "+6491234567",
  "caller_number": "+6497654321",
  "call_sid": "CA1234567890abcdef",
  "minutes_used": 150.5,
  "minutes_limit": 1000,
  "minutes_remaining": 849.5
}
```

### Failed Validation

```json
{
  "twiml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
  "allow_call": false,
  "reason": "Account suspended",
  "client_id": "client-123",
  "suspension_reason": "Payment overdue"
}
```

## Database Tables Used

### Read Operations

- **`client_subscriptions`**: Client lookup and status validation

### Write Operations

- **`call_validation_logs`**: Logging all validation attempts

## Configuration Requirements

### Supabase Credentials

- **Credential Name**: "Supabase account"
- **Credential ID**: `Wh1JpykCxWLpVqic`
- **Required Permissions**:
  - READ: `client_subscriptions`
  - WRITE: `call_validation_logs`

### Environment Variables

- **Vapi Twilio URL**: `https://api.vapi.ai/twilio/inbound_call`

## Error Handling

### Client Not Found

- Returns user-friendly error message
- Logs attempt with reason "Number not found"
- Provides graceful call termination

### Suspended Account

- Returns professional unavailable message
- Logs suspension reason
- Includes usage statistics for analysis

### Database Errors

- Supabase node configured with "Always Output Data"
- JavaScript code handles empty/null responses
- Defaults to blocking call if uncertain

## Monitoring & Analytics

### Call Validation Logs

The workflow logs all attempts to `call_validation_logs` including:

- Call success/failure rates
- Usage statistics per client
- Blocking reasons analysis
- Call volume trends

### Key Metrics

- **Blocked Call Rate**: Percentage of calls blocked
- **Top Blocking Reasons**: Suspension, expiration, etc.
- **Usage Patterns**: Minutes/calls per client
- **Response Times**: Validation performance

## Testing

### Test Cases

1. **Valid Active Client**: Should redirect to Vapi
2. **Suspended Client**: Should block with suspension message
3. **Inactive Client**: Should block with unavailable message
4. **Expired Period**: Should block with unavailable message
5. **Unknown Number**: Should block with configuration message

### Webhook URL

```
https://n8n.skyguyver.com/webhook/twilio-incoming-call
```

## Integration Points

### Upstream

- **Twilio**: Sends incoming call webhooks
- **Phone System**: Routes calls to Twilio numbers

### Downstream

- **Vapi.ai**: Receives allowed calls for AI processing
- **Supabase**: Stores validation logs and subscription data

## Security Considerations

- Webhook endpoint should be secured with Twilio signature validation
- Sensitive client data logged appropriately
- TwiML responses use professional, non-revealing messages
- Call blocking preserves client privacy

## Troubleshooting

### Common Issues

1. **Calls Always Blocked**: Check Supabase credentials and table permissions
2. **No Logging**: Verify `call_validation_logs` table exists and has correct schema
3. **TwiML Errors**: Validate XML format in JavaScript responses
4. **Timeout Issues**: Optimize Supabase query performance

### Debug Information

The JavaScript code includes extensive console logging:

- Received data from Supabase
- Twilio call information
- Validation decision logic
- Final routing decisions

---

**Related Documentation:**

- [Vapi End-of-Call Report Workflow](./workflow-vapi-end-of-call-report)
- [Client Subscriptions Table](../../supabase/tables/client_subscriptions)
- [User Sessions Table](../../supabase/tables/user_sessions)
- [Call Validation Logs Schema](../../supabase/tables/call_validation_logs)
