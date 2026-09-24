// Extra "Good to know" tips shown on each tool page, keyed by tool id.
// Build-time only: baked into the static HTML by build/generate-pages.js,
// never shipped to the browser. Edit here, then re-run the generator.

const TOOL_TIPS = {
  'merge': [
    'The order you add files in is the order they appear in the result, so add them in final reading order rather than reordering afterward.',
    'If a scanned file comes in rotated, fix it with the Rotate tool first and then merge - correcting it later means splitting the merged file apart again.'
  ],
  'split': [
    'Page ranges are inclusive: "2-5" keeps pages 2, 3, 4 and 5. You can mix single pages and ranges, like "1,4-6,9".',
    'Leaving the range field blank gives you every page as its own separate PDF - handy for breaking a scanned batch into individual documents.'
  ],
  'rotate': [
    'Rotation happens in 90-degree steps. Use 180 to flip an upside-down page, or 90 and 270 for sideways scans depending on which way the page is lying.',
    'Target specific pages (like "1,3,5") when only some pages were scanned sideways - there is no need to rotate the whole document.'
  ],
  'numbers': [
    'Numbers are drawn on top of the existing content near the bottom-center, so leave a little clear margin there if you are designing the document yourself.',
    'Add page numbers as the last step, after merging or reordering - numbering first and then rearranging pages leaves them out of sequence.'
  ],
  'compress': [
    'Most of a PDF\'s size comes from images, not text, so compression helps most on scan-heavy or photo-heavy files and barely changes a text-only document.',
    '"Screen" produces the smallest file at the lowest image quality, "ebook" is the balanced middle, and "printer" keeps quality high with more modest savings.'
  ],
  'watermark': [
    'A diagonal watermark is the hardest to crop out and stays readable across the whole page - a good choice for "DRAFT" or "CONFIDENTIAL" stamps.',
    'A watermark is visual only; it does not lock or restrict the file. To actually control who can open it, use the Protect PDF tool instead.'
  ],
  'word-to-pdf': [
    'Converting to PDF freezes the layout, so fonts and spacing look identical on every device - the main reason to send a PDF rather than the .docx itself.',
    'Stick to standard or embedded fonts in your Word file; unusual fonts can be substituted during conversion and shift the layout slightly.'
  ],
  'ppt-to-pdf': [
    'Each slide becomes one page exactly as it would print - animations, transitions and embedded video do not carry over into a static PDF.',
    'Speaker notes are not included in the output; only the slide content itself is exported.'
  ],
  'xls-to-pdf': [
    'Wide spreadsheets are the usual pain point - columns can spill off the page edge. Set the print area and page orientation in Excel first for a clean result.',
    'A PDF freezes the numbers as they are, which is exactly what you want for an invoice or report you do not want anyone editing.'
  ],
  'jpg-to-pdf': [
    'Multiple images become one multi-page PDF in the order you add them - a quick way to turn several phone photos of a document into a single file to send.',
    'For text-heavy scans, straighten and crop the photos first; the PDF preserves them as-is and will not fix a skewed or dark image.'
  ],
  'pdf-to-word': [
    'This works best on PDFs that already contain real, selectable text. Scanned image-only PDFs need OCR first, which this conversion does not perform.',
    'Complex layouts (multi-column, heavy graphics) may need small manual fixes in Word - plain text documents convert the most cleanly.'
  ],
  'pdf-to-ppt': [
    'Each PDF page becomes one slide as an image, so the result is a strong visual match but the text will not be individually editable like a slide built from scratch.',
    'Best for turning a report or poster into presentable slides quickly, not for recovering the original editable deck a PDF was exported from.'
  ],
  'pdf-to-xls': [
    'Conversion is clean on genuine tables with clear rows and columns; free-form text or merged, irregular layouts often come out messy.',
    'Always spot-check the numbers afterward - a stray column break in the PDF can shift values into the wrong cells.'
  ],
  'pdf-to-jpg': [
    'Each page becomes a separate JPG - useful for dropping a single page into a slide, a website, or a chat where a PDF would not preview.',
    'JPGs are images, not selectable text. If you need editable text back instead of a picture, use PDF to Word.'
  ],
  'protect': [
    'Choose a password you will remember - there is no recovery. If it is lost, the file cannot be opened by you or anyone else.',
    'This encrypts the file itself, so the password is required to open it in any PDF reader, not just on this site.'
  ],
  'unlock': [
    'This only works when you already know the password - it removes protection from a file you are allowed to open, it does not crack unknown passwords.',
    'Once unlocked, the file opens without a prompt anywhere, so re-protect it if you still need it kept private.'
  ]
};

module.exports = { TOOL_TIPS };
