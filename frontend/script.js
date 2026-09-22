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
