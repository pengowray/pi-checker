// ---- Sequences ----
// Built-in fallback for pi (replaced asynchronously by the long version
// from pi-long.js when it loads). The other sequences are bundled in
// sequences.js (window.SEQUENCE_DATA).
const SHORT_PI = (
  "1415926535897932384626433832795028841971693993751058209749" +
  "4459230781640628620899862803482534211706798214808651328230" +
  "6647093844609550582231725359408128481117450284102701938521" +
  "1055596446229489549303819644288109756659334461284756482337" +
  "8678316527120190914564856692346034861045432664821339360726" +
  "0249141273724587006606315588174881520920962829254091715364" +
  "3678925903600113305305488204665213841469519415116094330572" +
  "7036575959195309218611738193261179310511854807446237996274" +
  "9567351885752724891227938183011949129833673362440656643086" +
  "0213949463952247371907021798609437027705392171762931767523" +
  "8467481846766940513200056812714526356082778577134275778960" +
  "9173637178721468440901224953430146549585371050792279689258" +
  "9235420199561121290219608640344181598136297747713099605187" +
  "0721134999999837297804995105973173281609631859502445945534" +
  "6908302642522308253344685035261931188171010003137838752886" +
  "5875332083814206171776691473035982534904287554687311595628" +
  "6388235378759375195778185778053217122680661300192787661119" +
  "59092164201989"
);

const SEQUENCES = {
  pi: {
    label: 'π (pi)',
    shortLabel: 'π',
    titleHtml: '&pi; Checker',
    integerPart: '3',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: SHORT_PI,
  },
  tau: {
    label: 'τ (tau = 2π)',
    shortLabel: 'τ',
    titleHtml: '&tau; Checker',
    integerPart: '6',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '', // derived from pi at load time and again when pi-long loads
  },
  phi: {
    label: 'φ (golden ratio)',
    shortLabel: 'φ',
    titleHtml: '&phi; Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  sqrt2: {
    label: '√2',
    shortLabel: '√2',
    titleHtml: '&radic;2 Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  'pi-binary': {
    label: 'π in binary',
    shortLabel: 'π in binary',
    titleHtml: '&pi; in binary',
    integerPart: '11',
    alphabet: '01',
    keypadType: 'decimal', // same 3x4 grid, 2-9 greyed out
    digits: '',
  },
  'pi-hex': {
    label: 'π in hex',
    shortLabel: 'π in hex',
    titleHtml: '&pi; in hex',
    integerPart: '3',
    alphabet: '0123456789ABCDEF',
    keypadType: 'hex',
    digits: '',
  },
  primes: {
    label: 'Primes',
    shortLabel: 'primes',
    titleHtml: 'Primes',
    integerPart: '',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',          // filled by setupPrimes()
    primeBoundaries: null, // Set of cumulative digit-positions where each prime ends
    naturalSpaces: true,
  },
  'primes-spaced': {
    label: 'Primes (spaced)',
    shortLabel: 'primes',
    titleHtml: 'Primes',
    integerPart: '',
    alphabet: '0123456789 ',
    keypadType: 'decimal',
    digits: '',
    naturalSpaces: true,
  },
};

// Pull in the bundled secondary sequences
if (window.SEQUENCE_DATA) {
  for (const key of ['phi', 'sqrt2', 'pi-binary', 'pi-hex']) {
    if (window.SEQUENCE_DATA[key]) {
      SEQUENCES[key].digits = window.SEQUENCE_DATA[key].digits;
    }
  }
}

// ---- Derived sequences ----
function doubleDigitString(s) {
  let carry = 0;
  let out = '';
  for (let i = s.length - 1; i >= 0; i--) {
    const d = s.charCodeAt(i) - 48; // '0' = 48
    const v = d * 2 + carry;
    out = String.fromCharCode(48 + (v % 10)) + out;
    carry = (v / 10) | 0;
  }
  if (carry) out = String(carry) + out;
  return out;
}

function deriveTau() {
  const pi = SEQUENCES.pi;
  const doubled = doubleDigitString(pi.integerPart + pi.digits);
  // Pi's integer part is "3", so doubling never produces a leading carry.
  // Align tau's integer-part length with pi's.
  const intLen = pi.integerPart.length;
  SEQUENCES.tau.integerPart = doubled.slice(0, intLen);
  SEQUENCES.tau.digits = doubled.slice(intLen);
}
deriveTau();

(function setupPrimes() {
  const N = 100000;
  const sieve = new Uint8Array(N + 1);
  const primes = [];
  for (let i = 2; i <= N; i++) {
    if (sieve[i]) continue;
    primes.push(i);
    for (let j = i * i; j <= N; j += i) sieve[j] = 1;
  }
  const boundaries = new Set();
  let pos = 0;
  let joined = '';
  for (const p of primes) {
    const s = String(p);
    joined += s;
    pos += s.length;
    boundaries.add(pos);
  }
  SEQUENCES.primes.digits = joined;
  SEQUENCES.primes.primeBoundaries = boundaries;
  SEQUENCES['primes-spaced'].digits = primes.join(' ');
})();

// ---- Constants ----
const MODE_FIXED_DELAY = { competitive: 2, hardcore: 0 };
const DEFAULT_PRACTICE_DELAY = 3;
const DEFAULT_GROUP_SIZE = 0;
const DEFAULT_SEQUENCE = 'pi';
const MANUAL_DELAY = 31; // slider sentinel: no auto-check; user presses Check/Enter
const COMPETITIVE_LIMIT_SECONDS = 15 * 60;

const STORAGE_KEYS = {
  theme: 'pi-theme',
  practiceDelay: 'pi-practice-delay',
  groupSize: 'pi-group-size',
  keypadFlip: 'pi-keypad-flip',
  practiceDisplay: 'pi-practice-display',
};

const DEFAULT_KEYPAD_FLIP = false;
const DEFAULT_PRACTICE_DISPLAY = 'annotations';

