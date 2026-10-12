#!/usr/bin/env python3
# Builds docs/long/<key>.js, the full-length digit files the app loads on
# demand (see loadLong in docs/script.js). Each file comes from one row of
# SOURCES below, of one of three kinds:
#   oeis      an OEIS b-file (one digit per line), downloaded and cached
#   text      a plain-text digit listing at a URL (pi)
#   computed  computed here with mpmath (zeta(5), which OEIS only lists to
#             about 100 digits)
#
# Run from anywhere:
#   python3 scripts/build_digits.py            # every file
#   python3 scripts/build_digits.py zeta3 e    # only these keys
#   python3 scripts/build_digits.py --cache DIR
# Downloads are cached in scripts/.cache/ (gitignored) unless --cache is given.
#
# Computed constants need mpmath; gmpy2 makes it much faster:
#   pip install mpmath gmpy2
#
# After adding a row here, add the key to SEQUENCES in docs/sequence-defs.js
# with long: true, and a short fallback to docs/sequences.js.
import argparse
import os
import sys
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT_DIR = os.path.join(ROOT, 'docs', 'long')
DEFAULT_CACHE = os.path.join(ROOT, 'scripts', '.cache')

# lead: the digits the source lists before the point, checked and dropped
# ('' when the source starts after the point).
SOURCES = [
    dict(key='pi', label='π', kind='text', lead='3', count=100000,
         url='https://raw.githubusercontent.com/eneko/Pi/master/one-million.txt'),
    dict(key='phi', label='φ', kind='oeis', id='A001622', lead='1'),
    dict(key='sqrt2', label='√2', kind='oeis', id='A002193', lead='1'),
    dict(key='sqrt3', label='√3', kind='oeis', id='A002194', lead='1'),
    dict(key='sqrt5', label='√5', kind='oeis', id='A002163', lead='2'),
    dict(key='e', label='e', kind='oeis', id='A001113', lead='2'),
    dict(key='ln2', label='ln 2', kind='oeis', id='A002162', lead=''),
    dict(key='log10_2', label='log₁₀ 2', kind='oeis', id='A007524', lead=''),
    dict(key='pi-squared', label='π²', kind='oeis', id='A002388', lead='9'),
    dict(key='zeta2', label='ζ(2) = π²/6', kind='oeis', id='A013661', lead='1'),
    dict(key='zeta3', label='ζ(3) (Apéry’s constant)', kind='oeis', id='A002117', lead='1'),
    dict(key='zeta5', label='ζ(5)', kind='computed', lead='1', count=20001),
    dict(key='tribonacci', label='the tribonacci constant', kind='oeis', id='A058265', lead='1'),
    dict(key='euler-mascheroni', label='γ (Euler–Mascheroni)', kind='oeis', id='A001620', lead=''),
    dict(key='catalan', label='Catalan’s constant G', kind='oeis', id='A006752', lead=''),
    dict(key='pi-binary', label='π in binary', kind='oeis', id='A004601', lead='11', base=2),
    # A062964 stores each hex digit as a decimal number 0-15; mapped to 0-9A-F.
    dict(key='pi-hex', label='π in hex', kind='oeis', id='A062964', lead='3', base=16),
]


def fetch(url, cache):
    path = os.path.join(cache, url.rsplit('/', 1)[-1])
    if not os.path.exists(path):
        os.makedirs(cache, exist_ok=True)
        req = urllib.request.Request(url, headers={'User-Agent': 'pi-checker build_digits.py'})
        with urllib.request.urlopen(req) as r, open(path, 'wb') as f:
            f.write(r.read())
    with open(path, encoding='utf-8') as f:
        return f.read()


def oeis_digits(src, cache):
    num = src['id'][1:]
    url = f'https://oeis.org/{src["id"]}/b{num}.txt'
    base = src.get('base', 10)
    out = []
    for line in fetch(url, cache).splitlines():
        parts = line.split()
        if len(parts) < 2 or parts[0].startswith('#'):
            continue
        d = int(parts[1])
        if not 0 <= d < base:
            sys.exit(f'{src["key"]}: digit {parts[1]} out of range for base {base}')
        out.append('0123456789ABCDEF'[d])
    return ''.join(out), url


