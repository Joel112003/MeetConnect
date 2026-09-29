# Performance

## Measurement method

Lighthouse 13.5.0 was run against the Vite production preview at `http://127.0.0.1:4173` with mobile emulation and default throttling. Each route was tested three times. Dashboard is protected, so its score reflects the unauthenticated route response available in the local preview.

Lighthouse logged a repeatable Windows cleanup warning after some runs (`LanternError: NO_LCP` followed by Chrome launcher `EPERM` cleanup). The JSON reports were still written and category scores were available. This warning is included rather than hidden.

## Before and after

The before values below are the scores supplied for the live site before this work. After values are measured locally from the production build.

| Route | Before Performance | Before Accessibility | Before Best Practices | Before SEO | After Performance (median) | After Accessibility (median) | After Best Practices (median) | After SEO (median) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Landing | 33* | 87* | 100* | 83* | 63 | 100 | 100 | 100 |
| Login | not supplied | not supplied | not supplied | not supplied | 76 | 97 | 100 | 100 |
| Dashboard | not supplied | not supplied | not supplied | not supplied | 78 | 97 | 100 | 100 |

\* User-provided live-site values, not measured by this run.

### Final individual runs

| Route | Run 1 | Run 2 | Run 3 | Median |
| --- | --- | --- | --- | --- |
| Landing | 63 / 100 / 100 / 100 | 61 / 100 / 100 / 100 | 77 / 100 / 100 / 100 | 63 / 100 / 100 / 100 |
| Login | 73 / 97 / 100 / 100 | 76 / 97 / 100 / 100 | 79 / 97 / 100 / 100 | 76 / 97 / 100 / 100 |
| Dashboard | 72 / 97 / 100 / 100 | 80 / 97 / 100 / 100 | 78 / 97 / 100 / 100 | 78 / 97 / 100 / 100 |

Values are ordered Performance / Accessibility / Best Practices / SEO.

## Bundle findings

The production build output after route splitting was:

- Main entry: 188.69 kB (59.77 kB gzip)
- Shared chunk: 49.43 kB (17.33 kB gzip)
- `SocketContext`: 42.11 kB (13.24 kB gzip)
- `api`: 39.44 kB (15.32 kB gzip)
- `Dashboard`: 42.38 kB (10.31 kB gzip)
- `VideoMeet`: 27.47 kB (8.50 kB gzip)
- `Landing`: 16.97 kB (4.94 kB gzip)
- CSS: 78.28 kB (12.42 kB gzip)
- Logo PNG: 80.69 kB

The landing page loads the main entry, global CSS, React/router/auth provider dependencies, the landing route chunk, and the logo asset. `VideoMeet`, `SocketContext`, and `Dashboard` remain separate lazy chunks. The previous idle prefetch in `App.jsx` was removed because it downloaded Dashboard and VideoMeet shortly after public-route first load, defeating the route boundary.

The logo is a 612x408 PNG used as a small UI mark. Its dimensions are now declared on visible instances to reduce layout shift. It was not converted to WebP/AVIF in this pass because there is only one small logo asset and no image pipeline is present; the measured PNG remains 80.69 kB.

## Remaining performance work

The local mobile Performance median improved relative to the supplied live score but remains variable and below the desired target. The largest remaining shared costs are the main JavaScript entry, global CSS, and the existing logo PNG. The local Lighthouse runs also do not represent production CDN/network conditions.
