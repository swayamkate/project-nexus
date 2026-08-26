const puppeteer = require('puppeteer-core');

async function runE2ETests() {
  console.log('--- STARTING COMPREHENSIVE E2E LIVE TEST ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER CONSOLE ERROR:', msg.text());
  });

  // TEST 1: MOBILE LANDING PAGE CLICKABILITY
  console.log('\n[TEST 1] Testing Mobile Landing Page (iPhone 12)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('https://sih2026.avishkark.in', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Test hamburger menu open and click
  const menuBtn = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (menuBtn) {
    console.log('Found Mobile Hamburger Button! Tapping...');
    await menuBtn.tap();
    console.log('Tapped Hamburger menu successfully.');
  }

  // Click "Access Trainee Portal" button
  console.log('Tapping "Access Trainee Portal" CTA button...');
  const traineeCta = await page.$('a[href="/login"]');
  if (traineeCta) {
    await traineeCta.tap();
    await page.waitForNavigation({ timeout: 10000 }).catch(() => console.log('Navigation wait'));
    console.log('Current URL after CTA tap:', page.url());
  }

  // TEST 2: LOGIN SUBMISSION & SESSION ESTABLISHMENT
  console.log('\n[TEST 2] Testing Trainee Login on Mobile...');
  await page.goto('https://sih2026.avishkark.in/login', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Fill in email and password
  await page.type('input[type="text"], input[type="email"]', 'priya.sharma@mahaskill.in');
  await page.type('input[type="password"]', 'priya123456');

  console.log('Submitting login form...');
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.tap();
    await page.waitForNavigation({ timeout: 15000 }).catch(() => console.log('Nav wait finished'));
    console.log('URL after login submission:', page.url());
  }

  // TEST 3: DASHBOARD INTERACTIVITY
  console.log('\n[TEST 3] Testing Dashboard Page on Mobile...');
  if (!page.url().includes('dashboard')) {
    await page.goto('https://sih2026.avishkark.in/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
  }
  console.log('Dashboard URL:', page.url());

  const dashTitle = await page.evaluate(() => document.title);
  console.log('Page Title:', dashTitle);

  // TEST 4: ADMIN CONSOLE
  console.log('\n[TEST 4] Testing Administrator Console (https://administrator.avishkark.in/login)...');
  await page.goto('https://administrator.avishkark.in/login', { waitUntil: 'domcontentloaded', timeout: 15000 });

  await page.type('input[type="email"]', 'admin@nexus.com');
  await page.type('input[type="password"]', 'adminpassword2026');

  const adminSubmit = await page.$('button[type="submit"]');
  if (adminSubmit) {
    await adminSubmit.tap();
    await page.waitForNavigation({ timeout: 15000 }).catch(() => console.log('Admin nav wait'));
    console.log('Admin Console URL after login:', page.url());
  }

  await browser.close();
  console.log('\n--- ALL E2E LIVE TESTS COMPLETED ---');
}

runE2ETests().catch(err => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});
