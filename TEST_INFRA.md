# E2E Test Infra: CabsCrypto Cyber-Futuristic Portfolio Landing Page

## Test Philosophy
- Opaque-box, requirement-driven E2E testing for Vanilla HTML5 / CSS3 / ES6+ web application.
- Standard-library zero-dependency Node.js test architecture using built-in modules (`http`, `fs`, `path`, `assert`, `vm`).
- Systematic 4-tier design methodology:
  - Tier 1: Baseline Feature Coverage (≥5 tests per feature across 13 features = 65+ tests).
  - Tier 2: Boundary Value & Corner Case Handling (≥5 tests per feature across 13 features = 65+ tests).
  - Tier 3: Cross-Feature Combinations (Pairwise feature interaction tests = 13+ tests).
  - Tier 4: Real-World Application Workload Scenarios (End-to-end multi-feature user flows = 7+ scenarios).

## Feature Inventory & Matrix
| # | Feature | Requirement Source | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross) | Tier 4 (Workload) |
|---|---------|-------------------|:-----------------:|:-----------------:|:--------------:|:-----------------:|
| 1 | Dark Neo-Glassmorphic Theme | ORIGINAL_REQUEST R1 | 5 tests | 5 tests | Pairwise | Scenario 4 |
| 2 | Typography & Font Stack | ORIGINAL_REQUEST R1 | 5 tests | 5 tests | Pairwise | Scenario 1 |
| 3 | Glassmorphic Styling & Spotlight Cursor | ORIGINAL_REQUEST R1 | 5 tests | 5 tests | Pairwise | Scenario 4 |
| 4 | Aurora & Cyber Grid Background | ORIGINAL_REQUEST R1 | 5 tests | 5 tests | Pairwise | Scenario 4 |
| 5 | Responsive Mobile/Tablet/Desktop Layout | ORIGINAL_REQUEST R1 | 5 tests | 5 tests | Pairwise | Scenario 5 |
| 6 | Dynamic Hero Headline | ORIGINAL_REQUEST R2 | 5 tests | 5 tests | Pairwise | Scenario 1 |
| 7 | Interactive CLI Terminal | ORIGINAL_REQUEST R2 | 5 tests | 5 tests | Pairwise | Scenario 1, 2 |
| 8 | Terminal Commands Execution | ORIGINAL_REQUEST R2 | 5 tests | 5 tests | Pairwise | Scenario 1, 2 |
| 9 | Matrix Digital Rain Mode | ORIGINAL_REQUEST R2 | 5 tests | 5 tests | Pairwise | Scenario 2, 4 |
| 10 | Bento Grid Projects Showcase | ORIGINAL_REQUEST R3 | 5 tests | 5 tests | Pairwise | Scenario 1, 3 |
| 11 | Project Detail View Modal | ORIGINAL_REQUEST R3 | 5 tests | 5 tests | Pairwise | Scenario 1, 3 |
| 12 | Tech Stack Matrix | ORIGINAL_REQUEST R3 | 5 tests | 5 tests | Pairwise | Scenario 3 |
| 13 | Local HTTP Server & Verification | ORIGINAL_REQUEST R4 | 5 tests | 5 tests | Pairwise | Scenario 6, 7 |

## Test Architecture & Invocation
- Entry Point: `node test/run_e2e_tests.js`
- Test Harness: `test/harness.js`
- Test Suites:
  - `test/tier1_feature_coverage.test.js`
  - `test/tier2_boundary_corner.test.js`
  - `test/tier3_cross_feature.test.js`
  - `test/tier4_real_world.test.js`
- Verification Criteria: Zero test failures (100% pass rate), exit code 0, formatted report output with timing metrics.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Focus / Objective |
|---|----------|--------------------|-------------------|
| 1 | Full Visitor Landing Session | F2, F6, F7, F8, F10, F11 | Hero viewing → terminal commands → project browsing → modal inspection |
| 2 | Dev CLI Interactive Session | F7, F8, F9 | Execution of technical CLI commands (`crypto`, `stats`, `matrix`, `clear`) |
| 3 | Recruiter Skill & Portfolio Audit | F10, F11, F12 | Tech stack category filtering → bento project modal links & tags |
| 4 | Cyber Aesthetic & FX Stress Test | F1, F3, F4, F9 | Neon theme variables, spotlight mouse tracking, background aurora & rain canvas |
| 5 | Multi-Device Responsive Layout | F5 | Viewport breakpoints, mobile hamburger/nav & bento grid column adaptation |
| 6 | HTTP Server Static Delivery & Load | F13 | HTTP GET requests for static assets, 200 OK, MIME types, 404 responses |
| 7 | Full Suite End-to-End Integration | F1-F13 | Sequential execution of complete test harness and integration suite |

## Coverage Thresholds
- Tier 1: ≥65 test cases (≥5 per feature)
- Tier 2: ≥65 test cases (≥5 per feature)
- Tier 3: ≥13 test cases (pairwise interaction tests)
- Tier 4: ≥7 test cases (application-level user flows)
- Total Target: ≥150 test cases
