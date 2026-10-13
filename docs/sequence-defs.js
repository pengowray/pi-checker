// ---- Sequence definitions ----
// Every sequence the app offers, in dropdown order, plus the generators for
// the computed ones. Loaded after sequences.js (short fallback digits,
// window.SEQUENCE_DATA) and before script.js, which builds the dropdown
// from SEQUENCES and loads full-length digits from docs/long/<id>.js on
// demand (loadLong). Built-in fallback for pi is SHORT_PI below.
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
    long: true,
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
  'pi-squared': {
    label: 'π² (pi squared)',
    shortLabel: 'π²',
    hintLabel: 'pi squared',
    titleHtml: '&pi;&sup2; Checker',
    integerPart: '9',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
    long: true,
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
    long: true,
  },
  zeta3: {
    label: 'ζ(3) (Apéry’s constant)',
    shortLabel: 'ζ(3)',
    hintLabel: 'zeta(3), Apéry’s constant',
    titleHtml: '&zeta;(3) Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
    long: true,
  },
  zeta5: {
    label: 'ζ(5)',
    shortLabel: 'ζ(5)',
    hintLabel: 'zeta(5)',
    titleHtml: '&zeta;(5) Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
    long: true,
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
    long: true,
  },
  // Real root of x³ = x² + x + 1, the ratio that successive tribonacci
  // numbers (each the sum of the previous three) tend to.
  tribonacci: {
    label: 'Tribonacci constant',
    shortLabel: 'tribonacci',
    hintLabel: 'the tribonacci constant',
    titleHtml: 'Tribonacci Checker',
    integerPart: '1',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
    long: true,
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
    long: true,
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
    long: true,
  },
  catalan: {
    label: 'G (Catalan’s constant)',
    shortLabel: 'G',
    hintLabel: 'Catalan’s constant',
    titleHtml: 'G Checker',
    integerPart: '0',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
    long: true,
  },
  ln2: {
    label: 'ln 2 (natural log)',
    shortLabel: 'ln 2',
    hintLabel: 'the natural log of 2',
    titleHtml: 'ln 2 Checker',
    integerPart: '0',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
    long: true,
  },
  log10_2: {
    label: 'log₁₀ 2 (common log)',
    shortLabel: 'log₁₀ 2',
    hintLabel: 'the base-10 log of 2',
    titleHtml: 'log<sub>10</sub> 2 Checker',
    integerPart: '0',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',
    long: true,
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
    long: true,
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
    long: true,
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
    long: true,
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
    long: true,
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
    long: true,
  },
  primes: {
    label: 'Primes',
    shortLabel: 'primes',
    hintLabel: 'the list of primes',
    // The keypad hint names the term being entered ("the 20th prime"); the
    // given 2 is the 1st prime, so the first one typed is the 2nd.
    firstTerm: 2,
    termName: 'prime',
    titleHtml: 'Primes',
    integerPart: '2',
    // "2 " (NBSP) so the trailing space renders reliably across browsers
    // — analogous to "3." for pi: the first prime sits in the prefix.
    prefix: '2 ',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '',          // filled by setupPrimes()
    // Generic: cumulative digit-positions a visual space follows. For primes
    // it's each prime's end; the emergency number uses it for phone grouping.
    spaceBoundaries: null,
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
    // Comma is accepted but recorded as the separating space (commaIsSpace).
    alphabet: '0123456789 ,',
    keypadType: 'decimal',
    digits: '',
    naturalSpaces: true,
    commaIsSpace: true,
    firstTerm: 2,
    termName: 'prime',
  },
  // cr(Kₙ) for n = 1, 2, 3, …: the fewest crossings in a plane drawing of
  // the complete graph on n points (OEIS A000241). Hill's formula, proved for
  // every n in a 2026 OpenAI preprint with a Lean proof; before that only
  // n <= 14 was proven (n = 13, 14 by Aichholzer, 2021). Typed like
  // primes-spaced: the user types the space (or comma) between terms, since
  // the run of zeros at the start makes auto-inserted spaces confusing.
  'crossing-numbers': {
    label: 'Crossing numbers of complete graphs',
    shortLabel: 'crossing numbers',
    hintLabel: 'the list of crossing numbers of complete graphs',
    titleHtml: 'Graph Crossing Numbers',
    integerPart: '',
    prefix: '',
    alphabet: '0123456789 ,',
    keypadType: 'decimal',
    digits: '',          // filled by setupCrossingNumbers()
    naturalSpaces: true,
    commaIsSpace: true,
    firstTerm: 1,
    termName: 'crossing number',
    digitsNote: 'Term n is the fewest crossings in any drawing of n points with every pair joined by a curve.',
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
  // Sum of the Flint Hills series, sum 1/(n^3 sin^2 n). An OpenAI preprint
  // (September 2026, not yet peer reviewed) proves that pi's irrationality
  // exponent is 2, which with Meiburg's theorem means the series converges.
  // There's no published table of digits: these 15 decimals were computed for
  // this app (scripts/flint-hills/README.md), so the run ends after the last
  // one like the other finite sequences.
  'flint-hills': {
    label: 'Flint Hills series',
    shortLabel: 'Flint Hills',
    hintLabel: 'the sum of the Flint Hills series',
    titleHtml: 'Flint Hills Series Checker',
    integerPart: '30',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '314546159143309',
    hidden: true,    // left out of the dropdown for now
    finite: true,
    digitsNote: 'The digits were calculated for this app and are very likely correct. A 2026 proof that the series converges is not yet peer reviewed.',
  },
  // ♥ Easter egg: any number that starts with "2." is less than 3, so every
  // digit you type is accepted as correct (see acceptAny in computeStatuses).
  // The "true" digits revealed by Skip are all 9s — 2.999… is the value that
  // creeps up on 3 without ever quite reaching it.
  'less-than-3': {
    label: '<3 (less than 3)',
    shortLabel: '< 3',
    hintLabel: 'a number less than 3',
    titleHtml: '&lt;3 Checker',
    integerPart: '2',
    alphabet: '0123456789',
    keypadType: 'decimal',
    acceptAny: true,
    digits: '',          // filled by setupLessThan3()
  },
  // ☎ The IT Crowd's "new, easy-to-remember" emergency services number,
  // 0118 999 881 999 119 7253. Unlike the constants this one is finite, so
  // it actually ends: entering the final digit correctly auto-checks it and
  // stops the clock (see maybeCompleteFinite). No prefix/clue — the leading
  // 0 is part of what the user has to recall. Spaces auto-insert at the
  // phone-number group boundaries via spaceBoundaries (the same mechanism
  // primes uses); phoneLetters paints the faint ABC/DEF keypad letters.
  moss: {
    label: 'New emergency services number',
    shortLabel: 'emergency number',
    hintLabel: 'the new emergency services number',
    titleHtml: 'The Moss Memory Check',
    integerPart: '',
    prefix: '',
    alphabet: '0123456789',
    keypadType: 'decimal',
    digits: '01189998819991197253',
    spaceBoundaries: new Set([4, 7, 10, 13, 16]),
    naturalSpaces: true,
    finite: true,
    phoneLetters: true,
    // Ends as soon as its final digit (3) lands as the 20th digit — or any
    // digit after, if an earlier slip pushed it past position 20.
    lenientEnd: true,
  },
  // 🎮 DOOM's M_Random rndtable[256] — the fixed pseudo-random table from the
  // id Software source. Finite (256 bytes), scored value-by-value: each byte
  // is accepted as decimal OR octal (a leading 0 followed by the octal form).
  // Separators between bytes are space or comma, interchangeable; extra ones
  // don't penalise. bytes/digits filled by setupDoom().
  doom: {
    label: 'DOOM rndtable',
    shortLabel: 'DOOM rndtable',
    hintLabel: 'DOOM’s M_Random rndtable',
    // The keypad hint names values C-style: rndtable[0] is the first.
    firstTerm: 0,
    termRef: (i) => 'rndtable[' + i + ']',
    titleHtml: 'DOOM rndtable',
    integerPart: '',
    // The given C declaration line, shown as a syntax-coloured header above
    // the grid (prefixHtml renders as HTML rather than text).
    prefixHtml: '<span class="c-type">unsigned char</span> ' +
      '<span class="c-ident">rndtable</span><span class="c-punct">[</span>' +
      '<span class="c-num">256</span><span class="c-punct">]</span> ' +
      '<span class="c-punct">=</span> <span class="c-punct">{</span>',
    alphabet: '0123456789 ,',
    keypadType: 'decimal',
    digits: '',          // filled by setupDoom()
    bytes: null,         // filled by setupDoom()
    naturalSpaces: true,
    finite: true,
    commaIsSpace: true,
    // Render byte values in aligned columns with C-like colours and faint
    // commas (valid C); the run finishes the moment the final byte (249) is
    // fully entered — it's 3 digits, so no trailing separator is needed.
    codeColumns: true,
    commaKey: true,
    // Only practice and hardcore apply (sprint/bullet timing and the auto-check
    // options don't fit value scoring); shown with DOOM's skill-level names.
    modes: ['practice', 'hardcore'],
    modeLabels: { practice: 'Hey, not too rough', hardcore: 'Nightmare' },
  },
};

