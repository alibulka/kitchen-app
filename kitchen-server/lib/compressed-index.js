const fs = require('node:fs/promises');
const { gzip } = require('node:zlib');
const { promisify } = require('node:util');

const compress = promisify(gzip);

// Cache only the compressed static page, never user data or API responses.
// The file signature invalidates the cache when the page changes in development.
function createCompressedIndexHandler(indexPath) {
  let cached = null;
  return async (req, res, next) => {
    res.vary('Accept-Encoding');
    if (req.acceptsEncodings('gzip', 'identity') !== 'gzip') return next();
    try {
      const stat = await fs.stat(indexPath);
      const key = `${stat.mtimeMs}:${stat.size}`;
      if (!cached || cached.key !== key) {
        cached = {
          key,
          modified: stat.mtime.toUTCString(),
          body: fs.readFile(indexPath).then(body => compress(body, { level: 6 })),
        };
      }
      const current = cached;
      const body = await current.body;
      res.type('html');
      res.set('Content-Encoding', 'gzip');
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
      res.set('Last-Modified', current.modified);
      res.send(body);
    } catch (error) {
      cached = null;
      next(error);
    }
  };
}

module.exports = { createCompressedIndexHandler };
