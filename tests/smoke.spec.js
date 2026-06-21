const { test, expect } = require('@playwright/test');

// DOOM's M_Random rndtable[256] — must match setupDoom() in script.js.
const DOOM_RND = [
  0, 8, 109, 220, 222, 241, 149, 107, 75, 248, 254, 140, 16, 66,
  74, 21, 211, 47, 80, 242, 154, 27, 205, 128, 161, 89, 77, 36,
  95, 110, 85, 48, 212, 140, 211, 249, 22, 79, 200, 50, 28, 188,
  52, 140, 202, 120, 68, 145, 62, 70, 184, 190, 91, 197, 152, 224,
  149, 104, 25, 178, 252, 182, 202, 182, 141, 197, 4, 81, 181, 242,
  145, 42, 39, 227, 156, 198, 225, 193, 219, 93, 122, 175, 249, 0,
  175, 143, 70, 239, 46, 246, 163, 53, 163, 109, 168, 135, 2, 235,
  25, 92, 20, 145, 138, 77, 69, 166, 78, 176, 173, 212, 166, 113,
  94, 161, 41, 50, 239, 49, 111, 164, 70, 60, 2, 37, 171, 75,
  136, 156, 11, 56, 42, 146, 138, 229, 73, 146, 77, 61, 98, 196,
  135, 106, 63, 197, 195, 86, 96, 203, 113, 101, 170, 247, 181, 113,
  80, 250, 108, 7, 255, 237, 129, 226, 79, 107, 112, 166, 103, 241,
  24, 223, 239, 120, 198, 58, 60, 82, 128, 3, 184, 66, 143, 224,
  145, 224, 81, 206, 163, 45, 63, 90, 168, 114, 59, 33, 159, 95,
  28, 139, 123, 98, 125, 196, 15, 70, 194, 253, 54, 14, 109, 226,
  71, 17, 161, 93, 186, 87, 244, 138, 20, 52, 123, 251, 26, 36,
  17, 46, 52, 231, 232, 76, 31, 221, 84, 37, 216, 165, 212, 106,
  197, 242, 98, 43, 39, 175, 254, 145, 190, 84, 118, 222, 187, 136,
  120, 163, 236, 249,
];

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
    'pi', 'tau', 'pi-squared', 'zeta2', 'phi', 'e', 'euler-mascheroni',
    'ln2', 'log10_2', 'sqrt2', 'sqrt3', 'sqrt5',
    'pi-binary', 'pi-hex', 'primes', 'primes-spaced', 'champernowne',
    'less-than-3', 'moss', 'doom',
  ]);
});

