# Handoff Report: `js/app.js` Architecture & Blueprint

**Agent**: Explorer 3 (M1: Design System & Layout Infrastructure)  
**Target File**: `js/app.js`  
**Working Directory**: `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m1_3\`  
**Date**: 2026-08-03  

---

## 1. Observation
1. **Workspace Files**:
   - `ORIGINAL_REQUEST.md`: Lines 13-17 require dark mode theme (`#08090f`, cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66`), Google Fonts, glassmorphic panels, radial spotlight cursor, and aurora/grid animations.
   - `.agents/orchestrator/PROJECT.md`: Lines 8-13 specify JavaScript layout separating core logic into `js/app.js`, `js/hero.js`, `js/terminal.js`, `js/bento.js`, `js/matrix.js`. Lines 40-45 define interface contracts (`window.CabsCrypto` event bus emitter with `openModal(projectId)`, `executeCommand(cmdString)`, `filterTechStack(category)`, `emit`, `on`).
   - `.agents/sub_orch_m1/SCOPE.md`: Lines 7, 21-31 specify `js/app.js` as the base JavaScript bootstrapping spotlight cursor tracking, canvas/CSS background grid, aurora setup, and global `window.CabsCrypto` event bus for M1.
   - Existing monolithic `app.js` at root: Contains all functions (`initParticleCanvas`, `initSpotlightEffect`, `initTypingEffect`, `initInteractiveTerminal`, `initProjectModals`, `initSmoothScroll`) bundled together without an event bus or module registry.
   - `index.html`: Contains `#bg-canvas` (line 21), `.cyber-grid-overlay` (line 22), `#navbar` (line 25), `.nav-links` (line 31), `.spotlight-card` (line 100), `#project-modal` (line 328), and `<script src="app.js"></script>` (line 337).

---

## 2. Logic Chain
1. *From Observation 1*: The project scope requires modularizing JavaScript so that `js/app.js` handles global infrastructure, visual effects, and navigation, while M2/M3 handle Hero, Terminal, Bento, and Matrix in separate files.
2. *From Observation 1*: The existing root `app.js` hardcodes terminal and project data directly into DOM event handlers without an event bus, leading to tight coupling and risk of race conditions when loading asynchronous modules.
3. *From Logic Steps 1 & 2*: A pub/sub event bus on `window.CabsCrypto` must be implemented in `js/app.js` with `on`, `off`, `emit`, `openModal`, `executeCommand`, `filterTechStack`, and `registerModule`.
4. *From Observation 1*: Performance for cursor tracking and canvas animation is critical for smooth frame rates. `js/app.js` must implement `requestAnimationFrame` throttling for mouse tracking, tab visibility detection (`visibilitychange` API) to pause canvas animation when hidden, and retina DPI handling (`window.devicePixelRatio`).
5. *From Observation 1 & Logic Step 3*: Modal dialog management requires handling ESC keys, backdrop clicks, and body scroll lock globally in `app.js` so sub-modules can trigger `CabsCrypto.openModal()` cleanly.

---

## 3. Caveats
- The blueprint assumes script tags in `index.html` will be updated during implementation to point to `js/app.js`, `js/hero.js`, `js/terminal.js`, `js/bento.js`, and `js/matrix.js`.
- If touch devices are used, radial spotlight cursor interactions switch to relative CSS fallback without throwing DOM exceptions.

---

## 4. Conclusion
A production-ready blueprint for `js/app.js` has been created and documented in `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m1_3\analysis.md`. The design fulfills all M1 requirements, establishes `window.CabsCrypto` PubSub event bus & interface contracts, tracks spotlight cursor coordinates, animates the cyber grid canvas with tab-visibility power savings, handles navigation and mobile menu toggles, controls modal popups, and provides sub-module lifecycle initialization hooks.

---

## 5. Verification Method
1. **File Inspection**:
   - Verify `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m1_3\analysis.md` exists and contains complete JS blueprint code.
2. **Console Verification (Post-Implementation)**:
   - Load `index.html` in browser.
   - Run `window.CabsCrypto.emit('test', { ok: true })` in browser developer console.
   - Run `CabsCrypto.openModal('bot')` -> verify modal opens and ESC key closes it.
   - Move mouse over spotlight cards -> verify `--card-mouse-x` and `--card-mouse-y` update in CSS properties.
