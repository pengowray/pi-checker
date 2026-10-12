// Sum of 1/(n^3 sin^2 n) over every n in (LO, HI] with |sin n| < DELTA.
//
// Uses a pair of consecutive convergents p_k/q_k, p_{k-1}/q_{k-1} of pi.
// Every integer is n = u*p_k + v*p_{k-1} for unique integers u, v, and then
// n - (u*q_k + v*q_{k-1})*pi = u*e_k + v*e_{k-1}, where e_j = p_j - q_j*pi.
// That error is roughly v*pi/p_k, so only |v| < DELTA*p_k/pi (plus a margin)
// can give |sin n| < DELTA, which makes the enumeration finite and exact.
//
// The terms left out (|sin n| >= DELTA) add up to about 1/(pi*DELTA*LO^2).
//
// Reads "p_k p_{k-1} e_k e_{k-1}" on stdin (from structured_terms.py --basis).
//   gcc -O2 near_pi_sum.c -o near_pi_sum -lquadmath -lm
//   python3 structured_terms.py --basis 21053343141 | ./near_pi_sum 1e10 1e12 1e-5
#include <quadmath.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
  if (argc < 4) { fprintf(stderr, "usage: %s LO HI DELTA < basis\n", argv[0]); return 1; }
  long long pk, pk1; char a[100], b[100];
  if (scanf("%lld %lld %99s %99s", &pk, &pk1, a, b) != 4) return 1;
  __float128 ek = strtoflt128(a, NULL), ek1 = strtoflt128(b, NULL);
  double LO = atof(argv[1]), HI = atof(argv[2]), DELTA = atof(argv[3]);
  long long V = (long long)(DELTA * pk / M_PI + HI * fabs((double)ek) / M_PI) + 10;
  int d0 = (int)floor(log10(LO));
  __float128 sum = 0, decade[8] = {0};
  long long count = 0;
  for (long long v = -V; v <= V; v++) {
    long long ulo = (long long)floor((LO - (double)v * pk1) / pk) - 1;
    long long uhi = (long long)ceil((HI - (double)v * pk1) / pk) + 1;
    for (long long u = ulo; u <= uhi; u++) {
      __int128 n = (__int128)u * pk + (__int128)v * pk1;
      if (n <= (__int128)LO || n > (__int128)HI) continue;
      __float128 e = (__float128)u * ek + (__float128)v * ek1;
      if (fabsq(e) >= DELTA) continue;
      long double s = sinl((long double)e), nn = (long double)n;
      __float128 t = (__float128)(1.0L / (nn * nn * nn * s * s));
      sum += t;
      count++;
      int d = (int)floor(log10((double)n - 1)) - d0;
      if (d >= 0 && d < 8) decade[d] += t;
    }
  }
  char buf[64];
  quadmath_snprintf(buf, sizeof buf, "%.15Qe", sum);
  printf("terms=%lld sum=%s\n", count, buf);
  for (int d = 0; d < 8 && d0 + d < log10(HI); d++) {
    quadmath_snprintf(buf, sizeof buf, "%.15Qe", decade[d]);
    printf("  (1e%d, 1e%d]: %s\n", d0 + d, d0 + d + 1, buf);
  }
  return 0;
}
