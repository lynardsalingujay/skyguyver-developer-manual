# Outbound Lead Calling System

## Executive Summary

**Project Name**: SkyGuyver Outbound  
**Concept**: AI voice assistant for automated outbound lead calling and prospect qualification  
**Value Proposition**: Help businesses scale their sales outreach with intelligent, conversational AI that can call leads, qualify prospects, and book appointments automatically.

## Overview

While SkyGuyver's core service handles incoming calls, this new service would flip the script - proactively calling potential customers on behalf of businesses. The AI would conduct natural conversations to qualify leads, gather information, and schedule follow-ups or appointments.

## Target Market

### Primary Targets

- **Financial Advisers** - Insurance lead calling, client follow-ups, appointment setting
- **Real Estate Agents** - Calling property leads, scheduling viewings
- **Insurance Brokers** - Following up on quotes, qualification calls
- **B2B Sales Teams** - Lead qualification and appointment setting
- **Service Businesses** - Following up on inquiries, booking consultations
- **Recruitment Agencies** - Initial candidate screening calls

### Market Size

- Small to medium businesses with 10-500 leads per month
- Sales teams spending 2-4 hours daily on manual calling
- New Zealand market initially, expand to Australia/UK

## Target Market Deep Dive

### Financial Advisers in New Zealand

**Market Opportunity**: NZ has ~3,000 registered financial advisers, many handling insurance leads manually

**Typical Use Cases:**

- Following up on insurance quote requests
- Qualifying leads for life/health/income protection insurance
- Scheduling consultation appointments
- Re-engaging lapsed policy inquiries
- Following up on referrals

**Compliance Requirements for Financial Advisers**

Financial advice is heavily regulated in NZ. AI outbound calling for financial advisers requires strict adherence to:

#### Legal & Regulatory Framework

1. **Clear Consent**: Obtain explicit consent before calling leads with AI voice agent
2. **Mandatory Disclosure**: At call start, clearly state:
   - Adviser name and business
   - That this is an AI voice (if choosing to disclose)
   - Purpose of the call
   - How to opt out or end the call
3. **Script Approval**: All conversation scripts must be compliance-reviewed
4. **Appropriate Hours**: Call only during business hours, avoid public holidays
5. **Record Keeping**: Maintain detailed logs of all calls and consent status

#### Operational Best Practices

- **Human Backup**: Warm transfer option to licensed adviser for complex questions
- **Telecom Compliance**: Ensure phone provider allows automated outbound calls
- **Complaint Monitoring**: Immediate opt-out respect and complaint handling
- **Script Boundaries**: Prevent AI improvisation beyond approved scripts
- **Legal Review**: Seek compliance advice for large-scale or cold outreach campaigns

#### Risk Mitigation

- **No Financial Advice**: AI only qualifies and books appointments, never gives advice
- **Disclaimer Requirements**: Include appropriate regulatory disclaimers
- **Consent Documentation**: Maintain evidence of lead opt-ins
- **Quality Monitoring**: Regular review of AI conversations for compliance
- **Professional Indemnity**: Ensure insurance covers AI-assisted activities

**Implementation for Financial Advisers:**

- Custom compliance-approved scripts
- Built-in regulatory disclaimers
- Automatic call logging for audit purposes
- Integration with CRM systems (Midwinter, Xplan)
- Warm transfer capabilities to licensed advisers

### Primary Target Client: AIL NZ Financial Advisers

**Company Profile**: AIL NZ (American Income Life New Zealand)

- Specializes in life and health insurance for union members
- Advisers have pre-consented leads from union partnerships
- Focus on scheduled calling rather than cold outreach
- Need efficient lead follow-up system

**Use Case Scenario:**

1. **Morning Preparation**: Adviser inputs leads into dashboard

   - Name and phone number
   - Preferred call time (lunch 12:30pm, evening 7pm, etc.)
   - Union affiliation and specific needs
   - **Available appointment slots** (2-3 options the adviser has free)
   - Any special notes or context

2. **Scheduled Execution**: AI calls at exact scheduled time

   - Professional introduction mentioning union partnership
   - Insurance needs assessment conversation
   - **Offers specific appointment times** from adviser's available slots
   - **Fallback option**: If no times suit, offers to SMS booking calendar link
   - Immediate notification to adviser with results