// ---- π in other bases ----
// Bases 3 to 15 except 10 (binary, decimal and hex have their own entries).
// Their digits are converted in the browser from the decimal digits of π
// (derivePiBase), so they grow when long/pi.js loads. The ids pi-base3 …
// pi-base15 stay out of the dropdown, which has a single "another base" entry
// plus a base picker (see script.js).
const PI_BASES = [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];
// Decimal digits used for the conversion: enough for 17,000 to 42,000 digits
// in these bases, while the BigInt work stays fast in every browser.
const PI_BASE_SOURCE_DIGITS = 20000;
for (const b of PI_BASES) {
  SEQUENCES['pi-base' + b] = {
    label: 'π in base ' + b,
    shortLabel: 'π in base ' + b,
    hintLabel: 'pi in base ' + b,
    titleHtml: '&pi; in base ' + b,
    integerPart: (3).toString(b),
    alphabet: '0123456789ABCDEF'.slice(0, b),
    keypadType: b <= 10 ? 'decimal' : 'hex', // unused keys greyed out
    digits: '',
    hidden: true,
    piBase: b,
  };
}

// The digits of π after the point in base b. n decimal digits pin π down to
// within 10^-n, which fixes about n·log(10)/log(b) base-b digits; the last 8
// of those are dropped as a margin against rounding.
function piDigitsInBase(b) {
  const dec = SEQUENCES.pi.digits.slice(0, PI_BASE_SOURCE_DIGITS);
  const n = dec.length;
  const count = Math.floor(n * Math.LN10 / Math.log(b)) - 8;
  const scaled = BigInt(dec) * BigInt(b) ** BigInt(count) / 10n ** BigInt(n);
  return scaled.toString(b).toUpperCase().padStart(count, '0');
}

