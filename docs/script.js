// ---- Sequences ----
// Built-in fallback for pi (replaced asynchronously by the long version
// from docs/long/pi.js when it loads). The other sequences are bundled in
// sequences.js (window.SEQUENCE_DATA), with their full-length versions
// loaded on demand from docs/long/<id>.js (see loadLong()).
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
    hintLabel: 'pi',
    titleHtml: '&pi; Checker',
    integerPart: '3',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: SHORT_PI,
  },
  tau: {
    label: 'τ (tau = 2π)',
    shortLabel: 'τ',
    hintLabel: 'tau (2π)',
    titleHtml: '&tau; Checker',
    integerPart: '6',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '', // derived from pi at load time and again when pi-long loads
  },
  phi: {
    label: 'φ (golden ratio)',
    shortLabel: 'φ',
    hintLabel: 'phi, the golden ratio',
    titleHtml: '&phi; Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  sqrt2: {
    label: '√2',
    shortLabel: '√2',
    hintLabel: 'the square root of 2',
    titleHtml: '&radic;2 Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  sqrt3: {
    label: '√3',
    shortLabel: '√3',
    hintLabel: 'the square root of 3',
    titleHtml: '&radic;3 Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  sqrt5: {
    label: '√5',
    shortLabel: '√5',
    hintLabel: 'the square root of 5',
    titleHtml: '&radic;5 Checker',
    integerPart: '2',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  e: {
    label: 'e (Euler’s number)',
    shortLabel: 'e',
    hintLabel: 'e, Euler’s number',
    titleHtml: 'e Checker',
    integerPart: '2',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  ln2: {
    label: 'ln 2',
    shortLabel: 'ln 2',
    hintLabel: 'the natural log of 2',
    titleHtml: 'ln 2 Checker',
    integerPart: '0',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  log10_2: {
    label: 'log₁₀ 2',
    shortLabel: 'log₁₀ 2',
    hintLabel: 'the base-10 log of 2',
    titleHtml: 'log<sub>10</sub> 2 Checker',
    integerPart: '0',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  'pi-squared': {
    label: 'π² (pi squared)',
    shortLabel: 'π²',
    hintLabel: 'pi squared',
    titleHtml: '&pi;&sup2; Checker',
    integerPart: '9',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  zeta2: {
    label: 'ζ(2) = π²/6',
    shortLabel: 'ζ(2)',
    hintLabel: 'zeta(2), the Basel constant (π²/6)',
    titleHtml: '&zeta;(2) Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  'euler-mascheroni': {
    label: 'γ (Euler–Mascheroni)',
    shortLabel: 'γ',
    hintLabel: 'the Euler–Mascheroni constant',
    titleHtml: '&gamma; Checker',
    integerPart: '0',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
  },
  champernowne: {
    label: 'Champernowne’s constant',
    shortLabel: 'Champernowne',
    hintLabel: 'Champernowne’s constant (0.12345678910…)',
    titleHtml: 'Champernowne Checker',
    integerPart: '0',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',          // filled by setupChampernowne()
  },
  'pi-binary': {
    label: 'π in binary',
    shortLabel: 'π in binary',
    hintLabel: 'pi in binary',
    titleHtml: '&pi; in binary',
    integerPart: '11',
    alphabet: '01',
    keypadType: 'decimal', // same 3x4 grid, 2-9 greyed out
    digits: '',
  },
  'pi-hex': {
    label: 'π in hex',
    shortLabel: 'π in hex',
    hintLabel: 'pi in hexadecimal',
    titleHtml: '&pi; in hex',
    integerPart: '3',
    alphabet: '0123456789ABCDEF',
    keypadType: 'hex',
    digits: '',
  },
  primes: {
    label: 'Primes',
    shortLabel: 'primes',
    hintLabel: 'the list of primes',
    titleHtml: 'Primes',
    integerPart: '2',
    // "2 " (NBSP) so the trailing space renders reliably across browsers
    // — analogous to "3." for pi: the first prime sits in the prefix.
    prefix: '2 ',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',          // filled by setupPrimes()
    primeBoundaries: null, // Set of cumulative digit-positions where each prime ends
    naturalSpaces: true,
  },
  'primes-spaced': {
    label: 'Primes (spaced)',
    shortLabel: 'primes',
    hintLabel: 'the list of primes, including spaces',
    titleHtml: 'Primes',
    // The "2 " (with a real space) gets silently absorbed when typed, so the
    // user starts entering at "3".
    integerPart: '2 ',
    prefix: '2 ',
    alphabet: '0123456789 ',
    keypadType: 'decimal',
    digits: '',
    naturalSpaces: true,
  },
};

// Pull in the bundled secondary sequences (short fallbacks)
if (window.SEQUENCE_DATA) {
  for (const key of ['phi', 'sqrt2', 'sqrt3', 'sqrt5', 'e', 'ln2', 'log10_2', 'pi-squared', 'zeta2', 'euler-mascheroni', 'pi-binary', 'pi-hex']) {
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
  // Skip primes[0] (=2) — it now lives in the integerPart as the visual prefix.
  for (let k = 1; k < primes.length; k++) {
    const s = String(primes[k]);
    joined += s;
    pos += s.length;
    boundaries.add(pos);
  }
  SEQUENCES.primes.digits = joined;
  SEQUENCES.primes.primeBoundaries = boundaries;
  SEQUENCES['primes-spaced'].digits = primes.slice(1).join(' ');
})();

(function setupChampernowne() {
  // 0.123456789 10 11 12 ... — concatenated positive integers.
  // The leading "0." is the integerPart; digits start with "1".
  let out = '';
  for (let i = 1; out.length < 5000; i++) out += i;
  SEQUENCES.champernowne.digits = out;
})();

// ---- Constants ----
// Sprint uses per-digit auto-check at SPRINT_PER_DIGIT_SECONDS
// (defined below). Hardcore and Bullet are instant (0) — bullet's
// scoring needs the digit's correct/wrong status resolved immediately
// so the budget reflects each keystroke.
const MODE_FIXED_DELAY = { sprint: 30, hardcore: 0, bullet: 0 };
const DEFAULT_PRACTICE_DELAY = 2;
const DEFAULT_GROUP_SIZE = 0;
const DEFAULT_SEQUENCE = 'pi';
const MANUAL_DELAY = 31; // slider sentinel: no auto-check; user presses Check/Enter
const SPRINT_LIMIT_SECONDS = 15 * 60;

const STORAGE_KEYS = {
  theme: 'pi-theme',
  practiceDelay: 'pi-practice-delay',
  groupSize: 'pi-group-size',
  keypadFlip: 'pi-keypad-flip',
  practiceDisplay: 'pi-practice-display',
  practiceAutoCheckStyle: 'pi-practice-autocheck-style',
  motionMode: 'pi-motion-mode',
  preZenMotion: 'pi-pre-zen-motion',
  hideKeypad: 'pi-hide-keypad',
  practiceLookahead: 'pi-practice-lookahead',
  bulletStart: 'pi-bullet-start',
  bulletBonus: 'pi-bullet-bonus',
  bulletPenalty: 'pi-bullet-penalty',
};

const DEFAULT_KEYPAD_FLIP = false;
const DEFAULT_PRACTICE_DISPLAY = 'annotations';
const DEFAULT_AUTOCHECK_STYLE = 'per-digit'; // per-digit | on-idle
// Motion-reduction levels. 'medium' is the default; 'low' is auto-picked
// when the browser advertises prefers-reduced-motion. 'high' restores the
// blinking cursor and per-digit auto-fill animation.
function defaultMotionMode() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'low';
    }
  } catch (e) { /* matchMedia missing — fall through */ }
  return 'medium';
}
// Sprint mode: each digit auto-checks after this many seconds, OR
// when SPRINT_LOOKAHEAD newer digits stack up behind it (whichever
// fires first). Keep this in sync with MODE_FIXED_DELAY.sprint.
const SPRINT_PER_DIGIT_SECONDS = 30;
const SPRINT_LOOKAHEAD = 10;
// Practice-mode lookahead default: 0 disables the lookahead-based
// auto-check (the per-digit / on-idle timer is the only trigger).
const DEFAULT_PRACTICE_LOOKAHEAD = 0;
// Bullet defaults: 60s starting bank, +5s per correct, -30s per wrong.
const DEFAULT_BULLET_START = 60;
const DEFAULT_BULLET_BONUS = 5;
const DEFAULT_BULLET_PENALTY = 30;

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
  sprintEnded: false,
  sprintFrozenAt: 0,
  hardcoreFailed: false,
  hardcoreFrozenAt: 0,
  practicePaused: false,
  practicePauseDisplayedAt: 0,
  erasedErrors: 0,
  erasedPreCheck: 0, // wrong digits erased before they were checked; not displayed yet
  // Pi seqIdx positions where a wrong digit was erased. When a digit is later
  // typed that lands at the same position with a positional (non-skip) correct
  // match, we mark it as "corrected" in practice mode.
  correctedPositions: new Set(),
  groupSize: 0,
  keypadFlipped: DEFAULT_KEYPAD_FLIP,
  practiceDisplay: DEFAULT_PRACTICE_DISPLAY,
  practiceAutoCheckStyle: DEFAULT_AUTOCHECK_STYLE,
  compTimerHidden: false,
  elapsedDimmed: false,
  motionMode: defaultMotionMode(),
  preZenMotion: null,
  hideKeypad: false,
  // Practice-mode lookahead: when N > 0, the oldest pending entry auto-
  // checks once N newer pending entries have stacked behind it. Combines
  // with per-digit / on-idle / manual — whichever fires first wins.
  practiceLookahead: DEFAULT_PRACTICE_LOOKAHEAD,
  // Bullet mode: chess-clock style countdown with bonus/penalty.
  bulletStartSeconds: DEFAULT_BULLET_START,
  bulletBonusSeconds: DEFAULT_BULLET_BONUS,
  bulletPenaltySeconds: DEFAULT_BULLET_PENALTY,
  bulletBudget: DEFAULT_BULLET_START, // current time bank
  bulletGameOver: false,
  bulletEndReason: null, // 'timeout' (budget hit 0) or 'stopped' (user-pressed Stop)
  bulletFrozenAt: 0, // elapsed seconds at game over
  // Pi positions that have ever received a penalty in this run. Persists
  // across backspace+retype so the same position can't be penalised more
  // than once, even if the user erases the wrong digit and types another
  // wrong one there.
  bulletPenalizedPositions: new Set(),
  // Highest pi-position-index that has ever been scored (bonus or
  // penalty) in this run. Any position ≤ this is "behind us" and can't
  // score on a fresh entry — closes the type-then-backspace-then-retype
  // exploit (each retype would otherwise re-bonus the same position).
  // The per-entry refund path still fires for missed-detection rescoring
  // because that's gated on e.bulletPenalized, not position.
  bulletMaxScoredPos: -1,
};

