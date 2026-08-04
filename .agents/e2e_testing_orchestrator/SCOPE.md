# Scope: E2E Testing Track Orchestration

## Architecture
- Framework: Pure Node.js E2E Test Suite & Test Runner (zero external npm dependencies).
- Modules: `http`, `fs`, `path`, `assert`, `child_process`, `vm`.
- Directory Layout:
  - `TEST_INFRA.md` — Project root test philosophy & matrix
  - `TEST_READY.md` — Project root publish readiness signal
  - `test/harness.js` — Test assertion utilities and HTTP helper
  - `test/run_e2e_tests.js` — Main test runner entry point
  - `test/tier1_feature_coverage.test.js` — Tier 1 test cases (>=65 tests)
  - `test/tier2_boundary_corner.test.js` — Tier 2 test cases (>=65 tests)
  - `test/tier3_cross_feature.test.js` — Tier 3 test cases (>=13 tests)
  - `test/tier4_real_world.test.js` — Tier 4 test cases (>=7 tests)

## Feature Inventory & Test Coverage Goals
| # | Feature Name | Description | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross) | Tier 4 (Workload) |
|---|--------------|-------------|-------------------|-------------------|----------------|-------------------|
| 1 | Dark Neo-Glassmorphic Theme | `#08090f` background, cyan, magenta, lime accents | 5 tests | 5 tests | Pairwise | Scenario 4 |
| 2 | Typography & Font Stack | Space Grotesk, JetBrains Mono, Inter | 5 tests | 5 tests | Pairwise | Scenario 1 |
| 3 | Glassmorphic Styling & Spotlight Cursor | Blur, neon borders, mouse spotlight | 5 tests | 5 tests | Pairwise | Scenario 4 |
| 4 | Aurora & Cyber Grid Background | Aurora mesh & 2D cyber grid overlay | 5 tests | 5 tests | Pairwise | Scenario 4 |
| 5 | Responsive Mobile/Tablet/Desktop Layout | Mobile (<768px), Tablet, Desktop rules | 5 tests | 5 tests | Pairwise | Scenario 5 |
| 6 | Dynamic Hero Headline | Gradient text animation & typing effect | 5 tests | 5 tests | Pairwise | Scenario 1 |
| 7 | Interactive CLI Terminal | Terminal container, input prompt, history | 5 tests | 5 tests | Pairwise | Scenario 1, 2 |
| 8 | Terminal Commands Execution | `help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix` | 5 tests | 5 tests | Pairwise | Scenario 1, 2 |
| 9 | Matrix Digital Rain Mode | Rain canvas & toggle command/button | 5 tests | 5 tests | Pairwise | Scenario 2, 4 |
| 10 | Bento Grid Projects Showcase | 12-col Bento layout, tags, hover state | 5 tests | 5 tests | Pairwise | Scenario 1, 3 |
| 11 | Project Detail View Modal | Modal backdrop blur, project details | 5 tests | 5 tests | Pairwise | Scenario 1, 3 |
| 12 | Tech Stack Matrix | 4 domain categories, neon progress bars | 5 tests | 5 tests | Pairwise | Scenario 3 |
| 13 | Local HTTP Server & Verification | HTTP server hosting static assets on localhost | 5 tests | 5 tests | Pairwise | Scenario 6, 7 |

## Sub-Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Test Infrastructure & Runner | `test/harness.js`, `test/run_e2e_tests.js` | none | PLANNED |
| M2 | Tier 1 Feature Coverage Tests | `test/tier1_feature_coverage.test.js` (65+ tests) | M1 | PLANNED |
| M3 | Tier 2 Boundary & Corner Tests | `test/tier2_boundary_corner.test.js` (65+ tests) | M1 | PLANNED |
| M4 | Tier 3 Cross-Feature Combination Tests | `test/tier3_cross_feature.test.js` (13+ tests) | M1 | PLANNED |
| M5 | Tier 4 Real-World Application Workload Tests | `test/tier4_real_world.test.js` (7+ tests) | M1 | PLANNED |
| M6 | Suite Execution & Publish TEST_READY | Full run & `TEST_READY.md` | M2, M3, M4, M5 | PLANNED |
