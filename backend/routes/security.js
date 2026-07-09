const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const { upload } = require('../utils/upload');

const execFileAsync = promisify(execFile);
const router = express.Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

async function cleanupJob(req) {
  if (req.jobDir) await fs.remove(req.jobDir).catch(() => {});
}

async function hasQpdf() {
  try { await execFileAsync('qpdf', ['--version']); return true; } catch { return false; }
}

function missingToolError() {
  const e = new Error('qpdf not installed');
  e.status = 503;
  e.publicMessage = "This feature needs qpdf installed on the server, which isn't set up yet. Install with: sudo apt-get install -y qpdf";
  return e;
}

// ---------- PROTECT (add a password) ----------
// Uses execFile (not exec/shell) so the password never passes through shell
// interpretation — it's just a literal argument, no escaping needed and no
// injection risk regardless of what characters the password contains.
router.post('/protect', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  const password = (req.body.password || '').toString();
  if (password.length < 4) {
    const e = new Error('weak password'); e.status = 400;
    e.publicMessage = 'Please enter a password of at least 4 characters.'; throw e;
  }
  if (!(await hasQpdf())) throw missingToolError();

  const outPath = path.join(req.jobDir, 'protected.pdf');
  try {
    await execFileAsync('qpdf', ['--encrypt', password, password, '256', '--', req.file.path, outPath]);
  } catch (err) {
    const e = new Error('protection failed'); e.status = 500;
    e.publicMessage = 'Adding password protection failed. The file may be corrupted or already encrypted.'; throw e;
  }
  if (!(await fs.pathExists(outPath))) {
    const e = new Error('protection produced no output'); e.status = 500;
    e.publicMessage = 'Adding password protection failed. The file may be corrupted or already encrypted.'; throw e;
  }
  res.download(outPath, 'protected.pdf', async () => cleanupJob(req));
}));

// ---------- UNLOCK (remove a known password) ----------
router.post('/unlock', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  const password = (req.body.password || '').toString();
  if (!(await hasQpdf())) throw missingToolError();

  const outPath = path.join(req.jobDir, 'unlocked.pdf');
  try {
    await execFileAsync('qpdf', [`--password=${password}`, '--decrypt', req.file.path, outPath]);
  } catch (err) {
    const e = new Error('unlock failed'); e.status = 500;
    e.publicMessage = 'Removing the password failed. Double-check the password is correct.'; throw e;
  }
  if (!(await fs.pathExists(outPath))) {
    const e = new Error('unlock produced no output'); e.status = 500;
    e.publicMessage = 'Removing the password failed. Double-check the password is correct.'; throw e;
  }
  res.download(outPath, 'unlocked.pdf', async () => cleanupJob(req));
}));

module.exports = router;
