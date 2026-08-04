# Project: CabsCrypto Cyber-Futuristic Portfolio Landing Page

## Architecture
- Architecture type: Modern modular Web application (Vanilla HTML5 / CSS3 / ES6+ JavaScript, zero external framework overhead for ultra-fast performance).
- Code Layout:
  - `index.html` — Semantic HTML structure with glassmorphic sections
  - `css/styles.css` — CSS variables, cyber themes, glassmorphism, animations, responsive breakpoints
  - `js/app.js` — Core application bootstrap, cursor spotlight, aurora background, grid canvas
  - `js/hero.js` — Dynamic Hero headline, gradient text, typing effect engine
  - `js/terminal.js` — Interactive CLI terminal engine, commands (`help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix`), command history, autocomplete
  - `js/bento.js` — Bento Grid layout rendering, project catalog, filtering, detail modal manager
  - `js/matrix.js` — Tech Stack Matrix renderer, proficiency progress bars, category tabs
  - `server.js` — Lightweight local HTTP static server for local hosting & E2E verification

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Dark Neo-Glassmorphic Theme | `#08090f` background, cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66` accents | M1 | R1 |
| 2 | Typography & Font Stack | Google Fonts: Space Grotesk, JetBrains Mono, Inter | M1 | R1 |
| 3 | Glassmorphic Styling & Spotlight Cursor | Backdrop blur, glowing neon borders, radial mouse spotlight following cursor | M1 | R1 |
| 4 | Aurora & Cyber Grid Background | Subtle background aurora mesh and animated 2D cyber grid overlay | M1 | R1 |
| 5 | Responsive Mobile/Tablet/Desktop Layout | Mobile (<768px), Tablet (768-1023px), Desktop (>=1024px) adaptive layouts | M1 | R1 |
| 6 | Dynamic Hero Headline | Gradient text animation and typewriter effect for hero section | M2 | R2 |
| 7 | Interactive CLI Terminal | Embedded CLI terminal with input prompt, history, and auto-scroll | M2 | R2 |
| 8 | Terminal Commands Execution | Execution of `help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix` | M2 | R2 |
| 9 | Matrix Digital Rain Mode | Visual matrix effect triggerable via `matrix` command or button | M2 | R2 |
| 10 | Bento Grid Projects Showcase | 12-col Bento box layout for Web3/Crypto/Dev projects with hover states & tags | M3 | R3 |
| 11 | Project Detail View Modal | Rich modal view with backdrop blur, project details, tech stack, and links | M3 | R3 |
| 12 | Tech Stack Matrix | 4 domain skill categories (Web3, Frontend, Backend, DevOps) with neon progress bars & tabs | M3 | R3 |
| 13 | Local HTTP Server & Verification | Serve via HTTP server on localhost, zero asset load errors, pass full E2E test suite | M4 | R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design System & Layout | Theme tokens, typography, glassmorphism, spotlight cursor, aurora grid, responsive shell (`index.html`, `css/styles.css`, `js/app.js`) | none | DONE |
| M2 | Hero & Interactive CLI Terminal | Dynamic typing hero, CLI terminal engine, terminal commands implementation (`js/hero.js`, `js/terminal.js`) | M1 | IN_PROGRESS |
| M3 | Bento Grid & Tech Matrix | Bento showcase, detail modal, tech stack matrix with progress bars & filter tabs (`js/bento.js`, `js/matrix.js`) | M1 | IN_PROGRESS |
| M4 | Server Hosting & E2E Integration | HTTP server, E2E test execution, 100% test pass verification, adversarial hardening (`server.js`, tests) | M1, M2, M3 | PLANNED |

## Interface Contracts
### `app.js` ↔ `terminal.js` / `bento.js` / `matrix.js`
- `window.CabsCrypto`: Global state & event bus emitter.
- `CabsCrypto.openModal(projectId)`: Opens project detail modal.
- `CabsCrypto.executeCommand(cmdString)`: Runs CLI command from external triggers or terminal input.
- `CabsCrypto.filterTechStack(category)`: Filters tech stack matrix by domain.

## Code Layout
Root directory: `c:\Users\MGC\Documents\antigravity\goofy-salk\`
- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/hero.js`
- `js/terminal.js`
- `js/bento.js`
- `js/matrix.js`
- `server.js`
