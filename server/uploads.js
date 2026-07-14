import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadDirectory = path.join(__dirname, '..', 'upload_images');
export const maxFileSize = 5 * 1024 * 1024;
// Dropzone adds an index when uploadMultiple is enabled: images[0], images[1], ...
const uploadFieldPattern = /^images\[\d+\]$/;
export const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]);

mkdirSync(uploadDirectory, { recursive: true });

export function validateUploadFile(file) {
  return Boolean(
    file
    && allowedTypes.has(file.mimetype)
    && file.size <= maxFileSize
  );
}

export function isUploadField(fieldName) {
  return uploadFieldPattern.test(fieldName);
}

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
    files: 6
  },
  fileFilter: (_request, file, callback) => {
    if (!isUploadField(file.fieldname)) {
      callback(new Error('Unexpected upload field. Use images[0], images[1], etc.'));
      return;
    }

    const isAllowed = allowedTypes.has(file.mimetype);

    callback(
      isAllowed ? null : new Error('Only JPG, PNG, WEBP and GIF images are allowed.'),
      isAllowed
    );
  }
});
