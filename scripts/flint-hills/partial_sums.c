// Partial sums S(N) of the Flint Hills series, sum 1/(n^3 sin^2 n), printed
// at N = 1, 2, 5 x 10^k up to the N given on the command line.
//
// Each n is reduced mod pi in __float128 (absolute error ~1e-24 at n = 1e10)
// before taking sinl, so terms with n close to a multiple of pi stay accurate.
//
//   gcc -O2 -fopenmp partial_sums.c -o partial_sums -lquadmath -lm
//   ./partial_sums 10000000000      # ~12 minutes on 12 cores
#include <quadmath.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <omp.h>

static __float128 term(long long n) {
  __float128 x = (__float128)n;
  long long k = (long long)llroundq(x / M_PIq);
  __float128 r = x - (__float128)k * M_PIq;
  long double s = sinl((long double)r);
  long double nn = (long double)n;
  return (__float128)(1.0L / (nn * nn * nn * s * s));
}

int main(int argc, char **argv) {
  if (argc < 2) { fprintf(stderr, "usage: %s N\n", argv[0]); return 1; }
  long long N = atoll(argv[1]);
  long long cps[64]; int nc = 0;
  for (long long p = 10; p <= N; p *= 10) {
    long long m[3] = {p, 2 * p, 5 * p};
    for (int i = 0; i < 3; i++) if (m[i] <= N) cps[nc++] = m[i];
  }
  if (nc == 0 || cps[nc - 1] != N) cps[nc++] = N;
  __float128 total = 0;
  long long lo = 1;
  for (int c = 0; c < nc; c++) {
    long long hi = cps[c];
    int T = omp_get_max_threads();
    __float128 *part = calloc(T, sizeof *part);
    #pragma omp parallel
    {
      __float128 acc = 0;
      #pragma omp for schedule(static, 1 << 16)
      for (long long n = lo; n <= hi; n++) acc += term(n);
      part[omp_get_thread_num()] = acc;
    }
    for (int t = 0; t < T; t++) total += part[t];
    free(part);
    char buf[64];
    quadmath_snprintf(buf, sizeof buf, "%.22Qf", total);
    printf("S(%lld) = %s\n", hi, buf);
    fflush(stdout);
    lo = hi + 1;
  }
  return 0;
}
