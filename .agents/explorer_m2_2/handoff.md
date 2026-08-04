# Handoff Report: Hero Section Specification (`js/hero.js`)

## 1. Observation
- **Original & Project Specs**:
  - `ORIGINAL_REQUEST.md` (R2): "Dynamic Hero section with animated gradient headlines and typing effect."
  - `PROJECT.md` (Feature 6): "Dynamic Hero Headline: Gradient text animation and typewriter effect for hero section (`js/hero.js`)."
  - `sub_orch_m2/SCOPE.md`: "`js/hero.js`: Dynamic Hero headline with cycling typewriter engine, animated gradient text, and CTA buttons linking to sections/terminal."
- **Existing Files & Implementation**:
  - `index.html` (lines 53-75): Hero container `#hero-container` contains `#typing-text` with class `.gradient-text`, subtitle, `#btn-explore-projects`, `#btn-open-terminal`, and `#hero-status`.
  - `css/styles.css` (lines 180-185, 424-528): `.gradient-text` defines CSS gradient clip; `.hero`, `.hero-title`, `.btn-primary`, `.btn-secondary` provide dark neo-glassmorphism visuals.
  - `js/app.js` (lines 136-152, 448-474): Exposes `CabsCrypto.registerModule('hero', initFn)` which executes modules on DOM ready.
  - `js/hero.js` (lines 1-17): Currently a stub placeholder calling `window.CabsCrypto.registerModule('hero', initHeroModule)`.
- **E2E Test Infrastructure**:
  - `test/tier1_feature_coverage.test.js` (lines 292-328): Asserts `#hero-container` and `#typing-text` exist, `js/hero.js` registers `'hero'` module, and script runs in VM context.
  - `test/tier3_cross_feature.test.js` & `test/tier4_real_world.test.js`: Assert script load order, CabsCrypto state bus integrity, and static asset HTTP GET 200 OK.

## 2. Logic Chain
1. **Requirement Analysis**:
   - The user request and project documentation require `js/hero.js` to implement an asynchronous typing engine that cycles through multiple title phrases inside `#typing-text`.
   - The headline requires an animated neon gradient text effect using existing CSS variables (`--cyan`, `--magenta`, `--purple`) and background-clip attributes.
   - The CTA buttons (`#btn-explore-projects` and `#btn-open-terminal`) require smooth scrolling and, in the case of terminal, auto-focusing the interactive terminal input (`#terminal-input`).
2. **Architecture & Module Contract**:
   - `js/hero.js` must interface cleanly with `window.CabsCrypto` via the `registerModule('hero', ...)` pattern established by M1 in `js/app.js`.
   - A dedicated `TypewriterEngine` class handles the state machine (`TYPING` -> `PAUSED_FULL` -> `ERASING` -> `PAUSED_EMPTY`) with configurable typing (`70ms`), erasing (`35ms`), full pause (`2200ms`), and empty pause (`450ms`) durations.
   - A visual blinking cursor element `<span class="typewriter-cursor">|</span>` with `aria-hidden="true"` ensures accessibility while providing a cyber-terminal visual affordance.
   - `document.visibilitychange` listener ensures typewriter animation pauses when browser tab is backgrounded and resumes seamlessly when active, protecting system resources.
   - The public interface (`CabsCrypto.hero`) provides `start()`, `stop()`, `setTitles()`, and handles CTA button routing.

## 3. Caveats
- **DOM Dependencies**: `js/hero.js` depends on `#typing-text`, `#btn-explore-projects`, `#btn-open-terminal`, `#terminal-container`, and `#terminal-input` existing in `index.html`. Guard clauses (`if (!typingEl) return;`) are included to ensure safe execution if elements are absent in unit/VM tests.
- **Header Offset**: Smooth scrolling must calculate `#navbar` height dynamically (`navbar ? navbar.offsetHeight : 70`) so section headers are not hidden underneath the floating navigation bar.
- **Focus Delay**: Terminal focus requires a slight timeout (`setTimeout(..., 300)`) to allow smooth scrolling to complete before triggering keyboard focus on `#terminal-input`.

## 4. Conclusion
- Requirements and complete design specifications for `js/hero.js` have been fully investigated and documented in `hero_design_spec.md`.
- `js/hero.js` will export a clean, robust, zero-dependency ES6 module registering under `CabsCrypto.hero`.
- The design strictly preserves test compatibility, accessibility standards, state machine integrity, and seamless integration with `js/app.js` and `js/terminal.js`.

## 5. Verification Method
1. **Specification Inspection**:
   - Inspect `.agents/explorer_m2_2/hero_design_spec.md` for complete code layout, configuration schema, and class design.
2. **E2E Test Execution**:
   - Execute project test suite: `node test/run_e2e_tests.js`.
   - Confirm all tests pass (specifically Feature 6 in `tier1_feature_coverage.test.js`, module order in `tier3_cross_feature.test.js`, and Scenario 1 in `tier4_real_world.test.js`).
3. **Interactive Visual Verification**:
   - Serve application via `server.js` or static web server.
   - Verify typewriter phrase cycling in hero section header.
   - Click "Explore Projects" CTA -> verify smooth scroll to `#bento-container`.
   - Click "Open Terminal" CTA -> verify smooth scroll to `#terminal-container` and immediate focus on `#terminal-input`.
