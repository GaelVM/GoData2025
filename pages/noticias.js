const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function get() {
    console.log("⏳ Cargando página de noticias...");

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36');

    await page.goto("https://pokemongolive.com/news/?hl=es", { waitUntil: "domcontentloaded" });

    console.log("⌛ Esperando selector .blogList__post...");
    await page.waitForSelector(".blogList__post", { timeout: 30000 });

    const noticias = await page.evaluate(() => {
        const posts = Array.from(document.querySelectorAll(".blogList__post"));
        return posts.map(post => {
            const href = post.getAttribute("href");
            const image = post.querySelector("img")?.src || "";
            const date = post.querySelector(".blogList__post__content__date")?.textContent.trim() || "";
            const title = post.querySelector(".blogList__post__content__title")?.textContent.trim() || "";

            return {
                URL: `https://pokemongolive.com${href}`,
                Image: image,
                Date: date,
                Title: title
            };
        }).filter(item => item.URL && item.Title);
    });

    await browser.close();

    const dir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    fs.writeFileSync(path.join(dir, 'noticias.json'), JSON.stringify(noticias, null, 2), 'utf-8');

    console.log(`✅ Noticias guardadas (${noticias.length}) en temp/noticias.json`);
}

module.exports = { get };
