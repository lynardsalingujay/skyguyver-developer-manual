# Table Creation Scripts

## Overview

SQL scripts for creating and setting up database tables in the SkyGuyver platform.

## Assistants Table

### Purpose

Create the assistants table for storing AI assistant configurations per user.

### Table Creation Script

```sql
-- Create assistants table
CREATE TABLE public.assistants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  assistant_name text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  vapi_assistant_id text NULL,
  model_provider text NULL DEFAULT 'openai'::text,
  model_name text NULL DEFAULT 'gpt-3.5-turbo'::text,
  first_message_mode text NULL DEFAULT 'assistant-speaks-first'::text,
  first_message text NULL DEFAULT 'Hello! How can I help you today?'::text,
  system_prompt text NULL DEFAULT 'You are a helpful AI voice assistant.'::text,
  voice_provider text NULL DEFAULT 'openai'::text,
  voice_id text NULL DEFAULT 'echo'::text,
  CONSTRAINT assistants_pkey PRIMARY KEY (id),
  CONSTRAINT assistants_user_id_key UNIQUE (user_id),
  CONSTRAINT assistants_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;
```

### Indexes

```sql
-- Create index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_assistants_user_id
ON public.assistants USING btree (user_id) TABLESPACE pg_default;
```

### Audit Triggers

```sql
-- Create audit trigger for assistant creation
CREATE TRIGGER assistant_create_audit_trigger
AFTER INSERT ON assistants FOR EACH ROW
EXECUTE FUNCTION log_assistant_create();

-- Create audit trigger for assistant updates
CREATE TRIGGER assistant_update_audit_trigger
AFTER UPDATE ON assistants FOR EACH ROW
EXECUTE FUNCTION log_assistant_update();

-- Create audit trigger for assistant deletion
CREATE TRIGGER assistant_delete_audit_trigger
BEFORE DELETE ON assistants FOR EACH ROW
EXECUTE FUNCTION log_assistant_delete();
```

### Maintenance Triggers

```sql
-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER assistants_updated_at_trigger
BEFORE UPDATE ON assistants FOR EACH ROW
EXECUTE FUNCTION update_assistants_updated_at();
```

## Verification Queries

### Check Table Creation

```sql
-- Verify table structure
\d assistants;

-- Check constraints
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'assistants'::regclass;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'assistants';
```

### Check Triggers

```sql
-- List all triggers on assistants table
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'assistants';
```

## Sample Data

### Insert Default Assistant

```sql
-- Create a sample assistant for testing
INSERT INTO assistants (
  user_id,
  assistant_name,
  model_provider,
  model_name,
  system_prompt,
  voice_provider,
  voice_id
) VALUES (
  'your-user-id-here',
  'SkyGuyver Assistant',
  'openai',
  'gpt-4',
  'You are SkyGuyver, a professional AI voice assistant helping with business communications.',
  'openai',
  'echo'
);
```

## Related Functions

### Required Audit Functions

These functions must exist before creating the triggers:

```sql
-- Function to log assistant creation
CREATE OR REPLACE FUNCTION log_assistant_create()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    operation,
    record_id,
    user_id,
    new_data,
    created_at
  ) VALUES (
    'assistants',
    'CREATE',
    NEW.id::text,
    NEW.user_id,
    row_to_json(NEW),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log assistant updates
CREATE OR REPLACE FUNCTION log_assistant_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    operation,
    record_id,
    user_id,
    old_data,
    new_data,
    created_at
  ) VALUES (
    'assistants',
    'UPDATE',
    NEW.id::text,
    NEW.user_id,
    row_to_json(OLD),
    row_to_json(NEW),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log assistant deletion
CREATE OR REPLACE FUNCTION log_assistant_delete()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    operation,
    record_id,
    user_id,
    old_data,
    created_at
  ) VALUES (
    'assistants',
    'DELETE',
    OLD.id::text,
    OLD.user_id,
    row_to_json(OLD),
    NOW()
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_assistants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Rollback Script

### Drop Table and Dependencies

```sql
-- Drop triggers first
DROP TRIGGER IF EXISTS assistant_create_audit_trigger ON assistants;
DROP TRIGGER IF EXISTS assistant_update_audit_trigger ON assistants;
DROP TRIGGER IF EXISTS assistant_delete_audit_trigger ON assistants;
DROP TRIGGER IF EXISTS assistants_updated_at_trigger ON assistants;

-- Drop indexes
DROP INDEX IF EXISTS idx_assistants_user_id;

-- Drop table
DROP TABLE IF EXISTS assistants;

-- Drop functions if not used elsewhere
DROP FUNCTION IF EXISTS log_assistant_create();
DROP FUNCTION IF EXISTS log_assistant_update();
DROP FUNCTION IF EXISTS log_assistant_delete();
DROP FUNCTION IF EXISTS update_assistants_updated_at();
```

---

**Created:** November 6, 2025  
**Status:** Active  
**Related Documentation:** [Assistants Table](../tables/assistants)
