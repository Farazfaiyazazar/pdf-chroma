// Generates /tools/<slug>.html for every entry in tools-data.js.
// Run with: node build/generate-pages.js
const fs = require('fs');
const path = require('path');
const { TOOLS, TOOL_ICONS, TOOL_ICON_BY_ID } = require('../tools-data.js');

const FRONTEND_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(FRONTEND_DIR, 'tools');
const SITE_URL = process.env.SITE_URL || 'https://example.com'; // update before deploying
const API_BASE = process.env.API_BASE || 'http://localhost:4000/api'; // set to https://yourdomain.com/api in production

fs.mkdirSync(TOOLS_DIR, { recursive: true });

function relatedTools(tool){
  return TOOLS.filter((t) => t.group === tool.group && t.id !== tool.id).slice(0, 4);
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function optionsFaqSchema(faq){
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

function appSchema(tool){
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title + ' - PDF Chroma',
    url: `${SITE_URL}/tools/${tool.slug}.html`,
    applicationCategory: 'Utility',
    operatingSystem: 'Any (web-based)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: tool.seoDescription
  };
}

function renderPage(tool){
  const related = relatedTools(tool);
  const stepsHtml = tool.steps.map((s, i) => `<li><span class="step-num">${i + 1}</span><span>${escapeHtml(s)}</span></li>`).join('\n        ');
  const faqHtml = tool.faq.map((f) => `
        <div class="faq-item">
          <button type="button" class="faq-q"><span>${escapeHtml(f.q)}</span><span class="plus"></span></button>
          <div class="faq-panel"><p>${escapeHtml(f.a)}</p></div>
        </div>`).join('\n');
  const relatedHtml = related.map((t) => `<a class="related-link" href="${t.slug}.html">${escapeHtml(t.title)}</a>`).join('\n        ');

  const optionsHtml = (tool.options || []).length
    ? '' // rendered client-side by tool-widget.js into #toolOptions
    : '';

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QY6S3Z83P8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-QY6S3Z83P8');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(tool.seoTitle)}</title>
<meta name="description" content="${escapeHtml(tool.seoDescription)}">
<link rel="canonical" href="${SITE_URL}/tools/${tool.slug}.html">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/favicon-192.png" sizes="192x192" type="image/png">
<link rel="icon" href="/assets/favicon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:title" content="${escapeHtml(tool.seoTitle)}">
<meta property="og:description" content="${escapeHtml(tool.seoDescription)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}/tools/${tool.slug}.html">
<meta property="og:image" content="${SITE_URL}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(tool.seoTitle)}">
<meta name="twitter:description" content="${escapeHtml(tool.seoDescription)}">
<meta name="twitter:image" content="${SITE_URL}/assets/og-image.png">
<meta name="twitter:card" content="summary">

<link rel="stylesheet" href="../style.css">
<script type="application/ld+json">${JSON.stringify(appSchema(tool))}</script>
<script type="application/ld+json">${JSON.stringify(optionsFaqSchema(tool.faq))}</script>
</head>
<body>

<canvas id="chromaCanvas" aria-hidden="true"></canvas>

<header class="site-header">
  <div class="wrap header-inner">
    <a href="../index.html" class="brand">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="-30 -30 280 280" width="38" height="38">
          <defs>
            <linearGradient id="hdrFoldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff3b3b"/>
              <stop offset="50%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#8b5cf6"/>
            </linearGradient>
            <path id="hdrPageShape" d="M0 0 H62 L86 24 V120 H0 Z"/>
          </defs>
          <g transform="translate(40,40)">
            <g transform="rotate(-11 43 60) translate(14,18)">
              <use href="#hdrPageShape" fill="#1b1c26" stroke="#8b5cf6" stroke-width="3" opacity="0.9"/>
              <path d="M62 0 V24 H86 Z" fill="#8b5cf6" opacity="0.9"/>
            </g>
            <g transform="rotate(-4 43 60) translate(7,9)">
              <use href="#hdrPageShape" fill="#161720" stroke="#3b82f6" stroke-width="3" opacity="0.95"/>
              <path d="M62 0 V24 H86 Z" fill="#3b82f6" opacity="0.95"/>
            </g>
            <g>
              <use href="#hdrPageShape" fill="#15161d" stroke="#ef4444" stroke-width="3.5"/>
              <path d="M62 0 V24 H86 Z" fill="url(#hdrFoldGrad)"/>
            </g>
          </g>
        </svg>
      </span>
      <span class="brand-word">PDF <span class="brand-accent">Chroma</span></span>
    </a>
    <nav class="site-nav">
      <a href="../index.html#organize">Organize</a>
      <a href="../index.html#convert">Convert</a>
      <a href="../index.html#optimize">Optimize</a>
      <a href="../blog/index.html">Blog</a>
    </nav>
    <a href="../index.html" class="btn btn--primary header-cta">All tools</a>
  </div>
</header>

<main>
  <nav class="breadcrumb wrap" aria-label="Breadcrumb">
    <a href="../index.html">Home</a> <span>/</span> <span>${escapeHtml(tool.title)}</span>
  </nav>

  <section class="tool-page-hero wrap">
    <h1>${escapeHtml(tool.h1)}</h1>
    <p class="tool-page-intro">${escapeHtml(tool.intro)}</p>
  </section>

  <section class="tool-widget-section wrap">
    <div class="workspace">
      <div class="workspace-head">
        <span class="workspace-icon" id="widgetIcon"></span>
        <div>
          <h2>${escapeHtml(tool.title)}</h2>
          <p>${escapeHtml(tool.desc)}</p>
        </div>
      </div>

      <div class="dropzone" id="dropzone">
        <input type="file" id="fileInput" hidden>
        <div class="dropzone-inner">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0-11 4 4m-4-4-4 4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <p>Drop a file here or <span>click to browse</span></p>
          <small id="wsAccept"></small>
        </div>
      </div>

      <ul class="file-list" id="fileList"></ul>
      <div class="tool-options" id="toolOptions">${optionsHtml}</div>
      <button type="button" class="btn btn--primary workspace-submit" id="wsSubmit" disabled>Process & download</button>

      <div class="progress-tracker" id="progressTracker">
        <div class="progress-step"><span class="dot">1</span><small>Uploading</small><span class="progress-line"></span></div>
        <div class="progress-step"><span class="dot">2</span><small>Processing</small><span class="progress-line"></span></div>
        <div class="progress-step"><span class="dot">3</span><small>Done</small></div>
      </div>

      <div class="workspace-status" id="wsStatus"></div>
    </div>
  </section>

  <section class="tool-steps-section wrap">
    <h2>How it works</h2>
    <ol class="steps-list">
        ${stepsHtml}
    </ol>
  </section>

  <section class="tool-faq-section wrap">
    <h2>Frequently asked questions</h2>
    <div class="faq-list">${faqHtml}
    </div>
  </section>

  ${related.length ? `<section class="related-section wrap">
    <h2>Related tools</h2>
    <div class="related-links">
        ${relatedHtml}
    </div>
  </section>` : ''}
</main>

<footer class="site-footer wrap">
  <p>PDF Chroma is built for anyone tired of upload limits, watermarked exports, and "premium" paywalls. Free, forever.</p>
  <p style="margin-top:10px;"><a href="/privacy.html" style="color:var(--ink-faint);">Privacy Policy</a> · <a href="/terms.html" style="color:var(--ink-faint);">Terms of Service</a></p>
</footer>

<script src="../tools-data-lite.js" defer></script>
<script src="../chroma-bg.js" defer></script>
<script>window.CURRENT_TOOL_ID = ${JSON.stringify(tool.id)}; window.OBSIDIAN_API_BASE = ${JSON.stringify(API_BASE)};</script>
<script src="../tool-widget.js" defer></script>
</body>
</html>
`;
}

let count = 0;
for (const tool of TOOLS) {
  const outPath = path.join(TOOLS_DIR, `${tool.slug}.html`);
  fs.writeFileSync(outPath, renderPage(tool));
  count++;
}
console.log(`Generated ${count} tool pages in /tools`);

// ---- Blog ----
const { BLOG_POSTS } = require('./generate-blog.js');

// ---- sitemap.xml ----
const today = new Date().toISOString().slice(0, 10);
const urls = [
  `${SITE_URL}/index.html`,
  ...TOOLS.map((t) => `${SITE_URL}/tools/${t.slug}.html`),
  `${SITE_URL}/blog/index.html`,
  ...BLOG_POSTS.map((p) => `${SITE_URL}/blog/${p.slug}.html`),
  `${SITE_URL}/privacy.html`,
  `${SITE_URL}/terms.html`
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(FRONTEND_DIR, 'sitemap.xml'), sitemap);
console.log('Generated sitemap.xml');

// ---- robots.txt ----
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(FRONTEND_DIR, 'robots.txt'), robots);
console.log('Generated robots.txt');

// ---- tools-data-lite.js ----
// tools-data.js (the full file) contains SEO content - intro paragraphs,
// step lists, FAQ text for all 16 tools - that only the build script needs
// (to bake into static HTML at build time). Browsers never touch those
// fields at runtime: the homepage's fallback grid render only needs
// id/slug/group/cat/title/desc, and each tool page's upload widget only
// needs the functional config (endpoint/field/options/etc). Shipping the
// full file to every visitor was pure waste - this strips it down to just
// what runs in the browser, cutting real payload weight sitewide.
const LITE_FIELDS = ['id', 'slug', 'group', 'cat', 'title', 'desc', 'endpoint', 'field', 'multiple', 'accept', 'resultName', 'options'];
const liteTools = TOOLS.map((t) => {
  const lite = {};
  for (const key of LITE_FIELDS) if (key in t) lite[key] = t[key];
  return lite;
});

const liteContent = `// Auto-generated by build/generate-pages.js - DO NOT EDIT DIRECTLY.
// This is the browser-facing subset of tools-data.js: functional config
// only (no SEO text), used by script.js (homepage) and tool-widget.js
// (each tool page). Edit tools-data.js and re-run the generator instead.

const TOOL_ICONS = ${JSON.stringify(TOOL_ICONS, null, 2)};
const TOOL_ICON_BY_ID = ${JSON.stringify(TOOL_ICON_BY_ID, null, 2)};
const TOOLS = ${JSON.stringify(liteTools, null, 2)};
`;
fs.writeFileSync(path.join(FRONTEND_DIR, 'tools-data-lite.js'), liteContent);
console.log(`Generated tools-data-lite.js (${(Buffer.byteLength(liteContent) / 1024).toFixed(1)} KiB, vs full tools-data.js)`);

// ---- Pre-render the homepage tool grid ----
// The grid used to be built entirely by script.js after page load, which
// caused a large layout shift (content appearing where there was empty
// space) and made script.js a render-blocking dependency for the page's
// main content. Baking the cards into index.html at build time fixes both:
// the content is present on first paint, and JS only adds interactivity.
const indexPath = path.join(FRONTEND_DIR, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const gridHtml = TOOLS.map((t) => `
    <a class="tool-card" href="tools/${t.slug}.html" data-group="${t.group}" data-cat="${t.cat}">
      <span class="icon-badge">${TOOL_ICONS[TOOL_ICON_BY_ID[t.id]] || ''}</span>
      <h2>${escapeHtml(t.title)}</h2>
      <p>${escapeHtml(t.desc)}</p>
    </a>`).join('');

const gridRegex = /(<div class="tool-grid" id="toolGrid">)[\s\S]*?(<\/div>)/;
if (gridRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(gridRegex, `$1${gridHtml}\n    $2`);
  fs.writeFileSync(indexPath, indexHtml);
  console.log('Pre-rendered homepage tool grid into index.html');
} else {
  console.warn('Could not find #toolGrid container in index.html - homepage grid NOT pre-rendered');
}
