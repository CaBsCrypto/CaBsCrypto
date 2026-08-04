/* ==========================================================================
   CabsCrypto E2E Test Suite Runner Entry Point
   Standard Node.js Library Only (fs, path, process)
   ========================================================================== */

const path = require('path');
const fs = require('fs');
const harness = require('./harness.js');

async function runE2ETests() {
  console.log('\n=======================================================');
  console.log(' CabsCrypto Cyber-Futuristic Portfolio E2E Test Suite');
  console.log('=======================================================\n');

  const testDir = __dirname;
  const testFiles = [];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.test.js')) {
        testFiles.push(fullPath);
      }
    }
  }

  scanDir(testDir);

  if (testFiles.length === 0) {
    console.log('⚠️ No test files (*.test.js) found in test/ directory.\n');
    console.log('Test harness loaded successfully (0 tests executed).\n');
    process.exit(0);
  }

  console.log(`Discovered ${testFiles.length} test suite file(s):\n${testFiles.map(f => ' - ' + path.relative(testDir, f)).join('\n')}\n`);

  harness.clearRegisteredSuites();

  for (const file of testFiles) {
    try {
      require(file);
    } catch (err) {
      console.error(`❌ Failed to load test file: ${path.basename(file)}`);
      console.error(err);
      process.exit(1);
    }
  }

  const suites = harness.getRegisteredSuites();
  let totalSuites = suites.length;
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  const overallStartTime = Date.now();

  for (const suite of suites) {
    console.log(`📦 Suite: ${suite.name}`);
    const suiteStartTime = Date.now();
    let suitePassed = true;

    // Run beforeAll hooks
    for (const hook of suite.beforeAll) {
      try {
        await hook();
      } catch (err) {
        console.error(`  ❌ beforeAll hook failed in suite "${suite.name}":`, err.message);
      }
    }

    for (const t of suite.tests) {
      totalTests++;
      const testStartTime = Date.now();

      // Run beforeEach hooks
      for (const hook of suite.beforeEach) {
        try {
          await hook();
        } catch (err) {
          console.error(`  ❌ beforeEach hook failed for "${t.name}":`, err.message);
        }
      }

      try {
        await t.fn();
        const duration = Date.now() - testStartTime;
        passedTests++;
        console.log(`  ✓ ${t.name} (${duration}ms)`);
      } catch (err) {
        const duration = Date.now() - testStartTime;
        failedTests++;
        suitePassed = false;
        console.log(`  ✗ ${t.name} (${duration}ms)`);
        console.log(`    Error: ${err.message}`);
        if (err.stack) {
          const lines = err.stack.split('\n');
          if (lines[1]) {
            console.log(`    At: ${lines[1].trim()}`);
          }
        }
      }

      // Run afterEach hooks
      for (const hook of suite.afterEach) {
        try {
          await hook();
        } catch (err) {
          console.error(`  ❌ afterEach hook failed for "${t.name}":`, err.message);
        }
      }
    }

    // Run afterAll hooks
    for (const hook of suite.afterAll) {
      try {
        await hook();
      } catch (err) {
        console.error(`  ❌ afterAll hook failed in suite "${suite.name}":`, err.message);
      }
    }

    const suiteDuration = Date.now() - suiteStartTime;
    console.log(`  Summary: ${suite.tests.length} tests completed in ${suiteDuration}ms\n`);
  }

  const totalDuration = Date.now() - overallStartTime;

  console.log('=======================================================');
  console.log(' E2E Test Execution Summary');
  console.log('=======================================================');
  console.log(` Total Test Suites : ${totalSuites}`);
  console.log(` Total Test Cases  : ${totalTests}`);
  console.log(` Passed            : ${passedTests}`);
  console.log(` Failed            : ${failedTests}`);
  console.log(` Total Duration    : ${totalDuration} ms`);
  console.log('=======================================================\n');

  if (failedTests > 0) {
    console.error(`❌ TEST SUITE FAILED: ${failedTests} test(s) failed.\n`);
    process.exit(1);
  } else {
    console.log(`✅ TEST SUITE PASSED: All ${passedTests} test(s) passed successfully.\n`);
    process.exit(0);
  }
}

runE2ETests().catch(err => {
  console.error('Unhandled runner exception:', err);
  process.exit(1);
});
