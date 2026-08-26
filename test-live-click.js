const puppeteer = require('puppeteer-core');

async function testDashboard() {
  console.log('Testing Dashboard interactions...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('DASHBOARD LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('DASHBOARD ERROR:', err.toString()));

  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });

  // 1. Go to login
  await page.goto('https://sih2026.avishkark.in/login', { waitUntil: 'domcontentloaded' });
  
  // Try to click demo button for Priya
  console.log('Attempting to log in as Priya...');
  await page.evaluate(() => {
    // Fill credentials
    const emailInput = document.querySelector('input[type="text"], input[type="email"]');
    const passInput = document.querySelector('input[type="password"]');
    if (emailInput && passInput) {
      emailInput.value = 'priya.sharma@mahaskill.in';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passInput.value = 'priya123456';
      passInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking Sign In button...');
    await submitBtn.click();
    await page.waitForNavigation({ timeout: 10000 }).catch(() => console.log('Navigation wait timed out'));
    console.log('Current URL:', page.url());
  }

  // Check interactive elements on /dashboard
  const dashData = await page.evaluate(() => {
    const clickable = Array.from(document.querySelectorAll('button, a, input, [role="button"], select'));
    return clickable.map(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const topEl = (cx >= 0 && cy >= 0 && cx <= window.innerWidth && cy <= window.innerHeight)
        ? document.elementFromPoint(cx, cy)
        : null;
      return {
        tag: el.tagName,
        text: el.innerText ? el.innerText.trim().slice(0, 25) : el.getAttribute('title') || '',
        topEl: topEl ? `${topEl.tagName}.${topEl.className}` : 'OUT_OF_VIEW',
        canClick: topEl ? (topEl === el || el.contains(topEl)) : false
      };
    });
  });

  console.log('\n--- Dashboard Elements on Mobile ---');
  dashData.forEach((el, i) => {
    console.log(`[${i}] ${el.tag} "${el.text}" - TopEl: ${el.topEl} - Can Click: ${el.canClick}`);
  });

  await browser.close();
}

testDashboard().catch(console.error);
