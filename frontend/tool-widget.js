// Generic inline tool widget. Each tool page includes tools-data.js, sets
// window.CURRENT_TOOL_ID, then includes this script to wire up its own
// upload box, options, submit button, progress tracker and result states.

const API_BASE = window.OBSIDIAN_API_BASE || 'http://localhost:4000/api';

const ICONS = {
  merge: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 3v9a4 4 0 0 0 4 4h4M16 12l-3-3m3 3-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  split: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v6m0 0-8 6m8-6 8 6M4 21h4m-4 0v-4m0 4 5-5m11 5h-4m4 0v-4m0 4-5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rotate: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 1 1-3-6.7M21 3v5h-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  numbers: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><text x="17" y="21" font-size="7" fill="currentColor">3</text></svg>',
  compress: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 4H4v5m16-5h-5m5 0v5M9 20H4v-5m16 5h-5m5 0v-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  watermark: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v6c0 4.5 3.4 7.7 8 8 4.6-.3 8-3.5 8-8V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  wordpdf: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  jpg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.6" fill="currentColor"/><path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  ppt: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="10.5" cy="11" r="2.6" stroke="currentColor" stroke-width="1.5"/></svg>',
  xls: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  generic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
};

const ICON_BY_ID = {
  merge:'merge', split:'split', rotate:'rotate', numbers:'numbers', compress:'compress',
  watermark:'watermark', 'word-to-pdf':'wordpdf', 'ppt-to-pdf':'ppt', 'xls-to-pdf':'xls',
  'jpg-to-pdf':'jpg', 'pdf-to-word':'wordpdf', 'pdf-to-ppt':'ppt', 'pdf-to-xls':'xls', 'pdf-to-jpg':'jpg'
};

const CHECK_ICON = `<svg class="status-icon show" viewBox="0 0 44 44" fill="none">
  <circle class="status-check-circle" cx="22" cy="22" r="19" stroke="#16a34a" stroke-width="3"/>
  <path class="status-check-mark" d="M13 23l6 6 12-14" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const ERROR_ICON = `<svg class="status-icon show" viewBox="0 0 44 44" fill="none">
  <circle cx="22" cy="22" r="19" stroke="#dc2626" stroke-width="3"/>
  <path d="M16 16l12 12M28 16 16 28" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