// In-memory only (not persisted): the last "Skip N" value the user entered.
let lastSkipAmount = 50;

// ---- DOM refs ----
const userDigitsEl = document.getElementById('user-digits');
const piDisplayEl = document.getElementById('pi-display');
const prefixEl = document.getElementById('prefix');
const appTitleEl = document.getElementById('app-title');
const sequenceSelect = document.getElementById('sequence');
const sequenceDigitsHintEl = document.getElementById('sequence-digits-hint');
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
const autoCheckStyleInputs = document.querySelectorAll('input[name="autocheck-style"]');
const autoCheckStyleSetting = document.getElementById('autocheck-style-setting');
const resetBtns = document.querySelectorAll('.setting-reset');
const skippedTile = document.getElementById('stat-skipped-tile');
const skipModal = document.getElementById('skip-modal');
const skipConfirmBtn = document.getElementById('skip-confirm');
const skipConfirmCountEl = document.getElementById('skip-confirm-count');
const skipCountInput = document.getElementById('skip-count');
const skipPresetBtns = document.querySelectorAll('.skip-preset');
const missedTile = document.getElementById('stat-missed-tile');
const missedModal = document.getElementById('missed-modal');
const motionModeInputs = document.querySelectorAll('input[name="motion-mode"]');
const hideKeypadInputs = document.querySelectorAll('input[name="hide-keypad"]');
const practiceLookaheadInput = document.getElementById('practice-lookahead');
const practiceLookaheadSetting = document.getElementById('practice-lookahead-setting');
const cursorEl = document.getElementById('cursor');
const zenExitBtn = document.getElementById('zen-exit');
const mobileInputEl = document.getElementById('mobile-input');
const bulletSettingsEl = document.getElementById('bullet-settings');
const bulletStartInput = document.getElementById('bullet-start');
const bulletBonusInput = document.getElementById('bullet-bonus');
const bulletPenaltyInput = document.getElementById('bullet-penalty');
const correctTile = document.getElementById('stat-correct-tile');
const bulletScoreModal = document.getElementById('bullet-score-modal');

const statCorrect = document.getElementById('stat-correct');
const statWrong = document.getElementById('stat-wrong');
const statMissed = document.getElementById('stat-missed');
const statSkipped = document.getElementById('stat-skipped');
const statFixed = document.getElementById('stat-fixed');
const statTime = document.getElementById('stat-time');

// ---- Theme ----
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  // Only persist when the user explicitly chose; otherwise we'd freeze the
  // first-detected system preference and ignore later OS theme changes.
  setTheme(theme, !!saved);
}
function setTheme(theme, persist = true) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '\u{1F319}';
  themeInputs.forEach(input => { input.checked = input.value === theme; });
  if (persist) localStorage.setItem(STORAGE_KEYS.theme, theme);
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

// ---- Motion mode (high/medium/low/zen) ----
function applyMotionMode(mode, persist = true) {
  if (mode !== 'high' && mode !== 'medium' && mode !== 'low' && mode !== 'zen') {
    mode = defaultMotionMode();
  }
  // Save the previous motion when entering zen so Esc / corner-× can
  // restore it. If the user reloads in zen, we'd lose the previous
  // mode, so persist preZenMotion too.
  if (mode === 'zen' && state.motionMode !== 'zen') {
    state.preZenMotion = state.motionMode;
    try { localStorage.setItem(STORAGE_KEYS.preZenMotion, state.motionMode); } catch (e) {}
  }
  state.motionMode = mode;
  document.documentElement.setAttribute('data-motion', mode);
  motionModeInputs.forEach(input => { input.checked = input.value === mode; });
  if (persist) localStorage.setItem(STORAGE_KEYS.motionMode, mode);
  // Low-mode practice starts with the elapsed timer dimmed; users can
  // click to reveal. Other transitions don't auto-toggle dimming.
  state.elapsedDimmed = (mode === 'low' && state.mode === 'practice');
}

function exitZenMode() {
  if (state.motionMode !== 'zen') return;
  const restore = state.preZenMotion || defaultMotionMode();
  applyMotionMode(restore);
  updateResetVisibility();
  render();
}
motionModeInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    applyMotionMode(input.value);
    updateResetVisibility();
    render();
  });
});

// ---- Hide keypad ----
function applyHideKeypad(hide, persist = true) {
  state.hideKeypad = !!hide;
  document.documentElement.setAttribute('data-keypad', hide ? 'hidden' : 'shown');
  hideKeypadInputs.forEach(input => { input.checked = input.value === (hide ? 'hide' : 'show'); });
  if (persist) localStorage.setItem(STORAGE_KEYS.hideKeypad, hide ? '1' : '0');
}
hideKeypadInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    applyHideKeypad(input.value === 'hide');
    updateResetVisibility();
    // updateUI applies the .user-hidden class to the keypads; without
    // this the toggle change wouldn't visually hide the keypad until
    // the next render (e.g. the user typing a digit).
    updateUI();
  });
});

// ---- Bullet timing settings ----
function applyBulletInputs(persist = true) {
  const s = parseInt(bulletStartInput.value, 10);
  const b = parseInt(bulletBonusInput.value, 10);
  const p = parseInt(bulletPenaltyInput.value, 10);
  if (!isNaN(s) && s >= 5 && s <= 3600) state.bulletStartSeconds = s;
  if (!isNaN(b) && b >= 0 && b <= 60) state.bulletBonusSeconds = b;
  if (!isNaN(p) && p >= 0 && p <= 120) state.bulletPenaltySeconds = p;
  if (persist) {
    localStorage.setItem(STORAGE_KEYS.bulletStart, String(state.bulletStartSeconds));
    localStorage.setItem(STORAGE_KEYS.bulletBonus, String(state.bulletBonusSeconds));
    localStorage.setItem(STORAGE_KEYS.bulletPenalty, String(state.bulletPenaltySeconds));
  }
  // Reflect the new start into the live budget when the player hasn't
  // begun typing yet — otherwise mid-run changes would feel cheaty.
  if (state.mode === 'bullet' && state.startTime === null) {
    state.bulletBudget = state.bulletStartSeconds;
  }
  updateModeHint();
  updateModeBadge();
  updateResetVisibility();
}
[bulletStartInput, bulletBonusInput, bulletPenaltyInput].forEach(input => {
  if (!input) return;
  input.addEventListener('input', () => applyBulletInputs(true));
});

// ---- Practice lookahead slider ----
practiceLookaheadInput.addEventListener('input', () => {
  const v = parseInt(practiceLookaheadInput.value, 10) || 0;
  state.practiceLookahead = v;
  localStorage.setItem(STORAGE_KEYS.practiceLookahead, String(v));
  renderLookaheadLabel();
  updateResetVisibility();
  // A lower limit may now mean older pending entries should fire.
  checkLookaheadAutoCheck();
});

function renderLookaheadLabel() {
  const v = state.practiceLookahead | 0;
  const labelEl = document.getElementById('practice-lookahead-label');
  if (labelEl) {
    labelEl.textContent = v > 0 ? (v + ' digit' + (v === 1 ? '' : 's')) : 'off';
  }
}

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

// ---- Auto-check style (per-digit vs on-idle) ----
autoCheckStyleInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    state.practiceAutoCheckStyle = input.value;
    localStorage.setItem(STORAGE_KEYS.practiceAutoCheckStyle, input.value);
    updateResetVisibility();
    refreshAutoCheckScheduling();
    render();
  });
});

// ---- Skip next digit(s) ----
// Practice: works any time. Sprint/Hardcore: only before the clock starts.
function nextPiIdx() {
  return state.entries.length > 0
    ? state.entries[state.entries.length - 1].seqIdxAfter
    : 0;
}

function canSkip() {
  if (isInputLocked()) return false;
  if (nextPiIdx() >= state.digits.length) return false;
  if ((state.mode === 'sprint' || state.mode === 'hardcore') && state.startTime !== null) return false;
  return true;
}

function skipDigits(n) {
  if (!canSkip()) return 0;
  const remaining = state.digits.length - nextPiIdx();
  const count = Math.min(Math.max(0, n | 0), remaining);
  if (count === 0) return 0;
  const firstNewIdx = state.entries.length;
  for (let i = 0; i < count; i++) {
    const t = state.startTime === null ? null : (performance.now() - state.startTime);
    state.entries.push({
      char: state.digits[nextPiIdx()],
      t: t,
      skipped: true,
      checked: true,
      status: 'pending',
      expected: null,
      missedBefore: [],
      seqIdxAfter: nextPiIdx() + 1,
    });
  }
  computeStatuses(firstNewIdx);
  render();
  return count;
}

function skipNextDigit() { skipDigits(1); }

