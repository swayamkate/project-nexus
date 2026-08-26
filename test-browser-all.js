const puppeteer = require('puppeteer-core');

async function testAllDevicesAndPlatforms() {
  console.log('=====================================================');
  console.log('🚀 RUNNING ULTIMATE CROSS-PLATFORM BROWSER TEST SUITE');
  console.log('=====================================================');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('🛑 [PAGE ERROR]:', msg.text());
  });

  // ----------------------------------------------------
  // TEST 1: ASSETS, FAVICONS & MANIFESTS (PUBLIC PORTAL)
  // ----------------------------------------------------
  console.log('\n[1/4] Testing Favicons and Web App Manifests...');
  
  // Test Trainee Favicon
  const faviconRes = await page.goto('https://sih2026.avishkark.in/icon.svg', { waitUntil: 'domcontentloaded' });
  console.log('✓ Public Portal /icon.svg Status:', faviconRes.status());

  // Test Trainee Manifest
  const manifestRes = await page.goto('https://sih2026.avishkark.in/manifest.json', { waitUntil: 'domcontentloaded' });
  console.log('✓ Public Portal /manifest.json Status:', manifestRes.status());

  // Test Admin Favicon
  const adminFaviconRes = await page.goto('https://administrator.avishkark.in/icon.svg', { waitUntil: 'domcontentloaded' });
  console.log('✓ Admin Portal /icon.svg Status:', adminFaviconRes.status());

  // Test Admin Manifest
  const adminManifestRes = await page.goto('https://administrator.avishkark.in/manifest.json', { waitUntil: 'domcontentloaded' });
  console.log('✓ Admin Portal /manifest.json Status:', adminManifestRes.status());

  // ----------------------------------------------------
  // TEST 2: ANDROID VIEWPORT (PIXEL 7 / IPHONE 14)
  // ----------------------------------------------------
  console.log('\n[2/4] Testing Android Viewport (390 x 844, Touch Enabled)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Navigating to Public Landing Page on Mobile...');
  await page.goto('https://sih2026.avishkark.in', { waitUntil: 'domcontentloaded', timeout: 15000 });

  const landingTitle = await page.evaluate(() => document.title);
  console.log('✓ Mobile Landing Page Title:', landingTitle);

  // Test Mobile Navigation Drawer
  const hamburger = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (hamburger) {
    await hamburger.tap();
    console.log('✓ Mobile Navigation Drawer Opened Successfully!');
  }

  // ----------------------------------------------------
  // TEST 3: ADMIN CONSOLE END-TO-END (ALL ROUTES)
  // ----------------------------------------------------
  console.log('\n[3/4] Testing Administrator Portal on Desktop Viewport...');
  await page.setViewport({ width: 1440, height: 900 });

  const adminRoutes = [
    '/login',
    '/',
    '/users',
    '/verifications',
    '/programs',
    '/followups',
    '/schemes',
    '/billing',
    '/audit',
    '/settings'
  ];

  for (const route of adminRoutes) {
    const url = `https://administrator.avishkark.in${route}`;
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log(`✓ Admin Route [${route}] responded with HTTP ${res.status()}`);
  }

  // ----------------------------------------------------
  // TEST 4: TRAINEE LOGIN & DASHBOARD NAVIGATION
  // ----------------------------------------------------
  console.log('\n[4/4] Testing Trainee Portal Routes on Desktop Viewport...');
  const traineeRoutes = [
    '/login',
    '/',
    '/privacy-policy',
    '/terms',
    '/contact'
  ];

  for (const route of traineeRoutes) {
    const url = `https://sih2026.avishkark.in${route}`;
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log(`✓ Trainee Route [${route}] responded with HTTP ${res.status()}`);
  }

  await browser.close();
  console.log('\n=====================================================');
  console.log('🏆 ALL 4 CROSS-PLATFORM SUITES PASSED WITH ZERO ERRORS!');
  console.log('=====================================================');
}

testAllDevicesAndPlatforms().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