</svg>`;

function initToolWidget(tool){
  let selectedFiles = [];
  let lastFormExtras = null;

  const iconEl = document.getElementById('widgetIcon');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const fileListEl = document.getElementById('fileList');
  const toolOptionsEl = document.getElementById('toolOptions');
  const submitBtn = document.getElementById('wsSubmit');
  const statusEl = document.getElementById('wsStatus');
  const acceptEl = document.getElementById('wsAccept');
  const progressEl = document.getElementById('progressTracker');

  if (iconEl) iconEl.innerHTML = ICONS[ICON_BY_ID[tool.id]] || '';
  if (acceptEl) acceptEl.textContent = `Accepted format: ${tool.accept}${tool.multiple ? ' · multiple files allowed' : ''}`;
  fileInput.accept = tool.accept;
  fileInput.multiple = !!tool.multiple;

  function fileIconFor(file){
    if (file.type && file.type.startsWith('image/')) {
      return null; // will render a real thumbnail instead
    }
    return `<span class="file-icon">${ICONS.generic}</span>`;
  }

  function renderFileList(){
    fileListEl.innerHTML = selectedFiles.map((f, i) => {
      const isImage = f.type && f.type.startsWith('image/');
      const thumbId = `thumb-${i}`;
      return `
      <li>
        <span class="file-name">
          ${isImage ? `<img class="file-thumb" id="${thumbId}" alt="">` : fileIconFor(f)}
          <span>${f.name}</span>
          <small style="color:var(--ink-faint); flex-shrink:0;">(${(f.size/1024).toFixed(0)} KB)</small>
        </span>
        <button type="button" data-idx="${i}" aria-label="Remove ${f.name}">✕</button>
      </li>`;
    }).join('');

    selectedFiles.forEach((f, i) => {
      if (f.type && f.type.startsWith('image/')) {
        const img = document.getElementById(`thumb-${i}`);
        if (img) img.src = URL.createObjectURL(f);
      }
    });

    fileListEl.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => {
        selectedFiles.splice(parseInt(b.dataset.idx, 10), 1);
        renderFileList();
        updateSubmitState();
      });
    });
  }

  function updateSubmitState(){
    submitBtn.disabled = selectedFiles.length === 0;
  }

  function addFiles(fileListObj){
    const incoming = Array.from(fileListObj);
    selectedFiles = tool.multiple ? selectedFiles.concat(incoming) : incoming.slice(0, 1);
    renderFileList();
    updateSubmitState();
    resetStatus();
    fileInput.value = '';
  }

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => addFiles(fileInput.files));

  if (toolOptionsEl && tool.options) {
    toolOptionsEl.innerHTML = tool.options.map((o) => {
      if (o.type === 'select') {
        return `<label>${o.label}
          <select name="${o.name}">
            ${o.choices.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}
          </select>
        </label>`;
      }
      if (o.type === 'range') {
        return `<label>${o.label}
          <span class="range-row">
            <input type="range" name="${o.name}" min="${o.min}" max="${o.max}" step="${o.step}" value="${o.default}">
            <span class="range-val">${o.default}</span>
          </span>
        </label>`;
      }
      return `<label>${o.label}
        <input type="text" name="${o.name}" placeholder="${o.placeholder || ''}" value="${o.default || ''}">
      </label>`;
    }).join('');

    toolOptionsEl.querySelectorAll('input[type=range]').forEach((r) => {
      const valEl = r.closest('.range-row').querySelector('.range-val');
      r.addEventListener('input', () => { valEl.textContent = r.value; });
    });
  }

  function setStep(stepName){
    if (!progressEl) return;
    progressEl.classList.add('is-active');
    const order = ['upload', 'process', 'done'];
    const idx = order.indexOf(stepName);
    progressEl.querySelectorAll('.progress-step').forEach((el, i) => {
      el.classList.remove('is-active', 'is-done');
      if (i < idx) el.classList.add('is-done');
      else if (i === idx) el.classList.add('is-active');
    });
  }

  function resetStatus(){
    if (progressEl) { progressEl.classList.remove('is-active'); progressEl.querySelectorAll('.progress-step').forEach((el) => el.classList.remove('is-active','is-done')); }
    statusEl.innerHTML = '';
  }

  function showResult(kind, message){
    if (progressEl && kind === 'success') setStep('done');
    const icon = kind === 'success' ? CHECK_ICON : ERROR_ICON;
    statusEl.innerHTML = `
      ${icon}
      <span class="status-text ${kind}">${message}</span>
      ${kind === 'error' ? '<button type="button" class="retry-btn show" id="retryBtn">Try again</button>' : ''}
    `;
    if (kind === 'error') {
      document.getElementById('retryBtn').addEventListener('click', () => submitForm());
    }
  }

  async function submitForm(){
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append(tool.field, f));
    (tool.options || []).forEach((o) => {
      const input = toolOptionsEl.querySelector(`[name="${o.name}"]`);
      if (input) formData.append(o.name, input.value);
    });

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing…';
    statusEl.innerHTML = '';
    setStep('upload');

    try {
      // brief delay so the "uploading" step is visible even on fast local networks
      await new Promise((r) => setTimeout(r, 250));
      setStep('process');

      const resp = await fetch(API_BASE + tool.endpoint, { method: 'POST', body: formData });

      if (!resp.ok) {
        let msg = 'Something went wrong while processing your file.';
        try { const j = await resp.json(); if (j.error) msg = j.error; } catch {}
        throw new Error(msg);
      }

      const disposition = resp.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : tool.resultName;

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);

      showResult('success', 'Done — your download has started');
    } catch (err) {
      showResult('error', err.message || 'An unexpected error occurred.');
    } finally {
      submitBtn.disabled = selectedFiles.length === 0;
      submitBtn.textContent = 'Process & download';
    }
  }

  submitBtn.addEventListener('click', submitForm);
}

document.addEventListener('DOMContentLoaded', () => {
  const tool = TOOLS.find((t) => t.id === window.CURRENT_TOOL_ID);
  if (tool) initToolWidget(tool);

  // Smooth-animating FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-panel');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-panel').style.maxHeight = null;
        }
      });
      item.classList.toggle('is-open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });
});
