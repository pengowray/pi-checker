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

const state = {
  mode: 'normal',
  autoCheckSeconds: 5,
  // Each entry: { char, t (ms since startTime), checked, status, expected, skippedBefore }
  entries: [],
  startTime: null,
  autoCheckTimer: null,
  gameLocked: false,
};

// ---- DOM refs ----
const userDigitsEl = document.getElementById('user-digits');
const autoSecondsInput = document.getElementById('auto-seconds');
const autoSecondsValue = document.getElementById('auto-seconds-value');
const modeInputs = document.querySelectorAll('input[name="mode"]');
const themeToggle = document.getElementById('theme-toggle');
const checkBtn = document.getElementById('check-btn');
const backBtn = document.getElementById('back-btn');
const resetBtn = document.getElementById('reset-btn');
const modeHint = document.getElementById('mode-hint');

const statCorrect = document.getElementById('stat-correct');
const statWrong = document.getElementById('stat-wrong');
const statSkipped = document.getElementById('stat-skipped');
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
  if (state.mode === 'competitive') {
    autoSecondsInput.value = 5;
    return;
  }
  state.autoCheckSeconds = parseInt(autoSecondsInput.value, 10);
  autoSecondsValue.textContent = state.autoCheckSeconds;
  // If a check is already scheduled, reschedule with new delay
  if (state.autoCheckTimer && hasPending()) {
    resetAutoCheckTimer();
  }
});

modeInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (state.gameLocked) {
      // restore previous selection
      const cur = document.querySelector(`input[name="mode"][value="${state.mode}"]`);
      if (cur) cur.checked = true;
      return;
    }
    state.mode = input.value;
    applyModeDefaults();
    updateUI();
  });
});

function applyModeDefaults() {
  if (state.mode === 'competitive') {
    state.autoCheckSeconds = 5;
    autoSecondsInput.value = 5;
    autoSecondsValue.textContent = 5;
  }
}

function updateModeHint() {
  const hints = {
    normal: 'Type the digits. Backspace removes recent input.',
    competitive: 'Fixed 5s auto-check. Once a digit is checked, it is locked in.',
    flawless: 'No backspace. One slip and it stays.',
  };
  modeHint.textContent = hints[state.mode] || '';
}

// ---- Input handling ----
function inputDigit(d) {
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
    checked: false,
    status: 'pending',
    expected: null,
    skippedBefore: [],
  });
  computeStatuses();
  resetAutoCheckTimer();
  render();
}

function backspace() {
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

// ---- Status computation (with up-to-2-digit skip detection) ----
function computeStatuses() {
  let piIdx = 0;
  for (const e of state.entries) {
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
    } else if (piIdx + 1 < PI_DIGITS.length && e.char === PI_DIGITS[piIdx + 1]) {
      e.skippedBefore.push(PI_DIGITS[piIdx]);
      e.status = 'correct';
      e.expected = PI_DIGITS[piIdx + 1];
      piIdx += 2;
    } else if (piIdx + 2 < PI_DIGITS.length && e.char === PI_DIGITS[piIdx + 2]) {
      e.skippedBefore.push(PI_DIGITS[piIdx], PI_DIGITS[piIdx + 1]);
      e.status = 'correct';
      e.expected = PI_DIGITS[piIdx + 2];
      piIdx += 3;
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
  let correct = 0, wrong = 0, skipped = 0;

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
      span.className = 'digit ' + e.status;
      span.textContent = e.char;
      if (e.status === 'wrong' && e.expected) {
        span.title = 'expected ' + e.expected;
      }
      frag.appendChild(span);
      if (e.status === 'correct') correct += 1;
      else if (e.status === 'wrong') wrong += 1;
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

  updateUI();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function tickTime() {
  if (state.startTime !== null) {
    const elapsed = (performance.now() - state.startTime) / 1000;
    statTime.textContent = formatTime(elapsed);
  } else {
    statTime.textContent = '0:00';
  }
}
setInterval(tickTime, 250);

// ---- UI state (enable/disable controls) ----
function updateUI() {
  const locked = state.gameLocked;

  modeInputs.forEach(input => { input.disabled = locked; });
  autoSecondsInput.disabled = (state.mode === 'competitive') || locked;

  // Backspace enabled?
  let backDisabled = false;
  if (state.mode === 'flawless') backDisabled = true;
  else if (state.entries.length === 0) backDisabled = true;
  else if (state.mode === 'competitive') {
    const last = state.entries[state.entries.length - 1];
    if (last.checked && last.status === 'wrong') backDisabled = true;
  }
  backBtn.disabled = backDisabled;

  checkBtn.disabled = !hasPending();
  updateModeHint();
}

// ---- Reset ----
function reset() {
  if (state.autoCheckTimer) {
    clearTimeout(state.autoCheckTimer);
    state.autoCheckTimer = null;
  }
  state.entries = [];
  state.startTime = null;
  state.gameLocked = false;
  // re-read mode from radio
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

document.querySelectorAll('.key[data-digit]').forEach(btn => {
  wireKey(btn, () => inputDigit(btn.dataset.digit));
});
wireKey(backBtn, backspace);
wireKey(checkBtn, forceCheck);
resetBtn.addEventListener('click', reset);

document.addEventListener('keydown', (e) => {
  // Avoid hijacking when focused in form controls (we only have the slider really)
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' && e.target.type === 'range') return;

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

// ---- Init ----
updateModeHint();
render();
