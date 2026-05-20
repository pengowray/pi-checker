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

test('primes shows "2 " as the prefix and a visual space at each prime boundary', async ({ page }) => {
  await setSequence(page,'primes');
  // The first prime (2) lives in the prefix, analogous to "3." for pi.
  const prefixText = await page.locator('#prefix').evaluate(el => el.textContent);
  expect(prefixText).toBe('2 ');
  // Type 2357: leading "2" is silently absorbed by the prefix; "3","5","7"
  // become three correct entries, with one prime-space marker after each.
  await page.keyboard.type('2357');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('3');
  await expect(page.locator('#user-digits .prime-space')).toHaveCount(3);
});

test('primes-spaced shows the space key and absorbs "2 " into the prefix', async ({ page }) => {
  await setSequence(page,'primes-spaced');
  await expect(page.locator('.key-space')).toBeVisible();
  const prefixText = await page.locator('#prefix').evaluate(el => el.textContent);
  expect(prefixText).toBe('2 ');
  // Typing the first four primes with single spaces: the leading "2 " gets
  // absorbed by the prefix, leaving "3 5 7" → 5 entries (digits + spaces).
  await page.keyboard.type('2 3 5 7');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('5');
  await expect(page.locator('#stat-wrong')).toHaveText('0');
});

test('primes-spaced collapses double-spaces and ignores a leading space', async ({ page }) => {
  await setSequence(page,'primes-spaced');
  // Triple-space between 5 and 7 plus a leading space — should still match exactly
  // as if the user typed "2 3 5 7" (one space each, no leading space).
  await page.keyboard.type(' 2 3 5   7');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('5');
  await expect(page.locator('#stat-wrong')).toHaveText('0');
});

test('typed spaces actually render visibly in primes-spaced', async ({ page }) => {
  await setSequence(page,'primes-spaced');
  // "2 " is absorbed by the prefix; typing "2 3 5" leaves "3"," ","5" → 3 entries.
  await page.keyboard.type('2 3 5');
  await page.keyboard.press('Enter');
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

test('hex keypad uses the JE600-style layout (ABCD top row, 0 bottom-right)', async ({ page }) => {
  await setSequence(page, 'pi-hex');
  await expect(page.locator('#keypad-hex')).toBeVisible();
  // Read each key's center position and group by row (using rounded y).
  const layout = await page.evaluate(() => {
    const keys = Array.from(document.querySelectorAll('#keypad-hex .key'));
    const items = keys
      .filter(k => k.dataset.digit || k.dataset.action) // include disabled keys
      .map(k => {
        const r = k.getBoundingClientRect();
        return {
          label: k.dataset.digit || (k.dataset.action === 'check' ? '✓' : '⌫'),
          x: Math.round(r.left + r.width / 2),
          y: Math.round(r.top + r.height / 2),
        };
      });
    // Group by approximate y, then sort each row by x.
    items.sort((a, b) => a.y - b.y || a.x - b.x);
    const rows = [];
    for (const it of items) {
      const last = rows[rows.length - 1];
      if (last && Math.abs(last[0].y - it.y) < 10) last.push(it);
      else rows.push([it]);
    }
    return rows.map(r => r.map(it => it.label));
  });
  expect(layout).toEqual([
    ['A', 'B', 'C', 'D'],
    ['1', '2', '3', 'E'],
    ['4', '5', '6', 'F'],
    ['7', '8', '9'],
    ['✓', '0', '⌫'],
  ]);
});

test('sequence dropdown stays in sync with state after reload', async ({ page }) => {
  // Pick a non-default sequence, then reload — the app intentionally
  // doesn't persist sequence choice, so it should come back as pi. The
  // dropdown must reflect that (otherwise users see "tau" selected but
  // can't re-pick tau without first switching to something else).
  await setSequence(page, 'tau');
  await page.reload();
  await expect(page.locator('#app-title')).toContainText('π');
  await expect(page.locator('#prefix')).toContainText('3.');
  await page.locator('#settings-toggle').click();
  await expect(page.locator('#sequence')).toHaveValue('pi');
});

test('keypad hint uses a verbose label per sequence', async ({ page }) => {
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 1 of pi:');
  await setSequence(page, 'pi-hex');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 1 of pi in hexadecimal:');
  await setSequence(page, 'primes-spaced');
  await expect(page.locator('#keypad-hint')).toHaveText(
    'Enter digit 1 of the list of primes, including spaces:'
  );
  await setSequence(page, 'sqrt2');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 1 of the square root of 2:');
  // After typing a few digits the position counter advances too.
  await page.keyboard.type('41421');
  await page.keyboard.press('Enter');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 6 of the square root of 2:');
});

test('Ctrl/Cmd/Alt modifiers do not count as digit input (e.g. Ctrl+C in hex)', async ({ page }) => {
  await setSequence(page, 'pi-hex');
  // Ctrl+C would otherwise be uppercased to "C" and swallowed as a hex digit.
  await page.keyboard.press('Control+c');
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Alt+f');
  await expect(page.locator('#stat-correct')).toHaveText('0');
  await expect(page.locator('#stat-wrong')).toHaveText('0');
  // Plain typing still works.
  await page.keyboard.type('243F');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('4');
});

test('skipped tile click opens the skip dialog', async ({ page }) => {
  await page.locator('#stat-skipped-tile').click();
  await expect(page.locator('#skip-modal')).toBeVisible();
});