const state = {
  sequenceId: 'pi',
  digits: SEQUENCES.pi.digits,
  integerPart: SEQUENCES.pi.integerPart,
  alphabet: SEQUENCES.pi.alphabet,
  keypadType: SEQUENCES.pi.keypadType,
  integerCharsConsumed: 0, // how many leading integer-part chars the user has typed
  mode: 'practice',
  autoCheckSeconds: DEFAULT_PRACTICE_DELAY,
  practiceDelay: DEFAULT_PRACTICE_DELAY, // remember user's choice for practice mode
  // Each entry: { char, t, skipped, checked, status, expected, missedBefore }
  entries: [],
  startTime: null,
  autoCheckTimer: null,
  gameLocked: false,
  competitiveEnded: false,
  competitiveFrozenAt: 0,
  hardcoreFailed: false,
  hardcoreFrozenAt: 0,
  practicePaused: false,
  practicePauseDisplayedAt: 0,
  erasedErrors: 0,
  erasedPreCheck: 0, // wrong digits erased before they were checked; not displayed yet
  groupSize: 0,
  keypadFlipped: DEFAULT_KEYPAD_FLIP,
  practiceDisplay: DEFAULT_PRACTICE_DISPLAY,
  compTimerHidden: false,
};

// In-memory only (not persisted): the last "Skip N" value the user entered.
let lastSkipAmount = 10;

// ---- DOM refs ----
const userDigitsEl = document.getElementById('user-digits');
const piDisplayEl = document.getElementById('pi-display');
const prefixEl = document.getElementById('prefix');
const appTitleEl = document.getElementById('app-title');
const sequenceSelect = document.getElementById('sequence');
const autoSecondsInput = document.getElementById('auto-seconds');
const autoSecondsLabel = document.getElementById('auto-seconds-label');
const groupSizeSelect = document.getElementById('group-size');
const modeInputs = document.querySelectorAll('input[name="mode"]');
const themeToggle = document.getElementById('theme-toggle');
const settingsToggle = document.getElementById('settings-toggle');
const settingsModal = document.getElementById('settings-modal');
const resetBtn = document.getElementById('reset-btn');
const stopBtn = document.getElementById('stop-btn');
const continueBtn = document.getElementById('continue-btn');
const keypadDecimal = document.getElementById('keypad-decimal');
const keypadHex = document.getElementById('keypad-hex');
const allDigitBtns = document.querySelectorAll('.key[data-digit]');
const allCheckBtns = document.querySelectorAll('[data-action="check"]');
const allBackBtns = document.querySelectorAll('[data-action="back"]');
const modeHint = document.getElementById('mode-hint');
const modeBadge = document.getElementById('mode-badge');
const compTimerEl = document.getElementById('comp-timer');
const keypadHintEl = document.getElementById('keypad-hint');
const themeInputs = document.querySelectorAll('input[name="theme"]');
const keypadFlipInputs = document.querySelectorAll('input[name="keypad-flip"]');
const practiceDisplayInputs = document.querySelectorAll('input[name="practice-display"]');
const resetBtns = document.querySelectorAll('.setting-reset');
const skippedTile = document.getElementById('stat-skipped-tile');
const skipModal = document.getElementById('skip-modal');
const skipOneBtn = document.getElementById('skip-one');
const skipConfirmBtn = document.getElementById('skip-confirm');
const skipCountInput = document.getElementById('skip-count');

const statCorrect = document.getElementById('stat-correct');
const statWrong = document.getElementById('stat-wrong');
const statMissed = document.getElementById('stat-missed');
const statSkipped = document.getElementById('stat-skipped');
const statErased = document.getElementById('stat-erased');
const statTime = document.getElementById('stat-time');

// ---- Theme ----
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '\u{1F319}';
  themeInputs.forEach(input => { input.checked = input.value === theme; });
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});
themeInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (input.checked) setTheme(input.value);
  });
});
initTheme();

// ---- Keypad flip (phone vs numpad) ----
function applyKeypadFlip(flipped) {
  state.keypadFlipped = !!flipped;
  keypadDecimal.classList.toggle('flipped', state.keypadFlipped);
  keypadHex.classList.toggle('flipped', state.keypadFlipped);
  const value = state.keypadFlipped ? 'numpad' : 'phone';
  keypadFlipInputs.forEach(input => { input.checked = input.value === value; });
}

keypadFlipInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    applyKeypadFlip(input.value === 'numpad');
    localStorage.setItem(STORAGE_KEYS.keypadFlip, input.value);
    updateResetVisibility();
  });
});

// ---- Practice display ----
practiceDisplayInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    state.practiceDisplay = input.value;
    localStorage.setItem(STORAGE_KEYS.practiceDisplay, input.value);
    updateResetVisibility();
    render();
  });
});

// ---- Skip next digit(s) ----
// Practice: works any time. Competitive/Hardcore: only before the clock starts.
function canSkip() {
  if (isInputLocked()) return false;
  if (state.entries.length >= state.digits.length) return false;
  if ((state.mode === 'competitive' || state.mode === 'hardcore') && state.startTime !== null) return false;
  return true;
}

function skipDigits(n) {
  if (!canSkip()) return 0;
  const remaining = state.digits.length - state.entries.length;
  const count = Math.min(Math.max(0, n | 0), remaining);
  if (count === 0) return 0;
  for (let i = 0; i < count; i++) {
    const t = state.startTime === null ? null : (performance.now() - state.startTime);
    state.entries.push({
      char: state.digits[state.entries.length],
      t: t,
      skipped: true,
      checked: true,
      status: 'pending',
      expected: null,
      missedBefore: [],
    });
  }
  computeStatuses();
  render();
  return count;
}

function skipNextDigit() { skipDigits(1); }

