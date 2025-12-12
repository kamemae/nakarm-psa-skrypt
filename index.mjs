import puppeteer from "puppeteer";
import fs from "fs";

async function run() {
    while (true) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto("https://nakarmpsa.olx.pl/", { waitUntil: "networkidle2" });

        const dogname = await page.evaluate(() => {
            const dogs = document.querySelectorAll('.single-pet-name-inner');
            if(!dogs || dogs.length === 0) return "Unknown";
            const randomIndex = Math.floor(Math.random() * dogs.length);
            const chosenDog = dogs[randomIndex];
            return chosenDog.textContent.trim();
        });

        await page.evaluate(() => {
            document.querySelector(".sort-select-current")?.click();
            document.getElementById("petVotesLeastFed")?.click();
        });

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button, span"));
            const target = buttons.find(b => b.textContent?.trim().toLowerCase() === "nakarm");
            if(target) target.click();
        });

        log(dogname);

        await delay(100);
        await browser.close();
        await delay(1);
    }
}

function log(name) {
  const date = new Date().toISOString();
  const line = `${name} - ${date}`;
  fs.appendFileSync('log.txt', `${line}\n`);
  console.log(line);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run();