function updateSequenceDigitsHint() {
  const def = SEQUENCES[state.sequenceId];
  if (!def) return;
  sequenceDigitsHintEl.textContent = `${def.digits.length.toLocaleString()} digits available`;
}

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
  const prefixText = def.prefix != null
    ? def.prefix
    : (def.integerPart ? def.integerPart + '.' : '');
  prefixEl.textContent = prefixText;
  prefixEl.hidden = !prefixText;
  appTitleEl.innerHTML = def.titleHtml;
  // Swap keypad layout
  keypadDecimal.hidden = def.keypadType !== 'decimal';
  keypadHex.hidden = def.keypadType !== 'hex';
  // Show the space key only when the alphabet uses spaces.
  keypadDecimal.classList.toggle('with-space', def.alphabet.includes(' '));
  // Keep the settings dropdown in sync — browsers restore form values
  // across reloads, so without this the select can show a stale
  // sequence when the app actually re-initialised back to the default.
  if (sequenceSelect.value !== id) sequenceSelect.value = id;
  updateSequenceDigitsHint();
  updateMobileInputMode();
  // Fire-and-forget: fetch the long version if we have a source for it.
  // Already-loaded sequences are a no-op (loadLong dedupes).
  loadLong(id);
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
  if (hasPending()) {
    if (useOnIdleAutoCheck()) {
      resetAutoCheckTimer();
    } else {
      cancelAllPerDigitTimers();
      schedulePerDigitForAllPending();
      render();
    }
  }
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

  // Hardcore, Sprint, and Bullet always start from a fresh session.
  if (newMode === 'sprint' || newMode === 'hardcore' || newMode === 'bullet') {
    if (state.entries.length > 0) {
      const ok = confirm('This will reset your current progress. Start a new ' + newMode + ' session?');
      if (!ok) return false;
    }
    clearSession();
    state.mode = newMode;
    applyModeDefaults();
    return true;
  }

  // Leaving an active sprint session to Practice requires confirmation.
  if (state.mode === 'sprint' && state.gameLocked && !state.sprintEnded && newMode === 'practice') {
    const ok = confirm('Your sprint session will end. Continue in practice mode?');
    if (!ok) return false;
    state.gameLocked = false;
  }

  if (state.mode === 'sprint' && newMode !== 'sprint') {
    if (state.sprintEnded && state.startTime !== null) {
      state.startTime = performance.now() - state.sprintFrozenAt * 1000;
    }
    state.sprintEnded = false;
    state.gameLocked = false;
  }

  if (state.mode === 'hardcore' && newMode !== 'hardcore') {
    if (state.hardcoreFailed && state.startTime !== null) {
      state.startTime = performance.now() - state.hardcoreFrozenAt * 1000;
    }
    state.hardcoreFailed = false;
  }

  if (state.mode === 'bullet' && newMode !== 'bullet') {
    if (state.bulletGameOver && state.startTime !== null) {
      state.startTime = performance.now() - state.bulletFrozenAt * 1000;
    }
    state.bulletGameOver = false;
    state.bulletEndReason = null;
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
  cancelAllPerDigitTimers();
  stopCheckBar();
  state.entries = [];
  state.startTime = null;
  state.gameLocked = false;
  state.sprintEnded = false;
  state.sprintFrozenAt = 0;
  state.hardcoreFailed = false;
  state.hardcoreFrozenAt = 0;
  state.practicePaused = false;
  state.practicePauseDisplayedAt = 0;
  state.erasedErrors = 0;
  state.erasedPreCheck = 0;
  state.correctedPositions.clear();
  state.integerCharsConsumed = 0;
  state.compTimerHidden = false;
  state.bulletBudget = state.bulletStartSeconds;
  state.bulletGameOver = false;
  state.bulletEndReason = null;
  state.bulletFrozenAt = 0;
  state.bulletPenalizedPositions.clear();
  state.bulletMaxScoredPos = -1;
}

function applyModeDefaults() {
  if (state.mode in MODE_FIXED_DELAY) {
    state.autoCheckSeconds = MODE_FIXED_DELAY[state.mode];
  } else {
    state.autoCheckSeconds = state.practiceDelay;
  }
  autoSecondsInput.value = state.autoCheckSeconds;
  // Low motion + practice starts with the elapsed timer dimmed; users
  // click to reveal. Re-evaluate on every mode switch so leaving and
  // coming back to practice re-applies the default.
  state.elapsedDimmed = (state.motionMode === 'low' && state.mode === 'practice');
  renderDelayLabel();
  updateModeBadge();
  refreshAutoCheckScheduling();
}

function updateModeBadge() {
  const modeName = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  let delayText;
  if (state.mode === 'sprint' && state.sprintEnded) delayText = 'ended';
  else if (state.mode === 'hardcore' && state.hardcoreFailed) delayText = 'failed';
  else if (state.mode === 'bullet' && state.bulletGameOver) {
    delayText = state.bulletEndReason === 'stopped' ? 'stopped' : 'time out';
  }
  else if (state.mode === 'sprint') {
    delayText = SPRINT_PER_DIGIT_SECONDS + 's/digit, +' + SPRINT_LOOKAHEAD;
  }
  else if (state.mode === 'bullet') {
    delayText = state.bulletStartSeconds + 's start, +' + state.bulletBonusSeconds +
      '/−' + state.bulletPenaltySeconds;
  }
  else if (isManual()) delayText = 'manual';
  else if (state.autoCheckSeconds === 0) delayText = 'instant';
  else {
    delayText = state.autoCheckSeconds + 's auto-check';
    if (state.mode === 'practice' && state.practiceLookahead > 0) {
      delayText += ', +' + state.practiceLookahead;
    }
  }
  modeBadge.textContent = modeName + ' · ' + delayText;
  modeBadge.classList.toggle('locked', state.gameLocked && !state.sprintEnded);
}

function updateKeypadHint() {
  const def = SEQUENCES[state.sequenceId];
  if (!def) return;
  const idx = (state.nextSeqIdx || 0) + 1;
  keypadHintEl.textContent = 'Enter digit ' + idx + ' of ' + (def.hintLabel || def.shortLabel || def.label) + ':';
}

function updateModeHint() {
  const hints = {
    practice: 'Type or paste digits. No time limit. Backspace allowed.',
    sprint: SPRINT_PER_DIGIT_SECONDS + 's per-digit auto-check (or after ' +
      SPRINT_LOOKAHEAD + ' more digits, whichever first), 15 minute limit, wrong digits stay locked. Reset is required to start.',
    hardcore: 'One wrong digit ends the run. Instant lock-in, no backspace. Reset is required to start.',
    bullet: 'Clock: start with ' + state.bulletStartSeconds + 's; +' +
      state.bulletBonusSeconds + 's per correct, −' + state.bulletPenaltySeconds +
      's per wrong (refunded if rescored). Backspace allowed but does not refund time.',
  };
  modeHint.textContent = hints[state.mode] || '';
}

