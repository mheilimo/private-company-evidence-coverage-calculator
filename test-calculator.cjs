#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const puppeteer = require("puppeteer-core");

const executablePath = process.env.CHROME_PATH;
if (!executablePath) throw new Error("CHROME_PATH is required");

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const testUrl =
      process.env.TEST_URL || pathToFileURL(path.join(__dirname, "index.html")).href;
    const response = await page.goto(testUrl, { waitUntil: "load" });
    if (response) assert.equal(response.status(), 200);
    assert.equal(await page.title(), "Private Company Evidence Coverage Calculator");
    assert.equal(await page.$$eval(".dimension", (items) => items.length), 12);
    assert.equal(await page.$eval("#score", (node) => node.textContent), "0");
    assert.equal(await page.$eval("#missing-count", (node) => node.textContent), "12");
    if (process.env.SCREENSHOT_PATH) {
      await page.screenshot({ path: process.env.SCREENSHOT_PATH, fullPage: true });
    }

    const selects = await page.$$("select[data-index]");
    for (let index = 0; index < 6; index += 1) await selects[index].select("supported");
    for (let index = 6; index < 12; index += 1) await selects[index].select("partial");
    assert.equal(await page.$eval("#score", (node) => node.textContent), "75");
    assert.equal(await page.$eval("#supported-count", (node) => node.textContent), "6");
    assert.equal(await page.$eval("#partial-count", (node) => node.textContent), "6");
    assert.equal(await page.$eval("#missing-count", (node) => node.textContent), "0");
    assert.equal(await page.$$eval("#gap-list li", (items) => items.length), 5);

    await page.click("#reset-button");
    assert.equal(await page.$eval("#score", (node) => node.textContent), "0");
    assert.equal(await page.$eval("#missing-count", (node) => node.textContent), "12");

    const trackedLink = await page.$eval(".cta a", (link) => link.href);
    const parsed = new URL(trackedLink);
    assert.equal(parsed.hostname, "www.ddscore.ai");
    assert.equal(parsed.searchParams.get("utm_source"), "github-pages");
    assert.equal(parsed.searchParams.get("utm_medium"), "referral");
    assert.equal(parsed.searchParams.get("utm_campaign"), "ddscore-30d-jul-2026");
    assert.equal(parsed.searchParams.get("utm_content"), "evidence-coverage-calculator-a");
    assert.match(await page.content(), /not a company score or investment recommendation/i);
    assert.deepEqual(errors, []);

    process.stdout.write("Evidence coverage calculator browser checks passed.\n");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
