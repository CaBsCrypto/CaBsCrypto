# Project: CabsCrypto Cyber-Futuristic Portfolio Landing Page (Gen 2 Orchestration)

## Architecture
- Modern modular Web application (Vanilla HTML5 / CSS3 / ES6+ JavaScript, zero external framework overhead).
- Code Layout:
  - `index.html` — Semantic HTML structure with glassmorphic sections, terminal container, bento grid, matrix tab container
  - `css/styles.css` — CSS variables (`#08090f`, `#00f3ff`, `#ff007a`, `#00ff66`), glassmorphism, animations, spotlight, responsive breakpoints
  - `js/app.js` — Core application bootstrap, global state bus (`window.CabsCrypto`), spotlight cursor, aurora & grid canvas
  - `js/hero.js` — Dynamic Hero headline, gradient text, typewriter effect engine (with re-entrancy & bounds safety)
  - `js/terminal.js` — Interactive CLI terminal engine, commands (`help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix`, `whoami`), command history, auto-scroll, XSS escaping
  - `js/bento.js` — Bento Grid layout rendering, project catalog, hover states, filter tags, project detail modal manager with project ID aliases
  - `js/matrix.js` — Tech Stack Matrix renderer, proficiency progress bars, 4 domain tabs (Web3, Frontend, Backend, DevOps), 2D Matrix Digital Rain canvas with window resize handler
  - `server.js` — Lightweight local HTTP static server for local hosting & E2E verification on port 3000
  - `test/harness.js` — DOM/VM test environment loading actual source files
  - `test/run_e2e_tests.js` — E2E test runner (34 test suites, 163 test cases, 100% pass)
  - `test/tier1_feature_coverage.test.js` — Tier 1 Feature Coverage tests
  - `test/tier2_boundary_corner.test.js` — Tier 2 Boundary & Corner tests
  - `test/tier3_cross_feature.test.js` — Tier 3 Cross-feature tests
  - `test/tier4_real_world.test.js` — Tier 4 Real-world user scenario tests

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Dark Neo-Glassmorphic Theme | `#08090f` background, cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66` accents | M1 | R1 | VERIFIED |
| 2 | Typography & Font Stack | Google Fonts: Space Grotesk, JetBrains Mono, Inter | M1 | R1 | VERIFIED |
| 3 | Glassmorphic Styling & Spotlight Cursor | Backdrop blur, glowing neon borders, radial mouse spotlight following cursor | M1 | R1 | VERIFIED |
| 4 | Aurora & Cyber Grid Background | Subtle background aurora mesh and animated 2D cyber grid overlay | M1 | R1 | VERIFIED |
| 5 | Responsive Mobile/Tablet/Desktop Layout | Mobile (<768px), Tablet (768-1023px), Desktop (>=1024px) adaptive layouts | M1 | R1 | VERIFIED |
| 6 | Dynamic Hero Headline | Gradient text animation and typewriter effect for hero section | M2 | R2 | VERIFIED |
| 7 | Interactive CLI Terminal | Embedded CLI terminal with input prompt, history, auto-scroll | M2 | R2 | VERIFIED |
| 8 | Terminal Commands Execution | Execution of `help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix`, `whoami` | M2 | R2 | VERIFIED |
| 9 | Matrix Digital Rain Mode | Visual matrix effect triggerable via `matrix` command or button | M2 | R2 | VERIFIED |
| 10 | Bento Grid Projects Showcase | 12-col Bento box layout for Web3/Crypto/Dev projects with hover states & tags | M3 | R3 | VERIFIED |
| 11 | Project Detail View Modal | Rich modal view with backdrop blur, project details, tech stack, and links | M3 | R3 | VERIFIED |
| 12 | Tech Stack Matrix | 4 domain skill categories (Web3, Frontend, Backend, DevOps) with neon progress bars & tabs | M3 | R3 | VERIFIED |
| 13 | Local HTTP Server & Verification | Serve via HTTP server on localhost, zero asset load errors, pass 100% E2E test suite | M4 | R4 | VERIFIED |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design System & Layout | Theme tokens, typography, glassmorphism, spotlight cursor, aurora grid, responsive shell (`index.html`, `css/styles.css`, `js/app.js`) | none | DONE |
| M2 | Hero & Interactive CLI Terminal | Dynamic typing hero, CLI terminal engine, commands (`help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix`) (`js/hero.js`, `js/terminal.js`) | M1 | DONE |
| M3 | Bento Grid & Tech Matrix | Bento showcase, detail modal, tech stack matrix with progress bars & filter tabs (`js/bento.js`, `js/matrix.js`) | M1 | DONE |
| M4 | Test Suite Remediation, Server & E2E Integration | Fix test harness/suites to test real code without mocks, create `server.js`, 100% test pass, launch HTTP server | M1, M2, M3 | DONE |

## Interface Contracts
### `app.js` ↔ `terminal.js` / `bento.js` / `matrix.js`
- `window.CabsCrypto`: Global state & event bus emitter.
- `CabsCrypto.openModal(projectId)`: Opens project detail modal.
- `CabsCrypto.executeCommand(cmdString)`: Runs CLI command from external triggers or terminal input.
- `CabsCrypto.filterTechStack(category)`: Filters tech stack matrix by domain.
