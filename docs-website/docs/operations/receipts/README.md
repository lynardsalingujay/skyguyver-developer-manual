# Receipt Documentation

This directory contains receipts and transaction records for SkyGuyver business expenses. These documents are maintained for tax purposes and financial auditing.

## File Organization

### Structure

```
receipts/
├── README.md                 # This file
├── 2025/                    # Year-based folders
│   ├── september/           # Monthly subfolders
│   ├── october/
│   └── november/
└── receipt-index.md         # Master index of all receipts
```

### Naming Convention

Use the following format for receipt files:

```
YYYY-MM-DD_VENDOR_AMOUNT_PURPOSE.pdf
YYYY-MM-DD_VENDOR_AMOUNT_PURPOSE.png
YYYY-MM-DD_VENDOR_AMOUNT_PURPOSE.jpg
```

**Examples:**

- `2025-09-19_Twilio_20.00NZD_PAYG-Credits.pdf`
- `2025-10-04_Vapi_10.00NZD_Testing-Credits.png`

## Tax Documentation Guidelines

### Required Information

Each receipt should contain:

- ✅ Transaction date
- ✅ Vendor/Provider name
- ✅ Amount in NZD (or conversion rate if USD)
- ✅ Description of service/product
- ✅ Business purpose justification
- ✅ Payment method confirmation

### Business Expense Categories

For tax purposes, categorize expenses as:

- **Professional Services**: API credits, SaaS subscriptions
- **Office Expenses**: Software licenses, development tools
- **Communications**: Phone services, SMS credits
- **Research & Development**: Testing platforms, pilot programs

### Retention Period

- **New Zealand**: Keep records for 7 years minimum
- **Digital copies**: Acceptable for tax purposes
- **Original receipts**: Scan and store digitally for convenience

## Receipt Processing Workflow

1. **Immediate**: Save receipt (email/download/screenshot)
2. **Same day**: Rename file using naming convention
3. **Weekly**: Update receipt-index.md with entry
4. **Monthly**: Verify against expenses-and-costs.md
5. **Annually**: Backup entire receipts folder

## Security & Privacy

- 🔒 **Password Protection**: Website already has authentication
- 📁 **Local Backup**: Keep copies outside of git repository
- 🏦 **Banking Records**: Cross-reference with bank statements
- 💼 **Accountant Access**: Share documentation during tax season

## Integration with Expense Tracking

Each receipt should correspond to an entry in:

- [`expenses-and-costs.md`](../expenses-and-costs.md)
- Monthly financial summaries
- Annual tax preparation documents

---

**Created**: November 6, 2025  
**Purpose**: Tax compliance and business expense documentation  
**Compliance**: New Zealand business record-keeping requirements
