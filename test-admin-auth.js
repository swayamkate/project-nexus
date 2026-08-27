const puppeteer = require('puppeteer-core');

async function testAdminAuthFlow() {
  console.log('--- TESTING ADMIN AUTH FLOW ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('ADMIN BROWSER CONSOLE:', msg.type(), msg.text()));

  await page.goto('https://administrator.avishkark.in/login', { waitUntil: 'domcontentloaded', timeout: 15000 });

  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', 'admin@nexus.com');
  await page.type('input[type="password"]', 'adminpassword2026');

  console.log('Clicking Authenticate & Enter Console button...');
  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }).catch(e => console.log('Nav:', e.message)),
    page.click('button[type="submit"]')
  ]);

  console.log('URL after submission:', page.url());
  const cookies = await page.cookies();
  console.log('Cookies set:', cookies.map(c => `${c.name}=${c.value}`));

  console.log('Testing direct route navigation to /users ...');
  await page.goto('https://administrator.avishkark.in/users', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('Users Page URL:', page.url());
  
  const title = await page.evaluate(() => document.title);
  console.log('Page Title:', title);

  await browser.close();
  console.log('--- ADMIN AUTH TEST FINISHED ---');
}

testAdminAuthFlow().catch(console.error);
