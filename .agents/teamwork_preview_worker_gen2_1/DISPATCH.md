## 2026-08-03T22:14:00Z
You are teamwork_preview_worker_gen2_1. Your working directory is `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\teamwork_preview_worker_gen2_1`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Context & Reference Documents:
- User Request: `c:\Users\MGC\Documents\antigravity\goofy-salk\ORIGINAL_REQUEST.md`
- Project Index: `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\orchestrator_gen2\PROJECT.md`
- Audit Findings: `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\teamwork_preview_explorer_gen2_1\analysis.md`
- Audit Handoff: `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\teamwork_preview_explorer_gen2_1\handoff.md`

Your Tasks:

1. **Fix `test/harness.js`**:
   - On line 873, fix ReferenceError: change `...customSandbox` to `...(options.customSandbox || options)`.
   - Ensure mock DOM element helper methods (`scrollIntoView`, `getBoundingClientRect`, `focus`, `blur`, `addEventListener`, `removeEventListener`, `setAttribute`, `getAttribute`, `classList`, `style`, `appendChild`, `querySelector`, `querySelectorAll`) are present and robust.

2. **Remediate & Complete Application Source Code**:
   - `js/terminal.js`:
     - Implement all 8 required commands: `help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix`. Ensure `crypto` command displays crypto portfolio, network stats, or Web3 details.
     - Subscribe to `CabsCrypto.on('terminal:execute', (cmd) => executeCommand(cmd))` so global events trigger terminal commands.
     - Implement Up/Down arrow key command history navigation.
   - `js/bento.js`:
     - Subscribe to `CabsCrypto.on('modal:open', (id) => openModal(id))` so programmatic event calls open modal view.
     - Add project ID alias mapping (`bot` -> `agente`, `aegis` -> `trustleaf`, `cli` -> `gitlyzer`) so test suite project ID lookups resolve properly.
     - Ensure modal open/close updates DOM elements and CSS classes (`active`, `show`) properly.
   - `js/matrix.js`:
     - Implement Tech Stack Matrix domain category filtering (`all`, `web3`, `frontend`, `backend`, `devops`).
     - Subscribe to `CabsCrypto.on('matrix:filter', (cat) => filterTechStack(cat))`.
     - Add event listeners to `.matrix-tab` buttons to filter matrix items & update active tab class.
     - Implement 2D Matrix Digital Rain canvas animation overlay toggle (`startMatrixRain`, `stopMatrixRain`).
   - `js/app.js`, `index.html`, `css/styles.css`: Ensure full visual alignment with R1 (dark mode `#08090f`, cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66`, spotlight cursor, glassmorphic panels, responsive grid).

3. **Build `server.js`**:
   - Create `c:\Users\MGC\Documents\antigravity\goofy-salk\server.js` using standard Node.js modules (`http`, `fs`, `path`).
   - Handle static file serving for `index.html`, `css/styles.css`, `js/*.js`, assets.
   - Set correct Content-Type headers based on file extensions (`.html`, `.css`, `.js`, `.json`, `.png`, `.svg`, `.ico`).
   - Include path traversal security (sanitize URL paths, reject paths escaping root).
   - Return appropriate status codes: 200 OK, 404 Not Found, 405 Method Not Allowed, 500 Internal Server Error.
   - Export server instance / start HTTP server on port 3000 (or `process.env.PORT` or default fallback).

4. **Refactor E2E Test Suites**:
   - `test/tier1_feature_coverage.test.js`: Remove `assertTrue(true)` and test real application code and DOM features.
   - `test/tier2_boundary_corner.test.js`: Remove ALL inline mock functions (`hexToHsl`, `simulateTypewriter`, `CommandHistory`, `MatrixEngine`, etc.) and inline mock classes. Load and test actual functions from `js/app.js`, `js/hero.js`, `js/terminal.js`, `js/bento.js`, `js/matrix.js`, `server.js` via `runInVMContext`.
   - `test/tier3_cross_feature.test.js`: Fix CSS path (`styles.css` -> `css/styles.css`). Replace inline `http.createServer` mocks with actual `server.js` execution.
   - `test/tier4_real_world.test.js`: Fix CSS path (`styles.css` -> `css/styles.css`). Replace `assertTrue(true)` and inline server mocks with real functional assertions against `server.js` and application JS modules.

5. **Run & Verify E2E Tests**:
   - Run command: `node test/run_e2e_tests.js`
   - Verify 100% test pass rate with zero ReferenceErrors and zero assertion failures.
   - Publish `TEST_READY.md` at root with test suite summary and invocation instructions.

6. **Deliver Handoff**:
   - Write your completion details and build/test outputs to `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\teamwork_preview_worker_gen2_1\handoff.md`.
   - Send a message to the orchestrator with the verification results and file path.
