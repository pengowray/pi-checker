# Terms of the Flint Hills series, sum 1/(n^3 sin^2 n), at the n where sin n
# is smallest: numerators p_k of the continued-fraction convergents of pi,
# their multiples m*p_k, and the intermediate fractions p_{k-1} + j*p_k.
# Prints their total per decade of n and beyond 1e16.
#
#   python3 structured_terms.py
#   python3 structured_terms.py --basis P   # basis line for near_pi_sum.c
#
# Reads pi from docs/long/pi.js.
import os, re, sys
from decimal import Decimal as D, getcontext

getcontext().prec = 200
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
src = open(os.path.join(root, 'docs', 'long', 'pi.js')).read()
PI = D('3.' + re.search(r'= "(\d+)"', src).group(1)[:190])

a, x = [], PI
for _ in range(110):
    ai = int(x); a.append(ai); x = 1 / (x - ai)
P, Q = [1, a[0]], [0, 1]   # P[i+1], Q[i+1] = p_i, q_i
for ai in a[1:]:
    P.append(ai * P[-1] + P[-2]); Q.append(ai * Q[-1] + Q[-2])

if len(sys.argv) > 2 and sys.argv[1] == '--basis':
    i = P.index(int(sys.argv[2]))
    print(P[i], P[i - 1], f"{P[i] - Q[i] * PI:.40E}", f"{P[i - 1] - Q[i - 1] * PI:.40E}")
    sys.exit()

def sin(r):
    s, t, k = D(0), r, 1
    while abs(t) > D(10) ** -190:
        s += t; t = -t * r * r / ((k + 1) * (k + 2)); k += 2
    return s

def term(n):
    k = int((D(n) / PI).to_integral_value())
    return 1 / (D(n) ** 3 * sin(n - k * PI) ** 2)

LIMIT = 10 ** 40
ns = set()
for i in range(1, len(P) - 1):
    p = P[i]
    if p > LIMIT: break
    ns.update(m * p for m in range(1, 2000))
    ns.update(P[i - 1] + j * p for j in range(1, a[i] if i < len(a) else 0))
ns = sorted(n for n in ns if 1 < n < LIMIT)

cuts = [10 ** e for e in range(6, 17)]
bins = [D(0)] * (len(cuts) - 1)
beyond = D(0)
for n in ns:
    t = term(n)
    if n > cuts[-1]:
        beyond += t
    for b, (lo, hi) in enumerate(zip(cuts, cuts[1:])):
        if lo < n <= hi: bins[b] += t
for b, (lo, hi) in enumerate(zip(cuts, cuts[1:])):
    print(f"(1e{len(str(lo)) - 1}, 1e{len(str(hi)) - 1}]: {float(bins[b]):.6e}")
print(f"beyond 1e16: {beyond:.15E}")
