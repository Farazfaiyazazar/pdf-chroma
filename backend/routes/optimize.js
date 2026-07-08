const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { PDFDocument } = require('pdf-lib');
const { upload } = require('../utils/upload');

const execAsync = promisify(exec);
const router = express.Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

async function cleanupJob(req) {
  if (req.jobDir) await fs.remove(req.jobDir).catch(() => {});
}

async function hasGhostscript() {
  try {
    await execAsync('gs --version');
    return true;
  } catch {
    return false;
  }
}

// ---------- COMPRESS ----------
// Uses Ghostscript when available on the server for real, strong compression
// (image downsampling + stream recompression). Falls back to a pdf-lib
// re-save, which only removes redundant objects and rebuilds the xref table
// — a much smaller size reduction, but it always works with zero system deps.
router.post('/compress', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  const level = ['screen', 'ebook', 'printer'].includes(req.body.level) ? req.body.level : 'ebook';
  const outPath = path.join(req.jobDir, 'compressed.pdf');

  if (await hasGhostscript()) {
    const cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${level} ` +
      `-dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outPath}" "${req.file.path}"`;
    await execAsync(cmd);
  } else {
    const bytes = await fs.readFile(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const outBytes = await doc.save({ useObjectStreams: true });
    await fs.writeFile(outPath, outBytes);
  }

  res.download(outPath, 'compressed.pdf', async () => cleanupJob(req));
}));

module.exports = router;
