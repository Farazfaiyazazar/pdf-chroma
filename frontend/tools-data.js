// Single source of truth for every tool: functional config (used by the
// upload widget) + SEO content (used to generate each dedicated tool page).
// Edit this file, then re-run `node build/generate-pages.js` to regenerate
// the static pages in /tools AND the pre-rendered homepage grid.

const TOOL_ICONS = {
  merge: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M192,40v64a8,8,0,0,1-2.34,5.66L136,163.31v49.38l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,212.69V163.31L66.34,109.66A8,8,0,0,1,64,104V40a8,8,0,0,1,16,0v60.69l48,48,48-48V40a8,8,0,0,1,16,0Z"/></svg>',
  split: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M157.73,113.13A8,8,0,0,1,159.82,102L227.48,55.7a8,8,0,0,1,9,13.21l-67.67,46.3a7.92,7.92,0,0,1-4.51,1.4A8,8,0,0,1,157.73,113.13Zm80.87,85.09a8,8,0,0,1-11.12,2.08L136,137.7,93.49,166.78a36,36,0,1,1-9-13.19L121.83,128,84.44,102.41a35.86,35.86,0,1,1,9-13.19l143,97.87A8,8,0,0,1,238.6,198.22ZM80,180a20,20,0,1,0-5.86,14.14A19.85,19.85,0,0,0,80,180ZM74.14,90.13a20,20,0,1,0-28.28,0A19.85,19.85,0,0,0,74.14,90.13Z"/></svg>',
  rotate: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/></svg>',
  numbers: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.58,55.16,48,52.94V104a8,8,0,0,0,16,0V40a8,8,0,0,0-11.58-7.16l-16,8a8,8,0,0,0,7.16,14.32ZM79.77,156.72a23.73,23.73,0,0,0-9.6-15.95,24.86,24.86,0,0,0-34.11,4.7,23.63,23.63,0,0,0-3.57,6.46,8,8,0,1,0,15,5.47,7.84,7.84,0,0,1,1.18-2.13,8.76,8.76,0,0,1,12-1.59A7.91,7.91,0,0,1,63.93,159a7.64,7.64,0,0,1-1.57,5.78,1,1,0,0,0-.08.11L33.59,203.21A8,8,0,0,0,40,216H72a8,8,0,0,0,0-16H56l19.08-25.53A23.47,23.47,0,0,0,79.77,156.72Z"/></svg>',
  compress: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M144,104V64a8,8,0,0,1,16,0V84.69l42.34-42.35a8,8,0,0,1,11.32,11.32L171.31,96H192a8,8,0,0,1,0,16H152A8,8,0,0,1,144,104Zm-40,40H64a8,8,0,0,0,0,16H84.69L42.34,202.34a8,8,0,0,0,11.32,11.32L96,171.31V192a8,8,0,0,0,16,0V152A8,8,0,0,0,104,144Zm67.31,16H192a8,8,0,0,0,0-16H152a8,8,0,0,0-8,8v40a8,8,0,0,0,16,0V171.31l42.34,42.35a8,8,0,0,0,11.32-11.32ZM104,56a8,8,0,0,0-8,8V84.69L53.66,42.34A8,8,0,0,0,42.34,53.66L84.69,96H64a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V64A8,8,0,0,0,104,56Z"/></svg>',
  watermark: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224,224a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,224Zm0-80v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V144a16,16,0,0,1,16-16h56.43L88.72,54.71A32,32,0,0,1,120,16h16a32,32,0,0,1,31.29,38.71L151.57,128H208A16,16,0,0,1,224,144ZM120.79,128h14.42l16.43-76.65A16,16,0,0,0,136,32H120a16,16,0,0,0-15.65,19.35ZM208,184V144H48v40H208Z"/></svg>',
  wordpdf: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z"/></svg>',
  jpg: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M120,144H104a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm96,0v16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,192,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.38,29.38,0,0,1,16.48,5.12,8,8,0,0,1-9,13.26A13.21,13.21,0,0,0,192,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.63,13.63,0,0,0,8-2.71V192a8,8,0,0,1,0-16h8A8,8,0,0,1,216,184ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z"/></svg>',
  ppt: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M224,152a8,8,0,0,1-8,8H204v48a8,8,0,0,1-16,0V160H176a8,8,0,0,1,0-16h40A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm84,0a28,28,0,0,1-28,28h-8v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h16A28,28,0,0,1,160,172Zm-16,0a12,12,0,0,0-12-12h-8v24h8A12,12,0,0,0,144,172ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z"/></svg>',
  xls: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M156,208a8,8,0,0,1-8,8H120a8,8,0,0,1-8-8V152a8,8,0,0,1,16,0v48h20A8,8,0,0,1,156,208ZM92.65,145.49a8,8,0,0,0-11.16,1.86L68,166.24,54.51,147.35a8,8,0,1,0-13,9.3L58.17,180,41.49,203.35a8,8,0,0,0,13,9.3L68,193.76l13.49,18.89a8,8,0,0,0,13-9.3L77.83,180l16.68-23.35A8,8,0,0,0,92.65,145.49Zm98.94,25.82c-4-1.16-8.14-2.35-10.45-3.84-1.25-.82-1.23-1-1.12-1.9a4.54,4.54,0,0,1,2-3.67c4.6-3.12,15.34-1.72,19.82-.56a8,8,0,0,0,4.07-15.48c-2.11-.55-21-5.22-32.83,2.76a20.58,20.58,0,0,0-8.95,14.95c-2,15.88,13.65,20.41,23,23.11,12.06,3.49,13.12,4.92,12.78,7.59-.31,2.41-1.26,3.33-2.15,3.93-4.6,3.06-15.16,1.55-19.54.35A8,8,0,0,0,173.93,214a60.63,60.63,0,0,0,15.19,2c5.82,0,12.3-1,17.49-4.46a20.81,20.81,0,0,0,9.18-15.23C218,179,201.48,174.17,191.59,171.31ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,1,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.68L160,51.31Z"/></svg>',
  lock: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"/></svg>',
  unlock: '<svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"/></svg>',
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
    seoTitle: 'Merge PDF Files Online - Free & Private | PDF Chroma',
    seoDescription: 'Combine multiple PDF files into one document in seconds. No file size games, no watermark, no sign-up - processed on our own server, not a stranger\'s.',
    h1: 'Merge PDF files into one document',
    intro: 'Upload two or more PDFs and combine them into a single file, in the order you add them. Useful for stitching together scanned pages, combining reports, or assembling a single document from several sources.',
    steps: [
      'Click the upload area below and select two or more PDF files (or drag them in).',
      'Files are combined in the order you added them - remove and re-add a file to change its position.',
      'Click "Process & download" - the merged PDF downloads automatically.'
    ],
    faq: [
      { q: 'Is there a limit to how many files I can merge?', a: 'Up to 30 files per merge, each up to 50MB. That covers the vast majority of use cases; the limits exist to keep the server responsive for everyone.' },
      { q: 'Does merging reduce PDF quality?', a: 'No. Pages are copied exactly as they are - text stays sharp, images keep their original resolution.' },
      { q: 'Can I reorder pages after merging?', a: 'Not on this page, but you can use the Split PDF tool afterward to pull pages out and merge them again in a different order.' }
    ]
  },
  {
    id: 'split', slug: 'split-pdf', group: 'organize', cat: 'organize',
    title: 'Split PDF', desc: 'Pull out specific pages or split into separate files.',
    endpoint: '/split', field: 'file', multiple: false, accept: '.pdf', resultName: 'split_result',
    options: [{ name: 'ranges', label: 'Page ranges (e.g. 1-3,5,7-8) - leave blank for one file per page', type: 'text', placeholder: '1-3,5,7-8' }],
    seoTitle: 'Split, Cut & Separate PDF Pages Free - No Signup | PDF Chroma',
    seoDescription: 'Cut, split, or separate PDF pages online for free. Extract specific pages or break every page into its own file - no signup, no watermark.',
    h1: 'Split, Cut & Separate PDF Pages Online',
    intro: 'Pull specific pages out of a larger PDF, cut it apart, or break a document into separate files entirely. Enter one or more page ranges to extract exactly what you need, or leave the range field blank to get every page as its own file.',
    steps: [
      'Upload the PDF you want to split.',
      'Enter page ranges like "1-3,5,7-8" to pull out specific sections, or leave it blank to split every page separately.',
      'Click "Process & download" - you\'ll get either a single PDF or a zip of files, depending on how many ranges you entered.'
    ],
    faq: [
      { q: 'What happens if I don\'t enter a page range?', a: 'The tool splits every page of the document into its own individual PDF file, delivered as a zip.' },
      { q: 'Can I extract non-consecutive pages?', a: 'Yes - separate ranges with commas, e.g. "2,4,9-12" pulls out page 2, page 4, and pages 9 through 12 as separate files.' },
      { q: 'Will splitting affect the quality of my pages?', a: 'No, pages are extracted exactly as they appear in the original - no re-compression or quality loss.' },
      { q: 'Is this a PDF page breaker or cutter tool?', a: 'Yes - this tool works as a PDF page breaker, letting you cut a PDF apart into individual pages or specific sections, completely free.' }
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
    seoTitle: 'Rotate PDF Pages Online - Free Tool | PDF Chroma',
    seoDescription: 'Fix sideways or upside-down PDF pages. Rotate the whole document or just specific pages by 90, 180, or 270 degrees.',
    h1: 'Rotate PDF pages',
    intro: 'Scanned a page sideways? Rotate the entire document, or target specific pages, by 90, 180, or 270 degrees - the fix takes seconds.',
    steps: [
      'Upload the PDF with pages that need rotating.',
      'Choose the rotation angle and whether it applies to all pages or specific ones (e.g. "1,3,5").',
      'Click "Process & download" to get the corrected file.'
    ],
    faq: [
      { q: 'Can different pages be rotated by different amounts in one pass?', a: 'Not in a single request - run the tool once per angle you need, targeting the specific pages each time.' },
      { q: 'Does rotating change the page size?', a: 'No, only the orientation changes; page dimensions stay the same.' },
      { q: 'How do I know which page numbers to target?', a: 'Page numbers refer to their position in the original document - page 1 is the first page, and so on.' }
    ]
  },
  {
    id: 'numbers', slug: 'add-page-numbers', group: 'organize', cat: 'organize',
    title: 'Add page numbers', desc: 'Stamp a page number at the bottom of every sheet.',
    endpoint: '/page-numbers', field: 'file', multiple: false, accept: '.pdf', resultName: 'numbered.pdf',
    seoTitle: 'Add Page Numbers to PDF Free | PDF Chroma',
    seoDescription: 'Stamp page numbers (e.g. "3 / 12") at the bottom of every page in your PDF, automatically, in one click.',
    h1: 'Add page numbers to a PDF',
    intro: 'Adds a small "current page / total pages" label to the bottom-center of every page - handy for printed handouts, contracts, or long reports.',
    steps: [
      'Upload the PDF you want numbered.',
      'Click "Process & download" - no extra settings needed.',
      'Every page gets a "page / total" label at the bottom.'
    ],
    faq: [
      { q: 'Can I change where the page number appears?', a: 'This tool places it bottom-center by default, which fits most documents without overlapping existing content.' },
      { q: 'Does it renumber if I later add or remove pages?', a: 'No - if you edit the PDF afterward, run this tool again on the updated file to refresh the numbering.' },
      { q: 'Will it overwrite numbers that are already in the document?', a: 'No, it adds a new number stamp; it doesn\'t detect or remove existing page numbers already printed on the page.' }
    ]
  },
  {
    id: 'compress', slug: 'compress-pdf', group: 'optimize', cat: 'optimize',
    title: 'Compress PDF', desc: 'Shrink the file size for easier sharing.',
    endpoint: '/compress', field: 'file', multiple: false, accept: '.pdf', resultName: 'compressed.pdf',
    options: [{ name: 'level', label: 'Compression level', type: 'select', choices: [['screen', 'Smallest file size'], ['ebook', 'Balanced (recommended)'], ['printer', 'High quality']] }],
    seoTitle: 'Compress PDF - Reduce File Size Free | PDF Chroma',
    seoDescription: 'Shrink large PDF files for email and uploads. Choose between maximum compression, balanced quality, or high quality output.',
    h1: 'Compress a PDF file',
    intro: 'Large PDFs bounce off email attachment limits and slow down uploads. Compress yours down to a fraction of the size, with a choice of how much quality to trade off.',
    steps: [
      'Upload the PDF you want to shrink.',
      'Pick a compression level: smallest file size, balanced, or high quality.',
      'Click "Process & download" to get the compressed file.'
    ],
    faq: [
      { q: 'How much smaller will my file get?', a: 'It depends heavily on content - PDFs full of high-resolution images shrink the most, while text-only PDFs are already small and may not shrink much further.' },
      { q: 'Will compression make my images blurry?', a: 'The "smallest file size" setting trades more visual quality for size; "high quality" keeps images closer to the original at a smaller size reduction.' },
      { q: 'Is compressed text still selectable and searchable?', a: 'Yes - compression only affects embedded images and internal file structure, never the actual text content.' }
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
    seoDescription: 'Stamp a custom text watermark - like DRAFT or CONFIDENTIAL - diagonally across every page of your PDF, with adjustable opacity.',
    h1: 'Add a watermark to a PDF',
    intro: 'Mark a document as a draft, confidential, or sample copy with a diagonal text watermark across every page. Set your own text and how visible it should be.',
    steps: [
      'Upload the PDF you want to watermark.',
      'Type the watermark text and adjust the opacity slider.',
      'Click "Process & download" to get the watermarked file.'
    ],
    faq: [
      { q: 'Can I use my own logo instead of text?', a: 'This tool currently supports text watermarks only. Image/logo watermarking is on the roadmap - see the project README for how to extend it.' },
      { q: 'Can the watermark be removed later?', a: 'It becomes part of the page content, like any other stamped text - it isn\'t a removable "layer" in most PDF viewers.' },
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
    intro: 'Turn a Word document into a PDF that keeps its exact formatting no matter what device or app opens it - ideal for sending resumes, contracts, or reports.',
    steps: [
      'Upload your .doc or .docx file.',
      'Click "Process & download" - no settings needed.',
      'Your formatting, fonts, and layout are preserved in the output PDF.'
    ],
    faq: [
      { q: 'Will my fonts and formatting be preserved?', a: 'Yes - the conversion renders the document exactly as it would print, including fonts, spacing, and images.' },
      { q: 'Does it work with .doc as well as .docx?', a: 'Yes, both older .doc and modern .docx formats are supported.' },
      { q: 'What if my Word file has tracked changes or comments?', a: 'The output reflects how the document currently displays; for a clean PDF, accept or resolve tracked changes in Word first.' }
    ]
  },
  {
    id: 'ppt-to-pdf', slug: 'powerpoint-to-pdf', group: 'convert', cat: 'ppt',
    title: 'PowerPoint to PDF', desc: 'Convert .pptx slides into a PDF.',
    endpoint: '/powerpoint-to-pdf', field: 'file', multiple: false, accept: '.ppt,.pptx', resultName: 'converted.pdf',
    seoTitle: 'Convert PowerPoint to PDF Free | PDF Chroma',
    seoDescription: 'Turn a .pptx presentation into a PDF, one slide per page - great for sharing decks without needing PowerPoint installed.',
    h1: 'Convert PowerPoint to PDF',
    intro: 'Share a presentation with anyone, even if they don\'t have PowerPoint. Each slide becomes one page of a PDF, keeping layout, images, and text intact.',
    steps: [
      'Upload your .ppt or .pptx file.',
      'Click "Process & download".',
      'Each slide is rendered as one page in the resulting PDF.'
    ],
    faq: [
      { q: 'Do slide animations or transitions carry over?', a: 'No - a PDF is static, so each slide is captured as it would look printed, without animations or transition effects.' },
      { q: 'Are speaker notes included?', a: 'No, only the slide content itself is included, not the presenter notes.' },
      { q: 'Will embedded videos still play?', a: 'No, embedded video/audio won\'t play in a PDF - a placeholder image or the first frame may appear instead.' }
    ]
  },
  {
    id: 'xls-to-pdf', slug: 'excel-to-pdf', group: 'convert', cat: 'excel',
    title: 'Excel to PDF', desc: 'Convert .xlsx spreadsheets into a PDF.',
    endpoint: '/excel-to-pdf', field: 'file', multiple: false, accept: '.xls,.xlsx', resultName: 'converted.pdf',
    seoTitle: 'Convert Excel to PDF Online Free | PDF Chroma',
    seoDescription: 'Turn an .xlsx spreadsheet into a clean, printable PDF - perfect for sharing reports and data without giving away the editable file.',
    h1: 'Convert Excel to PDF',
    intro: 'Turn a spreadsheet into a fixed, shareable PDF - useful for invoices, reports, or any table you want to send without the recipient editing it.',
    steps: [
      'Upload your .xls or .xlsx file.',
      'Click "Process & download".',
      'Each sheet is rendered as pages in the output PDF, following your print area settings.'
    ],
    faq: [
      { q: 'Will all my sheets be included?', a: 'Yes, every sheet tab in the workbook is converted, in order.' },
      { q: 'What if my spreadsheet is wider than one printed page?', a: 'It follows the print area and page setup defined in the spreadsheet - set that up in Excel first if columns are getting cut off.' },
      { q: 'Do formulas convert to their calculated values?', a: 'Yes, the PDF shows the calculated results of formulas, not the formulas themselves.' }
    ]
  },
  {
    id: 'jpg-to-pdf', slug: 'jpg-to-pdf', group: 'convert', cat: 'image',
    title: 'JPG to PDF', desc: 'Stitch one or more images into a single PDF.',
    endpoint: '/jpg-to-pdf', field: 'files', multiple: true, accept: '.jpg,.jpeg,.png', resultName: 'images.pdf',
    seoTitle: 'Convert JPG to PDF Free - Combine Images | PDF Chroma',
    seoDescription: 'Turn one or more JPG or PNG images into a single PDF document, in the order you choose. Free, fast, no watermark.',
    h1: 'Convert JPG to PDF',
    intro: 'Combine one or more photos or scanned images into a single, easy-to-share PDF - ideal for turning phone scans of documents into a proper file.',
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
      { q: 'Will the formatting look exactly the same in Word?', a: 'Close, but not always pixel-perfect - complex layouts (multi-column, heavy graphics) may need minor manual adjustment after conversion.' },
      { q: 'Does this work on scanned PDFs?', a: 'Not reliably - scanned (image-based) PDFs need OCR first, which isn\'t included in this conversion. Best results come from PDFs that already contain real text.' },
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
    intro: 'Turn a PDF into an editable .pptx presentation, with each page becoming one slide - handy for reusing content from a PDF report or handout in a live presentation.',
    steps: [
      'Upload the PDF you want to convert.',
      'Click "Process & download".',
      'Each page becomes one slide in the resulting .pptx file.'
    ],
    faq: [
      { q: 'Will text be editable in the resulting slides?', a: 'Text-based PDFs generally convert to editable text boxes; heavily designed pages may convert as fixed images instead.' },
      { q: 'Does this work well for slide-deck-style PDFs?', a: 'Yes - PDFs that were originally exported from PowerPoint tend to convert back the most cleanly.' },
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
      { q: 'Can I convert a scanned PDF invoice?', a: 'Not reliably - scanned documents need OCR first, which isn\'t part of this conversion.' }
    ]
  },
  {
    id: 'pdf-to-jpg', slug: 'pdf-to-jpg', group: 'convert', cat: 'image',
    title: 'PDF to JPG', desc: 'Convert each page into a high-quality image.',
    endpoint: '/pdf-to-jpg', field: 'file', multiple: false, accept: '.pdf', resultName: 'pdf-pages',
    seoTitle: 'Convert PDF to JPG Online Free | PDF Chroma',
    seoDescription: 'Turn every page of a PDF into a high-quality JPG image. Free, fast, one image per page, delivered as a zip for multi-page files.',
    h1: 'Convert PDF to JPG',
    intro: 'Turn each page of a PDF into a standalone JPG image - useful for pulling a single page out as a shareable picture, or preparing pages for a slideshow or website.',
    steps: [
      'Upload the PDF you want to convert.',
      'Click "Process & download".',
      'A single-page PDF downloads as one JPG; multi-page PDFs download as a zip of images.'
    ],
    faq: [
      { q: 'What resolution are the output images?', a: 'Pages are rendered at 150 DPI, a good balance between clarity and file size for screen viewing and most printing.' },
      { q: 'Can I get PNG instead of JPG?', a: 'This tool outputs JPG by default; PNG support can be added by extending the backend route - see the project README.' },
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
    intro: 'Lock a PDF with a password so it can only be opened by someone who knows it - useful for sending contracts, financial documents, or anything you don\'t want opened by the wrong person.',
    steps: [
      'Upload the PDF you want to protect.',
      'Type the password you want to require to open it.',
      'Click "Process & download" to get the password-protected file.'
    ],
    faq: [
      { q: 'What encryption does this use?', a: 'The file is encrypted with 256-bit AES - the current standard for PDF password protection - using the open-source qpdf library.' },
      { q: 'If I forget the password, can it be recovered?', a: 'No - that\'s the point of real encryption. There\'s no backdoor or recovery option, so store the password somewhere safe before sending the file.' },
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
      { q: 'Can this remove a password I don\'t know?', a: 'No - you need the correct password to unlock the file. This removes protection you already have access to; it isn\'t a password-cracking tool.' },
      { q: 'Is the original file changed?', a: 'No, a new unlocked copy is created - your original password-protected file is left untouched.' },
      { q: 'Why would I want to remove a password?', a: 'Common reasons: the document no longer contains sensitive information, you\'re archiving it internally, or re-entering a password every time has become inconvenient for a file you now only share internally.' }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TOOLS, TOOL_ICONS, TOOL_ICON_BY_ID };
}
