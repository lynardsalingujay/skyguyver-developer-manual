# assistants Table

## Overview

Stores AI assistant configurations for each user in the SkyGuyver voice AI platform. Each user can have one assistant with customizable voice, model, and behavior settings.

## Schema

| Column Name        | Data Type                | Constraints                   | Default                                 | Description                                    |
| ------------------ | ------------------------ | ----------------------------- | --------------------------------------- | ---------------------------------------------- |
| id                 | uuid                     | PRIMARY KEY                   | gen_random_uuid()                       | Unique identifier for the assistant            |
| user_id            | uuid                     | NOT NULL, UNIQUE, FOREIGN KEY | -                                       | Reference to the user who owns this assistant  |
| assistant_name     | text                     | NOT NULL                      | -                                       | Display name for the assistant                 |
| created_at         | timestamp with time zone | NULL                          | now()                                   | When the assistant was created                 |
| updated_at         | timestamp with time zone | NULL                          | now()                                   | When the assistant was last updated            |
| vapi_assistant_id  | text                     | NULL                          | -                                       | Reference to the assistant in Vapi.ai platform |
| model_provider     | text                     | NULL                          | 'openai'                                | AI model provider (openai, anthropic, etc.)    |
| model_name         | text                     | NULL                          | 'gpt-3.5-turbo'                         | Specific AI model to use                       |
| first_message_mode | text                     | NULL                          | 'assistant-speaks-first'                | How conversations are initiated                |
| first_message      | text                     | NULL                          | 'Hello! How can I help you today?'      | Initial message from assistant                 |
| system_prompt      | text                     | NULL                          | 'You are a helpful AI voice assistant.' | System instructions for the AI                 |
| voice_provider     | text                     | NULL                          | 'openai'                                | Voice synthesis provider                       |
| voice_id           | text                     | NULL                          | 'echo'                                  | Specific voice to use for speech               |

## Relationships

### Foreign Keys

- `user_id` → `auth.users.id`
  - ON DELETE: CASCADE
  - ON UPDATE: CASCADE
  - **Purpose**: Links assistant to its owner

### Referenced By

- `client_subscriptions.assistant_id` → `assistants.id` (Optional reference)
- `user_sessions.assistant_id` → `assistants.id` (Session tracking)

## Indexes

- `idx_assistants_user_id` on `user_id` (btree)
  - **Purpose**: Fast lookups by user
  - **Usage**: Finding user's assistant configuration

## Constraints

### Unique Constraints

- `assistants_user_id_key` on `user_id`
  - **Purpose**: Each user can only have one assistant
  - **Business Rule**: One-to-one relationship between users and assistants

### Check Constraints

- None explicitly defined, but business logic should validate:
  - Model provider values
  - Voice provider compatibility
  - First message mode options

## Triggers

### Audit Triggers

1. **assistant_create_audit_trigger**

   - **Event**: AFTER INSERT
   - **Function**: `log_assistant_create()`
   - **Purpose**: Log assistant creation events

2. **assistant_update_audit_trigger**

   - **Event**: AFTER UPDATE
   - **Function**: `log_assistant_update()`
   - **Purpose**: Track configuration changes

3. **assistant_delete_audit_trigger**
   - **Event**: BEFORE DELETE
   - **Function**: `log_assistant_delete()`
   - **Purpose**: Log assistant deletion

### Maintenance Triggers

4. **assistants_updated_at_trigger**
   - **Event**: BEFORE UPDATE
   - **Function**: `update_assistants_updated_at()`
   - **Purpose**: Automatically update `updated_at` timestamp

## Configuration Options

### Model Providers

- **openai** - OpenAI GPT models
- **anthropic** - Claude models
- **cohere** - Cohere language models
- **google** - Google's AI models

### Common Model Names

- **OpenAI**: gpt-3.5-turbo, gpt-4, gpt-4-turbo
- **Anthropic**: claude-3-haiku, claude-3-sonnet, claude-3-opus
- **Cohere**: command, command-light, command-nightly

### Voice Providers

- **openai** - OpenAI text-to-speech
- **elevenlabs** - ElevenLabs voice synthesis
- **deepgram** - Deepgram voice services
- **azure** - Microsoft Azure Speech

### First Message Modes

- **assistant-speaks-first** - Assistant initiates conversation
- **wait-for-user** - Wait for user to speak first
- **function-call** - Start with a function call

## Usage Examples

### Create New Assistant

