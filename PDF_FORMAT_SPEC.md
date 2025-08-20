# PDF Invoice Format Specification

## Professional A4 Invoice Layout Requirements

### Page Setup

- **Page Size**: A4 (210 × 297 mm)
- **Margins**: 20mm all around
- **Colors**: Black and white/grayscale only
- **Font**: Professional fonts (Arial, Times New Roman, or Helvetica)

### Header Section

```
┌─────────────────────────────────────────────────────┐
│                 SAND COMPANY INVOICE                │
│                                                     │
│  Company Logo (if any)    │    Invoice #: INV001    │
│  Sand Delivery Services   │    Date: DD/MM/YYYY     │
│  [Company Address]        │    Time: HH:MM AM/PM    │
│  Phone: +91 XXXXX XXXXX   │                         │
│  GST: XXXXXXXXXXXX        │                         │
└─────────────────────────────────────────────────────┘
```

### Customer Information

```
BILL TO:
────────────────────────────────────────
Customer Name: [Company Name]
Phone: [Phone Number]
GST Number: [GST Number]
Address: [Complete Billing Address]
```

### Invoice Details Table

```
┌─────┬─────────────┬────────┬─────────┬─────────────┬─────────────┐
│ S.  │ Description │ Trucks │ Rate/   │ Amount      │ Total       │
│ No. │             │ (Qty)  │ Ton (₹) │ (₹)         │ (₹)         │
├─────┼─────────────┼────────┼─────────┼─────────────┼─────────────┤
│  1  │ Sand        │   25   │ 1,500   │ 37,500      │ 37,500      │
│     │ Delivery    │        │         │             │             │
├─────┼─────────────┼────────┼─────────┼─────────────┼─────────────┤
│     │             │        │         │             │             │
│     │             │        │         │ Sub Total:  │ ₹37,500     │
│     │             │        │         │ GST (18%):  │ ₹6,750      │
│     │             │        │         │ TOTAL:      │ ₹44,250     │
└─────┴─────────────┴────────┴─────────┴─────────────┴─────────────┘
```

### Footer Section

```
Notes/Instructions: [Any additional notes]

Payment Terms: As per agreement
Due Date: Immediate

────────────────────────────────────────
Authorized Signature

Generated on: [Date & Time]
System: Sand Company Billing System
```

## Data Structure Expected from Frontend

```json
{
  "companyName": "ABC Construction Ltd",
  "companyPhone": "+91 98765 43210",
  "companyAddress": "123 Business Park, City, State - 400001",
  "companyGst": "22AAAAA0000A1Z5",
  "ratePerTon": 1500,
  "trucks": 25,
  "notes": "Urgent delivery required",
  "total": 37500,
  "invoiceNumber": "INV001",
  "createdAt": "2025-08-20T10:30:00.000Z"
}
```

## API Endpoint Requirements

### Generate PDF

- **Endpoint**: `GET /api/invoices/:id/pdf`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: PDF file with Content-Type: application/pdf
- **Filename**: `Invoice_[InvoiceNumber].pdf`

### Key Features Required

1. **Professional Layout**: Clean, business-ready format
2. **Indian Currency**: All amounts in ₹ with proper comma formatting
3. **Date/Time**: Indian format (DD/MM/YYYY, HH:MM AM/PM)
4. **Print Ready**: A4 size, proper margins
5. **Company Branding**: Space for logo and company details
6. **Table Format**: Clean rows and columns
7. **Legal Compliance**: GST details, terms, signature space

## Implementation Notes

- Use PDF libraries like PDFKit, jsPDF, or Puppeteer
- Ensure consistent formatting across different invoices
- Add proper page breaks for multiple items
- Include sequential numbering
- Make it printer-friendly (black/white, good contrast)
