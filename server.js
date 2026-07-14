import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  addUser,
  checkDatabaseConnection,
  config
} from './server/database.js';
import {
  upload,
  uploadDirectory
} from './server/uploads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

app.get('/', (_request, response) => {
  response.sendFile(path.join(__dirname, 'index.htm'));
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/upload_images', express.static(uploadDirectory));

function validateUserInput(body = {}) {
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const type = typeof body.type === 'string' ? body.type.trim() : '';

  if (!email || !password || !type) {
    const error = new Error('email, password, and type are required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    email,
    password,
    type,
    active: body.active !== false
  };
}

app.post('/api/users', async (request, response, next) => {
  try {
    await addUser(validateUserInput(request.body));
    response.status(201).json({
      success: true,
      message: 'User created.'
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/health/db', async (_request, response) => {
  try {
    await checkDatabaseConnection();
    response.json({ status: 'ok', database: 'connected' });
  } catch (_error) {
    response.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.post('/api/upload', upload.any(), (request, response) => {
  if (!request.files?.length) {
    return response.status(400).json({
      success: false,
      message: 'Choose at least one image.'
    });
  }

  const files = request.files.map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    size: file.size,
    url: `/upload_images/${file.filename}`
  }));

  return response.status(201).json({
    success: true,
    message: `${files.length} image(s) uploaded.`,
    files
  });
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'Click Fit server' });
});

app.use((error, request, response, _next) => {
  const isUploadError = error.code?.startsWith('LIMIT_')
    || error.message?.includes('image')
    || error.message?.includes('upload field');
  const statusCode = error.statusCode || (isUploadError ? 400 : 500);

  if (statusCode >= 500) {
    console.error(`[${request.method} ${request.originalUrl}]`, error.message);
  }

  response.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? 'Unexpected server error.' : error.message
  });
});

const isMainModule = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  app.listen(config.port, () => {
    console.log(`Click Fit is running at http://localhost:${config.port}`);
  });
}

export {
  app,
  validateUserInput
};
