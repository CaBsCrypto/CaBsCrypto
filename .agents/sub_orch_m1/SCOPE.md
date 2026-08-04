# Scope: Milestone 1 (M1) — Design System & Layout Infrastructure

## Architecture & Responsibilities
- Deliverables:
  1. `index.html`: Semantic HTML shell containing Header, Dynamic Hero container, CLI Terminal container, Bento Grid container, Tech Matrix container, Footer, and Modal container.
  2. `css/styles.css`: CSS Design System with dark mode tokens (`#08090f`, cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66`), Google Fonts (`Space Grotesk`, `JetBrains Mono`, `Inter`), neo-glassmorphism styling, radial spotlight cursor effect, aurora animation, 2D cyber grid overlay, and responsive CSS breakpoints for Mobile, Tablet, and Desktop.
  3. `js/app.js`: Base JavaScript bootstrapping spotlight cursor tracking, canvas/CSS background grid, aurora background setup, and global `window.CabsCrypto` event bus.
- Write Ownership:
  - `index.html`
  - `css/styles.css`
  - `js/app.js`

## Feature Inventory for M1
| # | Feature | Description | File(s) | Source |
|---|---------|-------------|---------|--------|
| 1 | Dark Neo-Glassmorphic Theme | `#08090f` background, cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66` accents | `css/styles.css` | R1 |
| 2 | Typography & Font Stack | Google Fonts: Space Grotesk, JetBrains Mono, Inter | `index.html`, `css/styles.css` | R1 |
| 3 | Glassmorphic Styling & Spotlight Cursor | Backdrop blur, glowing neon borders, radial mouse spotlight following cursor | `css/styles.css`, `js/app.js` | R1 |
| 4 | Aurora & Cyber Grid Background | Subtle background aurora mesh and animated 2D cyber grid overlay | `css/styles.css`, `js/app.js` | R1 |
| 5 | Responsive Mobile/Tablet/Desktop Layout | Mobile (<768px), Tablet (768-1023px), Desktop (>=1024px) adaptive layouts | `css/styles.css`, `index.html` | R1 |
| 6 | Base HTML Semantic Structure | Header, Hero container, Terminal container, Bento container, Tech Matrix container, Footer, Modal container | `index.html` | R1 |
| 7 | Global Event Bus & Bootstrap | Window-level `CabsCrypto` object, event handlers, cursor listeners | `js/app.js` | R1 |

## Interface Contracts
- `window.CabsCrypto`: Global state & event bus emitter.
  - `CabsCrypto.openModal(projectId)`
  - `CabsCrypto.executeCommand(cmdString)`
  - `CabsCrypto.filterTechStack(category)`
  - `CabsCrypto.emit(event, data)`
  - `CabsCrypto.on(event, callback)`

## Status
- Milestone 1 Status: DONE (Gate 2 PASS: Reviewers APPROVE, Challengers APPROVE, Auditor CLEAN)
