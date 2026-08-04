## 2026-08-03T17:42:51-04:00
You are Worker 2 for Milestone 1 (M1: Design System & Layout Infrastructure) Remediation.
Your working directory is: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\worker_m1_gen2

MANDATORY INTEGRITY WARNING:
"DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work."

Mandate & Specific Remediation Instructions:
Read Reviewer 2 Handoff: c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\reviewer_m1_2\handoff.md

Remediate the following specific issues in `js/app.js` (and root `app.js`):
1. **Canvas Animation Loop Accumulation**:
   In `initParticleCanvas()` within `js/app.js` and `app.js`, update the `visibilitychange` listener:
   ```javascript
   document.addEventListener('visibilitychange', () => {
     if (document.hidden) {
       if (animationFrameId) {
         cancelAnimationFrame(animationFrameId);
         animationFrameId = null;
       }
     } else {
       if (!animationFrameId) {
         render();
       }
     }
   });
   ```
   Ensure that turning tab focus back and forth can NEVER spawn duplicate concurrent `requestAnimationFrame` loops.

2. **Canvas Context Transform Matrix Reset**:
   In `resizeCanvas()` within `js/app.js` and `app.js`, reset the canvas 2D transformation matrix before scaling:
   ```javascript
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
   ```
   This prevents transformation accumulation during window resize events.

3. **CSS Variables Compatibility**:
   In `css/styles.css` and `styles.css`, confirm `:root` has `--bg-primary: #08090f;` and `--bg-dark: #08090f;` (or `--bg-dark: var(--bg-primary);`) to satisfy both current specs and any test runner checks.

4. Verify all modified files, check JS syntax, and document your changes and verification tests in `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\worker_m1_gen2\handoff.md`.

5. Message sub-orchestrator when completed.
