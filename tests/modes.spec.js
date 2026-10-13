const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('starts an instant-checking attempt and preserves stats geometry on entering practice', async ({ page }) => {
  const toggle = page.getByRole('switch', { name: 'Practice', exact: true });
  await expect(toggle).not.toBeChecked();
  await expect(page.locator('#practice-switch-state')).toHaveText('off');
  await expect(page.locator('input[name="mode"][value="hardcore"]')).toBeChecked();
  await expect(page.locator('#mode-badge')).toBeHidden();
  await expect(page.locator('#stat-fixed')).toBeHidden();
  const before = await page.locator('.stats').boundingBox();
  await page.keyboard.type('1415');
  await expect(page.locator('#stat-correct')).toHaveText('4');
  await toggle.check();
  await expect(page.locator('#practice-switch-state')).toHaveText('on');
  await expect(page.locator('#stat-fixed')).toBeVisible();
  await expect(page.locator('#stat-correct')).toHaveText('4');
  expect(await page.locator('.stats').boundingBox()).toEqual(before);
  // Typing still works when the switch retains focus.
  await page.keyboard.type('9');
  await expect(page.locator('#stat-correct')).toHaveText('5');
  await page.locator('#settings-toggle').click();
  await expect(page.locator('input[name="delayed-checking"][value="off"]')).toBeChecked();
  await expect(page.locator('#auto-delay-setting')).toBeHidden();
});

test('failed attempts can retry or continue, while practice reset keeps practice on', async ({ page }) => {
  await page.keyboard.type('12');
  await expect(page.locator('#reset-btn')).toHaveText('Try again');
  await page.locator('#reset-btn').click();
  await expect(page.locator('#practice-switch')).not.toBeChecked();
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await page.keyboard.type('12');
  await page.locator('#continue-btn').click();
  await expect(page.locator('#practice-switch')).toBeChecked();
  await expect(page.locator('#stat-wrong')).toHaveText('1');
  await expect(page.locator('#stat-missed')).toBeVisible();
  await page.locator('#reset-btn').click();
  await expect(page.locator('#reset-btn')).toHaveText('Reset practice');
  await expect(page.locator('#practice-switch')).toBeChecked();
  await expect(page.locator('#stat-correct')).toHaveText('—');
});

test('turning practice off can be cancelled; new attempt clears progress and synchronizes settings', async ({ page }) => {
  await page.keyboard.type('1415');
  await page.locator('#practice-switch').check();
  page.once('dialog', dialog => dialog.dismiss());
  // click rather than uncheck: cancelling intentionally leaves it checked.
  await page.locator('#practice-switch').click();
  await expect(page.locator('#practice-switch')).toBeChecked();
  await expect(page.locator('#stat-correct')).toHaveText('4');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#new-attempt-btn').click();
  await expect(page.locator('#practice-switch')).not.toBeChecked();
  await expect(page.locator('input[name="mode"][value="hardcore"]')).toBeChecked();
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await expect(page.locator('#stat-missed-tile')).toHaveAttribute('tabindex', '-1');
  await page.locator('#reset-btn').click();
  await expect(page.locator('#practice-switch')).not.toBeChecked();
});

test('saved delayed checking remains opt-in and reduced motion removes the stat drop', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('pi-delayed-checking', '1'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('.practice-stat').first()).toHaveCSS('transform', 'none');
  await page.locator('#practice-switch').check();
  await page.locator('#settings-toggle').click();
  await expect(page.locator('input[name="delayed-checking"][value="on"]')).toBeChecked();
  await expect(page.locator('#auto-delay-setting')).toBeVisible();
});

// performance.now() stops while a phone sleeps; outside practice the run
// clock still counts that time. Simulate a 2-minute suspend by moving
// Date.now() forward without performance.now() advancing.
async function simulateSuspend(page, ms) {
  await page.evaluate((ms) => {
    const realNow = Date.now.bind(Date);
    Date.now = () => realNow() + ms;
    document.dispatchEvent(new Event('visibilitychange'));
  }, ms);
}

test('attempt clock counts time the page spent suspended', async ({ page }) => {
  await page.keyboard.type('14');
  await simulateSuspend(page, 120_000);
  await expect(page.locator('#stat-time')).toContainText('2:0');
});

test('practice clock leaves out time the page spent suspended', async ({ page }) => {
  await page.locator('#practice-switch').check();
  await page.locator('#practice-switch').evaluate(el => el.blur());
  await page.keyboard.type('14');
  await simulateSuspend(page, 120_000);
  await page.waitForTimeout(400);
  await expect(page.locator('#stat-time')).toContainText('0:0');
});