function isInputLocked() {
  if (state.sprintEnded && state.mode === 'sprint') return true;
  if (state.hardcoreFailed && state.mode === 'hardcore') return true;
  if (state.bulletGameOver && state.mode === 'bullet') return true;
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

// ---- Sprint session lifecycle ----
function endSprint() {
  if (state.mode !== 'sprint' || state.sprintEnded) return;
  state.sprintEnded = true;
  const elapsed = state.startTime === null ? 0 : (performance.now() - state.startTime) / 1000;
  state.sprintFrozenAt = Math.min(SPRINT_LIMIT_SECONDS, elapsed);
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  cancelAllPerDigitTimers();
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
  cancelAllPerDigitTimers();
  stopCheckBar();
  markAllChecked();
  render();
}

// ---- Bullet mode lifecycle ----
// Scoring rules:
//   1. Penalty is per pi POSITION, not per entry. Once a position has paid
//      a penalty, no further penalty for that position — even if the wrong
//      entry is erased and another wrong digit is typed there.
//      (state.bulletPenalizedPositions tracks ever-penalized positions.)
//   2. Bonus is per entry, applied at most once.
//   3. Refund is per entry: the specific entry that paid the penalty
//      gets its penalty refunded if/when it later resolves to correct
//      (typically via missed-detection re-scoring). A new entry at the
//      same position that didn't actually pay a penalty can NOT trigger
//      a refund.
//   4. Skipped and "fixed" (corrected) entries are inert — no time change.
function applyBulletScoring() {
  if (state.mode !== 'bullet') return;
  if (state.bulletGameOver) return;
  for (const e of state.entries) {
    if (!e.checked) continue;
    if (e.skipped || e.corrected) continue;
    const piPos = e.seqIdxAfter > 0 ? e.seqIdxAfter - 1 : -1;
    if (piPos < 0) continue;

    // Positions ≤ the high-water mark have already had their one shot.
    // A fresh entry there (e.g. after backspace+retype) can't bonus or
    // penalize again. The per-entry refund below is exempt — it's keyed
    // on e.bulletPenalized, which only the original wrong entry carries.
    const locked = piPos <= state.bulletMaxScoredPos;

    if (e.status === 'wrong') {
      if (!e.bulletPenalized && !locked && !state.bulletPenalizedPositions.has(piPos)) {
        state.bulletBudget -= state.bulletPenaltySeconds;
        state.bulletPenalizedPositions.add(piPos);
        e.bulletPenalized = true;
        state.bulletMaxScoredPos = piPos;
        floatBulletDelta(-state.bulletPenaltySeconds);
      }
    } else if (e.status === 'correct') {
      if (e.bulletPenalized && !e.bulletRefunded) {
        // Only the entry that actually paid the penalty can get it back
        // (typically via missed-detection rescoring the same entry as
        // correct later in the run). The position stays "scored", so a
        // new entry there can't re-bonus.
        state.bulletBudget += state.bulletPenaltySeconds;
        e.bulletRefunded = true;
        floatBulletDelta(+state.bulletPenaltySeconds);
      }
      if (!e.bulletBonused && !locked) {
        state.bulletBudget += state.bulletBonusSeconds;
        e.bulletBonused = true;
        state.bulletMaxScoredPos = piPos;
        floatBulletDelta(+state.bulletBonusSeconds);
      }
    }
  }
}

// Float a "+5" / "−30" indicator near the active bullet timer for ~1s.
//   - High motion: large, below the big-top timer.
//   - Medium motion: small, above the inline stat-time slot.
// Low / zen are silent — the inline countdown already reflects the
// change and a float would clash with the motion-mode intent.
function floatBulletDelta(seconds) {
  if (seconds === 0) return;
  if (state.mode !== 'bullet') return;
  let anchor, size;
  if (state.motionMode === 'high' && !compTimerEl.hidden) {
    anchor = compTimerEl;
    size = 'large';
  } else if (state.motionMode === 'medium' && !statTime.hidden) {
    anchor = statTime;
    size = 'small';
  } else {
    return;
  }
  const rect = anchor.getBoundingClientRect();
  if (rect.width === 0) return;
  const float = document.createElement('div');
  float.className = 'bullet-float ' + size + ' ' + (seconds > 0 ? 'positive' : 'negative');
  float.textContent = (seconds > 0 ? '+' : '−') + Math.abs(seconds);
  float.style.left = (rect.left + rect.width / 2) + 'px';
  // Large: drift down from below the big-top. Small: drift up from above
  // the stat-time slot so it doesn't overlap the countdown text.
  float.style.top = (size === 'large' ? rect.bottom + 2 : rect.top - 2) + 'px';
  document.body.appendChild(float);
  setTimeout(() => float.remove(), 1200);
}

function endBullet(reason = 'timeout') {
  if (state.mode !== 'bullet' || state.bulletGameOver) return;
  state.bulletGameOver = true;
  state.bulletEndReason = reason;
  state.bulletFrozenAt = state.startTime === null ? 0
    : (performance.now() - state.startTime) / 1000;
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  cancelAllPerDigitTimers();
  stopCheckBar();
  markAllChecked();
  applyBulletScoring();
  openBulletScoreModal();
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
  if (state.mode === 'sprint' && state.sprintEnded) {
    if (state.startTime !== null) {
      state.startTime = performance.now() - state.sprintFrozenAt * 1000;
    }
    state.sprintEnded = false;
    state.gameLocked = false;
  } else if (state.mode === 'bullet' && state.bulletGameOver) {
    if (state.startTime !== null) {
      state.startTime = performance.now() - state.bulletFrozenAt * 1000;
    }
    state.bulletGameOver = false;
    state.bulletEndReason = null;
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

  // Silently absorb leading integer-part chars (e.g. user types "3" first
  // when "3." is already displayed; "1" then "1" for pi-binary; "2" then a
  // space for primes-spaced). Must come before the leading-space rejection
  // so primes-spaced can absorb the space after the leading "2".
  if (state.entries.length === 0 && state.integerCharsConsumed < state.integerPart.length) {
    if (d === state.integerPart[state.integerCharsConsumed]) {
      state.integerCharsConsumed += 1;
      return;
    }
  }

  // Collapse consecutive spaces: a second space in a row is silently ignored
  // so users don't get penalised for double-tapping the space bar.
  if (d === ' ') {
    if (state.entries.length === 0) return;
    const last = state.entries[state.entries.length - 1];
    if (last.char === ' ') return;
  }

  practiceResume();

  if (state.startTime === null) {
    state.startTime = performance.now();
    if (state.mode === 'sprint') state.gameLocked = true;
    // Bullet's three timing inputs (and their reset-to-default button)
    // lock the moment the run starts; refresh so the × hides immediately.
    if (state.mode === 'bullet') updateResetVisibility();
  }

  const t = performance.now() - state.startTime;
  const entry = {
    char: d,
    t: t,
    skipped: false,
    checked: false,
    status: 'pending',
    expected: null,
    missedBefore: [],
    autoCheckStartedAt: null,
    _timerId: null,
  };
  state.entries.push(entry);
  computeStatuses(state.entries.length - 1);
  if (useOnIdleAutoCheck()) {
    resetAutoCheckTimer();
  } else {
    schedulePerDigitTimer(entry);
  }
  checkLookaheadAutoCheck();
  applyBulletScoring();
  checkHardcoreFail();
  checkBulletGameOver();
  render();
}

function inputPaste(text) {
  if (isInputLocked()) return;
  const upper = text.toUpperCase();
  const digits = [];
  // Track the previous char so we can collapse consecutive spaces in the
  // pasted text (mirroring how live typing ignores double-spaces). Seed with
  // ' ' when there are no entries yet so a leading space in the paste gets
  // dropped, matching inputDigit's rejection of a leading space.
  let prevChar = state.entries.length > 0
    ? state.entries[state.entries.length - 1].char
    : ' ';
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
  cancelAllPerDigitTimers();
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

  const firstNewIdx = state.entries.length;
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

  computeStatuses(firstNewIdx);
  applyBulletScoring();
  checkHardcoreFail();
  checkBulletGameOver();
  render();
}

function backspace() {
  if (isInputLocked()) return;
  if (state.mode === 'hardcore') return;
  if (state.entries.length === 0) return;
  const last = state.entries[state.entries.length - 1];
  if (state.mode === 'sprint') {
    if (last.checked && last.status === 'wrong') return;
    if (last.skipped) return; // skipped digits in sprint can't be erased
  }

  // Internal tracking (not displayed; reserved for future stats dialog).
  if (last.checked) {
    if (last.status === 'wrong' ||
        last.skipped ||
        (last.skipConfirms && !last.correctNoSkip)) {
      state.erasedErrors += 1;
    }
  } else if (last.status === 'wrong') {
    state.erasedPreCheck += 1;
  }

  // Remember pi positions where the user has been *shown* the correct digit
  // (via a wrong-and-checked entry, an explicit skip, or a missed marker).
  // A subsequent correct re-type at one of these positions is marked as
  // "fixed" (counted, dotted underline). Only checked entries qualify —
  // pre-check erasures don't yet expose the correct value to the user.
  if (last.checked) {
    const piPosMain = last.seqIdxAfter > 0 ? last.seqIdxAfter - 1 : -1;
    if (last.status === 'wrong' && last.expected !== null && piPosMain >= 0) {
      // User saw the underline (and the correct digit in annotations mode).
      state.correctedPositions.add(piPosMain);
    } else if (last.skipped && piPosMain >= 0) {
      // User explicitly skipped and saw the correct digit fill in.
      state.correctedPositions.add(piPosMain);
    }
    // Missed markers attached to this entry: the user saw those correct
    // digits rendered as small inline markers.
    if (last.missedBefore && last.missedBefore.length > 0 && piPosMain >= 0) {
      const missedStart = piPosMain - last.missedBefore.length;
      for (let m = 0; m < last.missedBefore.length; m++) {
        const p = missedStart + m;
        if (p >= 0) state.correctedPositions.add(p);
      }
    }
  }

  const popped = state.entries.pop();
  if (popped && popped._timerId) {
    clearTimeout(popped._timerId);
    popped._timerId = null;
  }
  if (state.entries.length === 0) state.integerCharsConsumed = 0;
  // After popping the tail, lookahead-affected entries are within the
  // last 3 positions; pass the new length-1 so we resume from there.
  computeStatuses(Math.max(0, state.entries.length - 1));
  if (useOnIdleAutoCheck()) {
    resetAutoCheckTimer();
  } else {
    syncCheckBarPerDigit();
  }
  applyBulletScoring();
  render();
}

function forceCheck() {
  if (isInputLocked()) return;
  // Sprint disallows manual force-checks — only the per-digit and
  // lookahead auto-checks should reveal results.
  if (state.mode === 'sprint') return;
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  cancelAllPerDigitTimers();
  stopCheckBar();
  markAllChecked();
  render();
}

function hasPending() {
  return state.entries.some(e => !e.checked);
}

function useOnIdleAutoCheck() {
  return state.mode === 'practice' && state.practiceAutoCheckStyle === 'on-idle';
}

// Maximum number of pending entries allowed at once. When exceeded, the
// oldest pending entry auto-checks. Hardcore is 0 (instant), so its
// per-digit timer never accumulates anyway.
function lookaheadLimit() {
  if (state.mode === 'sprint') return SPRINT_LOOKAHEAD;
  if (state.mode === 'practice') return state.practiceLookahead | 0;
  return 0;
}

// Walks state.entries front-to-back, force-checking the oldest pending
// entry until the pending count is at most `lookaheadLimit()`. Called
// after each new entry is typed, and after the practice slider changes.
function checkLookaheadAutoCheck() {
  const limit = lookaheadLimit();
  if (limit <= 0) return;
  let pendingCount = 0;
  for (const e of state.entries) if (!e.checked) pendingCount++;
  if (pendingCount <= limit) return;
  for (let i = 0; i < state.entries.length && pendingCount > limit; i++) {
    const e = state.entries[i];
    if (e.checked) continue;
    if (e._timerId) { clearTimeout(e._timerId); e._timerId = null; }
    e.autoCheckStartedAt = null;
    e.checked = true;
    pendingCount--;
  }
  applyBulletScoring();
}

// Bullet game-over check: budget − elapsed ≤ 0 ends the run. Called
// from the input pipelines and from tickTime so a long pause without
// typing still triggers game-over.
function checkBulletGameOver() {
  if (state.mode !== 'bullet') return;
  if (state.bulletGameOver) return;
  if (state.startTime === null) return;
  const elapsed = (performance.now() - state.startTime) / 1000;
  if (state.bulletBudget - elapsed <= 0) {
    endBullet();
  }
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

function schedulePerDigitTimer(entry) {
  if (entry.checked) return;
  if (isManual()) return;
  const ms = state.autoCheckSeconds * 1000;
  if (ms <= 0) {
    entry.checked = true;
    return;
  }
  entry.autoCheckStartedAt = performance.now();
  entry._timerId = setTimeout(() => {
    entry._timerId = null;
    entry.checked = true;
    syncCheckBarPerDigit();
    render();
  }, ms);
  // Medium motion replaces the per-digit underline with a single bar on
  // the check button that tracks the most recently scheduled entry.
  syncCheckBarPerDigit();
}

// Drives the medium-mode check-button fill from the latest pending entry.
// Low motion explicitly suppresses the bar (CSS); high motion uses the
// per-digit underline instead and doesn't need this.
function syncCheckBarPerDigit() {
  if (state.motionMode !== 'medium') return;
  if (useOnIdleAutoCheck()) return; // on-idle already drives the bar.
  // Latest pending entry with a live timer.
  let latest = null;
  for (let i = state.entries.length - 1; i >= 0; i--) {
    const e = state.entries[i];
    if (!e.checked && e.autoCheckStartedAt != null) { latest = e; break; }
  }
  if (!latest) { stopCheckBar(); return; }
  const totalMs = state.autoCheckSeconds * 1000;
  const elapsed = Math.max(0, performance.now() - latest.autoCheckStartedAt);
  startCheckBar(totalMs, elapsed);
}

function schedulePerDigitForAllPending() {
  for (const e of state.entries) {
    if (!e.checked) schedulePerDigitTimer(e);
  }
}

function cancelAllPerDigitTimers() {
  for (const e of state.entries) {
    if (e._timerId) {
      clearTimeout(e._timerId);
      e._timerId = null;
    }
    e.autoCheckStartedAt = null;
  }
}

function refreshAutoCheckScheduling() {
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  cancelAllPerDigitTimers();
  stopCheckBar();
  if (!hasPending()) return;
  if (useOnIdleAutoCheck()) {
    resetAutoCheckTimer();
  } else {
    schedulePerDigitForAllPending();
    syncCheckBarPerDigit();
  }
}

function startCheckBar(ms, elapsedMs = 0) {
  allCheckBtns.forEach(btn => {
    btn.classList.remove('filling');
    void btn.offsetWidth; // restart animation by forcing reflow
    btn.style.setProperty('--fill-duration', ms + 'ms');
    btn.style.setProperty('--fill-delay', `-${Math.max(0, elapsedMs)}ms`);
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
//
// `fromIdx` is the lowest index that may have changed since the last call.
// Statuses use a 2-entry lookahead, so we resume from `fromIdx - 2` and
// reuse the cached `seqIdxAfter` of the entry just before. With 50k
// entries the full O(n) recompute on every keystroke is the dominant cost
// of typing — this lets us touch only the tail. Pass 0 for a full
// recompute (the default).
function computeStatuses(fromIdx = 0) {
  const entries = state.entries;
  const digits = state.digits;
  // Re-analyze starting 2 entries earlier so lookahead-affected entries
  // (i+1, i+2) catch up.
  const startI = Math.max(0, fromIdx - 2);
  let seqIdx = startI > 0 ? entries[startI - 1].seqIdxAfter : 0;

  // Skip-aware walk
  for (let i = startI; i < entries.length; i++) {
    const e = entries[i];
    e.missedBefore = [];
    e.skipConfirms = false;
    e.corrected = false;

    if (seqIdx >= digits.length) {
      e.status = 'wrong';
      e.expected = null;
      e.seqIdxAfter = seqIdx;
      continue;
    }

    if (e.char === digits[seqIdx]) {
      e.status = 'correct';
      e.expected = digits[seqIdx];
      e.corrected = state.correctedPositions.has(seqIdx);
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
      e.corrected = state.correctedPositions.has(seqIdx + missed);
      seqIdx += missed + 1;
    } else {
      e.status = 'wrong';
      e.expected = digits[seqIdx];
      seqIdx += 1;
    }
    e.seqIdxAfter = seqIdx;
  }

  // Position in the sequence the next typed digit will land at.
  state.nextSeqIdx = entries.length > 0 ? entries[entries.length - 1].seqIdxAfter : 0;

  // Mark the next two entries after each skip as the skip's "confirming"
  // digits. Deleting one of these unwinds the skip and so should count as
  // erasing an error, unless the digit would have been correct at its
  // literal position anyway (the correctNoSkip check below). Reset only
  // [startI..end]; entries before that are unchanged from the previous
  // run, but we still walk back 2 because a skip just before startI can
  // mark targets at startI / startI+1.
  for (let i = startI; i < entries.length; i++) {
    entries[i].skipConfirms = false;
  }
  for (let i = Math.max(0, startI - 2); i < entries.length; i++) {
    if (entries[i].missedBefore && entries[i].missedBefore.length > 0) {
      if (entries[i + 1] && i + 1 >= startI) entries[i + 1].skipConfirms = true;
      if (entries[i + 2] && i + 2 >= startI) entries[i + 2].skipConfirms = true;
    }
  }

  // No-skip walk: would this entry be correct at its literal position
  // (one pi digit per typed digit, no skipping)? Only the re-analyzed
  // range needs updating; earlier entries' correctNoSkip is positional
  // and stable.
  for (let i = startI; i < entries.length; i++) {
    const e = entries[i];
    e.correctNoSkip = i < digits.length && e.char === digits[i];
  }
}

// ---- Render ----
//
// Incremental: each entry maps to a short run of sibling nodes under
// #user-digits (missed markers, the main digit, optional prime-space).
// A fingerprint per entry encodes its visual state; on render we only
// rebuild and swap entries whose fingerprint changed, so typing one digit
// at the 50,000-digit mark is ~1 DOM mutation rather than 50,000.
//
// Trade-off vs. the old approach: group spacing is per-entry now (a
// `margin-right` on every Nth main digit) instead of a wrapping
// <span class="group">. Missed markers no longer count toward group
// position, so group widths stay uniform.
let renderCache = [];
// When gs > 0, entries are placed inside a per-group <span class="group">
// wrapper so a group never line-breaks mid-pair. Wrappers are created
// lazily and shared across renders; only the entry's own nodes are
// touched on incremental updates.
let groupElements = [];
let lastRenderContextKey = '';

// A literal " " inside an inline-block can collapse to near-zero width in
// some browsers, so spaces are rendered as NBSP and given an explicit
// min-width class.
function setCharText(el, char) {
  if (char === ' ') {
    el.classList.add('space-char');
    el.textContent = ' ';
  } else {
    el.textContent = char;
  }
}

function buildEntryNodes(e, ctx, hasPrimeAfter) {
  const nodes = [];
  if (e.checked) {
    for (const s of e.missedBefore) {
      const m = document.createElement('span');
      m.className = 'digit missed-marker';
      setCharText(m, s);
      m.title = 'missed digit';
      nodes.push(m);
    }
  }
  const main = document.createElement('span');
  if (e.checked) {
    let cls = 'digit ' + e.status;
    if (e.skipped) cls += ' skipped';
    if (e.corrected && e.status === 'correct') cls += ' corrected';
    const showDiff = ((ctx.inSprint && ctx.sprintEnded) || ctx.inPracticeAnnot)
      && e.status === 'wrong' && e.expected;
    const showMask = ctx.inSprint && !ctx.sprintEnded && e.status === 'wrong';
    if (showDiff) {
      cls += ' diff';
      main.className = cls;
      const correctionEl = document.createElement('span');
      correctionEl.className = 'correction';
      setCharText(correctionEl, e.expected);
      const typedEl = document.createElement('span');
      typedEl.className = 'typed';
      setCharText(typedEl, e.char);
      main.appendChild(correctionEl);
      main.appendChild(typedEl);
    } else if (showMask) {
      cls += ' masked';
      main.className = cls;
      main.textContent = '·';
    } else {
      main.className = cls;
      setCharText(main, e.char);
    }
    if (e.status === 'wrong' && e.expected) {
      main.title = 'typed ' + e.char + ', expected ' + e.expected;
    } else if (e.skipped) {
      main.title = 'skipped';
    }
  } else {
    main.className = 'digit pending';
    if (e.autoCheckStartedAt != null && ctx.autoCheckSeconds > 0 && !ctx.isManual) {
      main.classList.add('auto-filling');
      const totalMs = ctx.autoCheckSeconds * 1000;
      const elapsed = Math.max(0, performance.now() - e.autoCheckStartedAt);
      main.style.setProperty('--fill-duration', totalMs + 'ms');
      main.style.setProperty('--fill-delay', `-${elapsed}ms`);
    }
    setCharText(main, e.char);
  }
  nodes.push(main);
  if (hasPrimeAfter) {
    const ps = document.createElement('span');
    ps.className = 'prime-space';
    ps.textContent = ' ';
    nodes.push(ps);
  }
  return nodes;
}

function computeEntryFingerprint(e, ctx, hasPrimeAfter) {
  // Pending entries only depend on char + auto-fill animation state. The
  // started-at timestamp is floored so a same-frame re-render doesn't
  // replace the node (which would restart the CSS animation).
  if (!e.checked) {
    const t = e.autoCheckStartedAt != null ? Math.floor(e.autoCheckStartedAt) : '';
    return 'p|' + e.char + '|' + t + '|' + ctx.autoCheckSeconds + '|' +
      (ctx.isManual ? 1 : 0) + '|' + (hasPrimeAfter ? 1 : 0);
  }
  return 'c|' + e.char + '|' + e.status + '|' + (e.expected || '') + '|' +
    (e.skipped ? 1 : 0) + '|' + (e.corrected ? 1 : 0) + '|' +
    e.missedBefore.join(',') + '|' +
    (ctx.inSprint ? 1 : 0) + '|' + (ctx.sprintEnded ? 1 : 0) + '|' +
    (ctx.inPractice ? 1 : 0) + '|' +
    (ctx.inPracticeAnnot ? 1 : 0) + '|' + (hasPrimeAfter ? 1 : 0);
}

function render() {
  const def = SEQUENCES[state.sequenceId];
  // Sequences with their own natural spacing (e.g. primes) override the
  // user-selected grouping — the prime boundaries are the grouping.
  const gs = (def && def.naturalSpaces) ? 0 : state.groupSize;
  const primeBoundaries = def && def.primeBoundaries;

  const ctx = {
    inSprint: state.mode === 'sprint',
    sprintEnded: state.sprintEnded,
    inPractice: state.mode === 'practice',
    inPracticeAnnot: state.mode === 'practice' && state.practiceDisplay === 'annotations',
    autoCheckSeconds: state.autoCheckSeconds,
    isManual: isManual(),
  };

  // Sequence/grouping changes invalidate every entry anyway; full rebuild
  // beats comparing 50k fingerprints in those cases.
  const ctxKey = state.sequenceId + '|' + gs + '|' + (primeBoundaries ? '1' : '0');
  if (lastRenderContextKey !== ctxKey) {
    renderCache = [];
    groupElements = [];
    userDigitsEl.replaceChildren();
    lastRenderContextKey = ctxKey;
  }

  const entries = state.entries;
  let correct = 0, wrong = 0, missed = 0, skipped = 0, fixed = 0;
  let seqPos = 0;
  // Cumulative pi positions consumed by entries' visible parts. Missed
  // markers count as 1 pi position each; the main digit is 1. We track
  // visible (not logical) so that pending entries — which don't show
  // their inferred missed markers — only contribute 1 here.
  let displayedPi = 0;

  // Track the last DOM node placed in each group, for in-order insertion.
  // Key -1 (ALL_GROUP) is used when gs <= 0 (single flat container).
  const lastNodeInGroup = new Map();
  const ALL_GROUP = -1;

  function groupIdxFor(piPos) {
    if (gs <= 0) return ALL_GROUP;
    return Math.floor(piPos / gs);
  }

  function groupParent(gIdx) {
    if (gIdx === ALL_GROUP) return userDigitsEl;
    let wrap = groupElements[gIdx];
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'group';
      // Find the next existing higher-index group so we insert the wrap
      // in the correct DOM order (groups may be created out of order
      // when missed markers push their pi positions into earlier groups).
      let nextSibling = null;
      for (let k = gIdx + 1; k < groupElements.length; k++) {
        if (groupElements[k]) { nextSibling = groupElements[k]; break; }
      }
      userDigitsEl.insertBefore(wrap, nextSibling);
      groupElements[gIdx] = wrap;
    }
    return wrap;
  }

  function insertNode(node, gIdx) {
    const parent = groupParent(gIdx);
    const after = lastNodeInGroup.get(gIdx);
    if (after && after.parentNode === parent) {
      parent.insertBefore(node, after.nextSibling);
    } else {
      parent.insertBefore(node, parent.firstChild);
    }
    lastNodeInGroup.set(gIdx, node);
  }

  function placeEntryNodes(nodes, e, visibleMissed, entryStartPi, mainPi, hasPrimeAfter) {
    let nodeIdx = 0;
    for (let m = 0; m < visibleMissed; m++) {
      insertNode(nodes[nodeIdx], groupIdxFor(entryStartPi + m));
      nodeIdx++;
    }
    insertNode(nodes[nodeIdx], groupIdxFor(mainPi));
    nodeIdx++;
    if (hasPrimeAfter && nodeIdx < nodes.length) {
      insertNode(nodes[nodeIdx], groupIdxFor(mainPi));
      nodeIdx++;
    }
  }

  function markPlacedNodes(nodes, visibleMissed, entryStartPi, mainPi, hasPrimeAfter) {
    let nodeIdx = 0;
    for (let m = 0; m < visibleMissed; m++) {
      lastNodeInGroup.set(groupIdxFor(entryStartPi + m), nodes[nodeIdx]);
      nodeIdx++;
    }
    lastNodeInGroup.set(groupIdxFor(mainPi), nodes[nodeIdx]);
    nodeIdx++;
    if (hasPrimeAfter && nodeIdx < nodes.length) {
      lastNodeInGroup.set(groupIdxFor(mainPi), nodes[nodeIdx]);
      nodeIdx++;
    }
  }

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const seqAfter = (e.seqIdxAfter != null) ? e.seqIdxAfter : seqPos + 1;
    const hasPrimeAfter = !!(primeBoundaries && primeBoundaries.has(seqAfter));
    const visibleMissed = e.checked ? e.missedBefore.length : 0;
    const entryStartPi = displayedPi;
    const mainPi = entryStartPi + visibleMissed;
    // Include entryStartPi in the fingerprint: if missed-marker counts
    // shift earlier entries' contribution to displayedPi, this entry's
    // placement (and possibly its group) changes too.
    const fp = computeEntryFingerprint(e, ctx, hasPrimeAfter) + '|s' + entryStartPi;

    if (i >= renderCache.length || renderCache[i].fp !== fp) {
      if (i < renderCache.length) {
        for (const n of renderCache[i].nodes) n.remove();
      }
      const newNodes = buildEntryNodes(e, ctx, hasPrimeAfter);
      placeEntryNodes(newNodes, e, visibleMissed, entryStartPi, mainPi, hasPrimeAfter);
      renderCache[i] = { fp, nodes: newNodes };
    } else {
      markPlacedNodes(renderCache[i].nodes, visibleMissed, entryStartPi, mainPi, hasPrimeAfter);
    }

    if (e.checked) {
      missed += e.missedBefore.length;
      if (e.status === 'correct') {
        if (e.corrected) fixed += 1;
        else if (e.skipped) skipped += 1;
        else correct += 1;
      } else if (e.status === 'wrong') {
        wrong += 1;
      }
    }
    seqPos = seqAfter;
    displayedPi += visibleMissed + 1;
  }

  // Trim if entries got shorter (backspace, clearSession, …).
  while (renderCache.length > entries.length) {
    const c = renderCache.pop();
    for (const n of c.nodes) n.remove();
  }
  // Drop now-empty group wrappers from the tail.
  if (gs > 0) {
    const lastGroupIdx = displayedPi > 0 ? Math.floor((displayedPi - 1) / gs) : -1;
    for (let k = groupElements.length - 1; k > lastGroupIdx; k--) {
      if (groupElements[k]) groupElements[k].remove();
    }
    groupElements.length = lastGroupIdx + 1;
  }

  piDisplayEl.classList.toggle('grouped', gs > 0);
  piDisplayEl.classList.toggle('diff-mode',
    (state.mode === 'sprint' && state.sprintEnded) ||
    (state.mode === 'practice' && state.practiceDisplay === 'annotations'));
  updateKeypadHint();
  // Defer to next frame so the new content is laid out before we measure
  // and scroll to the bottom; without this the scrollHeight reading can
  // lag a frame behind on some browsers.
  requestAnimationFrame(() => {
    piDisplayEl.scrollTop = piDisplayEl.scrollHeight;
  });

  const zeroDash = (n) => (n ? String(n) : '—');
  statCorrect.textContent = zeroDash(correct);
  statWrong.textContent = zeroDash(wrong);
  statMissed.textContent = zeroDash(missed);
  statSkipped.textContent = zeroDash(skipped);
  statFixed.textContent = zeroDash(fixed);
  // Doubles as a key for the dotted underline on corrected digits.
  // Hardcore and sprint don't allow the backspace-then-retype path
  // so they'll never have fixed > 0; bullet and practice will.
  statFixed.classList.toggle('corrected', fixed > 0);

  updateUI();
}

// M:SS, H:MM:SS once the duration crosses an hour, Dd HH:MM:SS once a day.
// Negative durations are clamped to 0.
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600) % 24;
  const d = Math.floor(total / 86400);
  const pad = (n) => String(n).padStart(2, '0');
  if (d > 0) return d + 'd ' + pad(h) + ':' + pad(m) + ':' + pad(s);
  if (h > 0) return h + ':' + pad(m) + ':' + pad(s);
  return Math.floor(total / 60) + ':' + pad(s);
}

// Where to display the active countdown. Sprint and bullet share
// the same per-motion-mode layout: big top in high motion, folded into
// the bottom-right stat-time slot in medium/low/zen.
function showCompTimerInline() {
  if (state.motionMode === 'high') return false;
  return state.mode === 'sprint' || state.mode === 'bullet';
}

// Returns the countdown remaining in seconds for sprint / bullet,
// or null for other modes. Handles the not-yet-started, frozen-at-end,
// and live cases, and triggers endBullet when the bullet budget hits 0.
function getModeRemaining(elapsed) {
  if (state.mode === 'sprint') {
    if (state.startTime === null) return SPRINT_LIMIT_SECONDS;
    if (state.sprintEnded) return Math.max(0, SPRINT_LIMIT_SECONDS - state.sprintFrozenAt);
    return Math.max(0, SPRINT_LIMIT_SECONDS - elapsed);
  }
  if (state.mode === 'bullet') {
    if (state.startTime === null) return state.bulletStartSeconds;
    if (state.bulletGameOver) return Math.max(0, state.bulletBudget - state.bulletFrozenAt);
    let remaining = state.bulletBudget - elapsed;
    if (remaining <= 0) {
      endBullet();
      remaining = 0;
    }
    return remaining;
  }
  return null;
}

function tickTime() {
  if (state.startTime === null) {
    if (showCompTimerInline()) {
      const remaining = getModeRemaining(0);
      statTime.textContent = formatTime(remaining) + ' remaining';
      statTime.classList.add('countdown');
    } else {
      statTime.textContent = '0:00 elapsed';
      statTime.classList.remove('countdown');
    }
    statTime.classList.remove('frozen');
  } else {
    if (state.mode === 'sprint' && state.gameLocked && !state.sprintEnded) {
      const elapsedNow = (performance.now() - state.startTime) / 1000;
      if (elapsedNow >= SPRINT_LIMIT_SECONDS) {
        endSprint();
      }
    }

    let elapsed;
    if (state.sprintEnded && state.mode === 'sprint') {
      elapsed = state.sprintFrozenAt;
    } else if (state.hardcoreFailed && state.mode === 'hardcore') {
      elapsed = state.hardcoreFrozenAt;
    } else if (state.bulletGameOver && state.mode === 'bullet') {
      elapsed = state.bulletFrozenAt;
    } else if (state.practicePaused && state.mode === 'practice') {
      elapsed = state.practicePauseDisplayedAt;
    } else {
      elapsed = (performance.now() - state.startTime) / 1000;
    }

    statTime.classList.toggle('paused', state.mode === 'practice' && state.practicePaused);

    const ended = state.sprintEnded || state.bulletGameOver;
    if (showCompTimerInline()) {
      const remaining = getModeRemaining(elapsed);
      statTime.textContent = formatTime(Math.max(0, remaining)) + ' remaining';
      statTime.classList.add('countdown');
      statTime.classList.toggle('frozen', ended);
    } else if (state.mode === 'sprint') {
      const capped = Math.min(elapsed, SPRINT_LIMIT_SECONDS);
      statTime.textContent = formatTime(capped) + ' elapsed';
      statTime.classList.remove('countdown');
      statTime.classList.toggle('frozen', state.sprintEnded);
    } else if (state.mode === 'bullet') {
      statTime.textContent = formatTime(elapsed) + ' elapsed';
      statTime.classList.remove('countdown');
      statTime.classList.toggle('frozen', state.bulletGameOver);
    } else if (state.mode === 'hardcore' && state.hardcoreFailed) {
      statTime.textContent = formatTime(elapsed) + ' elapsed';
      statTime.classList.remove('countdown');
      statTime.classList.add('frozen');
    } else {
      statTime.textContent = formatTime(elapsed) + ' elapsed';
      statTime.classList.remove('countdown');
      statTime.classList.remove('frozen');
    }
  }

  // Big top countdown — sprint and bullet in high motion only.
  // Medium/low/zen fold the countdown into the inline stat-time slot.
  if ((state.mode === 'sprint' || state.mode === 'bullet') && !showCompTimerInline()) {
    let bigElapsed;
    if (state.startTime === null) {
      bigElapsed = 0;
    } else if (state.sprintEnded && state.mode === 'sprint') {
      bigElapsed = state.sprintFrozenAt;
    } else if (state.bulletGameOver && state.mode === 'bullet') {
      bigElapsed = state.bulletFrozenAt;
    } else {
      bigElapsed = (performance.now() - state.startTime) / 1000;
    }
    const remaining = getModeRemaining(bigElapsed);
    const ended = state.sprintEnded || state.bulletGameOver;
    const active = (state.mode === 'sprint' && state.gameLocked) ||
                   (state.mode === 'bullet' && state.startTime !== null && !state.bulletGameOver);
    compTimerEl.textContent = formatTime(remaining);
    compTimerEl.classList.toggle('ended', ended);
    compTimerEl.classList.toggle('danger', !ended && remaining <= 10 && active);
    compTimerEl.classList.toggle('warning', !ended && remaining > 10 && remaining <= 60 && active);
  }
}
setInterval(tickTime, 250);

// ---- UI state ----
function updateUI() {
  const hasEntries = state.entries.length > 0;
  const inputLocked = isInputLocked();
  const sprintActive = state.mode === 'sprint' && state.gameLocked && !state.sprintEnded;
  const hardcoreActive = state.mode === 'hardcore' && state.startTime !== null && !state.hardcoreFailed;
  const practiceActive = state.mode === 'practice' && state.startTime !== null && !state.practicePaused;
  const gameOver = (state.mode === 'sprint' && state.sprintEnded) ||
                   (state.mode === 'hardcore' && state.hardcoreFailed) ||
                   (state.mode === 'bullet' && state.bulletGameOver);
  const bulletActive = state.mode === 'bullet' && state.startTime !== null && !state.bulletGameOver;

  // Keep the settings panel's mode radio in sync with state.mode in case
  // state was changed programmatically (Continue button, etc.)
  modeInputs.forEach(input => { input.checked = input.value === state.mode; });
  modeInputs.forEach(input => { input.disabled = false; input.parentElement.title = ''; });
  autoSecondsInput.disabled = (state.mode in MODE_FIXED_DELAY) || state.gameLocked;
  if (autoCheckStyleSetting) autoCheckStyleSetting.hidden = state.mode !== 'practice';

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
    else if (state.mode === 'sprint') {
      const last = state.entries[state.entries.length - 1];
      if (last.checked && last.status === 'wrong') backDisabled = true;
    }
  }
  allBackBtns.forEach(btn => { btn.disabled = backDisabled; });

  // Sprint: no manual force-check — only the per-digit / lookahead
  // auto-checks reveal results. Disable the check button outright.
  const checkDisabled = inputLocked || !hasPending() || state.mode === 'sprint';
  allCheckBtns.forEach(btn => { btn.disabled = checkDisabled; });

  // Stop button: ends in comp/hardcore/bullet, pseudo-pauses in practice
  stopBtn.hidden = !(sprintActive || hardcoreActive || practiceActive || bulletActive);
  stopBtn.textContent = state.mode === 'practice' ? 'Pause' : 'Stop';
  // Practice-mode Pause is a quiet courtesy button — toned-down border
  // and colour. Comp/hardcore Stop keeps the alert-red border.
  stopBtn.classList.toggle('practice-pause', state.mode === 'practice');

  continueBtn.hidden = !gameOver;

  // On game over the user's natural action is to start over, so make Reset
  // the prominent button and demote Continue.
  resetBtn.classList.toggle('primary', gameOver);
  continueBtn.classList.toggle('secondary', gameOver);
  // Big top timer is used in sprint AND bullet, but only in high
  // motion. Medium/low fold the countdown into the bottom-right
  // stat-time slot via showCompTimerInline().
  const showCompTimer = (state.mode === 'sprint' || state.mode === 'bullet') &&
                        !showCompTimerInline();
  compTimerEl.hidden = !showCompTimer;
  compTimerEl.classList.toggle('dimmed', state.compTimerHidden && !state.sprintEnded && !state.bulletGameOver);
  compTimerEl.classList.toggle('bullet', state.mode === 'bullet');
  compTimerEl.setAttribute('aria-label',
    (state.mode === 'bullet' ? 'Bullet' : 'Sprint') + ' countdown, click to hide');

  // Click-to-dim elapsed/countdown clock. Also force-dimmed by default in
  // low-motion practice (the user can click to reveal).
  statTime.classList.toggle('dimmed', state.elapsedDimmed && !state.sprintEnded && !state.hardcoreFailed);

  // Cursor: hidden on pause / game-over (any mode), so the display reads
  // as static rather than "still typing".
  const cursorHidden = state.practicePaused || gameOver;
  if (cursorEl) cursorEl.classList.toggle('hidden', cursorHidden);

  // Keypad hide toggle: collapses the keypads to recover vertical room.
  keypadDecimal.classList.toggle('user-hidden', state.hideKeypad);
  keypadHex.classList.toggle('user-hidden', state.hideKeypad);

  // Practice-lookahead setting is practice-only.
  if (practiceLookaheadSetting) practiceLookaheadSetting.hidden = state.mode !== 'practice';
  // Bullet-timing setting is bullet-only. Lock the three inputs the
  // moment the run starts (or is game-over) so the player can't
  // retroactively change start/bonus/penalty mid-run; Reset is required
  // to tweak them.
  if (bulletSettingsEl) {
    bulletSettingsEl.hidden = state.mode !== 'bullet';
    const bulletLocked = state.mode === 'bullet' && state.startTime !== null;
    [bulletStartInput, bulletBonusInput, bulletPenaltyInput].forEach(input => {
      if (input) input.disabled = bulletLocked;
    });
    bulletSettingsEl.classList.toggle('locked', bulletLocked);
  }

  // Zen reveals the stats only on pause or game-over.
  document.documentElement.classList.toggle('zen-reveal',
    state.motionMode === 'zen' && (state.practicePaused || gameOver));

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
  if (state.mode === 'sprint') endSprint();
  else if (state.mode === 'hardcore') endHardcore();
  else if (state.mode === 'bullet') endBullet('stopped');
  else if (state.mode === 'practice') practicePause();
});
continueBtn.addEventListener('click', () => continueInPractice());

