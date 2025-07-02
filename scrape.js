const fs = require('fs');
const noticias = require('./pages/noticias');

async function main() {
  await noticias.get();
}

main();