3. **Lead Qualification Process**:
   - Confirm union membership and insurance interest
   - Assess current coverage gaps
   - Determine urgency and priority level
   - **Offer 2-3 specific appointment times** from adviser's schedule
   - **If times don't work**: Offer to SMS booking calendar link
   - Document preferences and appointment outcome

**AIL NZ Specific Benefits:**

- **Pre-Consented Leads**: No cold calling compliance issues
- **Union Context**: Leverage existing trust relationship
- **Scheduled Flexibility**: Calls at optimal times for working union members
- **Efficiency Gains**: Advisers focus on qualified appointments only
- **Compliance Ready**: Built-in insurance industry disclaimers
- **Integration Potential**: Connect with AIL NZ systems

**Workflow for AIL NZ Advisers:**

```
Morning: Input leads + call times + available appointment slots →
AI calls throughout day → Offers specific times or SMS calendar link →
Evening: Review booked appointments + prepare for meetings
```

**Revenue Opportunity:**

- **AIL NZ has ~50+ advisers** across New Zealand
- **Average 20-30 leads per adviser per week**
- **Potential market**: 1,000-1,500 calls per week across all advisers
- **Setup fee potential**: $7,500 (50 advisers × $150)
- **Monthly credit volume**: $10,000-15,000 in call credits

## Technical Architecture

### Core Components

```
Lead Management System → AI Caller → Vapi.ai → Call Results → CRM Integration
```

### Technology Stack

- **Voice AI**: Vapi.ai (same as incoming service)
- **Telephony**: Twilio for outbound calling
- **Lead Management**: Supabase database
- **Workflow Engine**: n8n for call orchestration
- **AI Engine**: OpenAI/Claude for conversation logic
- **Frontend**: React dashboard for lead management

### Key Features

1. **Lead Import** - CSV upload, CRM integration, manual entry
2. **Call Scheduling** - Timezone awareness, optimal calling times
3. **Custom System Prompts** - Clients create their own conversation scripts
4. **Call Duration Controls** - Client-configurable time limits (e.g., 10 min max)
5. **Credit Management** - Prepaid credit system with real-time balance tracking
6. **Real-Time Cost Calculation** - Actual Vapi.ai costs calculated per call
7. **Automatic Credit Deduction** - Costs deducted immediately after call ends
8. **Transparent Billing** - Show exact cost breakdown for each call
9. **Lead Qualification** - Intelligent questioning based on custom prompts
10. **Appointment Booking** - Calendar integration (Google, Outlook)
11. **Call Analytics** - Success rates, conversation analysis, cost tracking
12. **Follow-up Automation** - Email, SMS, or callback scheduling

#### Compliance Features (Financial Advisers)

13. **Consent Management** - Track and verify lead consent before calling
14. **Mandatory Disclosures** - Automatic compliance statements at call start
15. **Script Approval Workflow** - Compliance team review before AI deployment
16. **Audit Trail** - Complete call logs for regulatory compliance
17. **Warm Transfer** - Seamless handoff to licensed adviser when needed
18. **Opt-Out Management** - Immediate opt-out processing and documentation
19. **Regulatory Disclaimers** - Automatic inclusion of required statements
20. **Call Recording Metadata** - Compliance-ready call documentation

#### AIL NZ Specific Features

21. **Scheduled Lead Input** - Morning preparation dashboard for advisers
22. **Precise Time Scheduling** - Call at exact specified times (12:30pm, 7pm, etc.)
23. **Appointment Slot Management** - Input 2-3 available appointment times per lead
24. **Smart Booking Flow** - Offer specific times or fallback to SMS calendar link
25. **Union Context Integration** - Leverage union partnership in conversations
26. **Pre-Consented Lead Management** - Track union member permissions
27. **Insurance Needs Assessment** - Life and health insurance specific qualification
28. **Working Hours Optimization** - Schedule around union member work schedules
29. **Real-Time Results Notification** - Immediate SMS/email to adviser with outcomes
30. **Bulk Lead Processing** - Handle multiple leads per adviser efficiently

## Business Model

### Credit-Based Pricing Strategy

**Why Credit-Based for Outbound:**

- Lead calling campaigns are sporadic and seasonal
- Sales teams prefer prepaid credits for budget control
- Actual call costs vary based on conversation length and complexity
- Transparent pricing based on real Vapi.ai costs plus margin

### Pricing Structure (NZD, incl. GST)