def text_digits(src, cache):
    text = fetch(src['url'], cache)
    # Header lines, then "3." on its own line, then the digits in rows.
    body = text.split(src['lead'] + '.', 1)[1]
    digits = ''.join(ch for ch in body if ch.isdigit())[:src['count']]
    return src['lead'] + digits, f'{src["url"]} (first {src["count"]:,} digits)'


def zeta5_digits(n):
    # Two independent ways, which must agree:
    #   1. mpmath's zeta(5)
    #   2. Plouffe's formula
    #        zeta(5) = pi^5/294 - (72/35) S(-1) - (2/35) S(+1),
    #        S(c) = sum over k >= 1 of 1 / (k^5 (e^(2 pi k) + c))
    from mpmath import mp, mpf, zeta, pi, exp, nstr
    guard = 20
    mp.dps = n + guard + 10
    a = zeta(5)
    q = exp(-2 * pi)
    qk, sm, sp, k = mpf(1), mpf(0), mpf(0), 0
    eps = mpf(10) ** -(n + guard + 5)
    while True:
        k += 1
        qk *= q
        k5 = mpf(k) ** 5
        tm = qk / (1 - qk) / k5   # 1 / (k^5 (e^(2 pi k) - 1))
        sm += tm
        sp += qk / (1 + qk) / k5  # 1 / (k^5 (e^(2 pi k) + 1))
        if tm < eps:
            break
    b = pi ** 5 / 294 - mpf(72) / 35 * sm - mpf(2) / 35 * sp
    sa = nstr(a, n + guard, strip_zeros=False)
    sb = nstr(b, n + guard, strip_zeros=False)
    if sa != sb:
        sys.exit('zeta5: mpmath and Plouffe disagree')
    return sa.replace('.', '')[:n + 1]


COMPUTE = {'zeta5': zeta5_digits}


def build(src, cache):
    kind = src['kind']
    if kind == 'oeis':
        all_digits, source = oeis_digits(src, cache)
    elif kind == 'text':
        all_digits, source = text_digits(src, cache)
    elif kind == 'computed':
        all_digits = COMPUTE[src['key']](src['count'])
        source = 'computed by scripts/build_digits.py; mpmath and Plouffe’s formula agree'
    lead = src['lead']
    if not all_digits.startswith(lead):
        sys.exit(f'{src["key"]}: expected the source to start with "{lead}", got "{all_digits[:len(lead)]}"')
    digits = all_digits[len(lead):]
    banner = (
        f'// Digits of {src["label"]} after the point ({len(digits)} digits).\n'
        f'// Source: {source}\n'
        f'// Generated by scripts/build_digits.py; do not edit by hand.\n'
    )
    body = f'(window.LONG_DIGITS = window.LONG_DIGITS || {{}})["{src["key"]}"] = "{digits}";\n'
    with open(os.path.join(OUT_DIR, src['key'] + '.js'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(banner + body)
    print(f'{src["key"]}: {len(digits)} digits -> docs/long/{src["key"]}.js')


def main():
    ap = argparse.ArgumentParser(description='Build docs/long/<key>.js digit files.')
    ap.add_argument('keys', nargs='*', help='keys to build (default: all)')
    ap.add_argument('--cache', default=DEFAULT_CACHE, help='download cache directory')
    args = ap.parse_args()
    known = {s['key'] for s in SOURCES}
    unknown = [k for k in args.keys if k not in known]
    if unknown:
        sys.exit(f'unknown keys: {", ".join(unknown)}. Known: {", ".join(sorted(known))}')
    for src in SOURCES:
        if not args.keys or src['key'] in args.keys:
            build(src, args.cache)


if __name__ == '__main__':
    main()