```sql
INSERT INTO assistants (
  user_id,
  assistant_name,
  model_provider,
  model_name,
  voice_provider,
  voice_id,
  system_prompt
) VALUES (
  'user-uuid-here',
  'My Business Assistant',
  'openai',
  'gpt-4',
  'elevenlabs',
  'professional-voice-id',
  'You are a professional business assistant helping with customer inquiries.'
);
```

### Update Assistant Configuration

```sql
UPDATE assistants
SET
  model_name = 'gpt-4-turbo',
  system_prompt = 'Updated system instructions...',
  updated_at = NOW()
WHERE user_id = 'user-uuid-here';
```

### Get User's Assistant

```sql
SELECT
  assistant_name,
  model_provider,
  model_name,
  voice_provider,
  voice_id,
  vapi_assistant_id
FROM assistants
WHERE user_id = 'user-uuid-here';
```

### Find Assistants by Model

```sql
SELECT
  u.email,
  a.assistant_name,
  a.model_name,
  a.created_at
FROM assistants a
JOIN auth.users u ON a.user_id = u.id
WHERE a.model_provider = 'openai'
  AND a.model_name = 'gpt-4';
```

## Business Logic

### Assistant Creation Workflow

1. **User Registration** → Create default assistant
2. **Vapi.ai Integration** → Create assistant in Vapi platform
3. **Store vapi_assistant_id** → Link local and remote assistants
4. **Configuration Sync** → Keep settings synchronized

### Configuration Management

- **Default Settings** applied for new assistants
- **Validation** of provider/model combinations
- **Sync with Vapi.ai** when settings change
- **Backup configurations** before major updates

## Performance Considerations

### Query Optimization

- Index on `user_id` provides fast user lookups
- Consider adding index on `vapi_assistant_id` if frequently queried
- Monitor query patterns for additional indexing needs

### Scaling Considerations

- **One assistant per user** limits table growth
- **Text fields** (system_prompt) can be large - monitor storage
- **Audit triggers** add overhead - consider async logging for high volume

## Security & Compliance

### Data Protection

- **System prompts** may contain sensitive business logic
- **Voice configurations** might include custom voice models
- **User isolation** enforced by user_id foreign key

### Access Control

- Users can only access their own assistant
- Admin users need special permissions for cross-user access
- API keys and sensitive configurations stored securely

## Monitoring & Alerts

### Key Metrics

- **Assistant creation rate** - New user onboarding
- **Configuration changes** - User customization activity
- **Model usage distribution** - Popular AI models
- **Voice provider distribution** - Voice preference trends

### Health Checks

```sql
-- Check for assistants without users (orphaned records)
SELECT COUNT(*) as orphaned_assistants
FROM assistants a
LEFT JOIN auth.users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Check for users without assistants
SELECT COUNT(*) as users_without_assistants
FROM auth.users u
LEFT JOIN assistants a ON u.id = a.user_id
WHERE a.user_id IS NULL;

-- Model provider distribution
SELECT
  model_provider,
  COUNT(*) as assistant_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM assistants), 2) as percentage
FROM assistants
GROUP BY model_provider
ORDER BY assistant_count DESC;
```

## Integration Points

### Vapi.ai Platform

- **Assistant Creation** - Sync with remote platform
- **Configuration Updates** - Push changes to Vapi
- **Voice Testing** - Test voice/model combinations
- **Call Routing** - Route calls to correct assistant

### Client Applications

- **Dashboard** - Assistant configuration interface
- **Mobile Apps** - Voice testing and preview
- **API Endpoints** - CRUD operations for assistants
- **Webhooks** - Real-time configuration updates

## Troubleshooting

### Common Issues

**Orphaned Assistants**

```sql
-- Find assistants without valid users
SELECT * FROM assistants a
LEFT JOIN auth.users u ON a.user_id = u.id
WHERE u.id IS NULL;
```

**Missing Vapi IDs**

```sql
-- Find assistants not yet synced with Vapi
SELECT user_id, assistant_name, created_at
FROM assistants
WHERE vapi_assistant_id IS NULL;
```

**Configuration Validation**

```sql
-- Check for invalid model combinations
SELECT user_id, model_provider, model_name
FROM assistants
WHERE (model_provider = 'openai' AND model_name NOT LIKE 'gpt%')
   OR (model_provider = 'anthropic' AND model_name NOT LIKE 'claude%');
```

---

**Last Updated**: November 6, 2025  
**Schema Version**: 1.0  
**Related Documentation**: [User Sessions](./user-sessions), [Client Subscriptions](./client-subscriptions)