#### Credit System

**How it Works:**

1. **Prepay Credits**: Clients purchase credit packages (e.g., $50, $100, $500)
2. **Real-Time Deduction**: Each call's actual cost is deducted from credit balance
3. **Transparent Costs**: Vapi.ai cost + margin shown for each call
4. **Duration-Based**: Longer conversations cost more, shorter ones cost less
5. **Client Control**: Set maximum call duration to limit costs per call

**Cost Calculation:**

- **Base Formula**: Vapi.ai actual cost × 2.5 markup = client charge
- **Example**: 5-minute call costs $1.40 from Vapi → Client charged $3.50
- **Real-Time Tracking**: Costs calculated and deducted immediately after call ends

#### Credit Packages

| Package Size | Credit Amount | Bonus Credits | Effective Discount |
| ------------ | ------------- | ------------- | ------------------ |
| Starter      | $50           | $0            | 0%                 |
| Standard     | $100          | $10           | 10%                |
| Professional | $250          | $37.50        | 15%                |
| Enterprise   | $500          | $100          | 20%                |

#### Setup Fees (One-time)

**Standard Setup Package: $150 NZD**

**Includes:**

- **Dedicated NZ Phone Number**: $3.50/month (first month included)
- **n8n Workflow Configuration**: Custom outbound calling automation
- **Vapi.ai Voice Assistant Setup**: AI configuration and training
- **System Integration**: CRM connections and webhook setup
- **Initial Script Development**: 1 custom conversation template
- **Dashboard Access**: Credit management and call analytics
- **Onboarding & Training**: 1-hour setup consultation

**What Covers Our Costs:**

- Linode server maintenance: $19.80/month
- Netlify hosting: $25.00/month
- Twilio phone number: $3.50/month
- Development and support time
- Ongoing system maintenance

**Optional Upgrades:**

- **Additional Phone Numbers**: $5/month each (includes markup)
- **Premium Voice Selection**: $25 one-time
- **Multiple Script Templates**: $50 per additional script
- **Advanced CRM Integration**: $100 (Midwinter, Xplan, custom APIs)
- **Compliance Package** (Financial Advisers): $200 (includes legal review)

#### Additional Services (Optional)

- **Premium AI Voices**: +$0.50 per call
- **CRM Integration**: +$0.25 per call
- **Advanced Analytics**: +$0.30 per call
- **Priority Support**: $99/month flat fee

### Revenue Streams

- **Setup Fees** - One-time $150 setup fee per client
- **Credit Sales** - Primary revenue from prepaid credit packages
- **Markup on Call Costs** - 2.5x markup on actual Vapi.ai costs
- **Credit Package Bonuses** - Incentivize larger purchases with bonus credits
- **Monthly Services** - Phone numbers, premium features, support
- **Premium Add-ons** - Enhanced features for additional per-call fees

### Unit Economics

**Setup Revenue:**

- **Setup Fee**: $150 per client
- **Setup Costs**: ~$50 (development time, phone number setup)
- **Setup Margin**: $100 (67% margin)

**Call Cost Examples:**

- **Short Call (2 min)**: Vapi cost $0.80 → Client charged $2.00 (150% margin)
- **Medium Call (5 min)**: Vapi cost $1.40 → Client charged $3.50 (150% margin)
- **Long Call (10 min)**: Vapi cost $2.20 → Client charged $5.50 (150% margin)

**Business Metrics:**

- **Call Margin**: 150% (2.5x markup)
- **Customer Acquisition Cost**: $100 NZD (reduced due to setup fee covering onboarding)
- **Average First Purchase**: $250 ($150 setup + $100 credits)
- **Immediate ROI**: Setup fee covers CAC + profit
- **Payback Period**: Immediate (setup fee) + ongoing credit revenue

### Revenue Projections (Credit-Based Model)

#### Year 1 Targets

- **Active Clients**: 30 businesses
- **Average Credit Purchase/Client/Month**: $150 NZD
- **Average Calls/Client/Month**: 50-75 calls (varies by duration)
- **Monthly Credit Sales**: $4,500 NZD
- **Annual Revenue**: $54,000 NZD
- **Average Call Cost to Client**: $2.00 - $5.50 (based on duration)

#### Growth Projections

- **Year 2**: 75 clients, $135,000 annual revenue
- **Year 3**: 150 clients, $270,000 annual revenue

