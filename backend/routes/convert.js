const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const archiver = require('archiver');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
const { upload } = require('../utils/upload');

const execAsync = promisify(exec);
const router = express.Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

async function cleanupJob(req) {
  if (req.jobDir) await fs.remove(req.jobDir).catch(() => {});
}

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

function missingToolError(toolName, installHint) {
  const e = new Error(`${toolName} not installed`);
  e.status = 503;
  e.publicMessage = `This feature needs ${toolName} installed on the server, which isn't set up yet. Install with: ${installHint}`;
  return e;
}

async function checkBinary(cmd) {
  try { await execAsync(cmd); return true; } catch { return false; }
}

// ---------- PDF -> JPG (requires poppler-utils: pdftoppm) ----------
router.post('/pdf-to-jpg', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a PDF file.'; throw e; }
  if (!(await checkBinary('pdftoppm -v'))) {
    throw missingToolError('poppler-utils', 'sudo apt-get install -y poppler-utils');
  }
  const outPrefix = path.join(req.jobDir, 'page');
  await execAsync(`pdftoppm -jpeg -r 150 "${req.file.path}" "${outPrefix}"`);

  const files = (await fs.readdir(req.jobDir))
    .filter((f) => f.startsWith('page') && f.endsWith('.jpg'))
    .sort()
    .map((f) => path.join(req.jobDir, f));

  if (files.length === 0) {
    const e = new Error('conversion produced no output'); e.status = 500;
    e.publicMessage = 'Converting the file to images failed.'; throw e;
  }
  if (files.length === 1) {
    return res.download(files[0], 'page-1.jpg', async () => cleanupJob(req));
  }
  const zipPath = path.join(req.jobDir, 'pages.zip');
  await zipFiles(files, zipPath);
  res.download(zipPath, 'pdf-pages.zip', async () => cleanupJob(req));
}));

// ---------- JPG/PNG -> PDF ----------
router.post('/jpg-to-pdf', upload.array('files', 30), wrap(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    const e = new Error('no files'); e.status = 400; e.publicMessage = 'Please choose at least one image.'; throw e;
  }
  const doc = await PDFDocument.create();
  for (const file of req.files) {
    const normalized = await sharp(file.path).jpeg({ quality: 92 }).toBuffer();
    const img = await doc.embedJpg(normalized);
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const outBytes = await doc.save();
  const outPath = path.join(req.jobDir, 'images.pdf');
  await fs.writeFile(outPath, outBytes);
  res.download(outPath, 'images.pdf', async () => cleanupJob(req));
}));

// ---------- Generic LibreOffice conversion (Office <-> PDF) ----------
// Covers: word-to-pdf, powerpoint-to-pdf, excel-to-pdf, pdf-to-word,
// pdf-to-powerpoint, pdf-to-excel. LibreOffice headless does the heavy
// lifting; quality on PDF -> editable formats depends on how structured
// the source PDF is (scanned/image PDFs will need OCR first).
//
// Important bug fix: by default, LibreOffice opens a PDF using its *Draw*
// import filter — treating it as flat page graphics, not text. That makes
// export to docx/pptx/xlsx fail outright ("no export filter found"), since
// you can't export a Draw document into a text/spreadsheet format. Passing
// --infilter="writer_pdf_import" forces LibreOffice to import the PDF as a
// real Writer text document instead, which is what actually enables
// conversion to editable formats.
async function convertWithLibreOffice(req, res, targetExt, inFilter) {
  if (!req.file) { const e = new Error('no file'); e.status = 400; e.publicMessage = 'Please choose a file.'; throw e; }
  if (!(await checkBinary('soffice --version'))) {
    throw missingToolError('LibreOffice', 'sudo apt-get install -y libreoffice');
  }
  const filterArg = inFilter ? ` --infilter="${inFilter}"` : '';
  await execAsync(
    `soffice --headless --norestore${filterArg} --convert-to ${targetExt} --outdir "${req.jobDir}" "${req.file.path}"`,
    { timeout: 120000 }
  );
  const base = path.parse(req.file.filename).name;
  const outPath = path.join(req.jobDir, `${base}.${targetExt}`);
  if (!(await fs.pathExists(outPath))) {
    const e = new Error('conversion produced no output'); e.status = 500;
    e.publicMessage = 'The conversion failed. The file may be corrupted or encrypted.'; throw e;
  }
  res.download(outPath, `converted.${targetExt}`, async () => cleanupJob(req));
}

router.post('/word-to-pdf', upload.single('file'), wrap((req, res) => convertWithLibreOffice(req, res, 'pdf')));
router.post('/powerpoint-to-pdf', upload.single('file'), wrap((req, res) => convertWithLibreOffice(req, res, 'pdf')));
router.post('/excel-to-pdf', upload.single('file'), wrap((req, res) => convertWithLibreOffice(req, res, 'pdf')));
router.post('/pdf-to-word', upload.single('file'), wrap((req, res) => convertWithLibreOffice(req, res, 'docx', 'writer_pdf_import')));
router.post('/pdf-to-powerpoint', upload.single('file'), wrap((req, res) => convertWithLibreOffice(req, res, 'pptx', 'writer_pdf_import')));
router.post('/pdf-to-excel', upload.single('file'), wrap((req, res) => convertWithLibreOffice(req, res, 'xlsx', 'writer_pdf_import')));

module.exports = router;
