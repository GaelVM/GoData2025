const fs = require('fs');
const noticias = require('./pages/noticias');

async function main() {
  if (!fs.existsSync('temp')) fs.mkdirSync('temp');
  await noticias.get();
}

main();