// ---- Sequence selection ----
function applySequence(id) {
  const def = SEQUENCES[id];
  if (!def) return;
  state.sequenceId = id;
  state.digits = def.digits;
  state.integerPart = def.integerPart;
  state.alphabet = def.alphabet;
  state.keypadType = def.keypadType;
  state.integerCharsConsumed = 0;
  prefixEl.textContent = def.integerPart ? def.integerPart + '.' : '';
  prefixEl.hidden = !def.integerPart;
  appTitleEl.innerHTML = def.titleHtml;
  // Swap keypad layout
  keypadDecimal.hidden = def.keypadType !== 'decimal';
  keypadHex.hidden = def.keypadType !== 'hex';
  // Show the space key only when the alphabet uses spaces.
  keypadDecimal.classList.toggle('with-space', def.alphabet.includes(' '));
}

sequenceSelect.addEventListener('change', () => {
  const newId = sequenceSelect.value;
  if (newId === state.sequenceId) return;
  if (state.entries.length > 0) {
    const ok = confirm('Switching sequence will reset your current progress. Continue?');
    if (!ok) {
      sequenceSelect.value = state.sequenceId;
      return;
    }
  }
  clearSession();
  applySequence(newId);
  updateResetVisibility();
  render();
});

// ---- Group size ----
groupSizeSelect.addEventListener('change', () => {
  state.groupSize = parseInt(groupSizeSelect.value, 10) || 0;
  localStorage.setItem(STORAGE_KEYS.groupSize, String(state.groupSize));
  updateResetVisibility();
  render();
});

// ---- Mode + slider ----
autoSecondsInput.addEventListener('input', () => {
  if (state.mode in MODE_FIXED_DELAY) {
    autoSecondsInput.value = MODE_FIXED_DELAY[state.mode];
    return;
  }
  state.autoCheckSeconds = parseInt(autoSecondsInput.value, 10);
  state.practiceDelay = state.autoCheckSeconds;
  localStorage.setItem(STORAGE_KEYS.practiceDelay, String(state.practiceDelay));
  renderDelayLabel();
  updateModeBadge();
  updateResetVisibility();
  if (hasPending()) resetAutoCheckTimer();
});

function isManual() {
  return state.autoCheckSeconds >= MANUAL_DELAY;
}

function renderDelayLabel() {
  autoSecondsLabel.textContent = isManual() ? 'manual' : state.autoCheckSeconds + 's';
}

function processModeChange(newMode, targetInput) {
  if (newMode === state.mode) return;
  if (attemptModeChange(newMode)) {
    if (targetInput) targetInput.checked = true;
  } else {
    const cur = document.querySelector(`input[name="mode"][value="${state.mode}"]`);
    if (cur) cur.checked = true;
  }
  render();
}

// Click on the label itself, with preventDefault so the radio doesn't auto-
// activate. This catches every click reliably (including rapid clicks where
// the radio's `change` event sometimes fails to re-fire).
document.querySelectorAll('.mode-selector .mode-option').forEach(label => {
  const input = label.querySelector('input[name="mode"]');
  if (!input) return;
  label.addEventListener('click', (e) => {
    e.preventDefault();
    processModeChange(input.value, input);
  });
});

// Fallback for keyboard radio-group navigation (arrow keys fire `change`
// without a click event).
modeInputs.forEach(input => {
  input.addEventListener('change', () => {
    processModeChange(input.value, input);
  });
});

function attemptModeChange(newMode) {
  if (newMode === state.mode) return true;

  // Hardcore and Competitive always start from a fresh session.
  if (newMode === 'competitive' || newMode === 'hardcore') {
    if (state.entries.length > 0) {
      const ok = confirm('This will reset your current progress. Start a new ' + newMode + ' session?');
      if (!ok) return false;
    }
    clearSession();
    state.mode = newMode;
    applyModeDefaults();
    return true;
  }

  // Leaving an active competitive session to Practice requires confirmation.
  if (state.mode === 'competitive' && state.gameLocked && !state.competitiveEnded && newMode === 'practice') {
    const ok = confirm('Your competitive session will end. Continue in practice mode?');
    if (!ok) return false;
    state.gameLocked = false;
  }

  if (state.mode === 'competitive' && newMode !== 'competitive') {
    if (state.competitiveEnded && state.startTime !== null) {
      state.startTime = performance.now() - state.competitiveFrozenAt * 1000;
    }
    state.competitiveEnded = false;
    state.gameLocked = false;
  }

  if (state.mode === 'hardcore' && newMode !== 'hardcore') {
    if (state.hardcoreFailed && state.startTime !== null) {
      state.startTime = performance.now() - state.hardcoreFrozenAt * 1000;
    }
    state.hardcoreFailed = false;
  }

  state.mode = newMode;
  applyModeDefaults();
  return true;
}

function clearSession() {
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  stopCheckBar();
  state.entries = [];
  state.startTime = null;
  state.gameLocked = false;
  state.competitiveEnded = false;
  state.competitiveFrozenAt = 0;
  state.hardcoreFailed = false;
  state.hardcoreFrozenAt = 0;
  state.practicePaused = false;
  state.practicePauseDisplayedAt = 0;
  state.erasedErrors = 0;
  state.erasedPreCheck = 0;
  state.integerCharsConsumed = 0;
  state.compTimerHidden = false;
}

function applyModeDefaults() {
  if (state.mode in MODE_FIXED_DELAY) {
    state.autoCheckSeconds = MODE_FIXED_DELAY[state.mode];
  } else {
    state.autoCheckSeconds = state.practiceDelay;
  }
  autoSecondsInput.value = state.autoCheckSeconds;
  renderDelayLabel();
  updateModeBadge();
}

function updateModeBadge() {
  const modeName = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  let delayText;
  if (state.mode === 'competitive' && state.competitiveEnded) delayText = 'ended';
  else if (state.mode === 'hardcore' && state.hardcoreFailed) delayText = 'failed';
  else if (isManual()) delayText = 'manual';
  else if (state.autoCheckSeconds === 0) delayText = 'instant';
  else delayText = state.autoCheckSeconds + 's auto-check';
  modeBadge.textContent = modeName + ' · ' + delayText;
  modeBadge.classList.toggle('locked', state.gameLocked && !state.competitiveEnded);
}

