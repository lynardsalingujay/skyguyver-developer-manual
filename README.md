# SkyGuyver Developer Manual

Internal documentation for the **SkyGuyver AI Voice Assistant** platform.  
This repository serves as the **single source of truth** for all workflows, automations, and system configurations across **Vapi**, **n8n**, **Supabase**, and the **SkyGuyver web app**.

---

## 🚀 Purpose

SkyGuyver is a modular AI voice assistant system built with:

- **Vapi** – Voice agent creation and LLM-powered conversation handling.
- **n8n** – Workflow orchestration, automation, and data routing.
- **Supabase** – Backend database, authentication, and storage.
- **React + Vite** – Front-end web application for dashboard and user interactions.
- **Netlify** – Deployment platform for the SkyGuyver website and client dashboard.

The **Developer Manual** centralizes:

- Workflow documentation
- Integration endpoints and webhook URLs
- Database schema references
- Front-end deployment details
- Environment settings and architecture notes

Everything needed to rebuild, debug, or extend SkyGuyver lives here.

---

## 🧰 Tech Stack Overview

| Layer       | Technology            | Purpose                                       |
| ----------- | --------------------- | --------------------------------------------- |
| Voice Layer | **Vapi**              | AI assistant creation, call and chat handling |
| Automation  | **n8n**               | Workflow orchestration and data routing       |
| Backend     | **Supabase**          | Database, authentication, and storage         |
| Front-End   | **React + Vite**      | Fast, modular web client                      |
| Hosting     | **Netlify**           | Continuous deployment and edge hosting        |
| Docs        | **Markdown + GitHub** | Source-controlled documentation vault         |

---

## 💰 Business & Monetization

For subscription pricing details, tier enforcement, and billing integrations (e.g., Stripe via n8n, usage tracking in Supabase), see [pricing.md](./pricing.md).

**Dev Notes**:

- Implement tier logic in Supabase (e.g., row-level security on usage tables) and n8n workflows (e.g., minute tracking via Vapi webhooks).
- Track overages in Supabase `usage_logs` table; trigger alerts via n8n to Stripe.
- Feature flags in React dashboard: Use Supabase auth to gate UI elements (e.g., concurrency limits).

---

## Next Steps for Pricing Implementation

- Launch with Starter/Basic to drive trials—promote via NZ SMB networks like BusinessNZ.
- Monitor Vapi costs (~$0.15-0.25 USD/min) to ensure 50-100% margins.
- If needed, add-ons like extra numbers (+$17/mo) or unlimited storage (+$52/mo).
- Test pricing with a landing page A/B split!
