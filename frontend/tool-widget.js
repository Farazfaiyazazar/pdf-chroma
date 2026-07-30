// Generic inline tool widget. Each tool page includes tools-data.js, sets
// window.CURRENT_TOOL_ID, then includes this script to wire up its own
// upload box, options, submit button, progress tracker and result states.

const API_BASE = window.OBSIDIAN_API_BASE || 'http://localhost:4000/api';

const ICONS = {
  merge: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M192,40v64a8,8,0,0,1-2.34,5.66L136,163.31v49.38l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,212.69V163.31L66.34,109.66A8,8,0,0,1,64,104V40a8,8,0,0,1,16,0v60.69l48,48,48-48V40a8,8,0,0,1,16,0Z"/></svg>',
  split: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M157.73,113.13A8,8,0,0,1,159.82,102L227.48,55.7a8,8,0,0,1,9,13.21l-67.67,46.3a7.92,7.92,0,0,1-4.51,1.4A8,8,0,0,1,157.73,113.13Zm80.87,85.09a8,8,0,0,1-11.12,2.08L136,137.7,93.49,166.78a36,36,0,1,1-9-13.19L121.83,128,84.44,102.41a35.86,35.86,0,1,1,9-13.19l143,97.87A8,8,0,0,1,238.6,198.22ZM80,180a20,20,0,1,0-5.86,14.14A19.85,19.85,0,0,0,80,180ZM74.14,90.13a20,20,0,1,0-28.28,0A19.85,19.85,0,0,0,74.14,90.13Z"/></svg>',
  rotate: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/></svg>',
  numbers: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.58,55.16,48,52.94V104a8,8,0,0,0,16,0V40a8,8,0,0,0-11.58-7.16l-16,8a8,8,0,0,0,7.16,14.32ZM79.77,156.72a23.73,23.73,0,0,0-9.6-15.95,24.86,24.86,0,0,0-34.11,4.7,23.63,23.63,0,0,0-3.57,6.46,8,8,0,1,0,15,5.47,7.84,7.84,0,0,1,1.18-2.13,8.76,8.76,0,0,1,12-1.59A7.91,7.91,0,0,1,63.93,159a7.64,7.64,0,0,1-1.57,5.78,1,1,0,0,0-.08.11L33.59,203.21A8,8,0,0,0,40,216H72a8,8,0,0,0,0-16H56l19.08-25.53A23.47,23.47,0,0,0,79.77,156.72Z"/></svg>',
  compress: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M144,104V64a8,8,0,0,1,16,0V84.69l42.34-42.35a8,8,0,0,1,11.32,11.32L171.31,96H192a8,8,0,0,1,0,16H152A8,8,0,0,1,144,104Zm-40,40H64a8,8,0,0,0,0,16H84.69L42.34,202.34a8,8,0,0,0,11.32,11.32L96,171.31V192a8,8,0,0,0,16,0V152A8,8,0,0,0,104,144Zm67.31,16H192a8,8,0,0,0,0-16H152a8,8,0,0,0-8,8v40a8,8,0,0,0,16,0V171.31l42.34,42.35a8,8,0,0,0,11.32-11.32ZM104,56a8,8,0,0,0-8,8V84.69L53.66,42.34A8,8,0,0,0,42.34,53.66L84.69,96H64a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V64A8,8,0,0,0,104,56Z"/></svg>',
  watermark: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M224,224a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,224Zm0-80v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V144a16,16,0,0,1,16-16h56.43L88.72,54.71A32,32,0,0,1,120,16h16a32,32,0,0,1,31.29,38.71L151.57,128H208A16,16,0,0,1,224,144ZM120.79,128h14.42l16.43-76.65A16,16,0,0,0,136,32H120a16,16,0,0,0-15.65,19.35ZM208,184V144H48v40H208Z"/></svg>',
  wordpdf: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Zm0,56H44V160h8a20,20,0,0,1,0,40Zm169.53-4.91a8,8,0,0,1,.25,11.31A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,221.53,195.09ZM128,144c-17.65,0-32,16.15-32,36s14.35,36,32,36,32-16.15,32-36S145.65,144,128,144Zm0,56c-8.82,0-16-9-16-20s7.18-20,16-20,16,9,16,20S136.82,200,128,200ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z"/></svg>',
  jpg: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M120,144H104a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm96,0v16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,192,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.38,29.38,0,0,1,16.48,5.12,8,8,0,0,1-9,13.26A13.21,13.21,0,0,0,192,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.63,13.63,0,0,0,8-2.71V192a8,8,0,0,1,0-16h8A8,8,0,0,1,216,184ZM80,152v38a26,26,0,0,1-52,0,8,8,0,0,1,16,0,10,10,0,0,0,20,0V152a8,8,0,0,1,16,0ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z"/></svg>',
  ppt: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M224,152a8,8,0,0,1-8,8H204v48a8,8,0,0,1-16,0V160H176a8,8,0,0,1,0-16h40A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm84,0a28,28,0,0,1-28,28h-8v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h16A28,28,0,0,1,160,172Zm-16,0a12,12,0,0,0-12-12h-8v24h8A12,12,0,0,0,144,172ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z"/></svg>',
  xls: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M156,208a8,8,0,0,1-8,8H120a8,8,0,0,1-8-8V152a8,8,0,0,1,16,0v48h20A8,8,0,0,1,156,208ZM92.65,145.49a8,8,0,0,0-11.16,1.86L68,166.24,54.51,147.35a8,8,0,1,0-13,9.3L58.17,180,41.49,203.35a8,8,0,0,0,13,9.3L68,193.76l13.49,18.89a8,8,0,0,0,13-9.3L77.83,180l16.68-23.35A8,8,0,0,0,92.65,145.49Zm98.94,25.82c-4-1.16-8.14-2.35-10.45-3.84-1.25-.82-1.23-1-1.12-1.9a4.54,4.54,0,0,1,2-3.67c4.6-3.12,15.34-1.72,19.82-.56a8,8,0,0,0,4.07-15.48c-2.11-.55-21-5.22-32.83,2.76a20.58,20.58,0,0,0-8.95,14.95c-2,15.88,13.65,20.41,23,23.11,12.06,3.49,13.12,4.92,12.78,7.59-.31,2.41-1.26,3.33-2.15,3.93-4.6,3.06-15.16,1.55-19.54.35A8,8,0,0,0,173.93,214a60.63,60.63,0,0,0,15.19,2c5.82,0,12.3-1,17.49-4.46a20.81,20.81,0,0,0,9.18-15.23C218,179,201.48,174.17,191.59,171.31ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,1,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.68L160,51.31Z"/></svg>',
  lock: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"/></svg>',
  unlock: '<svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"/></svg>',
  eye: '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>',
  generic: '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"/></svg>',
};

