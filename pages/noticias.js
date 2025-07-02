const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

module.exports.get = async function () {
  console.log("⏳ Cargando página de noticias...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://pokemongolive.com/news/?hl=es', { waitUntil: 'networkidle2' });

  console.log("⌛ Esperando selector .blogList__post...");
  await page.waitForSelector('.blogList__post', { timeout: 20000 });

  const posts = await page.$$eval('.blogList__post', elements => {
    return elements.map(el => {
      const href = el.getAttribute('href');
      const post_url = href ? `https://pokemongolive.com${href}` : null;
      const post_image = el.querySelector('img')?.getAttribute('src');
      const post_date = el.querySelector('.blogList__post__content__date')?.innerText.trim();
      const post_title = el.querySelector('.blogList__post__content__title')?.innerText.trim();

      return {
        URL: post_url,
        Image: post_image,
        Date: post_date,
        Title: post_title
      };
    }).filter(p => p.URL && p.Title);
  });

  await browser.close();

  // Crear carpeta si no existe
  const tempDir = path.join(__dirname, '..', 'temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filePath = path.join(tempDir, 'noticias.json');
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`✅ Noticias guardadas en ${filePath}`);
};
