const puppeteer = require('puppeteer-core');

async function testExactValues() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('https://administrator.avishkark.in/login', { waitUntil: 'networkidle2' });

  // Wait for React hydration
  await new Promise(r => setTimeout(r, 1000));

  // Click demo credentials pill
  console.log('Clicking Demo Credentials pill (Avishkar0)...');
  await page.evaluate(() => {
    const demoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Avishkar0'));
    if (demoBtn) demoBtn.click();
  });

  await new Promise(r => setTimeout(r, 300));

  const fieldValues = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    return inputs.map(i => ({ type: i.type, value: i.value }));
  });
  console.log('Inputs after pill click:', fieldValues);

  // Click Submit
  console.log('Submitting via Authenticate button...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Authenticate'));
    if (btn) btn.click();
  });

  await page.waitForNavigation({ timeout: 10000 }).catch(e => console.log('Nav done'));
  console.log('Final URL:', page.url());

  const cookies = await page.cookies();
  console.log('Cookies after login:', cookies.map(c => c.name));

  await browser.close();
}

testExactValues().catch(console.error);
