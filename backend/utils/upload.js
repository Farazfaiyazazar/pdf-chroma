const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuid } = require('uuid');

const TMP_DIR = path.join(__dirname, '..', 'tmp');

// Every request gets its own isolated job folder under tmp/<jobId>/
// so concurrent uploads never collide and cleanup is a single rmdir.
function makeJobDir() {
  const jobId = uuid();
  const dir = path.join(TMP_DIR, jobId);
  fs.ensureDirSync(dir);
  return { jobId, dir };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.jobDir) {
      const { jobId, dir } = makeJobDir();
      req.jobId = jobId;
      req.jobDir = dir;
    }
    cb(null, req.jobDir);
  },
  filename: (req, file, cb) => {
    // Keep the original name (sanitised) so LibreOffice/poppler output
    // filenames stay predictable for the conversion step.
    const safe = file.originalname.replace(/[^\w.\-\u0600-\u06FF ]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  }
});

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 30 }
});

module.exports = { upload, makeJobDir, TMP_DIR };
