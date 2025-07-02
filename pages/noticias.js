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

    await page.goto("https://pokemongolive.com/news/?hl=es", {
        waitUntil: 'networkidle0',
        timeout: 60000
    });

    console.log("⌛ Esperando selector .blogList__post...");
    await page.waitForSelector(".blogList__post", { timeout: 30000 });

    // Toma screenshot por si falla
    await page.screenshot({ path: 'debug_noticias.png', fullPage: true });

    const postsData = await page.evaluate(() => {
        const posts = Array.from(document.querySelectorAll(".blogList__post"));
        return posts.map(post => {
            const url = "https://pokemongolive.com" + post.getAttribute("href");
            const image = post.querySelector("img")?.src || "";
            const date = post.querySelector(".blogList__post__content__date")?.textContent.trim() || "";
            const title = post.querySelector(".blogList__post__content__title")?.textContent.trim() || "";

            return { URL: url, Image: image, Date: date, Title: title };
        });
    });

    fs.mkdirSync("temp", { recursive: true });
    fs.writeFileSync("temp/noticias.json", JSON.stringify(postsData, null, 2), 'utf-8');

    console.log(`✅ Noticias guardadas en temp/noticias.json`);

    await browser.close();
}

module.exports = { get };