function updateKeypadHint() {
  const def = SEQUENCES[state.sequenceId];
  if (!def) return;
  const idx = (state.nextSeqIdx || 0) + 1;
  keypadHintEl.textContent = 'Enter digit ' + idx + ' of ' + (def.shortLabel || def.label) + ':';
}

function updateModeHint() {
  const hints = {
    practice: 'Type or paste digits. Backspace removes recent input.',
    competitive: '2s auto-check, 15 minute limit, wrong digits stay locked. Reset is required to start.',
    hardcore: 'Instant lock-in, no backspace. One wrong digit ends the run. Reset is required to start.',
  };
  modeHint.textContent = hints[state.mode] || '';
}

function isInputLocked() {
  if (state.competitiveEnded && state.mode === 'competitive') return true;
  if (state.hardcoreFailed && state.mode === 'hardcore') return true;
  return false;
}

function checkHardcoreFail() {
  if (state.mode !== 'hardcore' || state.hardcoreFailed) return;
  for (const e of state.entries) {
    if (e.checked && e.status === 'wrong') {
      state.hardcoreFailed = true;
      state.hardcoreFrozenAt = state.startTime === null ? 0
        : (performance.now() - state.startTime) / 1000;
      return;
    }
  }
}

// ---- Competitive session lifecycle ----
function endCompetitive() {
  if (state.mode !== 'competitive' || state.competitiveEnded) return;
  state.competitiveEnded = true;
  const elapsed = state.startTime === null ? 0 : (performance.now() - state.startTime) / 1000;
  state.competitiveFrozenAt = Math.min(COMPETITIVE_LIMIT_SECONDS, elapsed);
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  stopCheckBar();
  markAllChecked();
  render();
}

function endHardcore() {
  if (state.mode !== 'hardcore' || state.hardcoreFailed) return;
  state.hardcoreFailed = true;
  state.hardcoreFrozenAt = state.startTime === null ? 0
    : (performance.now() - state.startTime) / 1000;
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  stopCheckBar();
  markAllChecked();
  render();
}

function practicePause() {
  if (state.mode !== 'practice') return;
  if (state.startTime === null || state.practicePaused) return;
  state.practicePaused = true;
  state.practicePauseDisplayedAt = (performance.now() - state.startTime) / 1000;
  render();
}

function practiceResume() {
  if (!state.practicePaused) return;
  state.practicePaused = false;
}

function continueInPractice() {
  if (state.mode === 'competitive' && state.competitiveEnded) {
    if (state.startTime !== null) {
      state.startTime = performance.now() - state.competitiveFrozenAt * 1000;
    }
    state.competitiveEnded = false;
    state.gameLocked = false;
  } else if (state.mode === 'hardcore' && state.hardcoreFailed) {
    if (state.startTime !== null) {
      state.startTime = performance.now() - state.hardcoreFrozenAt * 1000;
    }
    state.hardcoreFailed = false;
  } else {
    return;
  }
  state.mode = 'practice';
  const radio = document.querySelector('input[name="mode"][value="practice"]');
  if (radio) radio.checked = true;
  applyModeDefaults();
  render();
}

// ---- Input handling ----
function inputDigit(d) {
  if (isInputLocked()) return;
  d = d.toUpperCase();
  if (!state.alphabet.includes(d)) return;

  // Collapse consecutive spaces: a second space in a row is silently ignored
  // so users don't get penalised for double-tapping the space bar.
  if (d === ' ') {
    if (state.entries.length === 0) return;
    const last = state.entries[state.entries.length - 1];
    if (last.char === ' ') return;
  }

  practiceResume();

  // Silently absorb leading integer-part chars (e.g. user types "3" first
  // when "3." is already displayed; or "1" then "1" for pi-binary).
  if (state.entries.length === 0 && state.integerCharsConsumed < state.integerPart.length) {
    if (d === state.integerPart[state.integerCharsConsumed]) {
      state.integerCharsConsumed += 1;
      return;
    }
  }

  if (state.startTime === null) {
    state.startTime = performance.now();
    if (state.mode === 'competitive') state.gameLocked = true;
  }

  const t = performance.now() - state.startTime;
  state.entries.push({
    char: d,
    t: t,
    skipped: false,
    checked: false,
    status: 'pending',
    expected: null,
    missedBefore: [],
  });
  computeStatuses();
  resetAutoCheckTimer();
  checkHardcoreFail();
  render();
}

function inputPaste(text) {
  if (isInputLocked()) return;
  const upper = text.toUpperCase();
  const digits = [];
  // Track the previous char so we can collapse consecutive spaces in the
  // pasted text (mirroring how live typing ignores double-spaces).
  let prevChar = state.entries.length > 0
    ? state.entries[state.entries.length - 1].char
    : '';
  for (const c of upper) {
    if (!state.alphabet.includes(c)) continue;
    if (c === ' ' && prevChar === ' ') continue;
    digits.push(c);
    prevChar = c;
  }
  if (digits.length === 0) return;

  practiceResume();

  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  markAllChecked();

  // Skip the leading integer part if the paste opens with it
  let startIdx = 0;
  if (state.entries.length === 0) {
    for (let i = state.integerCharsConsumed; i < state.integerPart.length && startIdx < digits.length; i++) {
      if (digits[startIdx] === state.integerPart[i]) {
        startIdx += 1;
        state.integerCharsConsumed += 1;
      } else {
        break;
      }
    }
  }

  if (startIdx >= digits.length) {
    render();
    return;
  }

  for (let k = startIdx; k < digits.length; k++) {
    const t = state.startTime === null ? null : (performance.now() - state.startTime);
    state.entries.push({
      char: digits[k],
      t: t,
      skipped: true,
      checked: true,
      status: 'pending',
      expected: null,
      missedBefore: [],
    });
  }

  computeStatuses();
  checkHardcoreFail();
  render();
}