## Competitive Analysis

### Direct Competitors

- **Outreach.io** - Email/phone sequences (enterprise focus)
- **SalesLoft** - Sales engagement platform
- **Local calling services** - Manual calling with human agents

### Competitive Advantages

- **Pay-As-You-Go Model** - No monthly commitments unlike subscription competitors
- **Performance-Based Pricing** - Only pay for completed calls, not attempts
- **AI-First Approach** - More natural conversations than robocalls
- **New Zealand Focus** - Localized for NZ business practices
- **Risk-Free Trial** - Start with small batches, scale based on results
- **Seasonal Flexibility** - Perfect for businesses with campaign-based calling
- **Easy Setup** - No complex integrations required
- **Conversation Quality** - Vapi.ai's advanced voice capabilities

## Sales & Go-to-Market Strategy

### Pricing Justification

**2.5x Markup Analysis for NZ Market:**

#### Market Comparisons

- **Traditional Call Centers**: 5-10x markup (human agents $25-50/hour)
- **Marketing Agencies**: 3-5x markup on services
- **Software Services**: 2-4x markup is standard
- **Telemarketing Services**: 4-8x markup for human callers
- **Our AI Solution**: 2.5x markup = competitive advantage

#### Value Justification

- **Technology Integration**: Complete solution, not just calls
- **Compliance Management**: Critical for regulated industries
- **24/7 Availability**: AI doesn't sleep or take breaks
- **Consistency**: Every call follows the same high standard
- **Scalability**: Handle volume spikes instantly

**Conclusion**: 2.5x markup is conservative and highly justifiable. Could support 3-4x for specialized industries.

### Core Value Propositions

#### 1. Time Liberation

- **Current Reality**: "You're spending 3-4 hours daily on repetitive qualification calls"
- **AI Solution**: "Our AI handles initial screening, you only speak to pre-qualified prospects"
- **Time Savings**: "Get back 20+ hours per week to focus on closing deals"

#### 2. Consistency at Scale

- **Human Limitation**: "Your energy drops, your pitch varies, you have bad days"
- **AI Advantage**: "Every call delivers your perfect pitch with consistent energy"
- **Result**: "Higher conversion rates because every prospect gets your A-game"

#### 3. Cost Efficiency

- **Traditional Cost**: "Hiring a caller costs $50,000+ annually plus training"
- **AI Cost**: "Same results for under $2,000 annually in call credits"
- **ROI**: "If you close just 2 extra deals per month, this pays for itself"

#### 4. Opportunity Capture

- **Lost Leads**: "How many leads go cold while you're busy with other calls?"
- **AI Speed**: "Strike while leads are hot - AI calls within minutes of inquiry"
- **Competition**: "While competitors take days to follow up, you're already booking appointments"

### Sales Scripts by Industry

#### Financial Advisers Script

_"Sarah, as a financial adviser, you know time is money. Right now, you're spending hours calling insurance leads who may not even qualify. What if you could have perfectly compliant conversations with every lead, automatically booking only the qualified ones into your calendar? You'd go from 20 calls to get 2 appointments, to 10 calls getting 6 appointments. That's triple your conversion rate while halving your time investment."_

#### AIL NZ Specific Script

_"John, I know as an AIL NZ adviser you're already doing great work with union members. But here's the thing - you're probably spending your mornings calling leads when you could be preparing for appointments, right? What if every morning you could just input your union member leads with their preferred call times and your available appointment slots, then have professional, compliant conversations happen automatically throughout the day? The AI would offer your specific available times to each prospect, and if none work, it can even SMS them your booking calendar link. By evening, you'd have a list of confirmed appointments in your diary. Your union members get called at convenient times - lunch break, after work - and you only spend time on the ones who are genuinely ready to meet. Imagine turning 30 union leads into 15 solid booked appointments instead of spending all day calling to get 5 maybes."_

#### Real Estate Agents Script

_"Mark, you're amazing at showing properties and closing deals. But you're also spending hours calling cold property leads, right? What if an AI could call 100 leads for you, have natural conversations about their needs, and only book the serious buyers into your calendar? You'd go from spending afternoons on the phone to showing up at appointments with pre-qualified buyers ready to make decisions."_

### Sample AIL NZ Conversation Flow

