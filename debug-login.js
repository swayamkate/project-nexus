const puppeteer = require('puppeteer-core');

async function debugLogin() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Navigating to https://sih2026.avishkark.in/login ...');
  await page.goto('https://sih2026.avishkark.in/login', { waitUntil: 'domcontentloaded' });

  // Get all visible interactive elements
  const items = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('input, button, a'));
    return list.map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      return {
        tag: el.tagName,
        type: el.getAttribute('type'),
        text: el.innerText ? el.innerText.trim().slice(0, 30) : el.getAttribute('placeholder') || el.getAttribute('value') || '',
        isVisible,
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }
      };
    });
  });

  console.log('Login Elements:');
  console.log(JSON.stringify(items.filter(i => i.isVisible), null, 2));

  // Try clicking "👤 Trainee Demo (Priya)" button if present, or fill directly
  const demoBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('Priya') || btn.innerText.includes('Trainee Demo'));
    if (b) {
      b.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Demo Button:', demoBtn);

  // Check what values were filled into inputs
  const inputValues = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    return inputs.map(i => ({ type: i.type, value: i.value }));
  });
  console.log('Input values after clicking demo button:', inputValues);

  // Click Submit
  console.log('Clicking Submit button...');
  const submitClicked = await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Submit button clicked:', submitClicked);

  await page.waitForNavigation({ timeout: 10000 }).catch(() => console.log('Nav timeout or instant client push'));
  console.log('Current URL after submit:', page.url());

  await browser.close();
}

debugLogin().catch(console.error);
