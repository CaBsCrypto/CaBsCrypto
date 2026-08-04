# Review & Handoff Report — E2E Test Suite (CabsCrypto)

**Date**: 2026-08-03
**Subagent**: Reviewer (`reviewer_1`)
**Working Directory**: `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\reviewer_1`
**Verdict**: **REQUEST_CHANGES**

---

## 1. Executive Summary & Verdict

- **Explicit Verdict**: **REQUEST_CHANGES**
- **Primary Rationale**: A fatal `ReferenceError` exists in `test/harness.js` (line 873) where `customSandbox` is referenced instead of `options`. Any execution of VM-based tests (`runInVMContext`) will crash at runtime with `ReferenceError: customSandbox is not defined`. Additionally, Tier 1 (Feature 13), Tier 3 (Test 9), and Tier 4 (Scenarios 6 & 7) utilize inline HTTP server fallbacks rather than directly testing `server.js`.

---

## 2. Review Findings

### 🔴 [Critical] Finding 1: Fatal Runtime ReferenceError in `test/harness.js` (`customSandbox is not defined`)
- **What**: Function `createVMContext` accepts parameter `options = {}` (line 765), but attempts to spread `...customSandbox` on line 873.
- **Where**: `test/harness.js`, line 765 and line 873:
  ```javascript
  // Line 765:
  function createVMContext(options = {}) {
    ...
    // Line 873:
    ...customSandbox // BUG: customSandbox is not defined in this scope!
  ```
- **Why this is a problem**: When `runInVMContext` calls `createVMContext(customSandbox)` (line 892), JavaScript tries to evaluate `...customSandbox` inside `createVMContext`. Because the parameter is named `options`, `customSandbox` is undefined in scope, causing a fatal `ReferenceError: customSandbox is not defined`. This crashes every VM-based test across Tiers 1, 2, 3, and 4.
- **Suggested Fix**: Update `createVMContext` parameter signature to `function createVMContext(customSandbox = {})` or change line 873 to `...options`.

---

### 🟡 [Major] Finding 2: Feature 13 Server Verification Bypasses Application `server.js` via Inline Fallbacks
- **What**: Tests for Feature 13 (Local HTTP Server) in `tier1_feature_coverage.test.js` (tests 13.1–13.5), `tier3_cross_feature.test.js` (test 9), and `tier4_real_world.test.js` (Scenarios 6 & 7) create inline ad-hoc HTTP servers or fall back to reading `PROJECT.md` if `server.js` does not exist on disk.
- **Where**:
  - `test/tier1_feature_coverage.test.js`, lines 650–700 (`if (fileExists('server.js')) ... else ...`)
  - `test/tier3_cross_feature.test.js`, line 371 (`server = http.createServer(...)`)
  - `test/tier4_real_world.test.js`, lines 488 & 599 (`server = http.createServer(...)`)
- **Why this is a problem**: E2E testing for Feature 13 should perform opaque-box HTTP requests against the actual `server.js` implementation rather than spinning up synthetic mock servers inside the test file itself.
- **Suggested Fix**: Update Feature 13 server tests to spawn `node server.js` as a background process or load `server.js` directly, ensuring the real production server code is executed and verified.

---

## 3. Verified Claims & Requirements Audit

| Requirement / Metric | Target Threshold | Actual Found | Status | Notes |
|----------------------|------------------|--------------|--------|-------|
| **Standard Lib Compliance** | 0 external npm pkgs | 0 external pkgs | **PASS** | Uses Node.js built-ins (`fs`, `path`, `http`, `https`, `url`, `vm`, `assert`) exclusively. |
| **13 Features Covered** | Features 1–13 | All 13 mapped | **PASS** | Mapped in matrix across Tiers 1-4 in `TEST_INFRA.md`. |
| **Tier 1 Test Count** | ≥65 tests | 65 tests | **PASS** | 13 describe blocks x 5 tests per feature. |
| **Tier 2 Test Count** | ≥65 tests | 65 tests | **PASS** | 13 describe blocks x 5 boundary tests per feature. |
| **Tier 3 Test Count** | ≥13 tests | 13 tests | **PASS** | Pairwise cross-feature integration test suite. |
| **Tier 4 Scenarios** | ≥7 scenarios | 7 scenarios (17 tests) | **PASS** | Real-world application workload flows. |
| **Total Test Cases** | ≥150 tests | 160 tests | **PASS** | Exceeds minimum volume requirements. |
| **Runtime Execution** | 0 failures / 100% pass | Crashing | **FAIL** | Blocked by `ReferenceError` in `test/harness.js`. |

---

## 4. Observation

1. **`test/harness.js` Line 765 & Line 873**:
   - `function createVMContext(options = {})`
   - Line 873: `...customSandbox`
   - `customSandbox` is not declared anywhere inside `createVMContext`.

2. **`test/harness.js` Line 883 & Line 892**:
   - `function runInVMContext(filePathOrCode, customSandbox = {})`
   - Line 892: `const sandbox = createVMContext(customSandbox);`

3. **`test/run_e2e_tests.js` Entry Point**:
   - Discovers `*.test.js` files in `test/` directory and executes them via Node.js runtime.

4. **Dependencies**:
   - `package.json` does not exist; no `node_modules` present. All requires use built-in Node.js modules or relative paths (`./harness.js`).

---

## 5. Logic Chain

1. **Observation 1 & 2**: `runInVMContext` calls `createVMContext(customSandbox)`. Parameter name in `createVMContext` is `options`. Line 873 attempts to spread `...customSandbox`.
2. **Logic Step 1**: In JavaScript strict/non-strict mode, referencing an undeclared variable (`customSandbox`) inside function execution throws `ReferenceError: customSandbox is not defined`.
3. **Logic Step 2**: All tests in Tier 1 (3.4, 3.5, 4.4, 6.5, 7.5, 8.1, 8.4, 8.5, 9.4, 9.5, 10.5, 11.3, 11.4, 11.5, 12.4, 12.5), Tier 2 (1.5, 2.5, 3.1, 3.4, 4.1, 4.2, 4.5, 5.4, 6.5, 7.5, 8.5, 9.5, 10.3, 11.1, 11.2, 11.4, 11.5, 12.2), Tier 3 (Tests 1–8, 10, 13), and Tier 4 (Scenarios 1–5, 7) invoke `runInVMContext`.
4. **Conclusion Step**: Therefore, running `node test/run_e2e_tests.js` will fail immediately with `ReferenceError`. The work product cannot be approved until this bug is fixed.

---

## 6. Caveats

- Command execution via terminal tool (`node test/run_e2e_tests.js`) was restricted by security prompt timeout during reviewer run, so static code analysis and AST/scope tracing were performed to discover and confirm the runtime error.

---

## 7. Verification Method

To independently verify the bug and the resolution after fixes are applied:

1. **Inspect `test/harness.js`**:
   View lines 765 to 875 of `test/harness.js` to observe the variable mismatch (`options` vs `customSandbox`).
2. **Execute Test Suite**:
   Run the following terminal command from the project root:
   ```bash
   node test/run_e2e_tests.js
   ```
3. **Invalidation Conditions**:
   - If `node test/run_e2e_tests.js` exits with code `1` and prints `ReferenceError: customSandbox is not defined`, the verdict **REQUEST_CHANGES** is confirmed.
   - If line 873 of `test/harness.js` is corrected to `...options` (or parameter renamed to `customSandbox`), and all 160 test cases pass with exit code `0`, the test suite is ready for approval.