// Fill in (or refresh, after more pi digits load) a pi-base sequence's digits.
function derivePiBase(id) {
  const def = SEQUENCES[id];
  if (!def || !def.piBase) return;
  const sourceLen = Math.min(SEQUENCES.pi.digits.length, PI_BASE_SOURCE_DIGITS);
  if (def.sourceLen === sourceLen) return;
  def.digits = piDigitsInBase(def.piBase);
  def.sourceLen = sourceLen;
}

// Short fallback digits from sequences.js, shown until docs/long/<id>.js loads.
for (const [id, data] of Object.entries(window.SEQUENCE_DATA || {})) {
  if (SEQUENCES[id]) SEQUENCES[id].digits = data.digits;
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
  SEQUENCES.primes.spaceBoundaries = boundaries;
  SEQUENCES['primes-spaced'].digits = primes.slice(1).join(' ');
})();

(function setupCrossingNumbers() {
  // Hill's formula, cr(Kₙ) = ¼⌊n/2⌋⌊(n−1)/2⌋⌊(n−2)/2⌋⌊(n−3)/2⌋. Exact in
  // doubles: at n = 2000 the product is about 1e12.
  const half = (k) => Math.floor(k / 2);
  const terms = [];
  for (let n = 1; n <= 2000; n++) {
    terms.push(half(n) * half(n - 1) * half(n - 2) * half(n - 3) / 4);
  }
  SEQUENCES['crossing-numbers'].digits = terms.join(' ');
})();