test('less-than-3: any digits are accepted as correct', async ({ page }) => {
  await setSequence(page, 'less-than-3');
  // Prefix is "2." and the title plays it straight as a checker.
  await expect(page.locator('#prefix')).toContainText('2.');
  await expect(page.locator('#app-title')).toContainText('<3');
  // A leading "2" is absorbed by the prefix (like "3" for pi); the rest are
  // arbitrary digits that would be wrong for any real constant.
  await page.keyboard.type('2748159');
  await page.keyboard.press('Enter');
  // Leading "2" is absorbed by the prefix; the other six land as correct.
  await expect(page.locator('#stat-correct')).toHaveText('6');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('emergency number: no prefix clue, auto-spaces, and the final digit auto-checks', async ({ page }) => {
  await setSequence(page, 'moss');
  // No "0." clue — the leading 0 is part of what the user has to recall.
  await expect(page.locator('#prefix')).toBeHidden();
  // Type the whole number; entering the final digit correctly auto-checks
  // everything (no Enter, no waiting), so all 20 land correct on their own.
  await page.keyboard.type('01189998819991197253');
  await expect(page.locator('#stat-correct')).toHaveText('20');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
  // 0118 999 881 999 119 7253 → five auto-inserted spaces.
  await expect(page.locator('#user-digits .prime-space')).toHaveCount(5);
});

test('emergency number: finishing stops the clock and locks input', async ({ page }) => {
  await setSequence(page, 'moss');
  await page.keyboard.type('01189998819991197253');
  // Clock frozen, keypad disabled, and a clear "done" message.
  await expect(page.locator('#stat-time')).toHaveClass(/frozen/);
  await expect(page.locator('#keypad-decimal .key[data-digit="5"]')).toBeDisabled();
  await expect(page.locator('#keypad-hint')).toHaveText('Complete — every digit correct!');
});

test('emergency number: keypad shows faint phone letters (ABC/DEF…) for this mode only', async ({ page }) => {
  // Default sequence (pi): no phone letters.
  await expect(page.locator('#keypad-decimal')).not.toHaveClass(/phone-letters/);
  await setSequence(page, 'moss');
  await expect(page.locator('#keypad-decimal')).toHaveClass(/phone-letters/);
  await expect(page.locator('#keypad-decimal .key[data-digit="2"]')).toHaveAttribute('data-letters', 'ABC');
  await expect(page.locator('#keypad-decimal .key[data-digit="7"]')).toHaveAttribute('data-letters', 'PQRS');
  // The faint letters actually render via ::after content.
  const after = await page.locator('#keypad-decimal .key[data-digit="3"]').evaluate(
    el => getComputedStyle(el, '::after').content
  );
  expect(after).toContain('DEF');
});

test('emergency number: a final "3" after a slip still ends the run', async ({ page }) => {
  await setSequence(page, 'moss');
  await page.keyboard.type('0118999881999119725'); // first 19 digits
  await page.keyboard.type('5'); // wrong 20th (should be 3) — does not finish
  await expect(page.locator('#stat-time')).not.toHaveClass(/frozen/);
  await page.keyboard.type('3'); // the final 3, now at position 21 → ends it
  await expect(page.locator('#stat-time')).toHaveClass(/frozen/);
  await expect(page.locator('#keypad-decimal .key[data-digit="5"]')).toBeDisabled();
});

test('doom: a determined value scores immediately; a still-growable one waits', async ({ page }) => {
  await setSequence(page, 'doom');
  // byte 0 = 0: "0" could still become "00", so it isn't scored until you move on.
  await page.keyboard.type('0');
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await page.keyboard.type(' ');
  await expect(page.locator('#stat-correct')).toHaveText('1');
  // byte 1 = 8: "8" could still grow (80–89), so it also waits for the separator.
  await page.keyboard.type('8');
  await expect(page.locator('#stat-correct')).toHaveText('1');
  await page.keyboard.type(' ');
  await expect(page.locator('#stat-correct')).toHaveText('2');
  // byte 2 = 109: three digits can't grow past 255, so it scores the instant
  // it's complete — before any separator.
  await page.keyboard.type('109');
  await expect(page.locator('#stat-correct')).toHaveText('3');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('doom: comma and space are interchangeable, extra separators do not penalise', async ({ page }) => {
  await setSequence(page, 'doom');
  await page.keyboard.type('0 8 109'); // space-separated → 3 values
  await expect(page.locator('#stat-correct')).toHaveText('3');
  // Mixed and doubled commas/spaces collapse to one → same 3.
  await page.locator('#reset-btn').click();
  await page.keyboard.type('0,,  8,109');
  await expect(page.locator('#stat-correct')).toHaveText('3');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('doom: a malformed value (08) goes entirely red and scores incorrect at once', async ({ page }) => {
  await setSequence(page, 'doom');
  // byte 0 = 0; "08" is malformed octal — it can never be valid, so both digits
  // go red and it scores wrong immediately.
  await page.keyboard.type('08');
  await expect(page.locator('#stat-wrong')).toHaveText('1');
  await expect(page.locator('#stat-correct')).toHaveText('—');
  const classes = await page.$$eval('#user-digits .digit', els => els.map(e => e.className));
  expect(classes.length).toBe(2);
  expect(classes.every(c => /\bwrong\b/.test(c))).toBe(true);
});

test('doom: a wrong but still-growable value keeps accepting digits, scored only when saturated', async ({ page }) => {
  await setSequence(page, 'doom');
  // byte 2 = 109. "11" diverges (red) but could still grow (110–119), so it's
  // not scored yet and the user may keep typing toward "111".
  await page.keyboard.type('0 8 11');
  await expect(page.locator('#stat-correct')).toHaveText('2');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
  // "111" can't grow past 255 → now it's scored wrong.
  await page.keyboard.type('1');
  await expect(page.locator('#stat-wrong')).toHaveText('1');
  // Keep going to "11111," — still a single wrong value.
  await page.keyboard.type('11,');
  await expect(page.locator('#stat-wrong')).toHaveText('1');
});

test('doom: a correct value stays editable — extending it takes the point back', async ({ page }) => {
  await setSequence(page, 'doom');
  await page.keyboard.type('0,8,109,220'); // byte 3 = 220 → 4 correct
  await expect(page.locator('#stat-correct')).toHaveText('4');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
  // "2200" is no longer 220 → the point is taken back and it goes wrong.
  await page.keyboard.type('0');
  await expect(page.locator('#stat-correct')).toHaveText('3');
  await expect(page.locator('#stat-wrong')).toHaveText('1');
});

test('doom: an undecided value shows in the neutral pending grey, not green', async ({ page }) => {
  await setSequence(page, 'doom');
  // "10" is a valid prefix of 109 but not yet decided → grey, unscored.
  await page.keyboard.type('0,8,10');
  const classes = await page.$$eval('#user-digits .doom-cell:last-child .digit',
    els => els.map(e => e.className));
  expect(classes.length).toBe(2);
  expect(classes.every(c => /\bpending\b/.test(c))).toBe(true);
  await expect(page.locator('#stat-correct')).toHaveText('2'); // only 0 and 8 so far
});

test('doom: shows the C header, aligned cells, and a comma key (not space)', async ({ page }) => {
  await setSequence(page, 'doom');
  await expect(page.locator('#pi-display')).toHaveClass(/code-mode/);
  // The given declaration line renders as syntax-coloured HTML.
  await expect(page.locator('#prefix')).toContainText('rndtable[256]');
  await expect(page.locator('#prefix .c-type')).toHaveText('unsigned char');
  // Comma key shown, space key hidden.
  await expect(page.locator('#keypad-decimal .key-comma')).toBeVisible();
  await expect(page.locator('#keypad-decimal .key-space')).toBeHidden();
  // Each value becomes one aligned column cell.
  await page.keyboard.type('0 8 109');
  await expect(page.locator('#user-digits .doom-cell')).toHaveCount(3);
});

test('doom: renames the modes and hides the inapplicable ones', async ({ page }) => {
  await setSequence(page, 'doom');
  await expect(page.locator('#mode-badge')).toHaveText(/Hey, not too rough/);
  await page.locator('#settings-toggle').click();
  await expect(page.locator('.mode-selector input[name="mode"][value="practice"] + span')).toHaveText('Hey, not too rough');
  await expect(page.locator('.mode-selector input[name="mode"][value="hardcore"] + span')).toHaveText('Nightmare');
  await expect(page.locator('.mode-selector .mode-option:has(input[name="mode"][value="sprint"])')).toBeHidden();
  await expect(page.locator('.mode-selector .mode-option:has(input[name="mode"][value="bullet"])')).toBeHidden();
  await expect(page.locator('#auto-delay-setting')).toBeHidden();
  await expect(page.locator('#autocheck-style-setting')).toBeHidden();
  await expect(page.locator('#bullet-settings')).toBeHidden();
  await page.locator('#settings-close').click();
  // Switching back restores the standard mode names.
  await setSequence(page, 'pi');
  await page.locator('#settings-toggle').click();
  await expect(page.locator('.mode-selector input[name="mode"][value="practice"] + span')).toHaveText('Practice');
  await expect(page.locator('.mode-selector .mode-option:has(input[name="mode"][value="sprint"])')).toBeVisible();
});

test('doom: a byte may be entered in octal (leading 0 + octal conversion)', async ({ page }) => {
  await setSequence(page, 'doom');
  // byte 1 = 8 entered as octal "010" (=8); octal 8 can still grow, so commit it.
  await page.keyboard.type('0 010 ');
  await expect(page.locator('#stat-correct')).toHaveText('2');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
  // byte 2 = 109 as octal "0155" is 3 octal digits (≥32) → determined, scores
  // immediately; a wrong octal ("0156") goes red on divergence.
  await page.locator('#reset-btn').click();
  await page.keyboard.type('0 8 0155');
  await expect(page.locator('#stat-correct')).toHaveText('3');
  await page.locator('#reset-btn').click();
  await page.keyboard.type('0 8 0156');
  await expect(page.locator('#stat-correct')).toHaveText('2');
  await expect(page.locator('#stat-wrong')).toHaveText('1');
});

test('doom: faint commas are rendered between committed values', async ({ page }) => {
  await setSequence(page, 'doom');
  await page.keyboard.type('0 8 10'); // 0 and 8 committed; "10" still in progress
  await expect(page.locator('#user-digits .doom-comma')).toHaveCount(2);
});

test('doom: Skip reveals values and counts them as skipped', async ({ page }) => {
  await setSequence(page, 'doom');
  await page.keyboard.press('v'); // skip value 0
  await page.keyboard.press('v'); // skip value 1
  await expect(page.locator('#stat-skipped')).toHaveText('2');
  await expect(page.locator('#stat-correct')).toHaveText('—');
  // Revealed values render in the muted skipped style.
  const cls = await page.locator('#user-digits .doom-cell .digit').first().getAttribute('class');
  expect(cls).toMatch(/\bskipped\b/);
});

test('doom: a wrong value retyped correctly counts as fixed', async ({ page }) => {
  await setSequence(page, 'doom');
  // byte 0 = 0. Commit a wrong value, then erase and retype it correctly.
  await page.keyboard.type('5,');
  await expect(page.locator('#stat-wrong')).toHaveText('1');
  await page.keyboard.press('Backspace'); // remove the separator
  await page.keyboard.press('Backspace'); // remove "5"
  await page.keyboard.type('0,');         // correct now → counts as fixed
  await expect(page.locator('#stat-fixed')).toHaveText('1');
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('doom: a skipped-over value is inserted as missed', async ({ page }) => {
  await setSequence(page, 'doom');
  // byte 1 = 8 is skipped: type 0 then 109 (byte 2). 8 is inserted as missed.
  await page.keyboard.type('0,109,');
  await expect(page.locator('#stat-correct')).toHaveText('2');
  await expect(page.locator('#stat-missed')).toHaveText('1');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
  await expect(page.locator('#user-digits .missed-marker')).toHaveCount(1); // the "8"
});

test('doom: entering the whole table finishes the run (}; + lock), no trailing separator', async ({ page }) => {
  await setSequence(page, 'doom');
  // Paste the full decimal table; the final byte 249 completes it on its own
  // last digit — no trailing separator needed.
  await page.evaluate((text) => {
    const dt = new DataTransfer();
    dt.setData('text', text);
    document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  }, DOOM_RND.join(' '));
  await expect(page.locator('#pi-display')).toHaveClass(/run-complete/);
  await expect(page.locator('#keypad-decimal .key[data-digit="1"]')).toBeDisabled();
  // Pasted values count as skipped (not typed from memory) — all 256 of them.
  await expect(page.locator('#stat-skipped')).toHaveText('256');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('primes-spaced: commas are accepted and recorded as spaces', async ({ page }) => {
  await setSequence(page, 'primes-spaced');
  // "2," → the leading "2 " is absorbed; "3,5,7" → 3 5 7 = 5 entries.
  await page.keyboard.type('2,3,5,7');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('5');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('reset returns the keypad hint to "digit 1"', async ({ page }) => {
  await page.keyboard.type('1415');
  await expect(page.locator('#keypad-hint')).toContainText('digit 5');
  await page.locator('#reset-btn').click();
  await expect(page.locator('#keypad-hint')).toContainText('digit 1');
});

test('pi: typing the first digits scores correct', async ({ page }) => {
  await page.keyboard.type('14159');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('5');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('tau prefix is "6." and the digits match 2π', async ({ page }) => {
  await setSequence(page,'tau');
  await expect(page.locator('#prefix')).toContainText('6.');
  // 2π = 6.2831853071795864...
  await page.keyboard.type('28318530717');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('11');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
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
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('primes-spaced collapses double-spaces and ignores a leading space', async ({ page }) => {
  await setSequence(page,'primes-spaced');
  // Triple-space between 5 and 7 plus a leading space — should still match exactly
  // as if the user typed "2 3 5 7" (one space each, no leading space).
  await page.keyboard.type(' 2 3 5   7');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('5');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
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

test('e: prefix is "2." and the first digits score correct', async ({ page }) => {
  await setSequence(page, 'e');
  await expect(page.locator('#prefix')).toContainText('2.');
  // e = 2.71828182845...
  await page.keyboard.type('71828182845');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('11');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('ln 2: prefix is "0." and the first digits score correct', async ({ page }) => {
  await setSequence(page, 'ln2');
  await expect(page.locator('#prefix')).toContainText('0.');
  // ln 2 = 0.69314718055...
  await page.keyboard.type('69314718055');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('11');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('champernowne: 9→10 transition is treated as correct digits', async ({ page }) => {
  await setSequence(page, 'champernowne');
  await expect(page.locator('#prefix')).toContainText('0.');
  // Champernowne = 0.12345678910111213…
  // Typing past the 9→10 boundary catches the obvious off-by-one.
  await page.keyboard.type('12345678910111213');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('17');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('champernowne: 99→100 boundary is correct', async ({ page }) => {
  await setSequence(page, 'champernowne');
  // The full sequence at index 188 (0-indexed) crosses the two-digit→three-digit
  // boundary: ...979899100101102… A wrong digit here would be a 99→00 bug.
  // We type just enough to cross it; verify with a wrong digit afterwards.
  let expected = '';
  for (let i = 1; expected.length < 195; i++) expected += i;
  expected = expected.slice(0, 195); // covers ...979899100101…
  await page.keyboard.type(expected);
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('195');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('settings shows digit count under the sequence dropdown', async ({ page }) => {
  // Open settings so the hint is visible.
  await page.locator('#settings-toggle').click();
  // Default sequence is pi — long pi may still be loading async, so check
  // for any digit count, then verify the comma formatting on a known one.
  await expect(page.locator('#sequence-digits-hint')).toHaveText(
    /^[0-9,]+ digits available$/
  );
  // ln 2's long file ships 20,001 digits; wait for it to load before asserting.
  await page.locator('#sequence').selectOption('ln2');
  await page.waitForFunction(() => window.LONG_DIGITS && window.LONG_DIGITS.ln2);
  await expect(page.locator('#sequence-digits-hint')).toHaveText('20,001 digits available');
  // Switching back to pi should swap the count (pi has at least the short
  // fallback length of ~1000+).
  await page.locator('#sequence').selectOption('pi');
  const piText = await page.locator('#sequence-digits-hint').textContent();
  expect(piText).toMatch(/^[0-9,]+ digits available$/);
});

test('keypad hint reflects new sequences', async ({ page }) => {
  await setSequence(page, 'e');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 1 of e, Euler’s number:');
  await setSequence(page, 'ln2');
  await expect(page.locator('#keypad-hint')).toHaveText('Enter digit 1 of the natural log of 2:');
  await setSequence(page, 'champernowne');
  await expect(page.locator('#keypad-hint')).toHaveText(
    'Enter digit 1 of Champernowne’s constant (0.12345678910…):'
  );
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

test('picking a sequence writes a shareable URL hash and reload restores it', async ({ page }) => {
  // Selecting a non-default sequence mirrors it into the URL hash so the link
  // can be copied/shared; reloading that URL restores the selection.
  await setSequence(page, 'tau');
  await expect(page).toHaveURL(/#tau$/);
  await page.reload();
  await expect(page.locator('#app-title')).toContainText('τ');
  await expect(page.locator('#prefix')).toContainText('6.');
  await page.locator('#settings-toggle').click();
  await expect(page.locator('#sequence')).toHaveValue('tau');
});

test('loading a #sequence hash directly selects that sequence', async ({ page }) => {
  await page.goto('/#e');
  await expect(page.locator('#app-title')).toContainText('e Checker');
  await expect(page.locator('#prefix')).toContainText('2.');
  await page.locator('#settings-toggle').click();
  await expect(page.locator('#sequence')).toHaveValue('e');
});

test('the default sequence (pi) keeps a clean URL with no hash', async ({ page }) => {
  // Switch away then back to pi — selecting the default clears the hash.
  await setSequence(page, 'tau');
  await expect(page).toHaveURL(/#tau$/);
  await setSequence(page, 'pi');
  await expect(page).not.toHaveURL(/#/);
});

test('an unknown hash falls back to pi and is cleared', async ({ page }) => {
  await page.goto('/#not-a-sequence');
  await expect(page.locator('#app-title')).toContainText('π');
  await expect(page).not.toHaveURL(/#/);
});

test('editing the hash live switches sequence without reload', async ({ page }) => {
  await expect(page.locator('#app-title')).toContainText('π');
  // Drive a hashchange the way the back button or a pasted link would.
  await page.evaluate(() => { location.hash = 'sqrt2'; });
  await expect(page.locator('#app-title')).toContainText('√2');
  await page.locator('#settings-toggle').click();
  await expect(page.locator('#sequence')).toHaveValue('sqrt2');
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
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
  // Plain typing still works.
  await page.keyboard.type('243F');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('4');
});

test('skipped tile click opens the skip dialog', async ({ page }) => {
  await page.locator('#stat-skipped-tile').click();
  await expect(page.locator('#skip-modal')).toBeVisible();
});

// ---- Accounting buckets (correct / wrong / missed / skipped / fixed) ----
//
// Each test exercises one stat tile so a regression in computeStatuses,
// correctedPositions, or the render-time counter is caught here rather
// than via downstream UI bugs.

test('wrong: a single wrong digit increments stat-wrong', async ({ page }) => {
  // Pi[0] is '1'; typing '2' is unambiguously wrong.
  await page.keyboard.type('2');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-wrong')).toHaveText('1');
  await expect(page.locator('#stat-correct')).toHaveText('—');
});

test('missed: a skipped-over digit is detected via lookahead and counted', async ({ page }) => {
  // Pi = 1 4 1 5 9 2 …  Typing "1592" jumps over "41": the "5" entry
  // resolves as correct-with-2-missed (lookahead confirms "92" matches),
  // so missedBefore=['4','1'] on that entry.
  await page.keyboard.type('1592');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-correct')).toHaveText('4');
  await expect(page.locator('#stat-missed')).toHaveText('2');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('fixed: wrong → backspace → correct re-type counts as fixed', async ({ page }) => {
  await page.keyboard.type('2');           // wrong at pi[0]
  await page.keyboard.press('Enter');      // force-check so backspace records the position
  await page.keyboard.press('Backspace');  // erases the wrong entry, marks position as corrected
  await page.keyboard.type('1');           // correct re-type at the same position
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-fixed')).toHaveText('1');
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('fixed: wrong → backspace → skip onto the same position counts as fixed, not skipped', async ({ page }) => {
  await page.keyboard.type('2');           // wrong at pi[0]
  await page.keyboard.press('Enter');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('v');          // "v" skips one digit (lands on the now-corrected position)
  await expect(page.locator('#stat-fixed')).toHaveText('1');
  await expect(page.locator('#stat-skipped')).toHaveText('—');
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
  // Visual: digit carries both classes so it stays skipped-gray with the
  // corrected dotted underline.
  const cls = await page.locator('#user-digits .digit').first().getAttribute('class');
  expect(cls).toMatch(/\bskipped\b/);
  expect(cls).toMatch(/\bcorrected\b/);
});

// ---- Subtitle (pi-day swap) ----

// Stub Date.now() before the app's init runs so applyPiDaySubtitle reads
// the fake clock. Playwright's addInitScript runs after the navigation
// commits but before any page scripts, so it lands before script.js's
// init block at the bottom of the file.
async function withFakeDate(page, isoString) {
  const epoch = Date.parse(isoString);
  await page.addInitScript((ms) => {
    const RealDate = Date;
    function FakeDate(...args) {
      if (args.length === 0) return new RealDate(ms);
      return new RealDate(...args);
    }
    FakeDate.now = () => ms;
    FakeDate.parse = RealDate.parse;
    FakeDate.UTC = RealDate.UTC;
    FakeDate.prototype = RealDate.prototype;
    // eslint-disable-next-line no-global-assign
    Date = FakeDate;
  }, epoch);
  await page.goto('/');
}

test('subtitle: default text reads "remember today"', async ({ page }) => {
  // Mid-July — definitely not pi day in any timezone.
  await withFakeDate(page, '2025-07-15T12:00:00Z');
  await expect(page.locator('#subtitle')).toHaveText('How many digits can you remember today?');
});

test('subtitle: pi day in UTC swaps to the greeting', async ({ page }) => {
  await withFakeDate(page, '2025-03-14T12:00:00Z');
  await expect(page.locator('#subtitle')).toHaveText('Happy pi day!');
});

test('subtitle: still pi day if UTC+12 has just rolled into March 14', async ({ page }) => {
  // UTC March 13, 12:01 → UTC+12 is March 14, 00:01. Pi day in Kiribati.
  await withFakeDate(page, '2025-03-13T12:01:00Z');
  await expect(page.locator('#subtitle')).toHaveText('Happy pi day!');
});

test('subtitle: still pi day if UTC-12 has not yet rolled out of March 14', async ({ page }) => {
  // UTC March 15, 11:59 → UTC-12 is March 14, 23:59. Still pi day in Baker Island.
  await withFakeDate(page, '2025-03-15T11:59:00Z');
  await expect(page.locator('#subtitle')).toHaveText('Happy pi day!');
});

test('subtitle: NOT pi day once UTC+12 has not yet hit March 14', async ({ page }) => {
  // UTC March 13, 11:59 → UTC+12 is March 13, 23:59. Pi day is one minute away.
  await withFakeDate(page, '2025-03-13T11:59:00Z');
  await expect(page.locator('#subtitle')).toHaveText('How many digits can you remember today?');
});

test('subtitle: NOT pi day once UTC-12 has just rolled out of March 14', async ({ page }) => {
  // UTC March 15, 12:01 → UTC-12 is March 15, 00:01. Pi day just ended everywhere.
  await withFakeDate(page, '2025-03-15T12:01:00Z');
  await expect(page.locator('#subtitle')).toHaveText('How many digits can you remember today?');
});

test('subtitle: July 22 in UTC swaps to the approximation greeting', async ({ page }) => {
  await withFakeDate(page, '2025-07-22T12:00:00Z');
  await expect(page.locator('#subtitle')).toHaveText('Happy Pi Approximation Day!');
});

test('subtitle: still approximation day if UTC+12 has just rolled into July 22', async ({ page }) => {
  // UTC July 21, 12:01 → UTC+12 is July 22, 00:01. Approximation day in Kiribati.
  await withFakeDate(page, '2025-07-21T12:01:00Z');
  await expect(page.locator('#subtitle')).toHaveText('Happy Pi Approximation Day!');
});

test('subtitle: still approximation day if UTC-12 has not yet rolled out of July 22', async ({ page }) => {
  // UTC July 23, 11:59 → UTC-12 is July 22, 23:59. Still approximation day in Baker Island.
  await withFakeDate(page, '2025-07-23T11:59:00Z');
  await expect(page.locator('#subtitle')).toHaveText('Happy Pi Approximation Day!');
});

test('subtitle: NOT approximation day until UTC+12 hits July 22', async ({ page }) => {
  // UTC July 21, 11:59 → UTC+12 is July 21, 23:59. One minute away.
  await withFakeDate(page, '2025-07-21T11:59:00Z');
  await expect(page.locator('#subtitle')).toHaveText('How many digits can you remember today?');
});

test('subtitle: NOT approximation day once UTC-12 has rolled out of July 22', async ({ page }) => {
  // UTC July 23, 12:01 → UTC-12 is July 23, 00:01. Approximation day ended everywhere.
  await withFakeDate(page, '2025-07-23T12:01:00Z');
  await expect(page.locator('#subtitle')).toHaveText('How many digits can you remember today?');
});

// ---- Group padding ----

test('grouped: partial group reserves the same width as a complete group', async ({ page }) => {
  // Regression: the cursor lives inside the partial group and was
  // contributing ~1ch of layout width on top of the NBSP pads, so the
  // partial group was wider than the complete group it grows into. At
  // certain zoom levels that pushed the group past a wrap point and made
  // it jump to the next line, then jump back once enough digits filled
  // in to evict the cursor.
  await page.locator('#settings-toggle').click();
  await page.locator('#group-size').selectOption('6');
  await page.locator('#settings-close').click();

  // Two digits into a fresh group — the rest is pad+cursor.
  await page.keyboard.type('14');
  const partialWidth = await page.evaluate(() => {
    const group = document.querySelector('#user-digits .group');
    return group.getBoundingClientRect().width;
  });

  // Fill the group out.
  await page.keyboard.type('1592');
  const fullWidth = await page.evaluate(() => {
    const group = document.querySelector('#user-digits .group');
    return group.getBoundingClientRect().width;
  });

  // The two should agree to within sub-pixel rounding.
  expect(Math.abs(partialWidth - fullWidth)).toBeLessThan(1);
});

// ---- Undo / redo ----

test('Ctrl+Z undoes the last typed digit, same as backspace', async ({ page }) => {
  await page.keyboard.type('14');
  await page.keyboard.press('Enter');
  await expect(page.locator('#user-digits .digit')).toHaveCount(2);
  await page.keyboard.press('Control+z');
  // The "4" should be gone; "1" remains.
  const chars = await page.$$eval('#user-digits .digit', els =>
    els.map(e => e.textContent));
  expect(chars).toEqual(['1']);
});

test('Ctrl+Z after paste removes every pasted digit in one shot', async ({ page }) => {
  // Paste via the dispatched ClipboardEvent path the perf test already uses.
  await page.evaluate(() => {
    const dt = new DataTransfer();
    dt.setData('text', '14159');
    document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }));
  });
  await expect(page.locator('#user-digits .digit')).toHaveCount(5);
  await page.keyboard.press('Control+z');
  await expect(page.locator('#user-digits .digit')).toHaveCount(0);
});

test('undo then retype-correct still counts as "fixed" (same as backspace+retype)', async ({ page }) => {
  // Mirrors the "wrong → backspace → correct" test, but using Ctrl+Z
  // instead of Backspace. The user's invariant: undo of a delete-able
  // edit must leave the same bookkeeping behind, so re-typing correctly
  // marks the position as fixed.
  await page.keyboard.type('2');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Control+z');
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');
  await expect(page.locator('#stat-fixed')).toHaveText('1');
  await expect(page.locator('#stat-correct')).toHaveText('—');
  await expect(page.locator('#stat-wrong')).toHaveText('—');
});

test('Ctrl+Y redoes the last undone digit', async ({ page }) => {
  await page.keyboard.type('14');
  await page.keyboard.press('Control+z');
  await expect(page.locator('#user-digits .digit')).toHaveCount(1);
  await page.keyboard.press('Control+y');
  const chars = await page.$$eval('#user-digits .digit', els =>
    els.map(e => e.textContent));
  expect(chars).toEqual(['1', '4']);
});

test('Ctrl+Shift+Z also redoes', async ({ page }) => {
  await page.keyboard.type('14');
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+Shift+z');
  const chars = await page.$$eval('#user-digits .digit', els =>
    els.map(e => e.textContent));
  expect(chars).toEqual(['1', '4']);
});

test('mobile-input: 4+ chars at once route through paste (counted as skipped)', async ({ page }) => {
  // Simulate a mobile keyboard / autofill / macro that delivers the whole
  // string in one input event. The threshold (≥4) treats it as a paste.
  await page.evaluate(() => {
    const el = document.getElementById('mobile-input');
    el.value = '1415';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#user-digits .digit')).toHaveCount(4);
  await expect(page.locator('#stat-skipped')).toHaveText('4');
  await expect(page.locator('#stat-correct')).toHaveText('—');
});

test('mobile-input: 3 chars at once still count as keystrokes, not paste', async ({ page }) => {
  // Below the threshold — charitable to the fast-typer / double-tap case.
  await page.evaluate(() => {
    const el = document.getElementById('mobile-input');
    el.value = '141';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.keyboard.press('Enter');
  await expect(page.locator('#user-digits .digit')).toHaveCount(3);
  await expect(page.locator('#stat-correct')).toHaveText('3');
  await expect(page.locator('#stat-skipped')).toHaveText('—');
});

test('mobile-input: a 4+ char delivery is one undo unit', async ({ page }) => {
  // Multi-char delivery should be undone in one Ctrl+Z, same as a paste.
  await page.evaluate(() => {
    const el = document.getElementById('mobile-input');
    el.value = '14159';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#user-digits .digit')).toHaveCount(5);
  await page.keyboard.press('Control+z');
  await expect(page.locator('#user-digits .digit')).toHaveCount(0);
});

test('Ctrl+Z while focused in a settings field does not touch pi state', async ({ page }) => {
  // Type some pi digits, then focus the skip-count box and press Ctrl+Z.
  // Our handler must defer to the browser's native textbox undo — the
  // pi entries should be untouched.
  await page.keyboard.type('1415');
  await page.locator('#stat-skipped-tile').click();
  await expect(page.locator('#skip-modal')).toBeVisible();
  const skipBox = page.locator('#skip-count');
  await skipBox.focus();
  await skipBox.fill('77');
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+Shift+z');
  await page.keyboard.press('Control+y');
  // Pi state untouched — still 4 entries.
  await expect(page.locator('#user-digits .digit')).toHaveCount(4);
});

test('a new keystroke after undo clears the redo stack', async ({ page }) => {
  await page.keyboard.type('14');
  await page.keyboard.press('Control+z'); // entries = "1"
  await page.keyboard.type('5');           // entries = "15", redo cleared
  await page.keyboard.press('Control+y');  // should be a no-op
  const chars = await page.$$eval('#user-digits .digit', els =>
    els.map(e => e.textContent));
  expect(chars).toEqual(['1', '5']);
});

// ---- Per-digit vs on-idle auto-check ----

async function setAutoCheckSeconds(page, seconds) {
  await page.locator('#settings-toggle').click();
  await page.locator('#auto-seconds').evaluate((el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, seconds);
  await page.locator('#settings-close').click();
}

async function setAutoCheckStyle(page, value) {
  await page.locator('#settings-toggle').click();
  await page.locator(`input[name="autocheck-style"][value="${value}"]`).check({ force: true });
  await page.locator('#settings-close').click();
}

async function setMode(page, value) {
  await page.locator(`.mode-selector input[name="mode"][value="${value}"]`).check({ force: true });
}

test('auto-check style setting defaults to per-digit and is only shown in practice mode', async ({ page }) => {
  await page.locator('#settings-toggle').click();
  await expect(page.locator('#autocheck-style-setting')).toBeVisible();
  await expect(page.locator('input[name="autocheck-style"][value="per-digit"]')).toBeChecked();
  // Switch to hardcore — the autocheck-style block should be hidden.
  await setMode(page, 'hardcore');
  await expect(page.locator('#autocheck-style-setting')).toBeHidden();
  // Back to practice — visible again.
  await setMode(page, 'practice');
  await expect(page.locator('#autocheck-style-setting')).toBeVisible();
});

test('per-digit: each digit checks on its own deadline (later digits stay pending)', async ({ page }) => {
  // 1s delay so the test finishes quickly.
  await setAutoCheckSeconds(page, 1);
  await page.keyboard.type('1');
  // Wait long enough for the first digit's timer to fire.
  await page.waitForTimeout(1200);
  // Now type more digits — they should be pending (correct color hasn't been applied).
  await page.keyboard.type('41');
  // The first digit ("1") has been auto-checked → has the .correct class.
  // The two new digits are still pending.
  const classes = await page.$$eval('#user-digits .digit', els =>
    els.map(e => e.className)
  );
  expect(classes.length).toBe(3);
  expect(classes[0]).toMatch(/\bcorrect\b/);
  expect(classes[1]).toMatch(/\bpending\b/);
  expect(classes[2]).toMatch(/\bpending\b/);
});

test('on-idle: timer resets on each keystroke (no digit is checked while typing continues)', async ({ page }) => {
  await setAutoCheckStyle(page, 'on-idle');
  await setAutoCheckSeconds(page, 1);
  // Type a digit, wait under the threshold, type another, wait under, etc.
  await page.keyboard.type('1');
  await page.waitForTimeout(400);
  await page.keyboard.type('4');
  await page.waitForTimeout(400);
  await page.keyboard.type('1');
  await page.waitForTimeout(400);
  // Total elapsed > 1s, but each gap was < 1s — nothing should be checked yet.
  let classes = await page.$$eval('#user-digits .digit', els => els.map(e => e.className));
  expect(classes.every(c => /\bpending\b/.test(c))).toBe(true);
  // Now stop typing and wait past the threshold — all get checked together.
  await page.waitForTimeout(1100);
  classes = await page.$$eval('#user-digits .digit', els => els.map(e => e.className));
  expect(classes.every(c => /\bpending\b/.test(c))).toBe(false);
  expect(classes.filter(c => /\bcorrect\b/.test(c))).toHaveLength(3);
});

// ---- Render performance ----
//
// With 10k entries already on screen, adding one more digit should be a
// near-instant operation. This regression-tests the incremental render —
// the previous version rebuilt all 10k+1 DOM nodes per keystroke and
// would blow well past any sensible threshold here.
test('render: adding one digit at 10k entries stays cheap', async ({ page }) => {
  // Skip auto-check so we don't pay timer-tick cost during the seed phase.
  await page.locator('#settings-toggle').click();
  await page.locator('#auto-seconds').evaluate((el) => {
    el.value = '31';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.locator('#settings-close').click();

  // Seed via paste so we don't pay 10k keystroke costs in the test itself.
  // Long pi loads async — wait for it before pasting.
  await page.waitForFunction(() => {
    return window.LONG_DIGITS &&
      typeof window.LONG_DIGITS.pi === 'string' &&
      window.LONG_DIGITS.pi.length >= 10000;
  });
  await page.evaluate(() => {
    const text = window.LONG_DIGITS.pi.slice(0, 10000);
    const dt = new DataTransfer();
    dt.setData('text', text);
    const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true });
    document.dispatchEvent(ev);
  });
  // Sanity: 10k digits landed.
  await expect(page.locator('#stat-skipped')).toHaveText(/^10,?000$/);

  // Measure: one keystroke at the 10k mark should be well under 150ms.
  // The pre-incremental render took ~500ms+ at this size, so this catches a
  // regression with room for CI jitter (typical local run is 30-60ms).
  const ms = await page.evaluate(async () => {
    const start = performance.now();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    await new Promise(r => requestAnimationFrame(r));
    return performance.now() - start;
  });
  expect(ms).toBeLessThan(150);
});

// ---- Bullet scoring ----
//
// Regression: typing a correct digit, backspacing, and re-typing it must
// only bonus once. The bug allowed each retype to fire +5 because the
// per-entry bulletBonused flag was lost when the entry was popped.
test('bullet: re-typing the same digit after backspace cannot double-bonus', async ({ page }) => {
  await page.locator('#settings-toggle').click();
  await setMode(page, 'bullet');
  await page.locator('#settings-close').click();
  // Default bullet: 60s start, +5s bonus, -30s penalty.
  // Type "1" (correct first digit of pi after the "3." prefix), then
  // backspace+retype 10 times. Only the very first "1" should bonus.
  for (let i = 0; i < 10; i++) {
    await page.keyboard.type('1');
    await page.keyboard.press('Backspace');
  }
  // Leave a single "1" on screen and stop the run so the score modal
  // reports the remaining budget — easier to assert than the live clock.
  await page.keyboard.type('1');
  await page.locator('#stop-btn').click();
  await expect(page.locator('#bullet-score-modal')).toBeVisible();

  // 1 bonus = budget 65s, minus a fraction-of-a-second of elapsed run.
  // If the bug were still present, 11 bonuses → budget ~115s → "1:5x".
  const headline = await page.locator('#bullet-score-headline').textContent();
  const match = headline.match(/Stopped with (\d+):(\d+) remaining/);
  expect(match).not.toBeNull();
  const totalSec = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  expect(totalSec).toBeLessThanOrEqual(65);
  expect(totalSec).toBeGreaterThan(55);

  // Only the single surviving "1" should count as correct.
  await expect(page.locator('#bullet-score-correct')).toHaveText('1');
});

// Same exploit pattern with a multi-digit sequence: type "1415", backspace
// it all, retype. The full-sequence bonus is +20 (4 digits × +5); the bug
// would let repeated cycles pile up far beyond that.
test('bullet: cycling "1415" via backspace cannot rack up bonuses', async ({ page }) => {
  await page.locator('#settings-toggle').click();
  await setMode(page, 'bullet');
  await page.locator('#settings-close').click();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.type('1415');
    for (let j = 0; j < 4; j++) await page.keyboard.press('Backspace');
  }
  // Final pass left on screen.
  await page.keyboard.type('1415');
  await page.locator('#stop-btn').click();
  await expect(page.locator('#bullet-score-modal')).toBeVisible();

  // 4 bonuses total = +20s. Budget ≤ 80s; the bug would push it past 100s.
  const headline = await page.locator('#bullet-score-headline').textContent();
  const match = headline.match(/Stopped with (\d+):(\d+) remaining/);
  expect(match).not.toBeNull();
  const totalSec = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  expect(totalSec).toBeLessThanOrEqual(80);
  expect(totalSec).toBeGreaterThan(70);

  await expect(page.locator('#bullet-score-correct')).toHaveText('4');
});