function backspace() {
  if (isInputLocked()) return;
  if (state.mode === 'hardcore') return;
  if (state.entries.length === 0) return;
  const last = state.entries[state.entries.length - 1];
  if (state.mode === 'competitive') {
    if (last.checked && last.status === 'wrong') return;
    if (last.skipped) return; // skipped digits in competitive can't be erased
  }

  // Displayed "Erased" counter: only the errors the user actually saw,
  // plus skipped digits (any erase undoes that skip).
  if (last.checked) {
    if (last.status === 'wrong' ||
        last.skipped ||
        (last.skipConfirms && !last.correctNoSkip)) {
      state.erasedErrors += 1;
    }
  } else if (last.status === 'wrong') {
    state.erasedPreCheck += 1;
  }

  state.entries.pop();
  if (state.entries.length === 0) state.integerCharsConsumed = 0;
  computeStatuses();
  resetAutoCheckTimer();
  render();
}

function forceCheck() {
  if (isInputLocked()) return;
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  stopCheckBar();
  markAllChecked();
  render();
}

function hasPending() {
  return state.entries.some(e => !e.checked);
}

function resetAutoCheckTimer() {
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  stopCheckBar();
  if (!hasPending()) return;
  if (isManual()) return;

  const ms = state.autoCheckSeconds * 1000;
  if (ms <= 0) {
    markAllChecked();
  } else {
    startCheckBar(ms);
    state.autoCheckTimer = setTimeout(() => {
      state.autoCheckTimer = null;
      stopCheckBar();
      markAllChecked();
      render();
    }, ms);
  }
}

function startCheckBar(ms) {
  allCheckBtns.forEach(btn => {
    btn.classList.remove('filling');
    void btn.offsetWidth; // restart animation by forcing reflow
    btn.style.setProperty('--fill-duration', ms + 'ms');
    btn.classList.add('filling');
  });
}

function stopCheckBar() {
  allCheckBtns.forEach(btn => {
    btn.classList.remove('filling');
    btn.style.removeProperty('--fill-duration');
  });
}

function markAllChecked() {
  for (const e of state.entries) e.checked = true;
}

// ---- Status computation ----
function computeStatuses() {
  const entries = state.entries;
  const digits = state.digits;
  let seqIdx = 0;

  // Skip-aware walk
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    e.missedBefore = [];
    e.skipConfirms = false;

    if (seqIdx >= digits.length) {
      e.status = 'wrong';
      e.expected = null;
      e.seqIdxAfter = seqIdx;
      continue;
    }

    if (e.char === digits[seqIdx]) {
      e.status = 'correct';
      e.expected = digits[seqIdx];
      seqIdx += 1;
      e.seqIdxAfter = seqIdx;
      continue;
    }

    let missed = 0;
    for (let k = 1; k <= 2; k++) {
      if (seqIdx + k >= digits.length) break;
      if (e.char !== digits[seqIdx + k]) continue;
      const n1 = entries[i + 1];
      const n2 = entries[i + 2];
      if (!n1 || !n2) continue;
      if (seqIdx + k + 2 >= digits.length) continue;
      if (n1.char === digits[seqIdx + k + 1] && n2.char === digits[seqIdx + k + 2]) {
        missed = k;
        break;
      }
    }

    if (missed > 0) {
      for (let j = 0; j < missed; j++) e.missedBefore.push(digits[seqIdx + j]);
      e.status = 'correct';
      e.expected = digits[seqIdx + missed];
      seqIdx += missed + 1;
    } else {
      e.status = 'wrong';
      e.expected = digits[seqIdx];
      seqIdx += 1;
    }
    e.seqIdxAfter = seqIdx;
  }

  // Position in the sequence the next typed digit will land at.
  state.nextSeqIdx = seqIdx;

  // Mark the next two entries after each skip as the skip's "confirming"
  // digits. Deleting one of these unwinds the skip and so should count as
  // erasing an error, unless the digit would have been correct at its
  // literal position anyway (the correctNoSkip check below).
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].missedBefore && entries[i].missedBefore.length > 0) {
      if (entries[i + 1]) entries[i + 1].skipConfirms = true;
      if (entries[i + 2]) entries[i + 2].skipConfirms = true;
    }
  }

  // No-skip walk: would this entry be correct at its literal position
  // (one pi digit per typed digit, no skipping)?
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    e.correctNoSkip = i < digits.length && e.char === digits[i];
  }
}

