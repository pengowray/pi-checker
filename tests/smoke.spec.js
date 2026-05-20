const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// The sequence selector lives inside the settings modal, which is hidden by
// default. Open it, change the sequence, then close it.
async function setSequence(page, value) {
  await page.locator('#settings-toggle').click();
  await page.locator('#sequence').selectOption(value);
  await page.locator('#settings-close').click();
  await expect(page.locator('#settings-modal')).toBeHidden();
}

test('loads with pi by default', async ({ page }) => {
  await expect(page.locator('#app-title')).toContainText('π');
  await expect(page.locator('#prefix')).toContainText('3.');
  await expect(page.locator('.key-space')).toBeHidden();
});

test('sequence dropdown lists every supported sequence', async ({ page }) => {
  const values = await page.$$eval('#sequence option', els => els.map(e => e.value));
  expect(values).toEqual([
    'pi', 'tau', 'phi', 'sqrt2', 'pi-binary', 'pi-hex', 'primes', 'primes-spaced',
  ]);
});

test('pi: typing the first digits scores correct', async ({ page }) => {
  await page.keyboard.type('14159');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('5');
  await expect(page.locator('#stat-wrong')).toHaveText('0');
});

test('tau prefix is "6." and the digits match 2π', async ({ page }) => {
  await setSequence(page,'tau');
  await expect(page.locator('#prefix')).toContainText('6.');
  // 2π = 6.2831853071795864...
  await page.keyboard.type('28318530717');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('11');
  await expect(page.locator('#stat-wrong')).toHaveText('0');
});

test('primes hides the prefix and shows a visual space at each prime boundary', async ({ page }) => {
  await setSequence(page,'primes');
  await expect(page.locator('#prefix')).toBeHidden();
  // First four primes: 2 3 5 7 → four boundaries (one after each digit)
  await page.keyboard.type('2357');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('4');
  await expect(page.locator('#user-digits .prime-space')).toHaveCount(4);
});

test('primes-spaced shows the space key and matches with literal spaces', async ({ page }) => {
  await setSequence(page,'primes-spaced');
  await expect(page.locator('.key-space')).toBeVisible();
  // First four primes typed with single spaces between them.
  await page.keyboard.type('2 3 5 7');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('7');
  await expect(page.locator('#stat-wrong')).toHaveText('0');
});

test('primes-spaced collapses double-spaces and ignores a leading space', async ({ page }) => {
  await setSequence(page,'primes-spaced');
  // Triple-space between 5 and 7 plus a leading space — should still match exactly
  // as if the user typed "2 3 5 7" (one space each, no leading space).
  await page.keyboard.type(' 2 3 5   7');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('7');
  await expect(page.locator('#stat-wrong')).toHaveText('0');
});

test('typed spaces actually render visibly in primes-spaced', async ({ page }) => {
  await setSequence(page,'primes-spaced');
  await page.keyboard.type('2 3');
  await page.keyboard.press('Enter');
  // Each digit entry is its own .digit span — count should be 3 (two digits + one space).
  await expect(page.locator('#user-digits > .digit, #user-digits .group > .digit')).toHaveCount(3);
  // The space entry should have a positive rendered width (catches the
  // earlier regression where a plain " " collapsed to zero width).
  const spaceWidth = await page.evaluate(() => {
    const spans = document.querySelectorAll('#user-digits .digit');
    for (const s of spans) {
      const txt = s.textContent;
      if (txt === ' ' || txt === ' ') {
        return s.getBoundingClientRect().width;
      }
    }
    return -1;
  });
  expect(spaceWidth).toBeGreaterThan(2);
});

test('skipped tile click opens the skip dialog', async ({ page }) => {
  await page.locator('#stat-skipped-tile').click();
  await expect(page.locator('#skip-modal')).toBeVisible();
});
