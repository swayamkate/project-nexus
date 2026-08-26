const puppeteer = require('puppeteer-core');

async function testFullTraineeLogin() {
  console.log('Testing Trainee login flow with verified credentials on live site...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.type(), msg.text());
  });

  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to https://sih2026.avishkark.in/login ...');
  await page.goto('https://sih2026.avishkark.in/login', { waitUntil: 'domcontentloaded', timeout: 15000 });

  console.log('Filling form and submitting via React state events...');
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inputs[0], 'priya.sharma@mahaskill.in');
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));

      setter.call(inputs[1], 'priya123456');
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));

      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  });

  console.log('Waiting for response / navigation...');
  await page.waitForNavigation({ timeout: 10000 }).catch(() => console.log('Navigation event done or SPA pushState'));

  console.log('Current URL after login attempt:', page.url());

  if (page.url().includes('dashboard')) {
    console.log('SUCCESS! Reached /dashboard');
    const headerText = await page.evaluate(() => document.querySelector('h2')?.innerText);
    console.log('Dashboard Header:', headerText);
  } else {
    // If not redirected yet, check if session is in localStorage
    const sessionToken = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.filter(k => k.includes('auth-token') || k.includes('supabase'));
    });
    console.log('LocalStorage auth keys found:', sessionToken);
  }

  await browser.close();
  console.log('Test completed.');
}

testFullTraineeLogin().catch(console.error);
