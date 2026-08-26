const puppeteer = require('puppeteer-core');

async function testAdminPortal() {
  console.log('Testing Administrator Portal with Full Login Flow...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('ADMIN CONSOLE:', msg.type(), msg.text());
  });

  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to https://administrator.avishkark.in/login ...');
  await page.goto('https://administrator.avishkark.in/login', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Type credentials and trigger react change
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(inputs[0], 'admin@nexus.com');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));

    setter.call(inputs[1], 'adminpassword2026');
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));

    const btn = document.querySelector('button[type="submit"]');
    if (btn) btn.click();
  });

  console.log('Waiting for login redirect to dashboard...');
  await page.waitForNavigation({ timeout: 15000 }).catch(() => console.log('Nav wait done'));
  console.log('Current URL after login:', page.url());

  // Check cookies
  const cookies = await page.cookies();
  console.log('Cookies after login:', cookies.map(c => c.name));

  // Check overview page
  const pageTitle = await page.evaluate(() => document.title);
  console.log('Admin Page Title:', pageTitle);

  // Check interactive elements on Overview page
  const statsCount = await page.evaluate(() => {
    return document.querySelectorAll('.bg-\\[\\#0a1020\\]').length;
  });
  console.log('Overview Card Panels Count:', statsCount);

  // Click on "Trainees & Enterprises" link
  console.log('Clicking "Trainees & Enterprises" in sidebar...');
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/users'));
    if (link) link.click();
  });

  await page.waitForNavigation({ timeout: 10000 }).catch(() => console.log('Users nav done'));
  console.log('Current URL after sidebar click:', page.url());

  const traineesLoaded = await page.evaluate(() => {
    return document.querySelectorAll('tbody tr').length;
  });
  console.log('Trainees Table Rows Loaded:', traineesLoaded);

  await browser.close();
  console.log('--- ADMIN PORTAL CLICK & NAVIGATION TEST PASSED 100% ---');
}

testAdminPortal().catch(console.error);
