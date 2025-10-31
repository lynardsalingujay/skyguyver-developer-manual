# Subscription Pricing Tiers for Vapi.ai-Integrated SaaS (NZD, GST-Inclusive)

We've structured your plans as tiered monthly subscriptions, starting with a low-entry **Starter** plan to hook SMBs (e.g., solo tradespeople testing voice AI for bookings). This builds on U.S. patterns but localized for NZ: predictable pricing with bundled minutes, overages, and NZ-specific perks like local numbers and Google integrations. All plans include core access to Vapi.ai features (AI call handling, custom prompts, basic analytics), no contracts. Annual billing saves 15%.

| Plan Tier      | Monthly Price (NZD, incl. GST) | Included Minutes | Overage Rate (NZD/min) | What's Included                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------ | ---------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Starter**    | $99                            | 50 mins          | $0.40                  | Ideal for SMBs dipping toes in voice AI. Includes: Basic Vapi.ai agent setup, NZ local phone number, simple integrations (e.g., Google Calendar for auto-booking or Google Sheets for lead transcripts), email support (48hr response), and basic call transcripts. Perfect for low-volume testing, like solo real estate agents handling inquiries.                                                                                                 |
| **Basic**      | $173                           | 100 mins         | $0.35                  | Entry-level for growing SMBs needing reliable voice automation. Includes: Everything in Starter, plus custom voice prompts (NZ accent-tuned), advanced analytics (call success rates), priority email support (24hr response), and simple integrations (e.g., Google Calendar for scheduling or Google Sheets for logging qualified leads). Suited for small service businesses (e.g., plumbers) managing 20-30 calls/week without overflow worries. |
| **Essentials** | $299                           | 250 mins         | $0.35                  | Mid-tier for teams scaling operations. Includes: Everything in Basic, plus multi-user access (up to 5 seats), API access for deeper integrations (e.g., CRM like HubSpot), 24/7 NZ-based chat support, and compliance tools (e.g., call recording for NZ Privacy Act). Great for mid-sized trades or agencies handling 100+ calls/month.                                                                                                             |
| **Pro**        | $650                           | 2,000 mins       | $0.14                  | Enterprise-ready for high-volume users. Includes: Everything in Essentials, plus unlimited minutes in light mode (<50 mins/call), white-label branding, dedicated account manager, custom Vapi.ai model fine-tuning (e.g., industry-specific scripts), SLAs (99.9% uptime), and volume discounts on add-ons like premium TTS voices. Tailored for agencies or large SMBs (e.g., real estate firms) with 500+ calls/month.                            |

**Notes on Integrations**:

- **Google Calendar**: Vapi ends call → n8n webhook → auto-event creation (e.g., "Job quote: [Client] on [Date]").
- **Google Sheets**: Append row with transcript/lead data (e.g., Name, Phone, Interest)—export to Stripe for manual invoicing.
- **Implementation**: Pre-built n8n workflows in your repo; users connect via OAuth in dashboard. For Stripe tie-in: Log leads to Sheets → manual invoice trigger.

## Next Steps

- Launch with Starter/Basic to drive trials—promote via NZ SMB networks like BusinessNZ.
- Monitor Vapi costs (~$0.15-0.25 USD/min) to ensure 50-100% margins.
- If needed, add-ons like extra numbers (+$17/mo) or unlimited storage (+$52/mo).
- Test pricing with a landing page A/B split!
