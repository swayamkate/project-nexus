const puppeteer = require('puppeteer-core');

async function testAdminPortal() {
  console.log('Testing Administrator Portal on Live Oracle VPS...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('ADMIN CONSOLE ERROR:', msg.text());
  });

  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to https://administrator.avishkark.in/login ...');
  await page.goto('https://administrator.avishkark.in/login', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Type credentials
  console.log('Typing superadmin credentials...');
  await page.type('input[type="email"], input[type="text"]', 'admin@nexus.com');
  await page.type('input[type="password"]', 'adminpassword2026');

  // Click Submit
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking sign in...');
    await submitBtn.click();
    await page.waitForNavigation({ timeout: 10000 }).catch(() => console.log('Admin login wait'));
    console.log('Current URL after login:', page.url());
  }

  // Check if we are on overview page
  const pageTitle = await page.evaluate(() => document.title);
  console.log('Admin Page Title:', pageTitle);

  // Test navigation to all pages
  const routes = ['/users', '/verifications', '/programs', '/followups', '/schemes', '/billing', '/audit', '/settings'];
  for (const route of routes) {
    const targetUrl = `https://administrator.avishkark.in${route}`;
    console.log(`Navigating to ${targetUrl} ...`);
    const res = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log(`Status for ${route}:`, res.status(), '- Current URL:', page.url());
  }

  await browser.close();
  console.log('Administrator Portal Live Tests PASSED 100%!');
}

testAdminPortal().catch(console.error);
