// Pi digits after the decimal point (1000 digits).
const PI_DIGITS = (
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

const MODE_FIXED_DELAY = { competitive: 2, flawless: 0 };
const DEFAULT_NORMAL_DELAY = 3;
const MANUAL_DELAY = 31; // slider sentinel: no auto-check; user presses Check/Enter
const COMPETITIVE_LIMIT_SECONDS = 10 * 60;

const state = {
  mode: 'normal',
  autoCheckSeconds: DEFAULT_NORMAL_DELAY,
  normalDelay: DEFAULT_NORMAL_DELAY, // remember user's choice for normal mode
  // Each entry: { char, t, pasted, checked, status, expected, skippedBefore }
  entries: [],
  startTime: null,
  autoCheckTimer: null,
  gameLocked: false,
  competitiveEnded: false,
  competitiveFrozenAt: 0, // seconds elapsed when the comp session ended
};

// ---- DOM refs ----
const userDigitsEl = document.getElementById('user-digits');
const autoSecondsInput = document.getElementById('auto-seconds');
const autoSecondsLabel = document.getElementById('auto-seconds-label');
const modeInputs = document.querySelectorAll('input[name="mode"]');
const themeToggle = document.getElementById('theme-toggle');
const settingsToggle = document.getElementById('settings-toggle');
const settingsClose = document.getElementById('settings-close');
const settingsModal = document.getElementById('settings-modal');
const checkBtn = document.getElementById('check-btn');
const backBtn = document.getElementById('back-btn');
const resetBtn = document.getElementById('reset-btn');
const stopBtn = document.getElementById('stop-btn');
const continueBtn = document.getElementById('continue-btn');
const digitBtns = document.querySelectorAll('.key[data-digit]');
const modeHint = document.getElementById('mode-hint');
const modeBadge = document.getElementById('mode-badge');

const statCorrect = document.getElementById('stat-correct');
const statWrong = document.getElementById('stat-wrong');
const statSkipped = document.getElementById('stat-skipped');
const statPasted = document.getElementById('stat-pasted');
const statTime = document.getElementById('stat-time');

// ---- Theme ----
function initTheme() {
  const saved = localStorage.getItem('pi-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '\u{1F319}';
}
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('pi-theme', next);
});
initTheme();

// ---- Mode + slider ----
autoSecondsInput.addEventListener('input', () => {
  if (state.mode in MODE_FIXED_DELAY) {
    // Snap back; the slider is locked in these modes
    autoSecondsInput.value = MODE_FIXED_DELAY[state.mode];
    return;
  }
  state.autoCheckSeconds = parseInt(autoSecondsInput.value, 10);
  state.normalDelay = state.autoCheckSeconds;
  renderDelayLabel();
  updateModeBadge();
  if (hasPending()) resetAutoCheckTimer();
});

function isManual() {
  return state.autoCheckSeconds >= MANUAL_DELAY;
}

function renderDelayLabel() {
  autoSecondsLabel.textContent = isManual() ? 'manual' : state.autoCheckSeconds + 's';
}

modeInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (!attemptModeChange(input.value)) {
      const cur = document.querySelector(`input[name="mode"][value="${state.mode}"]`);
      if (cur) cur.checked = true;
    }
    render();
  });
});

