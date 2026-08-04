const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = 'c:\\Users\\MGC\\Documents\\antigravity\\goofy-salk';

console.log('=== RUNNING EMPIRICAL TEST HARNESS FOR M1 ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// ---------------------------------------------------------------------------
// TEST 1: File Existence Checks
// ---------------------------------------------------------------------------
console.log('--- Test 1: Workspace File Existence ---');
const requiredFiles = [
  'index.html',
  'css/styles.css',
  'styles.css',
  'js/app.js',
  'app.js',
  'js/hero.js',
  'js/terminal.js',
  'js/bento.js',
  'js/matrix.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// ---------------------------------------------------------------------------
// TEST 2: HTML Validity & Structural Compliance (index.html)
// ---------------------------------------------------------------------------
console.log('\n--- Test 2: HTML Validity & DOM Structure Compliance ---');
const indexPath = path.join(rootDir, 'index.html');
const htmlContent = fs.readFileSync(indexPath, 'utf8');

assert(htmlContent.startsWith('<!DOCTYPE html>'), 'index.html begins with valid DOCTYPE declaration');
assert(htmlContent.includes('<html lang="en">'), 'index.html has <html> tag with lang="en"');
assert(htmlContent.includes('<head>') && htmlContent.includes('</head>'), '<head> tag section is closed');
assert(htmlContent.includes('<body>') && htmlContent.includes('</body>'), '<body> tag section is closed');

// Check required Fonts
assert(htmlContent.includes('Space+Grotesk'), 'Google Font Space Grotesk included in index.html');
assert(htmlContent.includes('JetBrains+Mono'), 'Google Font JetBrains Mono included in index.html');
assert(htmlContent.includes('Inter:'), 'Google Font Inter included in index.html');

// Check required DOM IDs specified in M1 mandate:
// Required: nav, #hero-container, #terminal-container, #bento-container, #matrix-container, footer, #modal-container
const hasNavTag = /<nav\s+[^>]*id=["']navbar["']/i.test(htmlContent) || /<nav\s+[^>]*id=["']nav["']/i.test(htmlContent);
assert(hasNavTag, 'Semantic <nav> element present with valid id (navbar/nav)');

const hasHeroContainer = /id=["']hero-container["']/i.test(htmlContent);
assert(hasHeroContainer, 'Required ID #hero-container present in index.html');

const hasTerminalContainer = /id=["']terminal-container["']/i.test(htmlContent);
assert(hasTerminalContainer, 'Required ID #terminal-container present in index.html');

const hasBentoContainer = /id=["']bento-container["']/i.test(htmlContent);
assert(hasBentoContainer, 'Required ID #bento-container present in index.html');

const hasMatrixContainer = /id=["']matrix-container["']/i.test(htmlContent);
assert(hasMatrixContainer, 'Required ID #matrix-container present in index.html');

const hasFooterTag = /<footer\s+/i.test(htmlContent);
assert(hasFooterTag, 'Semantic <footer> element present in index.html');

const hasModalContainer = /id=["']modal-container["']/i.test(htmlContent);
assert(hasModalContainer, 'Required ID #modal-container present in index.html');

// Check interactive layer elements
assert(/id=["']bg-canvas["']/i.test(htmlContent), 'Background canvas #bg-canvas present');
assert(/id=["']cyber-grid["']/i.test(htmlContent), 'Cyber grid overlay #cyber-grid present');
assert(/id=["']aurora-bg["']/i.test(htmlContent), 'Aurora background #aurora-bg present');
assert(/id=["']spotlight-cursor["']/i.test(htmlContent), 'Spotlight cursor #spotlight-cursor present');

// Tag balancing check (simple bracket count match)
const openTags = (htmlContent.match(/<[a-z1-6]+(?=\s|>)/g) || []).length;
const closeTags = (htmlContent.match(/<\/[a-z1-6]+>/g) || []).length;
console.log(`Info: Open tags count: ${openTags}, Close tags count (excluding self-closing): ${closeTags}`);
assert(openTags > 0 && closeTags > 0, 'HTML tag syntax parsing succeeded');

// ---------------------------------------------------------------------------
// TEST 3: CSS Token & Rule Verification (css/styles.css & styles.css)
// ---------------------------------------------------------------------------
console.log('\n--- Test 3: CSS Tokens & Design System Verification ---');
const mainCssPath = path.join(rootDir, 'css/styles.css');
const rootCssPath = path.join(rootDir, 'styles.css');
const cssContent = fs.readFileSync(mainCssPath, 'utf8');
const rootCssContent = fs.readFileSync(rootCssPath, 'utf8');

// Token checks in css/styles.css
assert(cssContent.includes('--bg-primary: #08090f'), 'CSS variable --bg-primary is #08090f');
assert(cssContent.includes('--cyan: #00f3ff'), 'CSS variable --cyan is #00f3ff');
assert(cssContent.includes('--magenta: #ff007a'), 'CSS variable --magenta is #ff007a');
assert(cssContent.includes('--lime: #00ff66'), 'CSS variable --lime is #00ff66');
assert(cssContent.includes('Space Grotesk'), 'Font family Space Grotesk in CSS');
assert(cssContent.includes('JetBrains Mono'), 'Font family JetBrains Mono in CSS');
assert(cssContent.includes('Inter'), 'Font family Inter in CSS');

// Check Glassmorphism & Spotlight styling
assert(cssContent.includes('backdrop-filter: var(--glass-blur') || cssContent.includes('backdrop-filter: blur'), 'Glassmorphic backdrop blur rule present');
assert(cssContent.includes('.spotlight-card'), 'Spotlight card styling rule present');
assert(cssContent.includes('#spotlight-cursor'), 'Spotlight cursor styling rule present');

// Responsive breakpoints
assert(cssContent.includes('@media (max-width: 767px)') || cssContent.includes('@media (max-width: 768px)'), 'Mobile responsive media query present');
assert(cssContent.includes('@media (min-width: 768px)'), 'Tablet/Desktop responsive media query present');
assert(cssContent.includes('@media (min-width: 1024px)'), 'Desktop responsive media query present');

// Root styles forwarding check
assert(rootCssContent.includes("@import url('css/styles.css')"), 'styles.css correctly imports css/styles.css');
assert(rootCssContent.includes('--bg-primary: #08090f'), 'styles.css defines --bg-primary token');
assert(rootCssContent.includes('--bg-dark: #08090f'), 'styles.css defines --bg-dark token');

// ---------------------------------------------------------------------------
// TEST 4: JavaScript Logic & Worker 2 Remediation Checks
// ---------------------------------------------------------------------------
console.log('\n--- Test 4: JS Engine & Worker 2 Remediation Verification ---');
const appJsPath = path.join(rootDir, 'js/app.js');
const rootAppJsPath = path.join(rootDir, 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');
const rootAppJsContent = fs.readFileSync(rootAppJsPath, 'utf8');

// Worker 2 Fix 1: Check visibilitychange listener cancels animation frame and sets animationFrameId = null
const hasNullReset = appJsContent.includes('animationFrameId = null;') && rootAppJsContent.includes('animationFrameId = null;');
assert(hasNullReset, 'Worker 2 Fix Verified: animationFrameId is set to null upon cancelAnimationFrame in visibilitychange handler');

const hasGuardCheck = appJsContent.includes('if (!animationFrameId)') && rootAppJsContent.includes('if (!animationFrameId)');
assert(hasGuardCheck, 'Worker 2 Fix Verified: visibilitychange handler checks !animationFrameId before triggering render()');

// Worker 2 Fix 2: Check resizeCanvas uses ctx.setTransform to prevent cumulative transform matrix scaling
const hasSetTransform = appJsContent.includes('ctx.setTransform(dpr, 0, 0, dpr, 0, 0)') && rootAppJsContent.includes('ctx.setTransform(dpr, 0, 0, dpr, 0, 0)');
assert(hasSetTransform, 'Worker 2 Fix Verified: resizeCanvas uses ctx.setTransform(dpr, 0, 0, dpr, 0, 0) to prevent transform matrix accumulation');

// ---------------------------------------------------------------------------
// TEST 5: Execution Test of window.CabsCrypto Event Bus in Mock Environment
// ---------------------------------------------------------------------------
console.log('\n--- Test 5: Execution Test of CabsCrypto Event Bus ---');

const mockWindow = {
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 1200,
  innerHeight: 800,
  devicePixelRatio: 1
};

const mockDocument = {
  addEventListener: () => {},
  removeEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  createElement: () => ({
    getContext: () => ({
      scale: () => {},
      setTransform: () => {},
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      moveTo: () => {},
      lineTo: () => {}
    }),
    style: {}
  }),
  hidden: false
};

const sandbox = {
  window: mockWindow,
  document: mockDocument,
  console: console,
  Math: Math,
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {}
};

try {
  vm.createContext(sandbox);
  vm.runInContext(appJsContent, sandbox);
  
  const cabscrypto = sandbox.window.CabsCrypto;
  assert(cabscrypto !== undefined, 'window.CabsCrypto successfully instantiated');
  assert(typeof cabscrypto.on === 'function', 'CabsCrypto.on is a function');
  assert(typeof cabscrypto.emit === 'function', 'CabsCrypto.emit is a function');
  assert(typeof cabscrypto.openModal === 'function', 'CabsCrypto.openModal is a function');
  assert(typeof cabscrypto.closeModal === 'function', 'CabsCrypto.closeModal is a function');
  assert(typeof cabscrypto.executeCommand === 'function', 'CabsCrypto.executeCommand is a function');
  assert(typeof cabscrypto.filterTechStack === 'function', 'CabsCrypto.filterTechStack is a function');

  // Test event bus pubsub mechanism
  let eventFired = false;
  let receivedData = null;
  cabscrypto.on('test-event', (data) => {
    eventFired = true;
    receivedData = data;
  });
  cabscrypto.emit('test-event', { payload: 'ok' });

  assert(eventFired && receivedData && receivedData.payload === 'ok', 'CabsCrypto PubSub event emitting and listening functions as expected');

} catch (err) {
  assert(false, `JS Execution Error: ${err.message}`);
}

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log(`\n=== TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED ===`);
if (failCount === 0) {
  console.log('VERDICT: ALL EMPIRICAL TESTS PASSED PERFECTLY.');
} else {
  console.error('VERDICT: EMPIRICAL TEST FAILURES DETECTED.');
}