const ICON_BY_ID = {
  merge:'merge', split:'split', rotate:'rotate', numbers:'numbers', compress:'compress',
  watermark:'watermark', 'word-to-pdf':'wordpdf', 'ppt-to-pdf':'ppt', 'xls-to-pdf':'xls',
  'jpg-to-pdf':'jpg', 'pdf-to-word':'wordpdf', 'pdf-to-ppt':'ppt', 'pdf-to-xls':'xls', 'pdf-to-jpg':'jpg',
  protect:'lock', unlock:'unlock'
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

  // Handoff: if the homepage drop zone sent us here (?handoff=1), pull the
  // stashed file out of IndexedDB and load it as if the user picked it here.
  // Fully guarded — any failure just leaves the uploader empty, never throws.
  (function receiveHandoff(){
    try {
      if (new URLSearchParams(window.location.search).get('handoff') !== '1') return;
      if (!('indexedDB' in window)) return;
      const req = indexedDB.open('pdfchroma', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('handoff');
      req.onsuccess = () => {
        try {
          const db = req.result;
          const tx = db.transaction('handoff', 'readwrite');
          const store = tx.objectStore('handoff');
          const getReq = store.get('pending');
          getReq.onsuccess = () => {
            const rec = getReq.result;
            store.delete('pending'); // consume once
            if (rec && rec.file && (Date.now() - rec.ts) < 120000) {
              addFiles([rec.file]);
            }
          };
        } catch (_) { /* no-op */ }
      };
    } catch (_) { /* no-op */ }
  })();

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
      if (o.type === 'password') {
        return `<label>${o.label}
          <span class="password-row">
            <input type="password" name="${o.name}" placeholder="${o.placeholder || ''}" autocomplete="new-password">
            <button type="button" class="password-toggle" aria-label="Show password">${ICONS.eye || '👁'}</button>
          </span>
        </label>`;
      }
      return `<label>${o.label}
        <input type="text" name="${o.name}" placeholder="${o.placeholder || ''}" value="${o.default || ''}">
      </label>`;
    }).join('');

    toolOptionsEl.querySelectorAll('.password-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    });

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
