let Storage;
try { Storage = require('@google-cloud/storage').Storage; } catch { Storage = null; }

const REPLIT_SIDECAR_ENDPOINT = 'http://127.0.0.1:1106';

const storageClient = Storage ? new Storage({
  credentials: {
    audience: 'replit',
    subject_token_type: 'access_token',
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: 'external_account',
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: { type: 'json', subject_token_field_name: 'access_token' },
    },
    universe_domain: 'googleapis.com',
  },
  projectId: '',
}) : null;

function getBase() {
  const dir = process.env.PRIVATE_OBJECT_DIR || '';
  if (!dir || !storageClient) throw new Error('Object storage not available (no @google-cloud/storage or PRIVATE_OBJECT_DIR)');
  const clean = dir.startsWith('/') ? dir.slice(1) : dir;
  const [bucketName, ...rest] = clean.split('/');
  return { bucketName, prefix: rest.join('/') };
}

function fileFor(filename) {
  const { bucketName, prefix } = getBase();
  const objectName = `${prefix}/photos/${filename}`.replace(/^\/+/, '');
  return storageClient.bucket(bucketName).file(objectName);
}

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.bmp': 'image/bmp',
};

function contentTypeFor(filename) {
  const ext = (filename.match(/\.[^.]+$/) || [''])[0].toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

async function putObject(filename, buffer) {
  const file = fileFor(filename);
  await file.save(buffer, {
    contentType: contentTypeFor(filename),
    resumable: false,
  });
}

async function objectExists(filename) {
  const [exists] = await fileFor(filename).exists();
  return exists;
}

async function deleteObject(filename) {
  try {
    await fileFor(filename).delete();
  } catch (err) {
    if (err.code !== 404) throw err;
  }
}

async function streamObject(filename, res) {
  const file = fileFor(filename);
  const [exists] = await file.exists();
  if (!exists) return false;
  const [metadata] = await file.getMetadata();
  res.set({
    'Content-Type': metadata.contentType || contentTypeFor(filename),
    'Content-Length': metadata.size,
    'Cache-Control': 'private, max-age=3600',
  });
  await new Promise((resolve, reject) => {
    const stream = file.createReadStream();
    stream.on('error', reject);
    stream.on('end', resolve);
    stream.pipe(res);
  });
  return true;
}

// ─── Временные объекты для порционной загрузки импорта ───────────────────────

function importFileFor(objectName) {
  const { bucketName, prefix } = getBase();
  return storageClient.bucket(bucketName).file(`${prefix}/imports/${objectName}`.replace(/^\/+/, ''));
}

async function putImportPart(uploadId, index, buffer) {
  await importFileFor(`${uploadId}/${index}.part`).save(buffer, {
    contentType: 'application/octet-stream',
    resumable: false,
  });
}

async function downloadImportPart(uploadId, index) {
  const file = importFileFor(`${uploadId}/${index}.part`);
  const [exists] = await file.exists();
  if (!exists) return null;
  const [buf] = await file.download();
  return buf;
}

async function cleanupImportParts(uploadId) {
  const { bucketName, prefix } = getBase();
  const [files] = await storageClient.bucket(bucketName).getFiles({
    prefix: `${prefix}/imports/${uploadId}/`.replace(/^\/+/, ''),
  });
  await Promise.all(files.map(f => f.delete().catch(() => {})));
}

// Удаление брошенных загрузок старше 24 часов (вызывается лениво)
async function cleanupStaleImports() {
  try {
    const { bucketName, prefix } = getBase();
    const [files] = await storageClient.bucket(bucketName).getFiles({
      prefix: `${prefix}/imports/`.replace(/^\/+/, ''),
    });
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    await Promise.all(files
      .filter(f => new Date(f.metadata.timeCreated).getTime() < cutoff)
      .map(f => f.delete().catch(() => {})));
  } catch (err) {
    console.error('Stale import cleanup error:', err.message);
  }
}

async function downloadObject(filename) {
  try {
    const [buf] = await fileFor(filename).download();
    return buf;
  } catch {
    return null;
  }
}

module.exports = {
  putObject, objectExists, deleteObject, streamObject, contentTypeFor, downloadObject,
  putImportPart, downloadImportPart, cleanupImportParts, cleanupStaleImports,
};
