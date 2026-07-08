const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { PDFDocument, degrees, rgb, StandardFonts } = require('pdf-lib');
const { upload } = require('../utils/upload');

const router = express.Router();

// Wrap async route handlers so thrown errors reach the central error handler
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

async function cleanupJob(req) {
  if (req.jobDir) await fs.remove(req.jobDir).catch(() => {});
}

// ---------- MERGE ----------
router.post('/merge', upload.array('files', 30), wrap(async (req, res) => {
  if (!req.files || req.files.length < 2) {
    const e = new Error('need at least 2 files'); e.status = 400;
    e.publicMessage = 'Merging needs at least two PDF files.'; throw e;
  }
  const merged = await PDFDocument.create();
  for (const file of req.files) {
    const bytes = await fs.readFile(file.path);
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const outBytes = await merged.save();
  const outPath = path.join(req.jobDir, 'merged.pdf');
  await fs.writeFile(outPath, outBytes);
  res.download(outPath, 'merged.pdf', async () => cleanupJob(req));
}));

// ---------- SPLIT ----------
// body: ranges="1-3,5,7-8" -> zip of separate PDFs, one per range
router.post('/split', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  const bytes = await fs.readFile(req.file.path);
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();

  const rangesInput = (req.body.ranges || '').trim();
  const ranges = rangesInput
    ? rangesInput.split(',').map((r) => r.trim()).filter(Boolean)
    : Array.from({ length: total }, (_, i) => String(i + 1)); // default: one PDF per page

  const outFiles = [];
  for (let i = 0; i < ranges.length; i++) {
    const [startStr, endStr] = ranges[i].split('-');
    const start = Math.max(1, parseInt(startStr, 10) || 1);
    const end = Math.min(total, parseInt(endStr || startStr, 10) || start);
    const doc = await PDFDocument.create();
    const indices = [];
    for (let p = start; p <= end; p++) indices.push(p - 1);
    const pages = await doc.copyPages(src, indices);
    pages.forEach((p) => doc.addPage(p));
    const outBytes = await doc.save();
    const outPath = path.join(req.jobDir, `part_${i + 1}_p${start}-${end}.pdf`);
    await fs.writeFile(outPath, outBytes);
    outFiles.push(outPath);
  }

  if (outFiles.length === 1) {
    return res.download(outFiles[0], path.basename(outFiles[0]), async () => cleanupJob(req));
  }

  const zipPath = path.join(req.jobDir, 'split_result.zip');
  await zipFiles(outFiles, zipPath);
  res.download(zipPath, 'split_result.zip', async () => cleanupJob(req));
}));

// ---------- ROTATE ----------
// body: angle=90|180|270, pages="all" or "1,3,5"
router.post('/rotate', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  const angle = parseInt(req.body.angle, 10) || 90;
  const bytes = await fs.readFile(req.file.path);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = doc.getPageCount();

  const target = (req.body.pages || 'all').trim();
  const indices = target === 'all'
    ? Array.from({ length: total }, (_, i) => i)
    : target.split(',').map((n) => parseInt(n.trim(), 10) - 1).filter((i) => i >= 0 && i < total);

  indices.forEach((i) => {
    const page = doc.getPage(i);
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360));
  });

  const outBytes = await doc.save();
  const outPath = path.join(req.jobDir, 'rotated.pdf');
  await fs.writeFile(outPath, outBytes);
  res.download(outPath, 'rotated.pdf', async () => cleanupJob(req));
}));

// ---------- WATERMARK ----------
// body: text, opacity(0-1), fontSize
router.post('/watermark', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  const text = (req.body.text || 'CONFIDENTIAL').toString().slice(0, 60);
  const opacity = Math.min(1, Math.max(0.05, parseFloat(req.body.opacity) || 0.25));

  const bytes = await fs.readFile(req.file.path);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) / 8;
    page.drawText(text, {
      x: width / 2 - (font.widthOfTextAtSize(text, fontSize) / 2),
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.55, 0.45, 0.15),
      opacity,
      rotate: degrees(45)
    });
  });

  const outBytes = await doc.save();
  const outPath = path.join(req.jobDir, 'watermarked.pdf');
  await fs.writeFile(outPath, outBytes);
  res.download(outPath, 'watermarked.pdf', async () => cleanupJob(req));
}));

// ---------- ADD PAGE NUMBERS ----------
router.post('/page-numbers', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  const bytes = await fs.readFile(req.file.path);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  pages.forEach((page, i) => {
    const { width } = page.getSize();
    const label = `${i + 1} / ${pages.length}`;
    page.drawText(label, {
      x: width / 2 - font.widthOfTextAtSize(label, 10) / 2,
      y: 24,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4)
    });
  });

  const outBytes = await doc.save();
  const outPath = path.join(req.jobDir, 'numbered.pdf');
  await fs.writeFile(outPath, outBytes);
  res.download(outPath, 'numbered.pdf', async () => cleanupJob(req));
}));

function zipFiles(files, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    files.forEach((f) => archive.file(f, { name: path.basename(f) }));
    archive.finalize();
  });
}

module.exports = router;
