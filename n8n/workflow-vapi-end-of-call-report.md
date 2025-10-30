---

## 🧠 Workflow Documentation Template

Use this structure for documenting each automation or component:

```markdown
# Workflow: vapi-end-of-call-report

**Platform:** n8n  
**Status:** Active  
**Last updated:** 2025-10-30

---

### 🧭 Purpose

Capture call duration, assistant name, and metadata from Vapi and insert into Supabase.

### ⚙️ Trigger

POST → `https://n8n.skyguyver.com/webhook/vapi-call-end`

### 🧩 Input Fields

| Field          | Description             | Example |
| -------------- | ----------------------- | ------- |
| call_id        | Unique call identifier  | abc123  |
| duration       | Call duration (seconds) | 243     |
| assistant_name | AI assistant label      | SkyBeta |

### 🏁 Output

Inserts record into Supabase table `call_reports`.

### 💡 Notes

- Handle potential null duration from incomplete calls.
- Related: [[Supabase/call_reports_schema]] [[Vapi/assistant-config]]
