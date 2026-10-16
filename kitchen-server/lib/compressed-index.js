const fs = require('node:fs/promises');
const { gzip } = require('node:zlib');
const { promisify } = require('node:util');

const compress = promisify(gzip);

// Cache only the compressed static page, never user data or API responses.
// The file signature invalidates the cache when the page changes in development.
function createCompressedIndexHandler(indexPath, { transform, contentType = 'html' } = {}) {
  let cached = null;
  return async (req, res, next) => {
    res.vary('Accept-Encoding');
    const useGzip = req.acceptsEncodings('gzip', 'identity') === 'gzip';
    try {
      const stat = await fs.stat(indexPath);
      const key = `${stat.mtimeMs}:${stat.size}`;
      if (!cached || cached.key !== key) {
        const original = fs.readFile(indexPath).then(body => transform ? transform(body) : body);
        cached = {
          key,
          modified: stat.mtime.toUTCString(),
          original,
          body: useGzip ? original.then(body => compress(body, { level: 6 })) : null,
        };
      }
      const current = cached;
      if (useGzip && !current.body) current.body = current.original.then(body => compress(body, { level: 6 }));
      const body = await (useGzip ? current.body : current.original);
      res.type(contentType);
      if (useGzip) res.set('Content-Encoding', 'gzip');
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
