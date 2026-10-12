# Flint Hills series digits

The app's `flint-hills` sequence is 30.314546159143, the first 12 decimals of

    S = sum over n >= 1 of 1 / (n^3 sin^2 n)

Nobody has proved that this series converges. These digits are its value if it
does. They come from the scripts in this folder, not from a published table.

## Result

| Part | Value | Script |
|---|---|---|
| Every term, n <= 10^10 | 30.3145461229631691497822 | `partial_sums.c` |
| n in (10^10, 10^12] with \|sin n\| < 10^-5 | 3.617619182074035e-8 | `near_pi_sum.c` |
| n in (10^12, 10^14] with \|sin n\| < 10^-6 | 3.886338005026527e-12 | `near_pi_sum.c` |
| Convergent numerators of pi, their multiples and intermediate fractions, n > 10^14 | 6.080248360185720e-14 | `structured_terms.py` |
| **Total** | **30.31454615914330...** | |

The 12 decimals in the app leave a margin of about 3e-13 below and 7e-13 above
the total. The known error sources are much smaller than that:

- Terms left out by the `|sin n| < DELTA` cutoff: about 1/(pi DELTA LO^2), so
  3e-16 for (10^10, 10^12] and 3e-19 for (10^12, 10^14]. Raising DELTA tenfold
  does not change either sum in the printed digits.
- Terms past 10^14 other than the structured ones: the leftover per decade
  (near_pi_sum minus structured_terms) falls about tenfold per decade and is
  8e-15 for (10^13, 10^14], so roughly 1e-15 for everything past 10^14.

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
    python3 structured_terms.py --basis 21053343141 | ./near_pi_sum 1e10 1e12 1e-5
    python3 structured_terms.py --basis 8958937768937 | ./near_pi_sum 1e12 1e14 1e-6
    python3 structured_terms.py