function toggleCompTimer() {
  if (state.mode !== 'sprint' && state.mode !== 'bullet') return;
  if (state.sprintEnded || state.bulletGameOver) return; // ended state always visible
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

// Click the elapsed/remaining clock to toggle dim/show. Works in every
// mode; low-motion practice starts already dimmed.
statTime.addEventListener('click', () => {
  state.elapsedDimmed = !state.elapsedDimmed;
  updateUI();
});

// Corner-× to exit zen mode (Esc handled in the keydown listener).
if (zenExitBtn) zenExitBtn.addEventListener('click', exitZenMode);

document.addEventListener('keydown', (e) => {
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

  // Let the browser handle Ctrl/Cmd/Alt combos (copy, paste, select-all,
  // browser shortcuts). Without this we'd swallow Ctrl+C as "C" in hex mode,
  // Ctrl+A as "A", etc. Shift is fine — keys get uppercased anyway.
  if (e.ctrlKey || e.metaKey || e.altKey) return;

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

  if (!missedModal.hidden) {
    if (e.key === 'Escape') {
      closeMissedModal();
      e.preventDefault();
    }
    return;
  }

  if (bulletScoreModal && !bulletScoreModal.hidden) {
    if (e.key === 'Escape') {
      closeBulletScoreModal();
      e.preventDefault();
    }
    return;
  }

  // Esc exits zen mode (no modals are open at this point).
  if (e.key === 'Escape' && state.motionMode === 'zen') {
    exitZenMode();
    e.preventDefault();
    return;
  }

  // "V" skips the next sequence digit. Practice: any time;
  // Sprint/Hardcore: only before the clock starts.
  if (e.key === 'v' || e.key === 'V') {
    skipNextDigit();
    e.preventDefault();
    return;
  }

  // Hidden: "Z" toggles zen motion mode. Falls back to the saved
  // pre-zen motion on exit, just like the corner-× and Esc.
  if (e.key === 'z' || e.key === 'Z') {
    if (state.motionMode === 'zen') {
      exitZenMode();
    } else {
      applyMotionMode('zen');
      updateResetVisibility();
      render();
    }
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
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
  if (!e.clipboardData) return;
  const text = e.clipboardData.getData('text');
  if (!text) return;
  e.preventDefault();
  inputPaste(text);
});

// ---- Hidden mobile-input handlers ----
// When the on-screen keypad is hidden, tapping the pi-display focuses
// this off-screen input to trigger the OS virtual keyboard. We route
// input → inputDigit, paste → inputPaste, and Backspace/Enter to their
// usual handlers. Keep the input perpetually empty so each keystroke
// produces a single 'input' event with a new value of length 1.
if (mobileInputEl) {
  mobileInputEl.addEventListener('input', () => {
    const text = mobileInputEl.value;
    if (!text) return;
    mobileInputEl.value = '';
    // Spaces / typed text outside the alphabet are filtered inside
    // inputDigit, so we don't need to pre-filter here.
    for (const c of text) inputDigit(c);
  });
  mobileInputEl.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Backspace') {
      backspace();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      forceCheck();
      e.preventDefault();
    } else if (e.key === 'Escape' && state.motionMode === 'zen') {
      exitZenMode();
      mobileInputEl.blur();
      e.preventDefault();
    }
  });
  mobileInputEl.addEventListener('paste', (e) => {
    if (!e.clipboardData) return;
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();
    inputPaste(text);
    mobileInputEl.value = '';
  });
  // When the OS keyboard surfaces and resizes the visual viewport, the
  // cursor may end up hidden behind it. Scroll it into view so the user
  // can see what they're typing without having to scroll the page first.
  // Run on focus and on the next visual-viewport resize (keyboard opening
  // is async on Android, so an immediate scroll uses stale measurements).
  mobileInputEl.addEventListener('focus', () => {
    const scrollToCursor = () => {
      if (cursorEl && cursorEl.scrollIntoView) {
        cursorEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };
    scrollToCursor();
    if (window.visualViewport) {
      const onResize = () => {
        window.visualViewport.removeEventListener('resize', onResize);
        scrollToCursor();
      };
      window.visualViewport.addEventListener('resize', onResize);
      // Safety: if no resize fires within 500ms, drop the listener.
      setTimeout(() => window.visualViewport.removeEventListener('resize', onResize), 500);
    }
  });
}

