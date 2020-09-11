const fs = require('fs')
const archiver = require('archiver')

fs.unlinkSync('./dist/main.js')
fs.unlinkSync('./dist/main.css')

let output = fs.createWriteStream('./dist/build.zip')
let archive = archiver('zip', {
  zlib: { level: 9 } // set compression to best
})

const MAX = 13 * 1024 // 13kb

output.on('close', function () {
  const bytes = archive.pointer()
  const percent = (bytes / MAX * 100).toFixed(2)
  if (bytes > MAX) {
    console.error(`Size overflow: ${bytes} bytes (${percent}%)`)
  } else {
    console.log(`Size: ${bytes} bytes (${percent}%)`)
  }
})

archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    console.warn(err)
  } else {
    throw err
  }
})

archive.on('error', function (err) {
  throw err
})

archive.pipe(output)
archive.append(
  fs.createReadStream('./dist/index.html'), {
    name: 'index.html'
  }
)

archive.finalize()