// ---- Render ----
function render() {
  const frag = document.createDocumentFragment();
  let correct = 0, wrong = 0, missed = 0, skipped = 0;
  let pos = 0;
  let currentGroup = null;
  const def = SEQUENCES[state.sequenceId];
  // Sequences with their own natural spacing (e.g. primes) override the
  // user-selected grouping — the prime boundaries are the grouping.
  const gs = (def && def.naturalSpaces) ? 0 : state.groupSize;
  const primeBoundaries = def && def.primeBoundaries;
  let seqPos = 0; // walk the sequence position alongside entries, for primeBoundaries

  function appendItem(span) {
    if (gs > 0) {
      if (pos % gs === 0) {
        currentGroup = document.createElement('span');
        currentGroup.className = 'group';
        frag.appendChild(currentGroup);
      }
      currentGroup.appendChild(span);
    } else {
      frag.appendChild(span);
    }
    pos += 1;
  }

  function maybeAppendPrimeBoundary() {
    if (!primeBoundaries || !primeBoundaries.has(seqPos)) return;
    const space = document.createElement('span');
    space.className = 'prime-space';
    space.textContent = ' ';
    frag.appendChild(space);
  }

  // A literal " " text node inside an inline-block can collapse to a near-
  // zero width in some browsers, so spaces are rendered as NBSP and given an
  // explicit width class so they always read as a visible gap.
  function setCharText(el, char) {
    if (char === ' ') {
      el.classList.add('space-char');
      el.textContent = ' ';
    } else {
      el.textContent = char;
    }
  }

  for (const e of state.entries) {
    if (e.checked) {
      for (const s of e.missedBefore) {
        const span = document.createElement('span');
        span.className = 'digit missed-marker';
        setCharText(span, s);
        span.title = 'missed digit';
        appendItem(span);
        missed += 1;
        seqPos += 1;
        maybeAppendPrimeBoundary();
      }
      const span = document.createElement('span');
      let cls = 'digit ' + e.status;
      if (e.skipped) cls += ' skipped';
      const inComp = state.mode === 'competitive';
      const inPracticeAnnot = state.mode === 'practice' && state.practiceDisplay === 'annotations';
      const showDiff = ((inComp && state.competitiveEnded) || inPracticeAnnot) && e.status === 'wrong' && e.expected;
      const showMask = inComp && !state.competitiveEnded && e.status === 'wrong';
      if (showDiff) {
        cls += ' diff';
        span.className = cls;
        const correctionEl = document.createElement('span');
        correctionEl.className = 'correction';
        setCharText(correctionEl, e.expected);
        const typedEl = document.createElement('span');
        typedEl.className = 'typed';
        setCharText(typedEl, e.char);
        span.appendChild(correctionEl);
        span.appendChild(typedEl);
      } else if (showMask) {
        cls += ' masked';
        span.className = cls;
        span.textContent = '·';
      } else {
        span.className = cls;
        setCharText(span, e.char);
      }
      if (e.status === 'wrong' && e.expected) {
        span.title = 'typed ' + e.char + ', expected ' + e.expected;
      } else if (e.skipped) {
        span.title = 'skipped';
      }
      appendItem(span);
      if (e.status === 'correct') {
        if (e.skipped) skipped += 1;
        else correct += 1;
      } else if (e.status === 'wrong') {
        wrong += 1;
      }
      // For primes (no-spaces) sequence, inject a visual space whenever the
      // sequence position reaches a prime boundary.
      seqPos = (e.seqIdxAfter != null) ? e.seqIdxAfter : seqPos + 1;
      maybeAppendPrimeBoundary();
    } else {
      const span = document.createElement('span');
      span.className = 'digit pending';
      setCharText(span, e.char);
      appendItem(span);
      seqPos = (e.seqIdxAfter != null) ? e.seqIdxAfter : seqPos + 1;
      maybeAppendPrimeBoundary();
    }
  }

  userDigitsEl.replaceChildren(frag);
  piDisplayEl.classList.toggle('grouped', gs > 0);
  piDisplayEl.classList.toggle('diff-mode',
    (state.mode === 'competitive' && state.competitiveEnded) ||
    (state.mode === 'practice' && state.practiceDisplay === 'annotations'));
  updateKeypadHint();
  // Defer to next frame so the new content is laid out before we measure
  // and scroll to the bottom; without this the scrollHeight reading can
  // lag a frame behind on some browsers.
  requestAnimationFrame(() => {
    piDisplayEl.scrollTop = piDisplayEl.scrollHeight;
  });

  statCorrect.textContent = correct;
  statWrong.textContent = wrong;
  statMissed.textContent = missed;
  statSkipped.textContent = skipped;
  statErased.textContent = state.erasedErrors;

  updateUI();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function tickTime() {
  // Elapsed time (small indicator)
  if (state.startTime === null) {
    statTime.textContent = '0:00';
    statTime.classList.remove('frozen');
  } else {
    if (state.mode === 'competitive' && state.gameLocked && !state.competitiveEnded) {
      const elapsedNow = (performance.now() - state.startTime) / 1000;
      if (elapsedNow >= COMPETITIVE_LIMIT_SECONDS) {
        endCompetitive();
        updateUI();
      }
    }

    let elapsed;
    if (state.competitiveEnded && state.mode === 'competitive') {
      elapsed = state.competitiveFrozenAt;
    } else if (state.hardcoreFailed && state.mode === 'hardcore') {
      elapsed = state.hardcoreFrozenAt;
    } else if (state.practicePaused && state.mode === 'practice') {
      elapsed = state.practicePauseDisplayedAt;
    } else {
      elapsed = (performance.now() - state.startTime) / 1000;
    }

    statTime.classList.toggle('paused', state.mode === 'practice' && state.practicePaused);

    if (state.mode === 'competitive') {
      const capped = Math.min(elapsed, COMPETITIVE_LIMIT_SECONDS);
      statTime.textContent = formatTime(capped);
      statTime.classList.toggle('frozen', state.competitiveEnded);
    } else if (state.mode === 'hardcore' && state.hardcoreFailed) {
      statTime.textContent = formatTime(elapsed);
      statTime.classList.add('frozen');
    } else {
      statTime.textContent = formatTime(elapsed);
      statTime.classList.remove('frozen');
    }
  }

  // Big countdown (competitive only)
  if (state.mode === 'competitive') {
    let remaining;
    if (state.startTime === null) {
      remaining = COMPETITIVE_LIMIT_SECONDS;
    } else if (state.competitiveEnded) {
      remaining = Math.max(0, COMPETITIVE_LIMIT_SECONDS - state.competitiveFrozenAt);
    } else {
      const e = (performance.now() - state.startTime) / 1000;
      remaining = Math.max(0, COMPETITIVE_LIMIT_SECONDS - e);
    }
    compTimerEl.textContent = formatTime(remaining);
    compTimerEl.classList.toggle('ended', state.competitiveEnded);
    compTimerEl.classList.toggle('danger', !state.competitiveEnded && remaining <= 10 && state.gameLocked);
    compTimerEl.classList.toggle('warning', !state.competitiveEnded && remaining > 10 && remaining <= 60 && state.gameLocked);
  }
}
setInterval(tickTime, 250);

// ---- UI state ----
function updateUI() {
  const hasEntries = state.entries.length > 0;
  const inputLocked = isInputLocked();
  const compActive = state.mode === 'competitive' && state.gameLocked && !state.competitiveEnded;
  const hardcoreActive = state.mode === 'hardcore' && state.startTime !== null && !state.hardcoreFailed;
  const practiceActive = state.mode === 'practice' && state.startTime !== null && !state.practicePaused;
  const gameOver = (state.mode === 'competitive' && state.competitiveEnded) ||
                   (state.mode === 'hardcore' && state.hardcoreFailed);

  // Keep the settings panel's mode radio in sync with state.mode in case
  // state was changed programmatically (Continue button, etc.)
  modeInputs.forEach(input => { input.checked = input.value === state.mode; });
  modeInputs.forEach(input => { input.disabled = false; input.parentElement.title = ''; });
  autoSecondsInput.disabled = (state.mode in MODE_FIXED_DELAY) || state.gameLocked;

  // Digit keys: disable if locked OR character not in current alphabet
  allDigitBtns.forEach(btn => {
    const inAlphabet = state.alphabet.includes(btn.dataset.digit);
    btn.disabled = inputLocked || !inAlphabet;
  });

  // Backspace
  let backDisabled = inputLocked;
  if (!backDisabled) {
    if (state.mode === 'hardcore') backDisabled = true;
    else if (!hasEntries) backDisabled = true;
    else if (state.mode === 'competitive') {
      const last = state.entries[state.entries.length - 1];
      if (last.checked && last.status === 'wrong') backDisabled = true;
    }
  }
  allBackBtns.forEach(btn => { btn.disabled = backDisabled; });

  const checkDisabled = inputLocked || !hasPending();
  allCheckBtns.forEach(btn => { btn.disabled = checkDisabled; });

  // Stop button: ends in comp/hardcore, pseudo-pauses in practice
  stopBtn.hidden = !(compActive || hardcoreActive || practiceActive);
  stopBtn.textContent = state.mode === 'practice' ? 'Pause' : 'Stop';

  continueBtn.hidden = !gameOver;

  // On game over the user's natural action is to start over, so make Reset
  // the prominent button and demote Continue.
  resetBtn.classList.toggle('primary', gameOver);
  continueBtn.classList.toggle('secondary', gameOver);
  compTimerEl.hidden = state.mode !== 'competitive';
  // Dim when the user has clicked it to hide, but force visible when the
  // session is over so the final time stands out.
  compTimerEl.classList.toggle('dimmed', state.compTimerHidden && !state.competitiveEnded);

  updateModeHint();
  updateModeBadge();
}

// ---- Reset ----
function reset() {
  clearSession();
  const checkedRadio = document.querySelector('input[name="mode"]:checked');
  if (checkedRadio) state.mode = checkedRadio.value;
  applyModeDefaults();
  render();
}

// ---- Event wiring ----
function wireKey(btn, fn) {
  btn.addEventListener('click', () => {
    fn();
    btn.blur();
  });
  btn.addEventListener('mousedown', (e) => e.preventDefault());
}

allDigitBtns.forEach(btn => {
  wireKey(btn, () => inputDigit(btn.dataset.digit));
});
allBackBtns.forEach(btn => wireKey(btn, backspace));
allCheckBtns.forEach(btn => wireKey(btn, forceCheck));
resetBtn.addEventListener('click', reset);
stopBtn.addEventListener('click', () => {
  if (state.mode === 'competitive') endCompetitive();
  else if (state.mode === 'hardcore') endHardcore();
  else if (state.mode === 'practice') practicePause();
});
continueBtn.addEventListener('click', () => continueInPractice());

function toggleCompTimer() {
  if (state.mode !== 'competitive') return;
  if (state.competitiveEnded) return; // ended state always visible
  state.compTimerHidden = !state.compTimerHidden;
  updateUI();
}
compTimerEl.addEventListener('click', toggleCompTimer);
compTimerEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.stopPropagation();
    toggleCompTimer();
  }
});

