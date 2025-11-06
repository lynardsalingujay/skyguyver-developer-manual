# PDF Viewing in Browser

VitePress supports viewing PDF files directly in the browser! Here's how it works:

## Direct PDF Links

When you upload PDF receipts to the documentation, they can be viewed directly in the browser through several methods:

### Method 1: Direct Link (Recommended)

```markdown
[View Twilio Receipt (PDF)](./2025/september/2025-09-19_Twilio_20.00NZD_PAYG-Credits.pdf)
```

### Method 2: Embedded PDF Viewer

```markdown
<iframe 
  src="./2025/september/2025-09-19_Twilio_20.00NZD_PAYG-Credits.pdf" 
  width="100%" 
  height="600px"
  style="border: 1px solid #ccc;">
</iframe>
```

### Method 3: PDF.js Integration (Advanced)

For better PDF viewing experience, you can use PDF.js:

```html
<iframe
  src="/pdfjs/web/viewer.html?file=../receipts/2025/september/2025-09-19_Twilio_20.00NZD_PAYG-Credits.pdf"
  width="100%"
  height="800px"
>
</iframe>
```

## Browser Compatibility

✅ **Chrome/Edge**: Native PDF viewer  
✅ **Firefox**: Built-in PDF.js viewer  
✅ **Safari**: Native PDF support  
✅ **Mobile**: Most modern mobile browsers support PDF viewing

## Security Considerations

Since your documentation is password-protected:

- ✅ PDFs inherit the same authentication
- ✅ Direct links require login
- ✅ No external access without credentials

## File Size Recommendations

- **Optimal**: Under 5MB per PDF
- **Maximum**: 10MB for good performance
- **Compression**: Use PDF compression for large receipts

## Setup Instructions

1. **Upload PDF** to the appropriate folder (e.g., `2025/september/`)
2. **Add link** to receipt-index.md
3. **Test viewing** after build
4. **Mobile check** - ensure responsive viewing

## Example Receipt Links

Once you upload your receipts, they'll appear like this:

- [📄 Twilio Receipt - Sept 19, 2025](./2025/september/2025-09-19_Twilio_20.00NZD_PAYG-Credits.pdf) _(Example - file not yet uploaded)_
- [📄 Vapi.ai Receipt - Oct 4, 2025](./2025/october/2025-10-04_Vapi_10.00NZD_Testing-Credits.pdf) _(Example - file not yet uploaded)_

## Fallback Options

If browser viewing doesn't work:

- **Download link** - Users can download and open locally
- **Image conversion** - Convert PDF to PNG/JPG for inline viewing
- **Text extraction** - Include key details in markdown format

---

**Pro Tip**: Modern browsers handle PDFs very well, so direct linking is usually the best approach for receipt viewing!
