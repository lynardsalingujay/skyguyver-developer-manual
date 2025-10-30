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
