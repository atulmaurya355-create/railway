import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const paperDirectory = path.join(__dirname, '..', '..', '..', 'uploads', 'previous-papers');

fs.mkdirSync(paperDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, paperDirectory);
  },
  filename: (_req, file, callback) => {
    const safeBaseName = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 80);
    callback(null, `${safeBaseName}-${Date.now()}.pdf`);
  },
});

function fileFilter(_req, file, callback) {
  if (file.mimetype !== 'application/pdf') {
    callback(new Error('Only PDF uploads are allowed'));
    return;
  }

  callback(null, true);
}

export const uploadPreviousPaperPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});
