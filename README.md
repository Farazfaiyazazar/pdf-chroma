# Obsidian — Professional PDF Toolkit

A complete, self-hosted set of common PDF tools (similar to iLovePDF), with a dark,
glass-styled frontend and a real Node.js backend. Files are processed only on your own server.

## Project structure

```
pdf-toolkit/
├── backend/          # Express API — all real file processing happens here
│   ├── server.js
│   ├── routes/
│   │   ├── organize.js   # merge, split, rotate, page-numbers  (pdf-lib — no system dependency)
│   │   ├── optimize.js   # compress                            (Ghostscript if available, else pdf-lib fallback)
│   │   └── convert.js    # pdf<->jpg (poppler) and office<->pdf (LibreOffice)
│   └── utils/upload.js
└── frontend/         # Static files — deployable anywhere (Nginx, Vercel, GitHub Pages)
    ├── index.html
    ├── style.css
    └── script.js
```

## Quick start (local development)

```bash
cd backend
npm install
npm start          # runs on http://localhost:4000
```

Then open `frontend/index.html` directly in your browser, or serve it with a static server:

```bash
cd frontend
npx serve .
```

If your backend runs at a different address in production, add this line before `script.js`
loads in `index.html`:

```html
<script>window.OBSIDIAN_API_BASE = "https://api.yourdomain.com/api";</script>
```

## System dependencies (to unlock every tool)

Some tools run on pdf-lib alone and work on any server with zero extra installs:
**merge, split, rotate, add page numbers, watermark, JPG to PDF**.

The rest need these packages installed on the server (Ubuntu/Debian):

```bash
# For Word/Excel/PowerPoint <-> PDF
sudo apt-get update && sudo apt-get install -y libreoffice

# For PDF -> JPG
sudo apt-get install -y poppler-utils

# For stronger real compression (optional — otherwise falls back automatically)
sudo apt-get install -y ghostscript
```

If these tools aren't installed, the API returns a clear, readable error (never a crash), and
the rest of the site keeps working normally.

> Quality note: converting a scanned (image-based) PDF into Word requires OCR, which isn't
> implemented in this version. For regular text-based PDFs, LibreOffice gives solid results.

## SEO: dedicated pages per tool

The site is no longer a single page with a modal. Every tool now has its own real,
crawlable HTML page under `frontend/tools/` — e.g. `frontend/tools/merge-pdf.html` —
each with a unique `<title>`, meta description, intro copy, a "how it works" section,
an FAQ (marked up with FAQPage schema), and links to related tools. The homepage
(`frontend/index.html`) is a directory that links out to these pages.

**Before deploying, update the site URL used in meta tags, canonical links, and the
sitemap.** Open `frontend/build/generate-pages.js` and set:
```bash
SITE_URL="https://yourdomain.com" node build/generate-pages.js
```
This regenerates every page in `frontend/tools/`, plus `frontend/sitemap.xml` and
`frontend/robots.txt`, using your real domain.

**All tool content lives in one place:** `frontend/tools-data.js`. To edit a tool's
title, description, FAQ, or add a new tool entirely, edit that file, then re-run the
generator command above — never hand-edit the files inside `frontend/tools/` directly,
since they get overwritten.

After deploying:
1. Submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console)
2. Verify domain ownership there
3. It can take days to weeks for pages to get crawled and indexed — this is normal



- Backend: a simple VM (Ubuntu 22.04) with Node 18+, behind Nginx as a reverse proxy with HTTPS (Let's Encrypt).
- Current per-file size limit: 50MB (adjustable in `backend/utils/upload.js`).
- Temporary files are wiped every 30 minutes, and also deleted immediately after each download completes.
- To scale further: add a job queue (e.g. BullMQ + Redis) for large files or slow conversions.

## What's not built yet

Your priority list — merge/split, PDF↔Word, PDF↔JPG, and compress/watermark/rotate — is fully
implemented and tested. The following tools have room in the code structure but no endpoint yet:
PDF lock/encrypt, digital signing, redaction, PDF comparison, full OCR, and AI summarize/translate
(the last one needs an LLM API key). Adding any of these is one new route in `backend/routes/`
plus one new entry in the `TOOLS` array in `frontend/script.js`.
