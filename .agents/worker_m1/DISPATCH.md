## 2026-08-03T21:37:35Z
<USER_REQUEST>
You are Worker 1 for Milestone 1 (M1: Design System & Layout Infrastructure).
Your working directory is: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\worker_m1

MANDATORY INTEGRITY WARNING:
"DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work."

Mandate & Implementation Instructions:
1. Read the following specification and blueprint files:
   - ORIGINAL_REQUEST.md: c:\Users\MGC\Documents\antigravity\goofy-salk\ORIGINAL_REQUEST.md
   - PROJECT.md: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\orchestrator\PROJECT.md
   - SCOPE.md: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\sub_orch_m1\SCOPE.md
   - HTML Blueprint: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m1_1\analysis.md
   - CSS Blueprint: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m1_2\analysis.md
   - JS Blueprint: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m1_3\analysis.md

2. Write ownership & Deliverables:
   a. Write `index.html` (c:\Users\MGC\Documents\antigravity\goofy-salk\index.html):
      - Title: "CabsCrypto | Cyber-Futuristic Portfolio"
      - Google Fonts: Space Grotesk, JetBrains Mono, Inter
      - Semantic structure: Header (`nav`), `#hero-container`, `#terminal-container`, `#bento-container`, `#matrix-container`, `footer`, `#modal-container`.
      - Links to `css/styles.css` and `js/app.js` (plus modular scripts `js/hero.js`, `js/terminal.js`, `js/bento.js`, `js/matrix.js`).
      - Structural placeholders for M2 (`#typing-text`, `#terminal-input`) and M3 (`.modal-trigger`, `#matrix-tabs`).
   b. Write `css/styles.css` (c:\Users\MGC\Documents\antigravity\goofy-salk\css\styles.css):
      - Create `css/` directory if missing.
      - CSS `:root` variables: `--bg-primary: #08090f`, `--cyan: #00f3ff`, `--magenta: #ff007a`, `--lime: #00ff66`, fonts, glassmorphic blurs and shadows.
      - Glassmorphism utility classes (`.glass-panel`, `.glass-card`, `.neon-border`, `.glow-effect`).
      - Cyber grid overlay (`#cyber-grid` / `.cyber-grid-overlay`) and aurora animation keyframes (`#aurora-bg`, `@keyframes aurora`).
      - Radial spotlight cursor tracking layer (`#spotlight-cursor`).
      - Responsive media queries for Mobile (<768px), Tablet (768px-1023px), and Desktop (>=1024px).
      - Layout styles for Header, Hero, Terminal, Bento Grid, Tech Matrix, Footer, and Modal overlay.
      - Also ensure root `styles.css` is updated or forwards to `css/styles.css` if referenced.
   c. Write `js/app.js` (c:\Users\MGC\Documents\antigravity\goofy-salk\js\app.js):
      - Create `js/` directory if missing.
      - Global PubSub Event Bus `window.CabsCrypto` (`on`, `emit`, `openModal`, `executeCommand`, `filterTechStack`, `registerModule`).
      - Radial spotlight cursor tracking mouse movement listener updating `--mouse-x`, `--mouse-y`, `--card-mouse-x`, `--card-mouse-y`.
      - Cyber particle canvas animation background with retina DPI scaling and `visibilitychange` tab-pausing.
      - Navigation smooth scrolling, scroll-spy link highlight, and mobile menu toggle.
      - Centralized Modal Overlay manager (ESC key, backdrop click, body scroll lock).
      - Also ensure root `app.js` is updated or forwards to `js/app.js`.
   d. Write stub modules `js/hero.js`, `js/terminal.js`, `js/bento.js`, `js/matrix.js`:
      - Basic JS stubs that safely hook into `window.CabsCrypto` to avoid 404 console errors.

3. Verify implementation:
   - Check file existence, HTML validation, CSS syntax, JS syntax.
   - Run any available node/browser verification or static checks.
   - Document commands, implementation details, and verification results in `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\worker_m1\handoff.md`.

4. Notify sub-orchestrator when completed.
</USER_REQUEST>
