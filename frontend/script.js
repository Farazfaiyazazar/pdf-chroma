// Homepage behavior. The tool cards themselves are pre-rendered directly
// into index.html at build time (see build/generate-pages.js) to avoid a
// layout shift and to keep the content crawlable without JS. This script
// only wires up interactivity: the scroll-reveal animation and the
// category filter pills. Icons/tool data come from tools-data.js.

const toolGrid = document.getElementById('toolGrid');

// If, for any reason, the grid wasn't pre-rendered (e.g. local file opened
// without running the build step), fall back to rendering it client-side
// so the page still works.
function renderGridFallback(){
  toolGrid.innerHTML = TOOLS.map((t) => `
    <a class="tool-card" href="tools/${t.slug}.html" data-group="${t.group}" data-cat="${t.cat}">
      <span class="icon-badge">${TOOL_ICONS[TOOL_ICON_BY_ID[t.id]] || ''}</span>
      <h2>${t.title}</h2>
      <p>${t.desc}</p>
    </a>
  `).join('');
}

if (!toolGrid.children.length) {
  renderGridFallback();
}
observeCards();

// Reveal cards with a gentle staggered fade-up as they scroll into view.
function observeCards(){
  const cards = toolGrid.querySelectorAll('.tool-card');
  if (!('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  cards.forEach((c) => observer.observe(c));
}

// ---- Filter pills ----
const filterBar = document.getElementById('filterBar');
filterBar.addEventListener('click', (e) => {
  const pill = e.target.closest('.filter-pill');
  if (!pill) return;
  filterBar.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('is-active'));
  pill.classList.add('is-active');
  const filter = pill.dataset.filter;
  toolGrid.querySelectorAll('.tool-card').forEach((card) => {
    const show = filter === 'all' || card.dataset.group === filter;
    card.classList.toggle('is-hidden', !show);
  });
});

document.querySelectorAll('[data-scrollfilter]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    const target = link.dataset.scrollfilter;
    const pill = filterBar.querySelector(`[data-filter="${target}"]`);
    if (pill) pill.click();
  });
});

// ---- Hero drop zone: route a dropped/chosen file to the right tool ----
// Unambiguous types go straight to their converter, carrying the file over via
// an IndexedDB handoff (read back by tool-widget.js). A bare PDF is ambiguous
// (merge? compress? convert?), so we scroll to the grid and let the user pick.
(function initHeroDrop(){
  const drop = document.getElementById('heroDrop');
  const input = document.getElementById('heroDropInput');
  const hint = document.getElementById('heroDropHint');
  if (!drop || !input) return;

  const ROUTE = {
    doc: 'word-to-pdf', docx: 'word-to-pdf',
    ppt: 'powerpoint-to-pdf', pptx: 'powerpoint-to-pdf',
    xls: 'excel-to-pdf', xlsx: 'excel-to-pdf',
    jpg: 'jpg-to-pdf', jpeg: 'jpg-to-pdf', png: 'jpg-to-pdf',
  };

  function showHint(msg){
    if (!hint) return;
    hint.textContent = msg;
    hint.hidden = false;
  }

  // Store the File in IndexedDB so the destination tool page can pick it up.
  // Resolves either way — a storage failure just means no handoff, not a crash.
  function stashFile(file){
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open('pdfchroma', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('handoff');
        req.onerror = () => resolve(false);
        req.onsuccess = () => {
          try {
            const db = req.result;
            const tx = db.transaction('handoff', 'readwrite');
            tx.objectStore('handoff').put({ file: file, ts: Date.now() }, 'pending');
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
          } catch (_) { resolve(false); }
        };
      } catch (_) { resolve(false); }
    });
  }

  function handleFile(file){
    if (!file) return;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const slug = ROUTE[ext];
    if (slug) {
      showHint('Opening the right tool for “' + file.name + '”…');
      stashFile(file).then(() => { window.location.href = 'tools/' + slug + '.html?handoff=1'; });
    } else if (ext === 'pdf') {
      showHint('Got your PDF — pick what to do with it below.');
      document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    } else {
      showHint('That file type isn’t supported yet. Try a PDF, Word, PowerPoint, Excel, or image file.');
    }
  }

  drop.addEventListener('click', () => input.click());
  drop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('change', () => { if (input.files && input.files[0]) handleFile(input.files[0]); });

  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-dragover'); });
  drop.addEventListener('dragleave', (e) => {
    if (e.target === drop) drop.classList.remove('is-dragover');
  });
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('is-dragover');
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  });
})();