document.addEventListener('keydown', (e) => {
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

  if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) return;

  if (!settingsModal.hidden) {
    if (e.key === 'Escape') {
      closeSettings();
      e.preventDefault();
    }
    return;
  }

  if (!skipModal.hidden) {
    if (e.key === 'Escape') {
      closeSkipModal();
      e.preventDefault();
    }
    return;
  }

  // "V" skips the next sequence digit. Practice: any time;
  // Competitive/Hardcore: only before the clock starts.
  if ((e.key === 'v' || e.key === 'V') && !e.ctrlKey && !e.metaKey) {
    skipNextDigit();
    e.preventDefault();
    return;
  }

  const k = e.key.toUpperCase();
  if (k.length === 1 && state.alphabet.includes(k)) {
    inputDigit(k);
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    backspace();
    e.preventDefault();
  } else if (e.key === 'Enter') {
    forceCheck();
    e.preventDefault();
  }
});

document.addEventListener('paste', (e) => {
  const cd = e.clipboardData || window.clipboardData;
  if (!cd) return;
  const text = cd.getData('text');
  if (!text) return;
  e.preventDefault();
  inputPaste(text);
});

// ---- Settings reset buttons ----
resetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.reset;
    if (target === 'sequence') {
      if (state.sequenceId === DEFAULT_SEQUENCE) return;
      sequenceSelect.value = DEFAULT_SEQUENCE;
      sequenceSelect.dispatchEvent(new Event('change'));
    } else if (target === 'auto-check') {
      state.practiceDelay = DEFAULT_PRACTICE_DELAY;
      localStorage.setItem(STORAGE_KEYS.practiceDelay, String(DEFAULT_PRACTICE_DELAY));
      if (!(state.mode in MODE_FIXED_DELAY)) {
        state.autoCheckSeconds = DEFAULT_PRACTICE_DELAY;
        autoSecondsInput.value = DEFAULT_PRACTICE_DELAY;
        renderDelayLabel();
        updateModeBadge();
        if (hasPending()) resetAutoCheckTimer();
      }
      updateResetVisibility();
    } else if (target === 'group-size') {
      state.groupSize = DEFAULT_GROUP_SIZE;
      groupSizeSelect.value = String(DEFAULT_GROUP_SIZE);
      localStorage.setItem(STORAGE_KEYS.groupSize, String(DEFAULT_GROUP_SIZE));
      updateResetVisibility();
      render();
    } else if (target === 'keypad-flip') {
      applyKeypadFlip(DEFAULT_KEYPAD_FLIP);
      localStorage.setItem(STORAGE_KEYS.keypadFlip, DEFAULT_KEYPAD_FLIP ? 'numpad' : 'phone');
      updateResetVisibility();
    } else if (target === 'practice-display') {
      state.practiceDisplay = DEFAULT_PRACTICE_DISPLAY;
      const radio = document.querySelector(`input[name="practice-display"][value="${DEFAULT_PRACTICE_DISPLAY}"]`);
      if (radio) radio.checked = true;
      localStorage.setItem(STORAGE_KEYS.practiceDisplay, DEFAULT_PRACTICE_DISPLAY);
      updateResetVisibility();
      render();
    }
  });
});

