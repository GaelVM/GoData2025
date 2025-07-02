const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function get() {
  console.log("⏳ Cargando página de noticias...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto('https://pokemongolive.com/news/?hl=es', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  console.log("⌛ Esperando selector .blogList__post...");
  try {
    await page.waitForSelector('.blogList__post', { timeout: 20000 });

    const posts = await page.$$eval('.blogList__post', items => {
      return items.map(el => {
        const postUrl = "https://pokemongolive.com" + el.getAttribute("href");
        const postImage = el.querySelector("img")?.getAttribute("src") || "";
        const postDate = el.querySelector(".blogList__post__content__date")?.innerText.trim() || "";
        const postTitle = el.querySelector(".blogList__post__content__title")?.innerText.trim() || "";

        return { URL: postUrl, Image: postImage, Date: postDate, Title: postTitle };
      });
    });

    await browser.close();

    const outputDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    fs.writeFileSync(
      path.join(outputDir, 'noticias.json'),
      JSON.stringify(posts, null, 2),
      'utf-8'
    );

    console.log("✅ Noticias guardadas en temp/noticias.json");
  } catch (err) {
    console.error("❌ Error al obtener noticias:", err);
    await browser.close();
  }
}

module.exports = { get };