(function setupChampernowne() {
  // 0.123456789 10 11 12 ... — concatenated positive integers.
  // The leading "0." is the integerPart; digits start with "1".
  let out = '';
  for (let i = 1; out.length < 5000; i++) out += i;
  SEQUENCES.champernowne.digits = out;
})();

(function setupLessThan3() {
  // 2.999999… — the supremum of the open interval, sneaking up on 3 but
  // never reaching it. Content only surfaces via Skip; acceptAny makes the
  // actual digit irrelevant for scoring, so every typed digit lands correct.
  SEQUENCES['less-than-3'].digits = '9'.repeat(10000);
})();

(function setupDoom() {
  // DOOM's M_Random rndtable[256], verbatim from id Software's m_random.c.
  // The array literal is the source of truth; join with spaces so it's
  // entered like primes-spaced (digits + separators), one value at a time.
  const rnd = [
      0,   8, 109, 220, 222, 241, 149, 107,  75, 248, 254, 140,  16,  66,
     74,  21, 211,  47,  80, 242, 154,  27, 205, 128, 161,  89,  77,  36,
     95, 110,  85,  48, 212, 140, 211, 249,  22,  79, 200,  50,  28, 188,
     52, 140, 202, 120,  68, 145,  62,  70, 184, 190,  91, 197, 152, 224,
    149, 104,  25, 178, 252, 182, 202, 182, 141, 197,   4,  81, 181, 242,
    145,  42,  39, 227, 156, 198, 225, 193, 219,  93, 122, 175, 249,   0,
    175, 143,  70, 239,  46, 246, 163,  53, 163, 109, 168, 135,   2, 235,
     25,  92,  20, 145, 138,  77,  69, 166,  78, 176, 173, 212, 166, 113,
     94, 161,  41,  50, 239,  49, 111, 164,  70,  60,   2,  37, 171,  75,
    136, 156,  11,  56,  42, 146, 138, 229,  73, 146,  77,  61,  98, 196,
    135, 106,  63, 197, 195,  86,  96, 203, 113, 101, 170, 247, 181, 113,
     80, 250, 108,   7, 255, 237, 129, 226,  79, 107, 112, 166, 103, 241,
     24, 223, 239, 120, 198,  58,  60,  82, 128,   3, 184,  66, 143, 224,
    145, 224,  81, 206, 163,  45,  63,  90, 168, 114,  59,  33, 159,  95,
     28, 139, 123,  98, 125, 196,  15,  70, 194, 253,  54,  14, 109, 226,
     71,  17, 161,  93, 186,  87, 244, 138,  20,  52, 123, 251,  26,  36,
     17,  46,  52, 231, 232,  76,  31, 221,  84,  37, 216, 165, 212, 106,
    197, 242,  98,  43,  39, 175, 254, 145, 190,  84, 118, 222, 187, 136,
    120, 163, 236, 249,
  ];
  // bytes drives byte-level scoring (decimal or octal per value); digits is
  // the decimal join, kept for the settings digit-count hint.
  SEQUENCES.doom.bytes = rnd;
  SEQUENCES.doom.digits = rnd.join(' ');
  // Digits before each value, counting each value's decimal form, for the
  // keypad hint's position in the whole table.
  const digitsBefore = [0];
  for (const v of rnd) digitsBefore.push(digitsBefore[digitsBefore.length - 1] + String(v).length);
  SEQUENCES.doom.digitsBefore = digitsBefore;
})();
