# Flint Hills series digits

The app's `flint-hills` sequence is 30.314546159143309, the first 15 decimals of

    S = sum over n >= 1 of 1 / (n^3 sin^2 n)

Nobody has proved that this series converges. These digits are its value if it
does. They come from the scripts in this folder, not from a published table.

## Result

| Part | Value | Script |
|---|---|---|
| Every term, n <= 10^10 | 30.3145461229631691497822 | `partial_sums.c` |
| n in (10^10, 10^12] with \|sin n\| < 10^-3 | 3.617619213582556e-8 | `near_pi_sum.c` |
| n in (10^12, 10^14] with \|sin n\| < 10^-5 | 3.886338291477026e-12 | `near_pi_sum.c` |
| n in (10^14, 10^16] with \|sin n\| < 10^-8 | 6.107300205610512e-14 | `near_pi_sum.c` |
| Convergent numerators of pi, their multiples and intermediate fractions, n > 10^16 | 5.352066506547405e-16 | `structured_terms.py` |
| **Total** | **30.31454615914330923...** | |

The 15 decimals in the app leave a margin of about 2.3e-16 below and 7.7e-16
above the total. The known error sources are much smaller than that:

- Terms left out by the `|sin n| < DELTA` cutoff: about 1/(pi DELTA LO^2),
  so 3e-18 for (10^10, 10^12] and less for the later ranges. Each range was
  also run with DELTA ten or a hundred times smaller, and the differences
  match this estimate.
- Terms past 10^16 other than the structured ones: the leftover per decade
  (near_pi_sum minus structured_terms) falls about tenfold per decade and is
  6e-17 for (10^15, 10^16], so roughly 7e-18 for everything past 10^16.
- Rounding in `partial_sums.c`: its S(10^5) matches a 50-digit decimal
  recomputation to 2e-21.

So the 16th decimal is very likely 2, but its margin (about 4e-17) is too
close to these error sizes to put in the app.

## Checks

- S(10^10) matches the value 30.31454612296317 published at
  <https://bigcompute.science/experiments/flint-hills-series/>. Their other
  rows add all 19 convergent spikes up to 10^10 to every N, so they are not
  partial sums, and the page's claim that S is stable to 8 digits from 10^6
  ignores the spike at n = 21,053,343,141 (convergent numerator of pi whose
  next partial quotient is 84), which adds 3.49e-8.
- `near_pi_sum.c` on (10^9, 10^10] with DELTA = 1e-4 gives
  1.585947866541747e-9, against 1.5859510176847e-9 from the brute-force
  partial sums. The 3e-15 gap is the size the cutoff estimate predicts.

## Reproducing

    gcc -O2 -fopenmp partial_sums.c -o partial_sums -lquadmath -lm
    gcc -O2 near_pi_sum.c -o near_pi_sum -lquadmath -lm
    ./partial_sums 10000000000          # about 12 minutes on 12 cores
    python3 structured_terms.py --basis 21053343141 | ./near_pi_sum 1e10 1e12 1e-3     # 2 minutes
    python3 structured_terms.py --basis 8958937768937 | ./near_pi_sum 1e12 1e14 1e-5
    python3 structured_terms.py --basis 5706674932067741 | ./near_pi_sum 1e14 1e16 1e-8
    python3 structured_terms.py