// Tapping the pi-display focuses the hidden input — but only when the
// on-screen keypad is hidden, so we don't pop the OS keyboard on every
// click. Must run inside the synchronous click handler so iOS allows
// programmatic focus to surface the keyboard.
piDisplayEl.addEventListener('click', (e) => {
  if (!state.hideKeypad || !mobileInputEl) return;
  if (e.target === mobileInputEl) return;
  mobileInputEl.focus();
});

// Match the virtual-keyboard layout to the active sequence's alphabet.
// Digit-only sequences (pi, primes, primes-spaced, decimal sequences)
// get the numeric pad. Hex (and any future text-style alphabet) gets
// the full keyboard via inputmode=text.
function updateMobileInputMode() {
  if (!mobileInputEl) return;
  const onlyDigits = /^[0-9 ]+$/.test(state.alphabet);
  mobileInputEl.setAttribute('inputmode', onlyDigits ? 'numeric' : 'text');
}

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
    } else if (target === 'autocheck-style') {
      state.practiceAutoCheckStyle = DEFAULT_AUTOCHECK_STYLE;
      const radio = document.querySelector(`input[name="autocheck-style"][value="${DEFAULT_AUTOCHECK_STYLE}"]`);
      if (radio) radio.checked = true;
      localStorage.setItem(STORAGE_KEYS.practiceAutoCheckStyle, DEFAULT_AUTOCHECK_STYLE);
      updateResetVisibility();
      refreshAutoCheckScheduling();
      render();
    } else if (target === 'motion-mode') {
      applyMotionMode(defaultMotionMode());
      updateResetVisibility();
      render();
    } else if (target === 'hide-keypad') {
      applyHideKeypad(false);
      updateResetVisibility();
      render();
    } else if (target === 'practice-lookahead') {
      state.practiceLookahead = DEFAULT_PRACTICE_LOOKAHEAD;
      practiceLookaheadInput.value = String(DEFAULT_PRACTICE_LOOKAHEAD);
      localStorage.setItem(STORAGE_KEYS.practiceLookahead, String(DEFAULT_PRACTICE_LOOKAHEAD));
      renderLookaheadLabel();
      updateResetVisibility();
      checkLookaheadAutoCheck();
      render();
    } else if (target === 'bullet') {
      bulletStartInput.value = String(DEFAULT_BULLET_START);
      bulletBonusInput.value = String(DEFAULT_BULLET_BONUS);
      bulletPenaltyInput.value = String(DEFAULT_BULLET_PENALTY);
      applyBulletInputs(true);
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
    else if (target === 'autocheck-style') isDefault = state.practiceAutoCheckStyle === DEFAULT_AUTOCHECK_STYLE;
    else if (target === 'motion-mode') isDefault = state.motionMode === defaultMotionMode();
    else if (target === 'hide-keypad') isDefault = state.hideKeypad === false;
    else if (target === 'practice-lookahead') isDefault = state.practiceLookahead === DEFAULT_PRACTICE_LOOKAHEAD;
    else if (target === 'bullet') {
      // Reset-to-default is also hidden once a bullet run is in flight
      // (or post-game-over), matching the lock on the three inputs — the
      // player can't retroactively change start/bonus/penalty mid-run.
      const bulletLocked = state.mode === 'bullet' && state.startTime !== null;
      isDefault = bulletLocked || (
        state.bulletStartSeconds === DEFAULT_BULLET_START
        && state.bulletBonusSeconds === DEFAULT_BULLET_BONUS
        && state.bulletPenaltySeconds === DEFAULT_BULLET_PENALTY
      );
    }
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
  syncSkipConfirmLabel();
  skipModal.hidden = false;
  skipModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => { skipCountInput.focus(); skipCountInput.select(); }, 0);
}

