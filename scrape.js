const fs = require('fs');
const noticias = require('./pages/noticias'); // <- Agregado

async function main() {
    if (!fs.existsSync('files')) fs.mkdirSync('files');

    await noticias.get(); // <- Ejecutar scraper de noticias
}

main();