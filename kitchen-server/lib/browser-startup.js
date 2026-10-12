// Keep the original embedded vendor source in the repository, but do not send
// the Excel library on every application visit. It is served separately on demand.
function stripInlineExcel(body) {
  const html = body.toString('utf8');
  const pattern = /<script>\s*\/\*! xlsx\.js[\s\S]*?<\/script>/;
  if (!pattern.test(html)) throw new Error('Embedded Excel library was not found');
  return Buffer.from(html.replace(pattern, ''), 'utf8');
}

module.exports = { stripInlineExcel };
