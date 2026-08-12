import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const slugs = [
  'low-ticket',
  'vsl-course',
  'healthcare',
  'saas',
  'law-firm',
  'real-estate',
  'restaurant',
  'fitness',
  'marketing-agency',
  'ecommerce',
  'event',
  'consultant',
];

const baseURL = process.env.SHOWCASE_URL ?? 'http://127.0.0.1:4173';
const output = 'docs/screenshots';

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

for (const slug of slugs) {
  const page = await context.newPage();
  const url = `${baseURL}/examples/${slug}/index.html`;

  console.log(`Capturing ${slug}: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);

  await page.screenshot({
    path: `${output}/${slug}.png`,
    fullPage: true,
    type: 'png',
  });

  await page.close();
}

await browser.close();
console.log(`Captured ${slugs.length} landing pages.`);
