# Workflow: vapi-end-of-call-report

**Platform:** n8n  
**Status:** Active  
**Last updated:** 2025-10-30

---

### 🧭 Purpose

Capture call duration, assistant name, and metadata from Vapi and insert into Supabase.

### ⚙️ Trigger

POST → `https://n8n.skyguyver.com/webhook/vapi-call-end`

### Input

Webhook

### 🧩 Output Fields

| Field            | Description             | Example                              |
| ---------------- | ----------------------- | ------------------------------------ |
| call_id          | Unique call identifier  | 019a3174-0a03-7113-863a-3b3fc01c3bd2 |
| assistant_name   | AI assistant label      | 3b47f539-cc56-4552-9364-849612bc8509 |
| duration_minutes | Call duration (minutes) | 1.49                                 |
| duration_seconds | Call duration (seconds) | 89.471                               |

### 🏁 Output

Inserts record into Supabase table `user_sessions`.

### 💡 Notes

- Log duration minutes/seconds for every end of call.