function attemptModeChange(newMode) {
  if (newMode === state.mode) return true;

  // Competitive and Flawless always start from a fresh session.
  // If there is existing progress, confirm before clearing it.
  if (newMode === 'competitive' || newMode === 'flawless') {
    if (state.entries.length > 0) {
      const ok = confirm('This will reset your current progress. Start a new ' + newMode + ' session?');
      if (!ok) return false;
    }
    clearSession();
    state.mode = newMode;
    applyModeDefaults();
    return true;
  }

  // Leaving an active competitive session to Normal requires confirmation.
  if (state.mode === 'competitive' && state.gameLocked && !state.competitiveEnded && newMode === 'normal') {
    const ok = confirm('Your competitive session will end. Continue in casual mode?');
    if (!ok) return false;
    state.gameLocked = false;
  }

  // Tidy up competitive state when leaving the mode in any way.
  if (state.mode === 'competitive' && newMode !== 'competitive') {
    // If the session ended, sync the timer so the display continues smoothly
    if (state.competitiveEnded && state.startTime !== null) {
      state.startTime = performance.now() - state.competitiveFrozenAt * 1000;
    }
    state.competitiveEnded = false;
    state.gameLocked = false;
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
  state.entries = [];
  state.startTime = null;
  state.gameLocked = false;
  state.competitiveEnded = false;
  state.competitiveFrozenAt = 0;
}

function applyModeDefaults() {
  if (state.mode in MODE_FIXED_DELAY) {
    state.autoCheckSeconds = MODE_FIXED_DELAY[state.mode];
  } else {
    state.autoCheckSeconds = state.normalDelay;
  }
  autoSecondsInput.value = state.autoCheckSeconds;
  renderDelayLabel();
  updateModeBadge();
}

function updateModeBadge() {
  const modeName = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  let delayText;
  if (state.mode === 'competitive' && state.competitiveEnded) delayText = 'ended';
  else if (isManual()) delayText = 'manual';
  else if (state.autoCheckSeconds === 0) delayText = 'instant';
  else delayText = state.autoCheckSeconds + 's auto-check';
  modeBadge.textContent = modeName + ' · ' + delayText;
  modeBadge.classList.toggle('locked', state.gameLocked && !state.competitiveEnded);
}

function updateModeHint() {
  const hints = {
    normal: 'Type or paste digits. Backspace removes recent input.',
    competitive: '2s auto-check, 10 minute limit, wrong digits stay locked. Reset is required to start.',
    flawless: 'Instant lock-in, no backspace. Reset is required to start.',
  };
  modeHint.textContent = hints[state.mode] || '';
}

function isInputLocked() {
  return state.competitiveEnded && state.mode === 'competitive';
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
  markAllChecked();
  render();
}

function continueInCasual() {
  if (!(state.mode === 'competitive' && state.competitiveEnded)) return;
  // Pick up the casual timer at the same elapsed value so the display
  // continues smoothly instead of jumping forward.
  if (state.startTime !== null) {
    state.startTime = performance.now() - state.competitiveFrozenAt * 1000;
  }
  state.mode = 'normal';
  state.competitiveEnded = false;
  state.gameLocked = false;
  const radio = document.querySelector('input[name="mode"][value="normal"]');
  if (radio) radio.checked = true;
  applyModeDefaults();
  render();
}

// ---- Input handling ----
function inputDigit(d) {
  if (isInputLocked()) return;
  // Initial "3" is silently ignored (since "3." is prefilled)
  if (state.entries.length === 0 && d === '3') return;

  if (state.startTime === null) {
    state.startTime = performance.now();
    if (state.mode === 'competitive') state.gameLocked = true;
  }

  const t = performance.now() - state.startTime;
  state.entries.push({
    char: d,
    t: t,
    pasted: false,
    checked: false,
    status: 'pending',
    expected: null,
    skippedBefore: [],
  });
  computeStatuses();
  resetAutoCheckTimer();
  render();
}

function inputPaste(text) {
  if (isInputLocked()) return;
  const digits = text.replace(/\D/g, '').split('');
  if (digits.length === 0) return;

  // Lock in any currently pending entries first
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  markAllChecked();

  let startIdx = 0;
  if (state.entries.length === 0 && digits[0] === '3') {
    startIdx = 1;
  }
  if (startIdx >= digits.length) {
    render();
    return;
  }

  // Paste does not start the timer or lock the mode — those wait for the
  // first real keypress. Pasted entries get t = elapsed if a session is
  // already running, else null.
  for (let k = startIdx; k < digits.length; k++) {
    const t = state.startTime === null ? null : (performance.now() - state.startTime);
    state.entries.push({
      char: digits[k],
      t: t,
      pasted: true,
      checked: true, // pasted digits lock in immediately
      status: 'pending',
      expected: null,
      skippedBefore: [],
    });
  }

  computeStatuses();
  render();
}

function backspace() {
  if (isInputLocked()) return;
  if (state.mode === 'flawless') return;
  if (state.entries.length === 0) return;
  const last = state.entries[state.entries.length - 1];
  // Competitive: locked-in errors stay
  if (state.mode === 'competitive' && last.checked && last.status === 'wrong') return;
  state.entries.pop();
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
  if (!hasPending()) return;
  if (isManual()) return; // user must press Check/Enter

  const ms = state.autoCheckSeconds * 1000;
  if (ms <= 0) {
    markAllChecked();
  } else {
    state.autoCheckTimer = setTimeout(() => {
      state.autoCheckTimer = null;
      markAllChecked();
      render();
    }, ms);
  }
}

function markAllChecked() {
  for (const e of state.entries) e.checked = true;
}

// ---- Status computation ----
// Skips of up to 2 pi digits are only credited when the next 2 user digits
// literally match the pi positions that follow (confirmation requirement).
function computeStatuses() {
  const entries = state.entries;
  let piIdx = 0;

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    e.skippedBefore = [];

    if (piIdx >= PI_DIGITS.length) {
      e.status = 'wrong';
      e.expected = null;
      continue;
    }

    if (e.char === PI_DIGITS[piIdx]) {
      e.status = 'correct';
      e.expected = PI_DIGITS[piIdx];
      piIdx += 1;
      continue;
    }

    let skipped = 0;
    for (let k = 1; k <= 2; k++) {
      if (piIdx + k >= PI_DIGITS.length) break;
      if (e.char !== PI_DIGITS[piIdx + k]) continue;
      // Confirmation: the next 2 entries must directly match pi[piIdx+k+1..k+2]
      const n1 = entries[i + 1];
      const n2 = entries[i + 2];
      if (!n1 || !n2) continue;
      if (piIdx + k + 2 >= PI_DIGITS.length) continue;
      if (n1.char === PI_DIGITS[piIdx + k + 1] && n2.char === PI_DIGITS[piIdx + k + 2]) {
        skipped = k;
        break;
      }
    }

    if (skipped > 0) {
      for (let j = 0; j < skipped; j++) e.skippedBefore.push(PI_DIGITS[piIdx + j]);
      e.status = 'correct';
      e.expected = PI_DIGITS[piIdx + skipped];
      piIdx += skipped + 1;
    } else {
      e.status = 'wrong';
      e.expected = PI_DIGITS[piIdx];
      piIdx += 1;
    }
  }
}

