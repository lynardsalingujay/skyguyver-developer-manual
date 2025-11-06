# n8n Workflows

## Overview

n8n is our automation platform that handles workflow orchestration between different services in the SkyGuyver platform. These workflows manage call routing, data processing, and integration between Twilio, Vapi.ai, and Supabase.

## Active Workflows

### Call Management Workflows

#### [Twilio Incoming Call Workflow](./workflow-twilio-incoming-call)

- **Purpose**: Call validation and routing for incoming calls
- **Trigger**: Twilio webhook on incoming calls
- **Functions**:
  - Client subscription validation
  - Call routing decisions
  - Usage tracking and logging
- **Status**: ✅ Active
- **Webhook**: `https://n8n.skyguyver.com/webhook/twilio-incoming-call`

#### [Vapi End of Call Report Workflow](./workflow-vapi-end-of-call-report)

- **Purpose**: Process call completion data and update usage metrics
- **Trigger**: Vapi.ai webhook on call completion
- **Functions**:
  - Session data processing
  - Usage calculations
  - Billing updates
- **Status**: ✅ Active
- **Webhook**: `https://n8n.skyguyver.com/webhook/vapi-end-of-call-report`

## Workflow Architecture

```
Twilio Calls → n8n Validation → Vapi.ai Processing → n8n Post-Processing → Supabase Storage
```

### Data Flow

1. **Incoming Call**: Twilio receives call and sends webhook to n8n
2. **Validation**: n8n checks client subscription status in Supabase
3. **Routing**: Based on validation, route to Vapi.ai or block call
4. **Processing**: Vapi.ai handles AI conversation
5. **Completion**: Vapi.ai sends end-of-call data to n8n
6. **Updates**: n8n processes usage data and updates Supabase

## Integration Points

### Upstream Services

- **Twilio**: Phone number management and call routing
- **Vapi.ai**: AI conversation processing

### Downstream Services

- **Supabase**: Data storage and retrieval
- **Logging Systems**: Monitoring and analytics

## Configuration

### Server Details

- **URL**: `https://n8n.skyguyver.com`
- **Environment**: Production
- **Hosting**: Linode VPS

### Database Connections

- **Supabase**: PostgreSQL database for all data operations
- **Tables Used**:
  - `client_subscriptions` - Client and subscription data
  - `user_sessions` - Call session tracking
  - `call_validation_logs` - Call validation logging

### API Integrations

- **Vapi.ai API**: For call redirection and data processing
- **Twilio API**: For call management (future enhancements)

## Monitoring & Maintenance

### Health Checks

- Monitor webhook response times
- Track workflow execution success rates
- Validate database connection stability

### Performance Metrics

- Workflow execution time
- Database query performance
- Error rates and types

### Maintenance Tasks

- Regular backup of workflow configurations
- Update API credentials as needed
- Monitor and optimize database queries

## Development & Testing

### Local Development

- Use n8n desktop application for workflow development
- Test webhooks with ngrok or similar tools
- Validate against staging Supabase environment

### Deployment Process

1. Develop and test workflows locally
2. Export workflow JSON
3. Import to production n8n instance
4. Test with production webhooks
5. Monitor for successful execution

## Security Considerations

- Webhook endpoints use HTTPS only
- API credentials stored securely in n8n credential system
- Database connections use encrypted connections
- Webhook signature validation (where supported)

---

**Server Management**: [Linode VPS Configuration](../../operations/infrastructure/linode-server)  
**Database Schema**: [Supabase Tables](../../supabase/tables/)  
**API Documentation**: [Integration APIs](../../integrations/)
