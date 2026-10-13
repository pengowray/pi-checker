// ---- π in other number systems ----
// Converts the decimal digits of π into other positional systems with BigInt.
// Loaded before sequence-defs.js, which builds the pi-base sequences on top.
// Each function takes the decimal digits after the point (a string) and
// returns { integerPart, digits }.
//
// n decimal digits pin π down to within 10^-n, which fixes about
// n·log(10)/log(b) digits in base b. Each conversion stops RADIX_GUARD digits
// short of that, as a margin against a carry from the digits it can't see.
const RADIX_GUARD = 8;
const RADIX_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// π as the fraction F / D, from its decimal digits.
function piFraction(decimals) {
  return { F: BigInt('3' + decimals), D: 10n ** BigInt(decimals.length) };
}

// Floor division for BigInt (the / operator rounds toward zero).
function floorDiv(a, b) {
  const q = a / b;
  return (a % b !== 0n && (a < 0n) !== (b < 0n)) ? q - 1n : q;
}

// How many base-|b| digits n decimal digits are good for, minus the guard.
function radixDigitCount(n, b) {
  return Math.max(0, Math.floor(n * Math.LN10 / Math.log(b)) - RADIX_GUARD);
}

// Ordinary base b, 2 to 36: π = 3.243F6A88… in base 16.
function piInBase(decimals, b) {
  const { F, D } = piFraction(decimals);
  const count = radixDigitCount(decimals.length, b);
  const scaled = (F - 3n * D) * BigInt(b) ** BigInt(count) / D;
  return {
    integerPart: (3).toString(b).toUpperCase(),
    digits: scaled.toString(b).toUpperCase().padStart(count, '0'),
  };
}

// Negative base −b, for b from 2 to 36. Every real number has an expansion
// Σ dᵢ(−b)^i with digits 0 to b−1 and no sign. The digits after the point
// are worth between −b/(b+1) and 1/(b+1), so the integer part is the integer
// I with π − I in that range: 4 in base −10, for example.
//
// Digits after the point: with an even count M, multiplying by b^M = (−b)^M
// turns them into the integer N = Σ dᵢ(−b)^(M−i), the one with
// π·b^M − N in [−b/(b+1), 1/(b+1)). Adding K = Σ (b−1)·b^j over the odd j
// makes N non-negative, and N + K written in ordinary base b gives the digits:
// unchanged at even j, and b−1 minus the digit at odd j.
function piInNegativeBase(decimals, b) {
  const { F, D } = piFraction(decimals);
  const B = BigInt(b);
  const I = Math.floor(Math.PI + b / (b + 1));
  let count = radixDigitCount(decimals.length, b);
  count -= count % 2;
  const scale = B ** BigInt(count);
  // N = floor((π − I)·b^M + b/(b+1)), in integers.
  const N = floorDiv(((F - BigInt(I) * D) * scale * (B + 1n)) + B * D, (B + 1n) * D);
  // K = (b−1)·(b + b³ + … + b^(M−1)) = b·(b^M − 1)/(b + 1).
  const K = B * (scale - 1n) / (B + 1n);
  const e = (N + K).toString(b).padStart(count, '0');
  let digits = '';
  for (let s = 0; s < count; s++) {
    // String index s holds the digit for (−b)^(count−1−s); count is even, so
    // that power is odd exactly when s is even.
    const v = parseInt(e[s], b);
    digits += RADIX_CHARS[s % 2 === 0 ? b - 1 - v : v];
  }
  return { integerPart: integerInNegativeBase(I, b), digits };
}

function integerInNegativeBase(n, b) {
  if (n === 0) return '0';
  let out = '';
  while (n !== 0) {
    const r = ((n % b) + b) % b;
    out = RADIX_CHARS[r] + out;
    n = (n - r) / -b;
  }
  return out;
}

// Balanced ternary: base 3 with digits −1, 0 and 1, written T, 0 and 1.
// π = 10.0111T… The digits after the point are worth between −1/2 and 1/2,
// so the integer part is 3, written 10. As with negative bases, the digits
// come from the nearest integer N to (π − 3)·3^M: adding K = (3^M − 1)/2
// shifts every digit up by one, into ordinary base 3.
function piInBalancedTernary(decimals) {
  const { F, D } = piFraction(decimals);
  const count = radixDigitCount(decimals.length, 3);
  const scale = 3n ** BigInt(count);
  const N = floorDiv(2n * (F - 3n * D) * scale + D, 2n * D);
  const K = (scale - 1n) / 2n;
  const e = (N + K).toString(3).padStart(count, '0');
  let digits = '';
  for (const c of e) digits += 'T01'[+c];
  return { integerPart: '10', digits };
}

// Integer square root, floor(√n), by Newton's method.
function bigIntSqrt(n) {
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
  for (;;) {
    const y = (x + n / x) >> 1n;
    if (y >= x) return x;
    x = y;
  }
}

// An irrational base β between 1 and 2 (the golden ratio φ, or √2), with
// digits 0 and 1. Uses the greedy expansion: each digit is 1 whenever the
// remaining value allows it, which for φ also means no two 1s in a row.
// Base √2 has other valid expansions; this is the greedy one.
//
// Works in fixed point with enough bits for `count` digits plus a margin.
// Each digit costs a full-precision multiplication, so this is slower than
// the other conversions: about 0.1 s for 10,000 digits.
const BETA_BASES = {
  phi: { log2: Math.log2((1 + Math.sqrt(5)) / 2), value: (bits) => {
    const one = 1n << bits;
    return (one + bigIntSqrt(5n << (2n * bits))) >> 1n;
  } },
  sqrt2: { log2: 0.5, value: (bits) => bigIntSqrt(2n << (2n * bits)) },
};

function piInBetaBase(decimals, kind, maxDigits) {
  const base = BETA_BASES[kind];
  // Bits for the requested digits plus 64 spare; capped by the decimals.
  const wanted = Math.ceil((maxDigits + RADIX_GUARD) * base.log2) + 64;
  const available = Math.floor(decimals.length * Math.log2(10));
  const bits = BigInt(Math.min(wanted, available));
  const count = Math.max(0, Math.floor((Number(bits) - 64) / base.log2) - RADIX_GUARD);
  const one = 1n << bits;
  const beta = base.value(bits);
  const n = Math.min(decimals.length, Math.ceil(Number(bits) * Math.log10(2)) + 10);
  let x = (BigInt('3' + decimals.slice(0, n)) << bits) / 10n ** BigInt(n);
  // Integer part: divide by β until the value is below 1; that many digits
  // come before the point.
  let intDigits = 0;
  while (x >= one) { x = (x << bits) / beta; intDigits++; }
  let out = '';
  for (let i = 0; i < intDigits + count; i++) {
    x = (x * beta) >> bits;
    if (x >= one) { out += '1'; x -= one; } else out += '0';
  }
  return { integerPart: out.slice(0, intDigits), digits: out.slice(intDigits) };
}

if (typeof module !== 'undefined') {
  module.exports = { piInBase, piInNegativeBase, piInBalancedTernary, piInBetaBase };
}