function closeSkipModal() {
  skipModal.hidden = true;
  skipModal.setAttribute('aria-hidden', 'true');
}

// Keeps the confirm button's "Skip N" label in sync with the number input.
function syncSkipConfirmLabel() {
  const v = parseInt(skipCountInput.value, 10);
  if (skipConfirmCountEl) skipConfirmCountEl.textContent = (!isNaN(v) && v > 0) ? String(v) : '';
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

// Preset chips: 1 / 10 / 100 / 1000 skip immediately on click.
skipPresetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const n = parseInt(btn.dataset.skip, 10);
    if (isNaN(n) || n < 1) return;
    lastSkipAmount = n;
    skipDigits(n);
    closeSkipModal();
  });
});

skipConfirmBtn.addEventListener('click', confirmSkipN);

skipCountInput.addEventListener('input', syncSkipConfirmLabel);
skipCountInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    confirmSkipN();
  }
});

skipModal.addEventListener('click', (e) => {
  if (e.target && e.target.hasAttribute('data-close')) closeSkipModal();
});

// ---- Missed help modal ----
function openMissedModal() {
  missedModal.hidden = false;
  missedModal.setAttribute('aria-hidden', 'false');
}
function closeMissedModal() {
  missedModal.hidden = true;
  missedModal.setAttribute('aria-hidden', 'true');
}
missedTile.addEventListener('click', openMissedModal);
missedTile.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openMissedModal();
  }
});
missedModal.addEventListener('click', (e) => {
  if (e.target && e.target.hasAttribute('data-close')) closeMissedModal();
});