function updateResetVisibility() {
  resetBtns.forEach(btn => {
    const target = btn.dataset.reset;
    let isDefault = true;
    if (target === 'sequence') isDefault = state.sequenceId === DEFAULT_SEQUENCE;
    else if (target === 'auto-check') isDefault = state.practiceDelay === DEFAULT_PRACTICE_DELAY;
    else if (target === 'group-size') isDefault = state.groupSize === DEFAULT_GROUP_SIZE;
    else if (target === 'keypad-flip') isDefault = state.keypadFlipped === DEFAULT_KEYPAD_FLIP;
    else if (target === 'practice-display') isDefault = state.practiceDisplay === DEFAULT_PRACTICE_DISPLAY;
    btn.hidden = isDefault;
  });
}

// ---- Settings modal ----
function openSettings() {
  settingsModal.hidden = false;
  settingsModal.setAttribute('aria-hidden', 'false');
}
function closeSettings() {
  settingsModal.hidden = true;
  settingsModal.setAttribute('aria-hidden', 'true');
}
settingsToggle.addEventListener('click', openSettings);
modeBadge.addEventListener('click', openSettings);
settingsModal.addEventListener('click', (e) => {
  if (e.target && e.target.hasAttribute('data-close')) closeSettings();
});

// ---- Skip-digits modal ----
function openSkipModal() {
  if (!canSkip()) return;
  skipCountInput.value = lastSkipAmount;
  skipModal.hidden = false;
  skipModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => { skipCountInput.focus(); skipCountInput.select(); }, 0);
}

function closeSkipModal() {
  skipModal.hidden = true;
  skipModal.setAttribute('aria-hidden', 'true');
}

function confirmSkipN() {
  const raw = parseInt(skipCountInput.value, 10);
  if (isNaN(raw) || raw < 1) return;
  lastSkipAmount = raw;
  skipDigits(raw);
  closeSkipModal();
}

skippedTile.addEventListener('click', openSkipModal);
skippedTile.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openSkipModal();
  }
});

skipOneBtn.addEventListener('click', () => {
  skipDigits(1);
  closeSkipModal();
});

skipConfirmBtn.addEventListener('click', confirmSkipN);

skipCountInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    confirmSkipN();
  }
});

skipModal.addEventListener('click', (e) => {
  if (e.target && e.target.hasAttribute('data-close')) closeSkipModal();
});

// ---- Async load of the long pi sequence ----
function loadLongPi() {
  const script = document.createElement('script');
  script.src = 'pi-long.js';
  script.async = true;
  script.onload = () => {
    if (typeof window.PI_LONG_DIGITS === 'string' && window.PI_LONG_DIGITS.length > SEQUENCES.pi.digits.length) {
      SEQUENCES.pi.digits = window.PI_LONG_DIGITS;
      // Tau is derived from pi, so its length grows in step.
      deriveTau();
      if (state.sequenceId === 'pi' || state.sequenceId === 'tau') {
        state.digits = SEQUENCES[state.sequenceId].digits;
        // Re-score entries that may have been beyond the short fallback
        computeStatuses();
        render();
      }
    }
  };
  script.onerror = () => {
    // Long pi failed to load; the short bundled version still works
    console.warn('Could not load pi-long.js; using short pi fallback');
  };
  document.head.appendChild(script);
}

// ---- Load persisted settings ----
function loadPersistedSettings() {
  const savedDelay = parseInt(localStorage.getItem(STORAGE_KEYS.practiceDelay), 10);
  if (!isNaN(savedDelay) && savedDelay >= 0 && savedDelay <= MANUAL_DELAY) {
    state.practiceDelay = savedDelay;
    state.autoCheckSeconds = savedDelay;
    autoSecondsInput.value = savedDelay;
  }
  const savedGroup = parseInt(localStorage.getItem(STORAGE_KEYS.groupSize), 10);
  if (!isNaN(savedGroup) && [0, 2, 3, 4, 5, 6, 7].includes(savedGroup)) {
    state.groupSize = savedGroup;
    groupSizeSelect.value = String(savedGroup);
  }
  const savedFlip = localStorage.getItem(STORAGE_KEYS.keypadFlip);
  if (savedFlip === 'numpad' || savedFlip === 'phone') {
    applyKeypadFlip(savedFlip === 'numpad');
  } else {
    applyKeypadFlip(DEFAULT_KEYPAD_FLIP);
  }
  const savedPracticeDisplay = localStorage.getItem(STORAGE_KEYS.practiceDisplay);
  if (savedPracticeDisplay === 'oneline' || savedPracticeDisplay === 'annotations') {
    state.practiceDisplay = savedPracticeDisplay;
    const radio = document.querySelector(`input[name="practice-display"][value="${savedPracticeDisplay}"]`);
    if (radio) radio.checked = true;
  }
}

// ---- Init ----
loadPersistedSettings();
applySequence('pi');
applyModeDefaults();
updateModeHint();
updateResetVisibility();
render();
loadLongPi();
