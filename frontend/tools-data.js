// Single source of truth for every tool: functional config (used by the
// upload widget) + SEO content (used to generate each dedicated tool page).
// Edit this file, then re-run `node build/generate-pages.js` to regenerate
// the static pages in /tools AND the pre-rendered homepage grid.

const TOOL_ICONS = {
  merge: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 3v9a4 4 0 0 0 4 4h4M16 12l-3-3m3 3-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  split: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v6m0 0-8 6m8-6 8 6M4 21h4m-4 0v-4m0 4 5-5m11 5h-4m4 0v-4m0 4-5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rotate: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 1 1-3-6.7M21 3v5h-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  numbers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><text x="17" y="21" font-size="7" fill="currentColor">3</text></svg>',
  compress: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 4H4v5m16-5h-5m5 0v5M9 20H4v-5m16 5h-5m5 0v-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  watermark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v6c0 4.5 3.4 7.7 8 8 4.6-.3 8-3.5 8-8V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  wordpdf: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  jpg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.6" fill="currentColor"/><path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  ppt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="10.5" cy="11" r="2.6" stroke="currentColor" stroke-width="1.5"/></svg>',
  xls: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16" r="1.3" fill="currentColor"/></svg>',
  unlock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V7a4 4 0 0 1 7.5-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16" r="1.3" fill="currentColor"/></svg>',
};

const TOOL_ICON_BY_ID = {
  merge:'merge', split:'split', rotate:'rotate', numbers:'numbers', compress:'compress',
  watermark:'watermark', 'word-to-pdf':'wordpdf', 'ppt-to-pdf':'ppt', 'xls-to-pdf':'xls',
  'jpg-to-pdf':'jpg', 'pdf-to-word':'wordpdf', 'pdf-to-ppt':'ppt', 'pdf-to-xls':'xls', 'pdf-to-jpg':'jpg',
  protect:'lock', unlock:'unlock'
};