// ---- Bullet score modal ----
function openBulletScoreModal() {
  if (!bulletScoreModal) return;
  // Recompute the stats from current entries so the dialog reflects the
  // very latest state (in case applyBulletScoring just ran).
  let correct = 0, wrong = 0, missed = 0, fixed = 0, refunded = 0;
  for (const e of state.entries) {
    if (!e.checked) continue;
    missed += e.missedBefore.length;
    if (e.status === 'correct') {
      if (e.corrected) fixed += 1;
      else if (e.skipped) { /* skipped: don't count */ }
      else correct += 1;
    } else if (e.status === 'wrong') {
      wrong += 1;
    }
    if (e.bulletRefunded) refunded += 1;
  }
  const pos = state.nextSeqIdx || 0;
  const seqLabel = (SEQUENCES[state.sequenceId] && SEQUENCES[state.sequenceId].shortLabel) || state.sequenceId;
  let headline;
  if (state.bulletGameOver) {
    if (state.bulletEndReason === 'stopped') {
      const remaining = Math.max(0, state.bulletBudget - state.bulletFrozenAt);
      headline = 'Stopped with ' + formatTime(remaining) + ' remaining at digit ' +
        pos + ' of ' + seqLabel + '.';
    } else {
      headline = 'Time out at digit ' + pos + ' of ' + seqLabel + '.';
    }
  } else {
    headline = 'Run so far — digit ' + pos + ' of ' + seqLabel + '.';
  }
  document.getElementById('bullet-score-headline').textContent = headline;
  document.getElementById('bullet-score-correct').textContent = correct;
  document.getElementById('bullet-score-wrong').textContent = wrong;
  document.getElementById('bullet-score-fixed').textContent = fixed;
  document.getElementById('bullet-score-missed').textContent = missed;
  document.getElementById('bullet-score-refunded').textContent = refunded;
  document.getElementById('bullet-score-time').textContent =
    formatTime(state.bulletGameOver ? state.bulletFrozenAt :
      (state.startTime === null ? 0 : (performance.now() - state.startTime) / 1000));
  bulletScoreModal.hidden = false;
  bulletScoreModal.setAttribute('aria-hidden', 'false');
}
function closeBulletScoreModal() {
  if (!bulletScoreModal) return;
  bulletScoreModal.hidden = true;
  bulletScoreModal.setAttribute('aria-hidden', 'true');
}
if (bulletScoreModal) {
  bulletScoreModal.addEventListener('click', (e) => {
    if (e.target && e.target.hasAttribute('data-close')) closeBulletScoreModal();
  });
}

// Clicking the Correct tile re-opens the bullet score modal after a
// bullet run. (Reserved as a hook for a general per-mode stats modal
// in future.)
if (correctTile) {
  correctTile.addEventListener('click', () => {
    if (state.mode === 'bullet') openBulletScoreModal();
  });
  correctTile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (state.mode === 'bullet') openBulletScoreModal();
    }
  });
}

// ---- Async load of long sequence data ----
// Each sequence with a reliable longer source has its own file in
// docs/long/<id>.js. The files set window.LONG_DIGITS[id] (kept lazy so
// only the picked sequence pays the bytes). Triggered eagerly for pi (so
// the perf test and a typical first-load user both get the long version
// quickly) and on demand whenever the user picks a different sequence.
const LONG_AVAILABLE = new Set([
  'pi', 'phi', 'sqrt2', 'sqrt3', 'sqrt5', 'e', 'ln2', 'log10_2',
  'pi-squared', 'zeta2', 'euler-mascheroni',
  'pi-binary', 'pi-hex',
]);
const longLoadPromises = new Map();

function loadLong(id) {
  // Tau is derived from pi; loading pi covers both.
  if (id === 'tau') id = 'pi';
  if (!LONG_AVAILABLE.has(id)) return Promise.resolve(false);
  if (longLoadPromises.has(id)) return longLoadPromises.get(id);
  const p = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'long/' + id + '.js';
    script.async = true;
    script.onload = () => {
      const longDigits = window.LONG_DIGITS && window.LONG_DIGITS[id];
      if (typeof longDigits === 'string' && longDigits.length > SEQUENCES[id].digits.length) {
        SEQUENCES[id].digits = longDigits;
        // Tau is derived from pi, so its length grows in step.
        if (id === 'pi') deriveTau();
        // If the user is currently on this sequence (or tau when pi
        // loaded), swap in the longer string and re-score any entries
        // beyond the short fallback.
        const active = state.sequenceId;
        const isActive = active === id || (id === 'pi' && active === 'tau');
        if (isActive) {
          state.digits = SEQUENCES[active].digits;
          computeStatuses();
          render();
          updateSequenceDigitsHint();
        }
      }
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Could not load long/' + id + '.js; using short fallback');
      resolve(false);
    };
    document.head.appendChild(script);
  });
  longLoadPromises.set(id, p);
  return p;
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
  if (!isNaN(savedGroup) && [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(savedGroup)) {
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
  const savedAutoCheckStyle = localStorage.getItem(STORAGE_KEYS.practiceAutoCheckStyle);
  if (savedAutoCheckStyle === 'per-digit' || savedAutoCheckStyle === 'on-idle') {
    state.practiceAutoCheckStyle = savedAutoCheckStyle;
    const radio = document.querySelector(`input[name="autocheck-style"][value="${savedAutoCheckStyle}"]`);
    if (radio) radio.checked = true;
  }
  // Restore preZenMotion FIRST so a reload-in-zen still knows what to
  // exit back to; applyMotionMode wouldn't overwrite it (we're not
  // entering zen, just rehydrating it).
  const savedPreZen = localStorage.getItem(STORAGE_KEYS.preZenMotion);
  if (savedPreZen === 'high' || savedPreZen === 'medium' || savedPreZen === 'low') {
    state.preZenMotion = savedPreZen;
  }
  const savedMotion = localStorage.getItem(STORAGE_KEYS.motionMode);
  applyMotionMode(savedMotion || defaultMotionMode(), false);
  const savedHideKeypad = localStorage.getItem(STORAGE_KEYS.hideKeypad);
  applyHideKeypad(savedHideKeypad === '1', false);
  const savedLookahead = parseInt(localStorage.getItem(STORAGE_KEYS.practiceLookahead), 10);
  if (!isNaN(savedLookahead) && savedLookahead >= 0 && savedLookahead <= 20) {
    state.practiceLookahead = savedLookahead;
    practiceLookaheadInput.value = String(savedLookahead);
  }
  renderLookaheadLabel();
  // Bullet timing.
  const bs = parseInt(localStorage.getItem(STORAGE_KEYS.bulletStart), 10);
  const bb = parseInt(localStorage.getItem(STORAGE_KEYS.bulletBonus), 10);
  const bp = parseInt(localStorage.getItem(STORAGE_KEYS.bulletPenalty), 10);
  if (!isNaN(bs) && bs >= 5 && bs <= 3600) {
    state.bulletStartSeconds = bs;
    state.bulletBudget = bs;
    bulletStartInput.value = String(bs);
  }
  if (!isNaN(bb) && bb >= 0 && bb <= 60) {
    state.bulletBonusSeconds = bb;
    bulletBonusInput.value = String(bb);
  }
  if (!isNaN(bp) && bp >= 0 && bp <= 120) {
    state.bulletPenaltySeconds = bp;
    bulletPenaltyInput.value = String(bp);
  }
}

// ---- Init ----
loadPersistedSettings();
applySequence('pi'); // also triggers loadLong('pi') via applySequence
applyModeDefaults();
updateModeHint();
updateResetVisibility();
render();
