import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const materialDirectory = path.join(__dirname, '..', '..', '..', 'uploads', 'study-materials');

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

fs.mkdirSync(materialDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, materialDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 80);
    callback(null, `${safeBaseName}-${Date.now()}${extension}`);
  },
});

function fileFilter(_req, file, callback) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(new Error('Only PDF, image, DOC, and DOCX materials are allowed'));
    return;
  }

  callback(null, true);
}

export const uploadStudyMaterialFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
});
