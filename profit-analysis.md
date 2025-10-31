# Profit Analysis for SkyGuyver Subscription Plans (NZD, GST-Inclusive)

This analysis calculates monthly profit per plan, assuming users consume exactly the included minutes (no overages). It incorporates your updated costs: Twilio NZ local number at **$3.15 NZD/client/month** + call fees (~$0.035 NZD/min), Stripe fees (**2.9% + $0.30 NZD per monthly transaction**), and Vapi.ai variable costs (~$0.265 NZD/min for default stack incl. STT/LLM/TTS). **Total variable cost: $0.30 NZD/min** (default voice). Fixed costs per user: **$4.025 NZD/mo** (Twilio + prorated Linode/n8n at ~$0.875 NZD for shared early-user instance). Supabase/Netlify remain free.

**Key Assumptions**:

- **Usage**: Full included minutes (conservative; real avg. ~75% boosts margins 10-20%).
- **Revenue**: Gross plan price (pre-GST; assumes you remit 15% GST separately). Net after Stripe.
- **Exclusions**: Support labor, marketing, annual discounts (15% off). At scale (50+ users), add ~$1-2 NZD/user/mo for Supabase/Netlify Pro.
- **Exchange**: 1 USD ≈ 1.75 NZD (Nov 2025).
- **Focus**: Launch with Starter/Basic for 75%+ margins. Pause Pro (low 4% margin). Update Essentials below for profitability.

## Base Profit Table (Default Voices)

| Plan Tier                 | Gross Revenue (NZD/mo) | Stripe Fee (NZD) | Net Revenue (NZD/mo) | Variable Cost (NZD, at included mins) | Fixed Cost (NZD/mo) | Total Cost (NZD/mo) | Profit (NZD/mo) | Profit Margin (%) |
| ------------------------- | ---------------------- | ---------------- | -------------------- | ------------------------------------- | ------------------- | ------------------- | --------------- | ----------------- |
| **Starter** (50 mins)     | $99                    | $3.17            | $95.83               | $15.00 (50 × $0.30)                   | $4.03               | $19.03              | $76.80          | 78%               |
| **Basic** (100 mins)      | $173                   | $5.32            | $167.68              | $30.00 (100 × $0.30)                  | $4.03               | $34.03              | $133.65         | 77%               |
| **Essentials** (400 mins) | $346                   | $10.33           | $335.67              | $120.00 (400 × $0.30)                 | $4.03               | $124.03             | $211.64         | 61%               |
| **Pro** (2,000 mins)      | $650                   | $19.15           | $630.85              | $600.00 (2,000 × $0.30)               | $4.03               | $604.03             | $26.82          | 4%                |

**Insights**:

- **Starter/Basic**: Highly profitable ($75-135/user/mo)—ideal for SMB acquisition. At 10 Basic users: ~$1,337/mo net profit.
- **Essentials**: Profitable but compressed (61% at full use). Avg. 200-300 mins usage: $250-280 profit (70-80%).
- **Pro**: Marginal—pause for now; revisit with Vapi/Twilio volume discounts (20% off at 10k+ mins).
- **Break-Even**: Starter ~63 mins; Basic ~113 mins; Essentials ~413 mins; Pro ~2,013 mins. All cover fixed/Stripe at low usage.

## Premium Voices Add-On (e.g., ElevenLabs)

Premium TTS like ElevenLabs increases variable cost to **$0.4625 NZD/min** (+$0.1625/min for TTS; total var $0.4625). This hits profits 7-12% without mitigation. **Recommendation**: Add a **fixed $25 NZD/mo add-on fee** per plan (unlimited premium for included mins; simple to implement via Stripe). Covers avg. usage (e.g., Basic 100 mins: $16.25 extra cost → +$8.75 profit buffer) and encourages upsell. Gate to dashboard toggle; track via n8n (log TTS provider to Supabase).

| Metric (Basic Plan Example, 100 mins) | Default Voice | Premium Voice (No Fee) | Premium Voice (+$25 Add-On)            |
| ------------------------------------- | ------------- | ---------------------- | -------------------------------------- |
| **Net Revenue**                       | $167.68       | $167.68                | $192.68 (after $5.72 Stripe on add-on) |
| **Var Cost**                          | $30.00        | $46.25 (100 × $0.4625) | $46.25                                 |
| **Fixed Cost**                        | $4.03         | $4.03                  | $4.03                                  |
| **Total Cost**                        | $34.03        | $50.28                 | $50.28                                 |
| **Profit**                            | $133.65       | $117.40                | $142.40                                |
| **Margin %**                          | 77%           | 65%                    | 72%                                    |
| **Profit Delta**                      | -             | -$16.25                | +$8.75 (vs. default)                   |

**Scaled Impact**: For 10 Basic users with premium: +$250/mo revenue from add-ons, offsetting $162.50 extra costs → net +$87.50 profit boost. Overages: Charge +$0.20/min premium (ensures +$0.0375/min margin).

## Overage Margins

Positive for low tiers; tighten higher. Adjust for premium (+$0.20/min extra).

| Plan Tier      | Overage Revenue (NZD/min) | Default Cost (NZD/min) | Default Margin (NZD/min) | Premium Margin (w/ +$0.20 Fee) |
| -------------- | ------------------------- | ---------------------- | ------------------------ | ------------------------------ |
| **Starter**    | $0.40                     | $0.30                  | +$0.10 (33%)             | +$0.3375 (73%)                 |
| **Basic**      | $0.35                     | $0.30                  | +$0.05 (17%)             | +$0.2875 (62%)                 |
| **Essentials** | $0.26                     | $0.30                  | -$0.04 (-15%)            | +$0.1575 (54%)                 |

## Recommendations

- **Launch Strategy**: Start with Starter/Basic (75%+ margins). Promote via NZ SMBs (e.g., BusinessNZ). Use n8n for usage tracking (Vapi/Twilio webhooks → Supabase `usage_logs` → Stripe overage invoices).
- **Essentials Update for Profitability**: Revise to **$299 NZD/mo for 250 mins** (reduces var cost to $75; net rev ~$290 after Stripe). Overage $0.35/min. **Profit: $210.97** (73% margin at full use)—aligns with Basic appeal, adds team features (unlimited concurrency, 5 seats). Test A/B on Netlify landing. Avg. 150 mins: $240 profit (80%).

  | Revised Essentials       | Gross Revenue (NZD/mo) | Net Revenue (NZD/mo) | Total Cost (NZD/mo, 250 mins) | Profit (NZD/mo) | Margin (%) |
  | ------------------------ | ---------------------- | -------------------- | ----------------------------- | --------------- | ---------- |
  | **Essentials (Tweaked)** | $299                   | $290.00              | $79.03                        | $210.97         | 73%        |

- **General Tips**: Audit Vapi stack quarterly (e.g., cheaper TTS like PlayHT $0.08 USD/min drops var to $0.25 NZD/min → +$20-80/tier). Monitor 1-3 months via Supabase queries. Target 70% overall margins; premium add-on boosts to 75%+.

_Sources: Twilio/ElevenLabs/Vapi pricing from official sites (Nov 2025); Stripe NZ rates._
