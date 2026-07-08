// Generates /blog/<slug>.html for every post in blog-data.js, plus
// /blog/index.html listing all of them. Run via generate-pages.js (which
// requires this file) or standalone: node build/generate-blog.js
const fs = require('fs');
const path = require('path');
const { BLOG_POSTS } = require('../blog-data.js');
const { TOOLS } = require('../tools-data.js');

const FRONTEND_DIR = path.join(__dirname, '..');
const BLOG_DIR = path.join(FRONTEND_DIR, 'blog');
const SITE_URL = process.env.SITE_URL || 'https://example.com';

fs.mkdirSync(BLOG_DIR, { recursive: true });

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function renderContentBlock(block) {
  if (block.type === 'h2') return `<h2>${escapeHtml(block.text)}</h2>`;
  if (block.type === 'p') return `<p>${escapeHtml(block.text)}</p>`;
  if (block.type === 'list') {
    return `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
  }
  return '';
}

function headMeta(post) {
  return `<title>${escapeHtml(post.seoTitle)}</title>
<meta name="description" content="${escapeHtml(post.seoDescription)}">
<link rel="canonical" href="${SITE_URL}/blog/${post.slug}.html">
<meta property="og:title" content="${escapeHtml(post.seoTitle)}">
<meta property="og:description" content="${escapeHtml(post.seoDescription)}">
<meta property="og:type" content="article">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/favicon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=optional">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=optional" media="print" onload="this.media='all'; this.onload=null;">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=optional"></noscript>
<link rel="stylesheet" href="../style.css">`;
}

function headerNav() {
  return `<header class="site-header">
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
      <span class="brand-word">PDF<span class="brand-accent">Chroma</span></span>
    </a>
    <nav class="site-nav">
      <a href="../index.html#organize">Organize</a>
      <a href="../index.html#convert">Convert</a>
      <a href="../index.html#optimize">Optimize</a>
      <a href="index.html">Blog</a>
    </nav>
    <a href="../index.html" class="btn btn--primary header-cta">All tools</a>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer wrap">
  <p>PDF Chroma is built for anyone tired of upload limits, watermarked exports, and "premium" paywalls. Free, forever.</p>
</footer>`;
}

function relatedToolLinks(post) {
  const tools = (post.relatedTools || []).map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean);
  if (!tools.length) return '';
  return `<section class="related-section wrap">
    <h2>Related tools</h2>
    <div class="related-links">
      ${tools.map((t) => `<a class="related-link" href="../tools/${t.slug}.html">${escapeHtml(t.title)}</a>`).join('\n      ')}
    </div>
  </section>`;
}

function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.publishDate,
    author: { '@type': 'Organization', name: 'PDF Chroma' },
    publisher: { '@type': 'Organization', name: 'PDF Chroma' },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}.html`
  };
}

function renderPost(post) {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${headMeta(post)}
<script type="application/ld+json">${JSON.stringify(articleSchema(post))}</script>
</head>
<body>

<canvas id="chromaCanvas" aria-hidden="true"></canvas>

${headerNav()}

<main>
  <nav class="breadcrumb wrap" aria-label="Breadcrumb">
    <a href="../index.html">Home</a> <span>/</span> <a href="index.html">Blog</a> <span>/</span> <span>${escapeHtml(post.title)}</span>
  </nav>

  <article class="blog-article wrap">
    <p class="blog-meta">${escapeHtml(post.category)} · ${formatDate(post.publishDate)} · ${post.readMinutes} min read</p>
    <h1>${escapeHtml(post.title)}</h1>
    <div class="blog-body">
      ${post.content.map(renderContentBlock).join('\n      ')}
    </div>
  </article>

  ${relatedToolLinks(post)}
</main>

${footer()}

<script src="../tools-data.js" defer></script>
<script src="../chroma-bg.js" defer></script>
</body>
</html>
`;
}

function renderIndex() {
  const cards = BLOG_POSTS.slice().sort((a, b) => b.publishDate.localeCompare(a.publishDate)).map((post) => `
    <a class="blog-card" href="${post.slug}.html">
      <p class="blog-card-meta">${escapeHtml(post.category)} · ${post.readMinutes} min read</p>
      <h2>${escapeHtml(post.title)}</h2>
      <p class="blog-card-excerpt">${escapeHtml(post.excerpt)}</p>
      <span class="blog-card-date">${formatDate(post.publishDate)}</span>
    </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog — Guides for working with PDFs | PDF Chroma</title>
<meta name="description" content="Practical, no-fluff guides for merging, converting, compressing, and organizing PDF files.">
<link rel="canonical" href="${SITE_URL}/blog/index.html">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=optional">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=optional" media="print" onload="this.media='all'; this.onload=null;">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=optional"></noscript>
<link rel="stylesheet" href="../style.css">
</head>
<body>

<canvas id="chromaCanvas" aria-hidden="true"></canvas>

${headerNav()}

<main>
  <section class="blog-hero wrap">
    <h1>Guides for working with PDFs</h1>
    <p class="blog-hero-sub">Practical, no-fluff advice — no filler, no "10 amazing tips," just what actually works.</p>
  </section>

  <section class="blog-grid-section wrap">
    <div class="blog-grid">
      ${cards}
    </div>
  </section>
</main>

${footer()}

<script src="../tools-data.js" defer></script>
<script src="../chroma-bg.js" defer></script>
</body>
</html>
`;
}

let count = 0;
for (const post of BLOG_POSTS) {
  fs.writeFileSync(path.join(BLOG_DIR, `${post.slug}.html`), renderPost(post));
  count++;
}
fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), renderIndex());
console.log(`Generated ${count} blog posts + blog index`);

module.exports = { BLOG_POSTS, SITE_URL };
