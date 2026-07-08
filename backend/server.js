require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 4000;
const TMP_DIR = path.join(__dirname, 'tmp');
fs.ensureDirSync(TMP_DIR);

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Basic protection against abuse of conversion endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' }
});
app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'Obsidian PDF Toolkit API' });
});

app.use('/api', require('./routes/organize'));
app.use('/api', require('./routes/optimize'));
app.use('/api', require('./routes/convert'));

// Central error handler — every route funnels failures here
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.publicMessage || 'Something went wrong while processing the file. Please try again.'
  });
});

// Housekeeping: wipe anything left in tmp/ older than 1 hour, every 30 minutes
setInterval(async () => {
  try {
    const entries = await fs.readdir(TMP_DIR);
    const now = Date.now();
    for (const entry of entries) {
      const full = path.join(TMP_DIR, entry);
      const stat = await fs.stat(full).catch(() => null);
      if (stat && now - stat.mtimeMs > 60 * 60 * 1000) {
        await fs.remove(full);
      }
    }
  } catch (e) {
    console.error('cleanup error', e);
  }
}, 30 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Obsidian PDF Toolkit API listening on port ${PORT}`);
});
