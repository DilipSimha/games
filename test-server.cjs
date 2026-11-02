// Loopback-only test server. Exercise the GitHub Pages /games/ subpath.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const types = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.mp3':'audio/mpeg', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png' };
http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/games/')) { res.writeHead(404).end(); return; }
    const name = decodeURIComponent(url.pathname.slice(7)) || 'index.html';
    const file = path.resolve(__dirname, name);
    if (path.dirname(file) !== __dirname) { res.writeHead(404).end(); return; }
    const content = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(content);
  } catch { res.writeHead(404).end(); }
}).listen(4173, '127.0.0.1');
