const http = require('http')
const fs = require('fs')
const path = require('path')

const HOST = '127.0.0.1'
const PORT = 5500
const ROOT = process.cwd()

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
}

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url.split('?')[0])
  const filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath)

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404)
      response.end('Not found')
      return
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    })
    response.end(data)
  })
})

server.listen(PORT, HOST, () => {
  console.log(`LiveSearch is running at http://${HOST}:${PORT}`)
})