test('Skipped tile hides once an attempt starts without skips', async ({ page }) => {
  const tile = page.locator('#stat-skipped-tile');
  await expect(tile).toBeVisible();
  await page.keyboard.type('1');
  await expect(tile).toBeHidden();
  // V can't skip now; it explains why instead.
  await page.keyboard.press('v');
  await expect(page.locator('#toast')).toBeVisible();
  await expect(page.locator('#stat-correct')).toHaveText('1');
  await page.locator('#practice-switch').check();
  await expect(tile).toBeVisible();
});

test('Skipped tile keeps a locked count when skips came before the start', async ({ page }) => {
  const tile = page.locator('#stat-skipped-tile');
  await page.keyboard.press('v');
  await page.keyboard.press('v');
  await expect(page.locator('#stat-skipped')).toHaveText('2');
  await page.keyboard.type('4');
  await expect(tile).toBeVisible();
  await expect(tile).toHaveClass(/skip-closed/);
  await tile.click();
  await expect(page.locator('#skip-modal')).toBeHidden();
  await expect(page.locator('#toast')).toBeVisible();
  await expect(page.locator('#toast')).toHaveText(await tile.getAttribute('title'));
});

test('bullet and DOOM Nightmare close skipping once the run starts', async ({ page }) => {
  await page.locator('#settings-toggle').click();
  await page.locator('.mode-option:has(input[value="bullet"])').click();
  await page.locator('#settings-close').click();
  await page.keyboard.press('v');
  await expect(page.locator('#stat-skipped')).toHaveText('1');
  await page.keyboard.type('4');
  await page.keyboard.press('v');
  await expect(page.locator('#stat-skipped')).toHaveText('1');
  await expect(page.locator('#toast')).toContainText('Switch to Practice mode');

  page.once('dialog', d => d.accept());
  await page.locator('#settings-toggle').click();
  await page.locator('#sequence').selectOption('doom');
  await page.locator('.mode-option:has(input[value="hardcore"])').click();
  await page.locator('#settings-close').click();
  await page.keyboard.type('0,');
  await page.keyboard.press('v');
  await expect(page.locator('#toast')).toContainText('Can’t skip values');
  await expect(page.locator('#stat-skipped-tile')).toBeHidden();
});

test('skipping ahead before the start moves the starting point', async ({ page }) => {
  await page.goto('/#pi-binary');
  await expect.poll(() => page.evaluate(() => state.digits.length)).toBeGreaterThan(330000);
  await page.locator('#stat-skipped-tile').click();
  await page.locator('#skip-count').fill('300000');
  await expect(page.locator('#skip-result')).toHaveText('After skipping: digit 300,001 of 332,184');
  await page.locator('#skip-confirm').click();
  await expect(page.locator('#stat-skipped')).toHaveText('300000');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 300,001 of pi in binary:');
  // About 2,000 digits of context, starting with "…", not 300,000 entries.
  expect(await page.evaluate(() => state.entries.length)).toBe(0);
  await expect(page.locator('#user-digits .skip-ellipsis')).toHaveCount(1);
  const shown = await page.locator('#user-digits .digit').count();
  expect(shown).toBeGreaterThan(1900);
  expect(shown).toBeLessThan(2200);
  // The context starts at a multiple of the line length, so columns line up
  // with a run from digit 1.
  const aligned = await page.evaluate(() =>
    skipContext.lineLength > 0 && (state.seqOffset - skipContext.len) % skipContext.lineLength === 0);
  expect(aligned).toBe(true);
  const next = await page.evaluate(() => SEQUENCES['pi-binary'].digits.slice(300000, 300008));
  await page.keyboard.type(next);
  await expect(page.locator('#stat-correct')).toHaveText('8');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 300,009 of pi in binary:');
  // Restart goes back to digit 1.
  await page.locator('#reset-btn').click();
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 1 of pi in binary:');
  await expect(page.locator('#user-digits .skip-ellipsis')).toHaveCount(0);
});

test('backspace before the start takes back a skipped digit in practice', async ({ page }) => {
  await page.locator('#practice-switch').check();
  await page.locator('#practice-switch').evaluate(el => el.blur());
  await page.keyboard.press('v');
  await page.keyboard.press('v');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 3 of pi:');
  await page.keyboard.press('Backspace');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 2 of pi:');
  await expect(page.locator('#stat-skipped')).toHaveText('1');
  // "3" isn't absorbed as the integer part after a skip: digit 2 is 4.
  await page.keyboard.type('4');
  await expect(page.locator('#stat-correct')).toHaveText('1');
});

test('skipping ahead in a spaced list lands on the next whole term', async ({ page }) => {
  await page.goto('/#primes-spaced');
  // "3 5 7" then the space: a 6-character skip ends on a space, so it also
  // skips that space and the next thing to type is 11.
  await page.locator('#stat-skipped-tile').click();
  await page.locator('#skip-count').fill('5');
  await page.locator('#skip-confirm').click();
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 4 (in the 5th prime):');
  await page.keyboard.type('11 13');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});
