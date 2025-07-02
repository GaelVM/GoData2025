import { getNoticias } from './pages/noticias.js';

async function main() {
  console.log("⏳ Cargando página de noticias...");
  await getNoticias();
}

main();
