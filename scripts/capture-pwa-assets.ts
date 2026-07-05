import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function captureScreenshots() {
  await mkdir('public/assets', { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // Desktop screenshot (wide)
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.on('console', (msg) => {
    if (msg.type() === 'error') console.error('  [BROWSER]', msg.text());
  });
  desktopPage.on('pageerror', (err) => console.error('  [PAGE]', err.message));
  await desktopPage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Wait for main content to render
  await desktopPage.waitForSelector('main, #layout, [data-root]', { timeout: 10000 }).catch(() => {});
  await desktopPage.waitForTimeout(3000);
  // Log page title for verification
  console.log('  Title:', await desktopPage.title());
  await desktopPage.screenshot({
    path: 'public/assets/screenshot-wide.png',
    clip: { x: 0, y: 0, width: 1280, height: 720 },
  });
  console.log('✓ Captured screenshot-wide.png (1280x720)');
  await desktopContext.close();

  // Mobile screenshot (narrow)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('console', (msg) => {
    if (msg.type() === 'error') console.error('  [BROWSER]', msg.text());
  });
  mobilePage.on('pageerror', (err) => console.error('  [PAGE]', err.message));
  await mobilePage.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobilePage.waitForSelector('main, #layout, [data-root]', { timeout: 10000 }).catch(() => {});
  await mobilePage.waitForTimeout(3000);
  console.log('  Title:', await mobilePage.title());
  await mobilePage.screenshot({
    path: 'public/assets/screenshot-narrow.png',
    clip: { x: 0, y: 0, width: 390, height: 844 },
  });
  console.log('✓ Captured screenshot-narrow.png (780x1688 @2x)');
  await mobileContext.close();

  // Icon 192x192 - capture the logo area
  const iconContext = await browser.newContext({
    viewport: { width: 192, height: 192 },
    deviceScaleFactor: 1,
  });
  const iconPage = await iconContext.newPage();
  await iconPage.setContent(`
    <html>
    <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;width:192px;height:192px;background:#16352A;border-radius:32px;overflow:hidden">
      <svg width="120" height="106" viewBox="0 0 110 100" fill="none" stroke="#C9A24B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 52 L22 38 C22 30 30 26 40 26 L70 26 C80 26 88 30 88 38 L88 52"/>
        <path d="M40 33 L40 48"/>
        <path d="M55 33 L55 48"/>
        <path d="M70 33 L70 48"/>
        <path d="M14 52 L96 52 C99 52 100 54 100 57 L100 62 L10 62 L10 57 C10 54 11 52 14 52 Z"/>
        <path d="M16 62 L16 70"/>
        <path d="M94 62 L94 70"/>
      </svg>
    </body>
    </html>
  `);
  await iconPage.screenshot({
    path: 'public/assets/icon-192.png',
  });
  console.log('✓ Captured icon-192.png');
  await iconContext.close();

  // Icon 512x512
  const icon512Context = await browser.newContext({
    viewport: { width: 512, height: 512 },
    deviceScaleFactor: 1,
  });
  const icon512Page = await icon512Context.newPage();
  await icon512Page.setContent(`
    <html>
    <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;width:512px;height:512px;background:#16352A;border-radius:80px;overflow:hidden">
      <svg width="320" height="282" viewBox="0 0 110 100" fill="none" stroke="#C9A24B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 52 L22 38 C22 30 30 26 40 26 L70 26 C80 26 88 30 88 38 L88 52"/>
        <path d="M40 33 L40 48"/>
        <path d="M55 33 L55 48"/>
        <path d="M70 33 L70 48"/>
        <path d="M14 52 L96 52 C99 52 100 54 100 57 L100 62 L10 62 L10 57 C10 54 11 52 14 52 Z"/>
        <path d="M16 62 L16 70"/>
        <path d="M94 62 L94 70"/>
      </svg>
    </body>
    </html>
  `);
  await icon512Page.screenshot({
    path: 'public/assets/icon-512.png',
  });
  console.log('✓ Captured icon-512.png');
  await icon512Context.close();

  await browser.close();
  console.log('\nAll PWA assets captured successfully!');
}

captureScreenshots().catch((err) => {
  console.error('Failed to capture screenshots:', err);
  process.exit(1);
});