**AI:** "Hi Sarah, this is Emma calling on behalf of David from AIL Financial Services. I understand through your union contact that you expressed interest in reviewing your life insurance options. Is this still a convenient time for a quick chat?"

**Prospect:** "Oh yes, I did mention that. Is this a good time... yes, I have a few minutes."

**AI:** "Perfect! David specializes in helping union members like yourself ensure their families are properly protected. Can I ask what prompted you to look into life insurance at this time?"

**Prospect:** "Well, my partner and I just bought our first house, and I realized we don't have much coverage if something happens to me."

**AI:** "That's very responsible thinking, especially with a new mortgage. David would love to sit down with you and review your specific needs and the union member benefits you're entitled to. I have his calendar here - would Tuesday at 6:30pm work for you, or would Thursday at 7:00pm suit better?"

**Prospect:** "Hmm, Tuesday evenings are tricky with the kids... Thursday might work but let me check."

**AI:** "No worries at all. If those times don't work, I can send you a link to David's full calendar via text message and you can pick any time that suits your schedule. Would that be helpful?"

**Prospect:** "Yes, that would be perfect actually. My schedule is pretty unpredictable."

**AI:** "Excellent! I'll send that calendar link to this number right now. David will call you at your chosen time to discuss your life insurance options and those special union member rates. You should receive the text within the next minute."

### Objection Handling

#### "Will prospects know it's AI?"

_"That's entirely up to you. Many clients choose to disclose it upfront - 'Hi, this is an AI assistant calling on behalf of John at ABC Financial.' Prospects actually appreciate the honesty and efficiency. But the technology is so natural, most can't tell the difference."_

#### "What about complex questions?"

_"That's the beauty of our system. When prospects ask complex questions, the AI seamlessly transfers them to you with complete context. You're not starting from scratch - you know exactly what they've already discussed."_

#### "Is it too expensive?"

_"Let's do the math. If you make 100 calls monthly at minimum wage value ($23/hour), that's $460 in your time. Our AI does the same 100 calls for under $350, works 24/7, never gets tired, and has perfect consistency. Plus, you get higher conversion rates. It's actually costing you money NOT to use it."_

### Closing Techniques

#### Trial Close

_"How many extra qualified appointments per week would make this worthwhile for you?"_

#### Urgency Close

_"I'm only taking on 25 clients in our beta launch. After that, there's a waiting list. Would you like to secure your spot with the $150 setup, or shall I put you on the waiting list?"_

#### ROI Close

_"If this system helps you close just one extra $5,000 commission per month, you've paid for the entire year in month one. Everything after that is pure profit. When can we get you started?"_

### Before vs After Positioning

**Before AI:**

- 4 hours calling → 2 appointments → 1 client
- Inconsistent messaging
- Tired voice by call #20
- Leads go cold waiting for follow-up

**After AI:**

- 30 minutes reviewing → 6 appointments → 3 clients
- Perfect pitch every time
- 24/7 lead engagement
- Immediate follow-up on all inquiries

## Implementation Roadmap

### Phase 1: MVP (Months 1-3)

- Basic lead management system
- Simple outbound calling with Vapi.ai
- **PAYG billing system** with per-call pricing
- Call duration tracking and pricing logic
- **Payment processing integration** (Stripe)
- Standard qualification script templates
- Call logging and basic reporting
- Manual appointment booking

### Phase 2: Enhanced Features (Months 4-6)

- **Volume discount automation** (10%, 15%, 20% tiers)
- **Premium add-on billing** (voices, CRM, analytics)
- Calendar integration for automatic booking
- Custom script builder
- CRM integrations (HubSpot, Pipedrive)
- Advanced analytics dashboard
- A/B testing for scripts

### Phase 3: Scale & Polish (Months 7-12)

- **Prepaid credit packages** with bonuses
- **Enterprise annual contracts** for guaranteed capacity
- White-label options
- API for third-party integrations
- Advanced AI conversation flows
- Multi-timezone calling optimization
- Enterprise features

## Technical Requirements

### New Database Tables

```sql
-- Lead management
leads
call_campaigns
call_attempts
call_outcomes
conversation_templates

-- Compliance & audit trail (especially for financial advisers)
consent_records
compliance_logs
script_approvals
opt_out_requests
call_recordings_metadata

-- Scheduling & follow-ups
call_schedules
appointment_bookings
follow_up_tasks
```

### API Integrations

