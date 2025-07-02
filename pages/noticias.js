import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export async function getNoticias() {
  console.log("🌐 Conectando a la API de noticias...");

  const url = 'https://pokemongolive.com/_next/data/<REEMPLAZA_ESTO>.json/news?hl=es';

  try {
    const res = await fetch(url);
    const json = await res.json();

    const posts = json.pageProps?.posts || [];
    const noticias = posts.map(post => ({
      title: post.title,
      image: post.hero?.url,
      link: `https://pokemongolive.com${post.url}`,
      date: post.date
    }));

    const outputDir = path.resolve('temp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const filePath = path.join(outputDir, 'noticias.json');
    fs.writeFileSync(filePath, JSON.stringify(noticias, null, 2), 'utf-8');

    console.log(`✅ Noticias guardadas (${noticias.length}) en ${filePath}`);
  } catch (err) {
    console.error("❌ Error al obtener noticias:", err.message);
  }
}