// ---- Render ----
function render() {
  const frag = document.createDocumentFragment();
  let correct = 0, wrong = 0, skipped = 0, pasted = 0;

  for (const e of state.entries) {
    if (e.checked) {
      // Show skipped pi digits before this entry as small markers
      for (const s of e.skippedBefore) {
        const span = document.createElement('span');
        span.className = 'digit skipped-marker';
        span.textContent = s;
        span.title = 'skipped digit';
        frag.appendChild(span);
        skipped += 1;
      }
      const span = document.createElement('span');
      let cls = 'digit ' + e.status;
      if (e.pasted) cls += ' pasted';
      span.className = cls;
      span.textContent = e.char;
      if (e.status === 'wrong' && e.expected) {
        span.title = 'expected ' + e.expected;
      } else if (e.pasted) {
        span.title = 'pasted';
      }
      frag.appendChild(span);
      if (e.status === 'correct') {
        if (e.pasted) pasted += 1;
        else correct += 1;
      } else if (e.status === 'wrong') {
        wrong += 1;
      }
    } else {
      const span = document.createElement('span');
      span.className = 'digit pending';
      span.textContent = e.char;
      frag.appendChild(span);
    }
  }

  userDigitsEl.replaceChildren(frag);

  statCorrect.textContent = correct;
  statWrong.textContent = wrong;
  statSkipped.textContent = skipped;
  statPasted.textContent = pasted;

  updateUI();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function tickTime() {
  if (state.startTime === null) {
    statTime.textContent = '0:00';
    statTime.classList.remove('frozen');
    return;
  }

  // Auto-end competitive when limit hits
  if (state.mode === 'competitive' && state.gameLocked && !state.competitiveEnded) {
    const elapsed = (performance.now() - state.startTime) / 1000;
    if (elapsed >= COMPETITIVE_LIMIT_SECONDS) {
      endCompetitive();
      updateUI();
    }
  }

  let elapsed;
  if (state.competitiveEnded && state.mode === 'competitive') {
    elapsed = state.competitiveFrozenAt;
  } else {
    elapsed = (performance.now() - state.startTime) / 1000;
  }

  if (state.mode === 'competitive') {
    const capped = Math.min(elapsed, COMPETITIVE_LIMIT_SECONDS);
    statTime.textContent = formatTime(capped) + ' / ' + formatTime(COMPETITIVE_LIMIT_SECONDS);
    statTime.classList.toggle('frozen', state.competitiveEnded);
  } else {
    statTime.textContent = formatTime(elapsed);
    statTime.classList.remove('frozen');
  }
}
setInterval(tickTime, 250);

// ---- UI state (enable/disable controls) ----
function updateUI() {
  const hasEntries = state.entries.length > 0;
  const inputLocked = isInputLocked();
  const compActive = state.mode === 'competitive' && state.gameLocked && !state.competitiveEnded;

  modeInputs.forEach(input => { input.disabled = false; input.parentElement.title = ''; });
  autoSecondsInput.disabled = (state.mode in MODE_FIXED_DELAY) || state.gameLocked;

  // Digit keys
  digitBtns.forEach(btn => { btn.disabled = inputLocked; });

  // Backspace
  let backDisabled = inputLocked;
  if (!backDisabled) {
    if (state.mode === 'flawless') backDisabled = true;
    else if (!hasEntries) backDisabled = true;
    else if (state.mode === 'competitive') {
      const last = state.entries[state.entries.length - 1];
      if (last.checked && last.status === 'wrong') backDisabled = true;
    }
  }
  backBtn.disabled = backDisabled;

  checkBtn.disabled = inputLocked || !hasPending();

  // Conditional action buttons
  stopBtn.hidden = !compActive;
  continueBtn.hidden = !(state.mode === 'competitive' && state.competitiveEnded);

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
  // Don't take focus on mouse press, so keyboard Enter doesn't re-trigger this button
  btn.addEventListener('mousedown', (e) => e.preventDefault());
}

digitBtns.forEach(btn => {
  wireKey(btn, () => inputDigit(btn.dataset.digit));
});
wireKey(backBtn, backspace);
wireKey(checkBtn, forceCheck);
resetBtn.addEventListener('click', reset);
stopBtn.addEventListener('click', () => endCompetitive());
continueBtn.addEventListener('click', () => continueInCasual());

document.addEventListener('keydown', (e) => {
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' && e.target.type === 'range') return;

  // Allow native paste shortcut to flow through (paste handler picks it up)
  if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) return;

  if (e.key === 'Escape' && !settingsModal.hidden) {
    closeSettings();
    e.preventDefault();
    return;
  }

  if (e.key >= '0' && e.key <= '9') {
    inputDigit(e.key);
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

// ---- Init ----
updateModeHint();
render();