- **Twilio** - Outbound calling
- **Google Calendar/Outlook** - Appointment booking
- **CRM APIs** - HubSpot, Pipedrive, Salesforce, **Midwinter, Xplan** (financial adviser CRMs)
- **Email/SMS** - Follow-up communications
- **Compliance APIs** - Consent management, audit logging

### Infrastructure Scaling

- Separate n8n workflows for outbound calling
- Queue management for high-volume calling
- Timezone handling for international leads
- Call result processing pipelines

## Risk Assessment

### Technical Risks

- **Call Quality** - Ensuring natural conversations
- **Compliance** - Do Not Call regulations
- **Scalability** - Managing high call volumes
- **Integration Complexity** - Multiple CRM connections

### Business Risks

- **Market Reception** - Acceptance of AI calling
- **Regulatory Changes** - Telemarketing law updates
- **Competition** - Large players entering market
- **Customer Acquisition** - Proving ROI to prospects

### Mitigation Strategies

- Start with warm leads only (existing inquiries)
- Strong compliance framework from day one
- Focus on conversation quality over quantity
- Clear ROI demonstration in pilot programs

## Success Metrics

### Key Performance Indicators

- **Monthly Recurring Revenue** - Primary business metric
- **Call Success Rate** - Percentage resulting in qualified leads
- **Customer Retention** - Monthly churn rate
- **Lead Conversion Rate** - Qualified leads to appointments
- **Cost per Acquisition** - Customer acquisition costs

### Technical Metrics

- **Call Connection Rate** - Successfully connected calls
- **Conversation Duration** - Average call length
- **AI Response Quality** - Conversation flow success
- **System Uptime** - Service reliability

## Personal Financial Analysis (Owner Take-Home Pay)

### AIL NZ Opportunity - Net Income Calculation

**Revenue Breakdown:**

- **Setup Fees**: $7,500 (50 advisers × $150) - One-time
- **Monthly Call Credits**: $12,500 average (mid-range of $10,000-15,000)
- **Annual Credit Revenue**: $150,000

**Monthly Operating Expenses:**

- **Vapi.ai Call Costs**: $5,000 (40% of credit sales)
- **Claude Pro**: $40
- **Linode Server**: $20
- **Netlify Pro**: $25
- **Twilio Numbers**: $10 (estimated 3 numbers)
- **Total Monthly Expenses**: $5,095

**Monthly Gross Profit:**

- **Credit Revenue**: $12,500
- **Less: Operating Expenses**: $5,095
- **Monthly Gross Profit**: $7,405

**Tax Considerations (NZ):**

- **Tax Rate**: 33% (high earner bracket for NZ$180,000+ annual)
- **Monthly Gross**: $7,405
- **Less: Tax (33%)**: $2,444
- **Monthly After-Tax**: $4,961

**Weekly Take-Home Pay:**

- **Weekly After-Tax**: $1,240 per week

**Annual Summary:**

- **Gross Annual Profit**: $88,860
- **After-Tax Annual**: $58,900
- **Weekly Take-Home**: $1,240

### Growth Scenarios

**Conservative (30 advisers):**

- Monthly Revenue: $9,000
- Monthly Profit: $5,405
- Weekly Take-Home: $900

**Optimistic (All 50+ advisers + expansion):**

- Monthly Revenue: $18,000
- Monthly Profit: $11,780
- Weekly Take-Home: $1,970

**Notes:**

- Excludes one-time setup fee of $7,500 (additional $5,025 after tax)
- Assumes 2.5x markup on Vapi.ai call costs
- Tax calculation at 33% bracket (conservative estimate)
- All figures in NZD

## Next Steps

### Immediate Actions (Next 30 Days)

1. **Market Validation** - Survey existing SkyGuyver customers
2. **Technical Proof of Concept** - Basic outbound calling with Vapi.ai
3. **Regulatory Research** - NZ telemarketing compliance requirements
4. **Cost Analysis** - Detailed unit economics modeling

### Short Term (Next 90 Days)

1. **MVP Development** - Build basic lead calling system
2. **Pilot Program** - Test with 3-5 friendly customers
3. **Feedback Integration** - Refine based on pilot results
4. **Go-to-Market Strategy** - Pricing and positioning

---

**Status**: Concept Phase  
**Last Updated**: November 5, 2025  
**Next Review**: December 5, 2025