const TOOLS = [
  {
    id: 'merge', slug: 'merge-pdf', group: 'organize', cat: 'organize',
    title: 'Merge PDF', desc: 'Combine several files into a single PDF.',
    endpoint: '/merge', field: 'files', multiple: true, accept: '.pdf', resultName: 'merged.pdf',
    seoTitle: 'Merge PDF Files Online — Free & Private | PDF Chroma',
    seoDescription: 'Combine multiple PDF files into one document in seconds. No file size games, no watermark, no sign-up — processed on our own server, not a stranger\'s.',
    h1: 'Merge PDF files into one document',
    intro: 'Upload two or more PDFs and combine them into a single file, in the order you add them. Useful for stitching together scanned pages, combining reports, or assembling a single document from several sources.',
    steps: [
      'Click the upload area below and select two or more PDF files (or drag them in).',
      'Files are combined in the order you added them — remove and re-add a file to change its position.',
      'Click "Process & download" — the merged PDF downloads automatically.'
    ],
    faq: [
      { q: 'Is there a limit to how many files I can merge?', a: 'Up to 30 files per merge, each up to 50MB. That covers the vast majority of use cases; the limits exist to keep the server responsive for everyone.' },
      { q: 'Does merging reduce PDF quality?', a: 'No. Pages are copied exactly as they are — text stays sharp, images keep their original resolution.' },
      { q: 'Can I reorder pages after merging?', a: 'Not on this page, but you can use the Split PDF tool afterward to pull pages out and merge them again in a different order.' }
    ]
  },
  {
    id: 'split', slug: 'split-pdf', group: 'organize', cat: 'organize',
    title: 'Split PDF', desc: 'Pull out specific pages or split into separate files.',
    endpoint: '/split', field: 'file', multiple: false, accept: '.pdf', resultName: 'split_result',
    options: [{ name: 'ranges', label: 'Page ranges (e.g. 1-3,5,7-8) — leave blank for one file per page', type: 'text', placeholder: '1-3,5,7-8' }],
    seoTitle: 'Split PDF — Extract or Separate Pages Free | PDF Chroma',
    seoDescription: 'Split a PDF into separate files or pull out just the pages you need. Enter a page range or leave it blank to split every page individually.',
    h1: 'Split a PDF into separate files',
    intro: 'Pull specific pages out of a larger PDF, or break a document apart entirely. Enter one or more page ranges to extract exactly what you need, or leave the range field blank to get every page as its own file.',
    steps: [
      'Upload the PDF you want to split.',
      'Enter page ranges like "1-3,5,7-8" to pull out specific sections, or leave it blank to split every page separately.',
      'Click "Process & download" — you\'ll get either a single PDF or a zip of files, depending on how many ranges you entered.'
    ],
    faq: [
      { q: 'What happens if I don\'t enter a page range?', a: 'The tool splits every page of the document into its own individual PDF file, delivered as a zip.' },
      { q: 'Can I extract non-consecutive pages?', a: 'Yes — separate ranges with commas, e.g. "2,4,9-12" pulls out page 2, page 4, and pages 9 through 12 as separate files.' },
      { q: 'Will splitting affect the quality of my pages?', a: 'No, pages are extracted exactly as they appear in the original — no re-compression or quality loss.' }
    ]
  },
  {
    id: 'rotate', slug: 'rotate-pdf', group: 'organize', cat: 'organize',
    title: 'Rotate PDF', desc: 'Rotate every page, or just the ones you choose.',
    endpoint: '/rotate', field: 'file', multiple: false, accept: '.pdf', resultName: 'rotated.pdf',
    options: [
      { name: 'angle', label: 'Rotation angle', type: 'select', choices: [['90', '90°'], ['180', '180°'], ['270', '270°']] },
      { name: 'pages', label: 'Pages (all or 1,3,5)', type: 'text', default: 'all', placeholder: 'all' }
    ],
    seoTitle: 'Rotate PDF Pages Online — Free Tool | PDF Chroma',
    seoDescription: 'Fix sideways or upside-down PDF pages. Rotate the whole document or just specific pages by 90, 180, or 270 degrees.',
    h1: 'Rotate PDF pages',
    intro: 'Scanned a page sideways? Rotate the entire document, or target specific pages, by 90, 180, or 270 degrees — the fix takes seconds.',
    steps: [
      'Upload the PDF with pages that need rotating.',
      'Choose the rotation angle and whether it applies to all pages or specific ones (e.g. "1,3,5").',
      'Click "Process & download" to get the corrected file.'
    ],
    faq: [
      { q: 'Can different pages be rotated by different amounts in one pass?', a: 'Not in a single request — run the tool once per angle you need, targeting the specific pages each time.' },
      { q: 'Does rotating change the page size?', a: 'No, only the orientation changes; page dimensions stay the same.' },
      { q: 'How do I know which page numbers to target?', a: 'Page numbers refer to their position in the original document — page 1 is the first page, and so on.' }
    ]
  },
  {
    id: 'numbers', slug: 'add-page-numbers', group: 'organize', cat: 'organize',
    title: 'Add page numbers', desc: 'Stamp a page number at the bottom of every sheet.',
    endpoint: '/page-numbers', field: 'file', multiple: false, accept: '.pdf', resultName: 'numbered.pdf',
    seoTitle: 'Add Page Numbers to PDF Free | PDF Chroma',
    seoDescription: 'Stamp page numbers (e.g. "3 / 12") at the bottom of every page in your PDF, automatically, in one click.',
    h1: 'Add page numbers to a PDF',
    intro: 'Adds a small "current page / total pages" label to the bottom-center of every page — handy for printed handouts, contracts, or long reports.',
    steps: [
      'Upload the PDF you want numbered.',
      'Click "Process & download" — no extra settings needed.',
      'Every page gets a "page / total" label at the bottom.'
    ],
    faq: [
      { q: 'Can I change where the page number appears?', a: 'This tool places it bottom-center by default, which fits most documents without overlapping existing content.' },
      { q: 'Does it renumber if I later add or remove pages?', a: 'No — if you edit the PDF afterward, run this tool again on the updated file to refresh the numbering.' },
      { q: 'Will it overwrite numbers that are already in the document?', a: 'No, it adds a new number stamp; it doesn\'t detect or remove existing page numbers already printed on the page.' }
    ]
  },
  {
    id: 'compress', slug: 'compress-pdf', group: 'optimize', cat: 'optimize',
    title: 'Compress PDF', desc: 'Shrink the file size for easier sharing.',
    endpoint: '/compress', field: 'file', multiple: false, accept: '.pdf', resultName: 'compressed.pdf',
    options: [{ name: 'level', label: 'Compression level', type: 'select', choices: [['screen', 'Smallest file size'], ['ebook', 'Balanced (recommended)'], ['printer', 'High quality']] }],
    seoTitle: 'Compress PDF — Reduce File Size Free | PDF Chroma',
    seoDescription: 'Shrink large PDF files for email and uploads. Choose between maximum compression, balanced quality, or high quality output.',
    h1: 'Compress a PDF file',
    intro: 'Large PDFs bounce off email attachment limits and slow down uploads. Compress yours down to a fraction of the size, with a choice of how much quality to trade off.',
    steps: [
      'Upload the PDF you want to shrink.',
      'Pick a compression level: smallest file size, balanced, or high quality.',
      'Click "Process & download" to get the compressed file.'
    ],
    faq: [
      { q: 'How much smaller will my file get?', a: 'It depends heavily on content — PDFs full of high-resolution images shrink the most, while text-only PDFs are already small and may not shrink much further.' },
      { q: 'Will compression make my images blurry?', a: 'The "smallest file size" setting trades more visual quality for size; "high quality" keeps images closer to the original at a smaller size reduction.' },
      { q: 'Is compressed text still selectable and searchable?', a: 'Yes — compression only affects embedded images and internal file structure, never the actual text content.' }
    ]
  },
  {
    id: 'watermark', slug: 'watermark-pdf', group: 'security', cat: 'security',
    title: 'Add watermark', desc: 'Stamp a soft, diagonal text mark across every page.',
    endpoint: '/watermark', field: 'file', multiple: false, accept: '.pdf', resultName: 'watermarked.pdf',
    options: [
      { name: 'text', label: 'Watermark text', type: 'text', default: 'CONFIDENTIAL', placeholder: 'e.g. DRAFT COPY' },
      { name: 'opacity', label: 'Opacity', type: 'range', min: 0.05, max: 0.6, step: 0.05, default: 0.25 }
    ],
    seoTitle: 'Add a Watermark to PDF Free | PDF Chroma',
    seoDescription: 'Stamp a custom text watermark — like DRAFT or CONFIDENTIAL — diagonally across every page of your PDF, with adjustable opacity.',
    h1: 'Add a watermark to a PDF',
    intro: 'Mark a document as a draft, confidential, or sample copy with a diagonal text watermark across every page. Set your own text and how visible it should be.',
    steps: [
      'Upload the PDF you want to watermark.',
      'Type the watermark text and adjust the opacity slider.',
      'Click "Process & download" to get the watermarked file.'
    ],
    faq: [
      { q: 'Can I use my own logo instead of text?', a: 'This tool currently supports text watermarks only. Image/logo watermarking is on the roadmap — see the project README for how to extend it.' },
      { q: 'Can the watermark be removed later?', a: 'It becomes part of the page content, like any other stamped text — it isn\'t a removable "layer" in most PDF viewers.' },
      { q: 'Does the watermark appear on every page, including blank ones?', a: 'Yes, it\'s applied uniformly across every page in the document.' }
    ]
  },
  {
    id: 'word-to-pdf', slug: 'word-to-pdf', group: 'convert', cat: 'word',
    title: 'Word to PDF', desc: 'Turn a .docx file into a print-ready PDF.',
    endpoint: '/word-to-pdf', field: 'file', multiple: false, accept: '.doc,.docx', resultName: 'converted.pdf',
    seoTitle: 'Convert Word to PDF Online Free | PDF Chroma',
    seoDescription: 'Turn a .docx or .doc file into a PDF that looks the same everywhere, on any device. Fast, free, and processed privately.',
    h1: 'Convert Word to PDF',
    intro: 'Turn a Word document into a PDF that keeps its exact formatting no matter what device or app opens it — ideal for sending resumes, contracts, or reports.',
    steps: [
      'Upload your .doc or .docx file.',
      'Click "Process & download" — no settings needed.',
      'Your formatting, fonts, and layout are preserved in the output PDF.'
    ],
    faq: [
      { q: 'Will my fonts and formatting be preserved?', a: 'Yes — the conversion renders the document exactly as it would print, including fonts, spacing, and images.' },
      { q: 'Does it work with .doc as well as .docx?', a: 'Yes, both older .doc and modern .docx formats are supported.' },
      { q: 'What if my Word file has tracked changes or comments?', a: 'The output reflects how the document currently displays; for a clean PDF, accept or resolve tracked changes in Word first.' }
    ]
  },
  {
    id: 'ppt-to-pdf', slug: 'powerpoint-to-pdf', group: 'convert', cat: 'ppt',
    title: 'PowerPoint to PDF', desc: 'Convert .pptx slides into a PDF.',
    endpoint: '/powerpoint-to-pdf', field: 'file', multiple: false, accept: '.ppt,.pptx', resultName: 'converted.pdf',
    seoTitle: 'Convert PowerPoint to PDF Free | PDF Chroma',
    seoDescription: 'Turn a .pptx presentation into a PDF, one slide per page — great for sharing decks without needing PowerPoint installed.',
    h1: 'Convert PowerPoint to PDF',
    intro: 'Share a presentation with anyone, even if they don\'t have PowerPoint. Each slide becomes one page of a PDF, keeping layout, images, and text intact.',
    steps: [
      'Upload your .ppt or .pptx file.',
      'Click "Process & download".',
      'Each slide is rendered as one page in the resulting PDF.'
    ],
    faq: [
      { q: 'Do slide animations or transitions carry over?', a: 'No — a PDF is static, so each slide is captured as it would look printed, without animations or transition effects.' },
      { q: 'Are speaker notes included?', a: 'No, only the slide content itself is included, not the presenter notes.' },
      { q: 'Will embedded videos still play?', a: 'No, embedded video/audio won\'t play in a PDF — a placeholder image or the first frame may appear instead.' }
    ]
  },
  {
    id: 'xls-to-pdf', slug: 'excel-to-pdf', group: 'convert', cat: 'excel',
    title: 'Excel to PDF', desc: 'Convert .xlsx spreadsheets into a PDF.',
    endpoint: '/excel-to-pdf', field: 'file', multiple: false, accept: '.xls,.xlsx', resultName: 'converted.pdf',
    seoTitle: 'Convert Excel to PDF Online Free | PDF Chroma',
    seoDescription: 'Turn an .xlsx spreadsheet into a clean, printable PDF — perfect for sharing reports and data without giving away the editable file.',
    h1: 'Convert Excel to PDF',
    intro: 'Turn a spreadsheet into a fixed, shareable PDF — useful for invoices, reports, or any table you want to send without the recipient editing it.',
    steps: [
      'Upload your .xls or .xlsx file.',
      'Click "Process & download".',
      'Each sheet is rendered as pages in the output PDF, following your print area settings.'
    ],
    faq: [
      { q: 'Will all my sheets be included?', a: 'Yes, every sheet tab in the workbook is converted, in order.' },
      { q: 'What if my spreadsheet is wider than one printed page?', a: 'It follows the print area and page setup defined in the spreadsheet — set that up in Excel first if columns are getting cut off.' },
      { q: 'Do formulas convert to their calculated values?', a: 'Yes, the PDF shows the calculated results of formulas, not the formulas themselves.' }
    ]
  },
  {
    id: 'jpg-to-pdf', slug: 'jpg-to-pdf', group: 'convert', cat: 'image',
    title: 'JPG to PDF', desc: 'Stitch one or more images into a single PDF.',
    endpoint: '/jpg-to-pdf', field: 'files', multiple: true, accept: '.jpg,.jpeg,.png', resultName: 'images.pdf',
    seoTitle: 'Convert JPG to PDF Free — Combine Images | PDF Chroma',
    seoDescription: 'Turn one or more JPG or PNG images into a single PDF document, in the order you choose. Free, fast, no watermark.',
    h1: 'Convert JPG to PDF',
    intro: 'Combine one or more photos or scanned images into a single, easy-to-share PDF — ideal for turning phone scans of documents into a proper file.',
    steps: [
      'Upload one or more JPG or PNG images.',
      'Images become PDF pages in the order you add them.',
      'Click "Process & download" to get the combined PDF.'
    ],
    faq: [
      { q: 'Can I mix JPG and PNG files in one PDF?', a: 'Yes, both formats can be combined together in a single output document.' },
      { q: 'Does image quality get reduced?', a: 'Images are encoded at high quality (92%) to keep the file reasonably small without visibly degrading photos.' },
      { q: 'What page size do the images use?', a: 'Each PDF page matches that image\'s own dimensions, so no cropping or letterboxing happens.' }
    ]
  },
  {
    id: 'pdf-to-word', slug: 'pdf-to-word', group: 'convert', cat: 'word',
    title: 'PDF to Word', desc: 'Turn PDF text into an editable .docx document.',
    endpoint: '/pdf-to-word', field: 'file', multiple: false, accept: '.pdf', resultName: 'converted.docx',
    seoTitle: 'Convert PDF to Word Online Free | PDF Chroma',
    seoDescription: 'Turn a PDF into an editable Word document. Best results on regular text-based PDFs; free and processed privately.',
    h1: 'Convert PDF to Word',
    intro: 'Turn a PDF back into an editable .docx file so you can update text, fix typos, or reuse content without retyping everything.',
    steps: [
      'Upload the PDF you want to make editable.',
      'Click "Process & download".',
      'Open the resulting .docx file in Word or any compatible editor.'
    ],
    faq: [
      { q: 'Will the formatting look exactly the same in Word?', a: 'Close, but not always pixel-perfect — complex layouts (multi-column, heavy graphics) may need minor manual adjustment after conversion.' },
      { q: 'Does this work on scanned PDFs?', a: 'Not reliably — scanned (image-based) PDFs need OCR first, which isn\'t included in this conversion. Best results come from PDFs that already contain real text.' },
      { q: 'Are images in the PDF preserved?', a: 'Yes, embedded images carry over into the Word document along with the text.' }
    ]
  },
  {
    id: 'pdf-to-ppt', slug: 'pdf-to-powerpoint', group: 'convert', cat: 'ppt',
    title: 'PDF to PowerPoint', desc: 'Convert each page into a slide.',
    endpoint: '/pdf-to-powerpoint', field: 'file', multiple: false, accept: '.pdf', resultName: 'converted.pptx',
    seoTitle: 'Convert PDF to PowerPoint Free | PDF Chroma',
    seoDescription: 'Turn a PDF into an editable PowerPoint presentation, one slide per page. Free, fast, and processed on our own server.',
    h1: 'Convert PDF to PowerPoint',
    intro: 'Turn a PDF into an editable .pptx presentation, with each page becoming one slide — handy for reusing content from a PDF report or handout in a live presentation.',
    steps: [
      'Upload the PDF you want to convert.',
      'Click "Process & download".',
      'Each page becomes one slide in the resulting .pptx file.'
    ],
    faq: [
      { q: 'Will text be editable in the resulting slides?', a: 'Text-based PDFs generally convert to editable text boxes; heavily designed pages may convert as fixed images instead.' },
      { q: 'Does this work well for slide-deck-style PDFs?', a: 'Yes — PDFs that were originally exported from PowerPoint tend to convert back the most cleanly.' },
      { q: 'What about PDFs made from Word documents?', a: 'Those will still convert, but expect one slide per page rather than a naturally paced presentation layout.' }
    ]
  },
  {
    id: 'pdf-to-xls', slug: 'pdf-to-excel', group: 'convert', cat: 'excel',
    title: 'PDF to Excel', desc: 'Extract tables from a PDF into .xlsx.',
    endpoint: '/pdf-to-excel', field: 'file', multiple: false, accept: '.pdf', resultName: 'converted.xlsx',
    seoTitle: 'Convert PDF to Excel Online Free | PDF Chroma',
    seoDescription: 'Extract tables and data from a PDF into an editable Excel spreadsheet. Free, private, no watermark.',
    h1: 'Convert PDF to Excel',
    intro: 'Pull tabular data out of a PDF report or statement into an .xlsx spreadsheet you can filter, sort, and calculate with.',
    steps: [
      'Upload the PDF containing the data or tables you need.',
      'Click "Process & download".',
      'Open the resulting .xlsx file in Excel or Google Sheets.'
    ],
    faq: [
      { q: 'Does this work on any PDF, or just ones with tables?', a: 'It works best on PDFs with clear tables or grid-like layouts; free-flowing text paragraphs won\'t organize into rows and columns meaningfully.' },
      { q: 'Will merged cells or complex table formatting convert correctly?', a: 'Simple tables convert cleanly; highly complex or nested table layouts may need manual cleanup afterward.' },
      { q: 'Can I convert a scanned PDF invoice?', a: 'Not reliably — scanned documents need OCR first, which isn\'t part of this conversion.' }
    ]
  },
  {
    id: 'pdf-to-jpg', slug: 'pdf-to-jpg', group: 'convert', cat: 'image',
    title: 'PDF to JPG', desc: 'Convert each page into a high-quality image.',
    endpoint: '/pdf-to-jpg', field: 'file', multiple: false, accept: '.pdf', resultName: 'pdf-pages',
    seoTitle: 'Convert PDF to JPG Online Free | PDF Chroma',
    seoDescription: 'Turn every page of a PDF into a high-quality JPG image. Free, fast, one image per page, delivered as a zip for multi-page files.',
    h1: 'Convert PDF to JPG',
    intro: 'Turn each page of a PDF into a standalone JPG image — useful for pulling a single page out as a shareable picture, or preparing pages for a slideshow or website.',
    steps: [
      'Upload the PDF you want to convert.',
      'Click "Process & download".',
      'A single-page PDF downloads as one JPG; multi-page PDFs download as a zip of images.'
    ],
    faq: [
      { q: 'What resolution are the output images?', a: 'Pages are rendered at 150 DPI, a good balance between clarity and file size for screen viewing and most printing.' },
      { q: 'Can I get PNG instead of JPG?', a: 'This tool outputs JPG by default; PNG support can be added by extending the backend route — see the project README.' },
      { q: 'Will text stay sharp in the image?', a: 'Yes, at 150 DPI text remains clearly readable, though it\'s no longer selectable since it\'s now part of a flat image.' }
    ]
  },
  {
    id: 'protect', slug: 'protect-pdf', group: 'security', cat: 'security',
    title: 'Protect PDF', desc: 'Lock a PDF with a password so only people who know it can open it.',
    endpoint: '/protect', field: 'file', multiple: false, accept: '.pdf', resultName: 'protected.pdf',
    options: [{ name: 'password', label: 'Password', type: 'password', placeholder: 'Enter a password (min. 4 characters)' }],
    seoTitle: 'Password Protect a PDF Online Free | PDF Chroma',
    seoDescription: 'Add a password to a PDF so only people who know it can open the file. Free, private, 256-bit encryption, processed on our own server.',
    h1: 'Add a password to a PDF',
    intro: 'Lock a PDF with a password so it can only be opened by someone who knows it — useful for sending contracts, financial documents, or anything you don\'t want opened by the wrong person.',
    steps: [
      'Upload the PDF you want to protect.',
      'Type the password you want to require to open it.',
      'Click "Process & download" to get the password-protected file.'
    ],
    faq: [
      { q: 'What encryption does this use?', a: 'The file is encrypted with 256-bit AES — the current standard for PDF password protection — using the open-source qpdf library.' },
      { q: 'If I forget the password, can it be recovered?', a: 'No — that\'s the point of real encryption. There\'s no backdoor or recovery option, so store the password somewhere safe before sending the file.' },
      { q: 'Does this also stop someone from editing or printing the PDF?', a: 'This sets a password required just to open and view the file. Separate printing or editing restrictions aren\'t set by this tool.' }
    ]
  },
  {
    id: 'unlock', slug: 'unlock-pdf', group: 'security', cat: 'security',
    title: 'Unlock PDF', desc: 'Remove a password from a PDF you already know the password to.',
    endpoint: '/unlock', field: 'file', multiple: false, accept: '.pdf', resultName: 'unlocked.pdf',
    options: [{ name: 'password', label: 'Current password', type: 'password', placeholder: 'Enter the current password' }],
    seoTitle: 'Unlock a Password-Protected PDF Online Free | PDF Chroma',
    seoDescription: 'Remove a password from a PDF you already have the password for. Free, private, no software to install.',
    h1: 'Remove a password from a PDF',
    intro: 'If you have a password-protected PDF and know the password, this removes the protection so the file opens freely from then on.',
    steps: [
      'Upload the password-protected PDF.',
      'Enter the current password.',
      'Click "Process & download" to get an unlocked copy.'
    ],
    faq: [
      { q: 'Can this remove a password I don\'t know?', a: 'No — you need the correct password to unlock the file. This removes protection you already have access to; it isn\'t a password-cracking tool.' },
      { q: 'Is the original file changed?', a: 'No, a new unlocked copy is created — your original password-protected file is left untouched.' },
      { q: 'Why would I want to remove a password?', a: 'Common reasons: the document no longer contains sensitive information, you\'re archiving it internally, or re-entering a password every time has become inconvenient for a file you now only share internally.' }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TOOLS, TOOL_ICONS, TOOL_ICON_BY_ID };
}
