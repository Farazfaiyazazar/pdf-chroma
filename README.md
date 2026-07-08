# PDF Chroma

A free, self-hosted PDF toolkit — merge, split, compress, convert, and edit PDFs, all processed on your own server instead of a stranger's. No sign-up, no watermarks, no upload limits you didn't set yourself.

**Live site:** [pdfchroma.com](https://pdfchroma.com)
**License:** MIT — see [LICENSE](LICENSE)

---

## Why this exists

Most free online PDF tools work fine, but your files pass through someone else's server to get there. PDF Chroma is the same idea, minus the trust exercise: you run the backend, you own the server, and nothing ever leaves your own infrastructure. It's also just... nice to look at, which most tools in this space are not.

## What it does

**Organize** — merge, split, rotate, add page numbers
**Optimize** — compress (with Ghostscript for real compression, or a pdf-lib fallback with zero extra installs)
**Convert** — Word ⇄ PDF, Excel ⇄ PDF, PowerPoint ⇄ PDF, JPG ⇄ PDF
**Security** — add a text watermark

Every tool has its own dedicated page (`/tools/merge-pdf.html`, `/tools/pdf-to-word.html`, etc.) with real content, an FAQ, and schema markup — built for search engines to actually index and rank, not just a single-page app hiding everything behind JavaScript. There's also a small blog (`/blog`) with practical guides that link back to the relevant tools.

## Tech stack

- **Backend:** Node.js, Express, [pdf-lib](https://pdf-lib.js.org/) (no system dependencies for most tools), LibreOffice + poppler-utils for Office/image conversions
- **Frontend:** Plain HTML/CSS/JS — no framework, no build step beyond a small Node script that generates the tool and blog pages from a single data file
- **Infra:** Nginx (reverse proxy + static file serving), Let's Encrypt for HTTPS, PM2 for process management

## Project structure

```
pdf-chroma/
├── backend/                  # Express API — all real file processing happens here
│   ├── server.js
│   ├── routes/
│   │   ├── organize.js       # merge, split, rotate, page numbers — pdf-lib, no system deps
│   │   ├── optimize.js       # compress — Ghostscript if available, else pdf-lib fallback
│   │   └── convert.js        # pdf↔jpg (poppler) and office↔pdf (LibreOffice)
│   └── utils/upload.js
└── frontend/
    ├── index.html            # homepage (tool grid is pre-rendered at build time)
    ├── tools-data.js         # single source of truth for every tool's content + config
    ├── blog-data.js          # blog post content
    ├── tool-widget.js        # upload/progress/result UI, shared across tool pages
    ├── chroma-bg.js          # the ambient animated background
    ├── build/
    │   ├── generate-pages.js # generates /tools/*.html + the homepage grid + sitemap
    │   └── generate-blog.js  # generates /blog/*.html
    ├── tools/                # generated — don't hand-edit
    └── blog/                 # generated — don't hand-edit
```

## Running it locally

```bash
cd backend
npm install
npm start          # http://localhost:4000
```

Then open `frontend/index.html` in a browser, or serve it properly:
```bash
cd frontend
npx serve .
```

If your backend lives at a different address, set it before deploying:
```bash
SITE_URL="https://yourdomain.com" API_BASE="https://yourdomain.com/api" node build/generate-pages.js
```
This regenerates every tool page, the homepage grid, the blog, `sitemap.xml`, and `robots.txt` with your real domain baked in.

## System dependencies

Merge, split, rotate, page numbers, watermark, and JPG→PDF work out of the box on any server — pure JS, no extra installs.

Everything else needs these on the server (Ubuntu/Debian):
```bash
sudo apt-get update && sudo apt-get install -y libreoffice poppler-utils ghostscript
```
Missing dependencies produce a clear error message from the API rather than a crash — the rest of the site keeps working normally either way.

> Converting a **scanned** PDF to Word needs OCR, which isn't implemented here yet. Regular text-based PDFs convert cleanly.

## Deploying

A minimal setup that works well: a small Ubuntu VM, Node 18+, PM2 to keep the backend alive, Nginx as a reverse proxy in front of it (also serving the static frontend + handling gzip/caching), and a free Let's Encrypt certificate for HTTPS.

- Per-file upload limit: 50MB (`backend/utils/upload.js`)
- Temp files are wiped every 30 minutes and immediately after each download
- For heavy traffic or slow conversions, consider adding a job queue (BullMQ + Redis) in front of the conversion routes

After deploying, submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console) — indexing a brand new domain typically takes days to a couple of weeks.

## Roadmap / not built yet

Contributions welcome on any of these — the code is structured to make adding a new tool straightforward (one backend route + one entry in `tools-data.js`):

- PDF password protection / encryption
- Digital signatures
- Redaction
- Side-by-side PDF comparison
- OCR for scanned documents
- AI-powered summarize/translate (would need an LLM API key)

## Contributing

Pull requests are welcome. If you're adding a tool, the pattern to follow is: a new route in `backend/routes/`, a new entry in `frontend/tools-data.js` (with SEO content — title, description, FAQ), then run `node build/generate-pages.js` to generate its page. Please don't hand-edit files inside `frontend/tools/` or `frontend/blog/` directly — they're regenerated from the data files and any manual changes will get overwritten.

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, self-host it, put your own name on it if you want. Just don't blame me if LibreOffice eats a font.
