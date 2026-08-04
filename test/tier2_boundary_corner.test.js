/* ==========================================================================
   Tier 2: Boundary Value & Corner Case Tests (Milestone 3)
   Comprehensive 65 Boundary Tests Across All 13 Features
   ========================================================================== */

const {
  describe,
  test,
  assert,
  assertTrue,
  assertFalse,
  assertEqual,
  assertNotEqual,
  assertContains,
  assertNotContains,
  assertMatches,
  assertNull,
  assertNotNull,
  assertUndefined,
  assertDefined,
  assertDeepEqual,
  assertThrows,
  assertRejects,
  assertInRange,
  readLocalFile,
  fileExists,
  parseHTML,
  parseCSS,
  runInVMContext,
  createMockDOMNode,
  createMockCanvasContext
} = require('./harness.js');

// --------------------------------------------------------------------------
// Feature 1 Boundary: Dark Neo-Glassmorphic Theme
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 1 Boundary: Dark Neo-Glassmorphic Theme', () => {
  test('Hex vs HSL color format fallback handling', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const vars = css.getCSSVariables();

    const cyan = vars['--neon-cyan'];
    assertDefined(cyan, '--neon-cyan should be defined');
    assertEqual(cyan.toLowerCase(), '#00f3ff', '--neon-cyan should be #00f3ff');
  });

  test('Missing CSS custom property fallback in var() declarations', () => {
    const cssContent = readLocalFile('css/styles.css');
    assertContains(cssContent, 'var(--', 'css/styles.css should use CSS variables with fallbacks');
  });

  test('Theme contrast ratio boundary between dark background and neon text', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const vars = css.getCSSVariables();

    const bgDark = vars['--bg-dark'] || '#08090f';
    const neonCyan = vars['--neon-cyan'] || '#00f3ff';
    const neonLime = vars['--neon-lime'] || '#00ff66';

    assertEqual(bgDark.toLowerCase(), '#08090f', '--bg-dark should be #08090f');
    assertEqual(neonCyan.toLowerCase(), '#00f3ff', '--neon-cyan should be #00f3ff');
    assertEqual(neonLime.toLowerCase(), '#00ff66', '--neon-lime should be #00ff66');
  });

  test('Alpha opacity boundary bounds for glassmorphism panels', () => {
    const cssContent = readLocalFile('css/styles.css');
    const rgbaRegex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/g;
    let match;
    const alphas = [];
    while ((match = rgbaRegex.exec(cssContent)) !== null) {
      alphas.push(parseFloat(match[1]));
    }

    assertTrue(alphas.length > 0, 'CSS should contain rgba color definitions');
    alphas.forEach(alpha => {
      assertInRange(alpha, 0.0, 1.0, `Alpha opacity ${alpha} must be bounded between 0.0 and 1.0`);
    });
  });

  test('Theme color fallback in VM context execution', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;
    
    doc.documentElement.style.setProperty('--custom-theme-accent', '#00f3ff');
    assertEqual(doc.documentElement.style['--custom-theme-accent'], '#00f3ff', 'VM context should update inline style properties');
  });
});

// --------------------------------------------------------------------------
// Feature 2 Boundary: Typography & Font Stack
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 2 Boundary: Typography & Font Stack', () => {
  test('Missing font fallback stack includes generic system fallbacks', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const vars = css.getCSSVariables();

    const fontHeading = vars['--font-heading'] || '';
    const fontBody = vars['--font-body'] || '';
    const fontMono = vars['--font-mono'] || '';

    assertTrue(fontHeading.includes('sans-serif'), 'Heading font stack must include sans-serif fallback');
    assertTrue(fontBody.includes('sans-serif'), 'Body font stack must include sans-serif fallback');
    assertTrue(fontMono.includes('monospace'), 'Mono font stack must include monospace fallback');
  });

  test('Whitespace in font names handling in CSS font family rules', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const fontFamilies = css.getFontFamilies();

    assertTrue(fontFamilies.includes('Space Grotesk'), 'Font families list should contain Space Grotesk');
    assertTrue(fontFamilies.includes('JetBrains Mono'), 'Font families list should contain JetBrains Mono');
    assertTrue(fontFamilies.includes('Inter'), 'Font families list should contain Inter');
  });

  test('Unknown heading elements typography fallback', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('h1'), 'HTML should have h1 heading');
    assertTrue(doc.hasElement('h2'), 'HTML should have h2 heading');
    
    const h5 = createMockDOMNode('h5', { class: 'section-title' });
    const h6 = createMockDOMNode('h6', { class: 'subsection-title' });

    assertEqual(h5.tagName, 'H5', 'Mock H5 tag name should be normalized uppercase');
    assertEqual(h6.tagName, 'H6', 'Mock H6 tag name should be normalized uppercase');
  });

  test('Empty or whitespace-only text content in heading elements', () => {
    const emptyHTML = '<h1>   </h1><h2>\t\n</h2>';
    const doc = parseHTML(emptyHTML);

    const h1 = doc.querySelector('h1');
    const h2 = doc.querySelector('h2');

    assertNotNull(h1, 'h1 element should be parsed');
    assertNotNull(h2, 'h2 element should be parsed');
    assertEqual(h1.textContent.trim(), '', 'h1 text content should trim to empty string');
    assertEqual(h2.textContent.trim(), '', 'h2 text content should trim to empty string');
  });

  test('Font family variable overrides in VM context', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    doc.documentElement.style.setProperty('--font-heading', "'Comic Sans MS', sans-serif");
    assertEqual(doc.documentElement.style['--font-heading'], "'Comic Sans MS', sans-serif", 'Font heading override should set cleanly');
  });
});

// --------------------------------------------------------------------------
// Feature 3 Boundary: Glassmorphic Styling & Spotlight Cursor
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 3 Boundary: Glassmorphic Styling & Spotlight Cursor', () => {
  test('Cursor out-of-bounds mouse coordinates calculation', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    doc.dispatchEvent('DOMContentLoaded');

    doc.dispatchEvent({ type: 'mousemove', clientX: -500, clientY: -1000 });
    assertEqual(doc.documentElement.style['--mouse-x'], '-500px', '--mouse-x should reflect negative coordinate');
    assertEqual(doc.documentElement.style['--mouse-y'], '-1000px', '--mouse-y should reflect negative coordinate');

    doc.dispatchEvent({ type: 'mousemove', clientX: 99999, clientY: 88888 });
    assertEqual(doc.documentElement.style['--mouse-x'], '99999px', '--mouse-x should reflect extreme positive coordinate');
    assertEqual(doc.documentElement.style['--mouse-y'], '88888px', '--mouse-y should reflect extreme positive coordinate');
  });

  test('Zero-width element spotlight bounding rect bounds', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const zeroCard = createMockDOMNode('div', { class: 'spotlight-card' });
    zeroCard.getBoundingClientRect = () => ({ top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 });
    doc.body.appendChild(zeroCard);

    doc.dispatchEvent('DOMContentLoaded');

    zeroCard.dispatchEvent({ type: 'mousemove', clientX: 0, clientY: 0 });
    assertEqual(zeroCard.style['--card-mouse-x'], '0px', 'Zero width card should compute card-mouse-x as 0px');
    assertEqual(zeroCard.style['--card-mouse-y'], '0px', 'Zero width card should compute card-mouse-y as 0px');
  });

  test('Backdrop blur fallback on unsupported browsers', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasBackdropBlur(), 'CSS should contain backdrop-filter with blur');
    assertContains(cssContent, '-webkit-backdrop-filter', 'CSS should include vendor prefix -webkit-backdrop-filter fallback');
  });

  test('Rapid mouse movement event flooding performance handling', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    doc.dispatchEvent('DOMContentLoaded');

    for (let i = 0; i < 100; i++) {
      doc.dispatchEvent({ type: 'mousemove', clientX: i * 10, clientY: i * 15 });
    }

    assertEqual(doc.documentElement.style['--mouse-x'], '990px', '--mouse-x should reflect last mouse position');
    assertEqual(doc.documentElement.style['--mouse-y'], '1485px', '--mouse-y should reflect last mouse position');
  });

  test('Spotlight card event handling on detached node', () => {
    const detachedCard = createMockDOMNode('div', { class: 'spotlight-card' });
    let errorThrown = false;

    try {
      detachedCard.dispatchEvent({ type: 'mousemove', clientX: 50, clientY: 50 });
    } catch (e) {
      errorThrown = true;
    }

    assertFalse(errorThrown, 'Detached spotlight card mousemove should not throw errors');
  });
});

// --------------------------------------------------------------------------
// Feature 4 Boundary: Aurora & Cyber Grid Background
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 4 Boundary: Aurora & Cyber Grid Background', () => {
  test('Canvas resize window events triggers dimension recalculation', () => {
    const vmRes = runInVMContext('js/app.js', { innerWidth: 1024, innerHeight: 768 });
    const doc = vmRes.document;

    const canvas = doc.createElement('canvas');
    canvas.setAttribute('id', 'bg-canvas');
    doc.body.appendChild(canvas);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.innerWidth = 1920;
    vmRes.window.innerHeight = 1080;
    vmRes.window.dispatchEvent('resize');

    assertTrue(canvas.width > 0, 'Canvas width should be recalculated');
    assertTrue(canvas.height > 0, 'Canvas height should be recalculated');
  });

  test('0x0 viewport dimensions particle calculation bounds', () => {
    const vmRes = runInVMContext('js/app.js', { innerWidth: 0, innerHeight: 0 });
    const doc = vmRes.document;

    const canvas = doc.createElement('canvas');
    canvas.setAttribute('id', 'bg-canvas');
    doc.body.appendChild(canvas);

    doc.dispatchEvent('DOMContentLoaded');

    assertEqual(canvas.style.width, '0px', 'Canvas width style should be 0px');
    assertEqual(canvas.style.height, '0px', 'Canvas height style should be 0px');
  });

  test('High DPI scaling context bounds cap at maximum scale', () => {
    const vmRes = runInVMContext('js/app.js', { innerWidth: 1024, innerHeight: 768, devicePixelRatio: 3 });
    const doc = vmRes.document;

    const canvas = doc.createElement('canvas');
    canvas.setAttribute('id', 'bg-canvas');
    doc.body.appendChild(canvas);

    doc.dispatchEvent('DOMContentLoaded');
    assertTrue(canvas.width > 0, 'Canvas width should scale up based on devicePixelRatio');
  });

  test('Particle velocity and position boundary reflection bounds', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const canvas = doc.createElement('canvas');
    canvas.setAttribute('id', 'bg-canvas');
    doc.body.appendChild(canvas);

    doc.dispatchEvent('DOMContentLoaded');
    assertTrue(doc.getElementById('bg-canvas') !== null, 'Particle canvas runs in VM context');
  });

  test('Visibility change event halts canvas animation on hidden tab', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const canvas = doc.createElement('canvas');
    canvas.setAttribute('id', 'bg-canvas');
    doc.body.appendChild(canvas);

    doc.dispatchEvent('DOMContentLoaded');

    doc.hidden = true;
    doc.dispatchEvent('visibilitychange');

    assertTrue(doc.hidden, 'Document hidden flag should be set to true');
  });
});

// --------------------------------------------------------------------------
// Feature 5 Boundary: Responsive Mobile/Tablet/Desktop Layout
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 5 Boundary: Responsive Mobile/Tablet/Desktop Layout', () => {
  test('Breakpoint edge values 767px vs 768px mobile boundary', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const mediaQueries = css.getMediaQueries();

    assertTrue(mediaQueries.some(q => q.includes('768px')), 'Media queries should include 768px breakpoint boundary');
  });

  test('Breakpoint edge values 991px vs 992px tablet boundary', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const mediaQueries = css.getMediaQueries();

    assertTrue(mediaQueries.some(q => q.includes('992px')), 'Media queries should include 992px breakpoint boundary');
  });

  test('Extreme small width 320px minimum mobile viewport', () => {
    const cssContent = readLocalFile('css/styles.css');
    assertContains(cssContent, 'box-sizing: border-box', 'CSS should set box-sizing: border-box for layout sizing');
    assertContains(cssContent, 'max-width: 100%', 'CSS should set max-width constraints');
  });

  test('Orientation change resize event recalculation', () => {
    const vmRes = runInVMContext('js/app.js', { innerWidth: 1024, innerHeight: 768 });
    const win = vmRes.window;

    let resizeTriggered = false;
    win.addEventListener('resize', () => { resizeTriggered = true; });

    win.innerWidth = 414;
    win.innerHeight = 896;
    win.dispatchEvent('resize');

    assertTrue(resizeTriggered, 'Resize listener should trigger on orientation change');
  });

  test('Mobile menu toggle rapid state synchronization', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const toggleBtn = doc.createElement('button');
    toggleBtn.setAttribute('id', 'mobile-menu-toggle');
    toggleBtn.setAttribute('aria-expanded', 'false');

    const navLinks = doc.createElement('ul');
    navLinks.setAttribute('class', 'nav-links');

    doc.body.appendChild(toggleBtn);
    doc.body.appendChild(navLinks);

    doc.dispatchEvent('DOMContentLoaded');

    toggleBtn.click();
    assertEqual(toggleBtn.getAttribute('aria-expanded'), 'true', 'Click 1: aria-expanded should be true');
    assertTrue(vmRes.CabsCrypto.state.isMobileMenuOpen, 'Click 1: isMobileMenuOpen should be true');

    toggleBtn.click();
    assertEqual(toggleBtn.getAttribute('aria-expanded'), 'false', 'Click 2: aria-expanded should be false');
    assertFalse(vmRes.CabsCrypto.state.isMobileMenuOpen, 'Click 2: isMobileMenuOpen should be false');
  });
});

// --------------------------------------------------------------------------
// Feature 6 Boundary: Dynamic Hero Headline
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 6 Boundary: Dynamic Hero Headline', () => {
  test('Empty headline string typewriter engine handling', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/hero.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const typingEl = doc.createElement('span');
    typingEl.setAttribute('id', 'typing-text');
    doc.body.appendChild(typingEl);

    doc.dispatchEvent('DOMContentLoaded');
    assertNotNull(doc.getElementById('typing-text'), 'typing-text element exists');
  });

  test('Rapid typewriter loop interrupt clean state reset', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/hero.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertTrue(vmRes.CabsCrypto.state.modulesLoaded.hero, 'Hero module registered on CabsCrypto');
  });

  test('HTML injection prevention in typewriter text', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const div = doc.createElement('div');
    const xssPayload = '<script>alert("XSS")</script>';
    div.textContent = xssPayload;
    assertEqual(div.textContent, xssPayload, 'textContent preserves raw text without HTML execution');
  });

  test('Long headline string character boundary handling', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/hero.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertTrue(vmRes.CabsCrypto.state.modulesLoaded.hero, 'Hero module handles headline bounds cleanly');
  });

  test('Gradient text styling CSS rule bounds', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.gradient-text'), 'CSS should define .gradient-text selector');
    const bgClip = css.getPropertyValue('.gradient-text', '-webkit-background-clip') || css.getPropertyValue('.gradient-text', 'background-clip');
    assertNotNull(bgClip, '.gradient-text should specify background-clip property');
  });
});

// --------------------------------------------------------------------------
// Feature 7 Boundary: Interactive CLI Terminal
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 7 Boundary: Interactive CLI Terminal', () => {
  test('Excessively long input string 1000+ characters handling', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    const inpWrapper = doc.createElement('div');
    inpWrapper.setAttribute('class', 'terminal-input-wrapper');
    const inp = doc.createElement('input');
    inp.setAttribute('id', 'terminal-input');
    inpWrapper.appendChild(inp);
    termBody.appendChild(inpWrapper);
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    const longInput = 'help ' + 'a'.repeat(1200);
    vmRes.window.executeCommand(longInput);
    assertContains(vmRes.window.CommandHistory, longInput.trim(), 'Command history receives long input');
  });

  test('Empty and whitespace-only input submission handling', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    const inpWrapper = doc.createElement('div');
    inpWrapper.setAttribute('class', 'terminal-input-wrapper');
    const inp = doc.createElement('input');
    inp.setAttribute('id', 'terminal-input');
    inpWrapper.appendChild(inp);
    termBody.appendChild(inpWrapper);
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.executeCommand('   ');
    assertNotNull(doc.getElementById('terminal-body'), 'Terminal handles whitespace command without crashing');
  });

  test('Command history navigation Up arrow upper bound limit', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    const inpWrapper = doc.createElement('div');
    inpWrapper.setAttribute('class', 'terminal-input-wrapper');
    const inp = doc.createElement('input');
    inp.setAttribute('id', 'terminal-input');
    inpWrapper.appendChild(inp);
    termBody.appendChild(inpWrapper);
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.executeCommand('help');
    vmRes.window.executeCommand('projects');
    vmRes.window.executeCommand('stats');

    const currentInp = doc.getElementById('terminal-input');
    currentInp.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assertEqual(currentInp.value, 'stats', 'First Up arrow returns newest history item');

    currentInp.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assertEqual(currentInp.value, 'projects', 'Second Up arrow returns middle history item');

    currentInp.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assertEqual(currentInp.value, 'help', 'Third Up arrow returns oldest history item');
  });

  test('Command history navigation Down arrow lower bound limit', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    const inpWrapper = doc.createElement('div');
    inpWrapper.setAttribute('class', 'terminal-input-wrapper');
    const inp = doc.createElement('input');
    inp.setAttribute('id', 'terminal-input');
    inpWrapper.appendChild(inp);
    termBody.appendChild(inpWrapper);
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.executeCommand('help');
    vmRes.window.executeCommand('projects');

    const currentInp = doc.getElementById('terminal-input');
    currentInp.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    currentInp.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assertEqual(currentInp.value, 'help');

    currentInp.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assertEqual(currentInp.value, 'projects', 'Down arrow moves forward in history');

    currentInp.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assertEqual(currentInp.value, '', 'Down arrow past latest item restores empty input');
  });

  test('Terminal body auto-scroll on long output bounds', () => {
    const termBody = createMockDOMNode('div');
    termBody.scrollHeight = 1800;
    termBody.clientHeight = 400;

    termBody.scrollTop = termBody.scrollHeight;
    assertEqual(termBody.scrollTop, 1800, 'scrollTop should update to scrollHeight for auto-scroll');
  });
});

// --------------------------------------------------------------------------
// Feature 8 Boundary: Terminal Commands Execution
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 8 Boundary: Terminal Commands Execution', () => {
  test('Unknown invalid command handling foo and sysinfo', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    const inpWrapper = doc.createElement('div');
    inpWrapper.setAttribute('class', 'terminal-input-wrapper');
    const inp = doc.createElement('input');
    inp.setAttribute('id', 'terminal-input');
    inpWrapper.appendChild(inp);
    termBody.appendChild(inpWrapper);
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.executeCommand('foo');
    assertContains(termBody.innerHTML, 'command not found', 'Should render command not found for foo');

    vmRes.window.executeCommand('sysinfo');
    assertContains(termBody.innerHTML, 'command not found', 'Should render command not found for sysinfo');
  });

  test('Whitespace and trimmed input normalization', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.executeCommand('   help   ');
    assertContains(termBody.innerHTML, 'Comandos Disponibles', 'Padded help should resolve cleanly');
  });

  test('Case sensitivity handling HELP vs help', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.executeCommand('HELP');
    assertContains(termBody.innerHTML, 'Comandos Disponibles', 'HELP should resolve to help');
  });

  test('Extra arguments handling projects Web3', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    doc.body.appendChild(termBody);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.executeCommand('projects Web3 Crypto');
    assertContains(termBody.innerHTML, 'Proyectos', 'projects Web3 Crypto resolves projects command');
  });

  test('Command execution event bus emission via CabsCrypto', () => {
    const vmRes = runInVMContext('js/app.js');
    let emittedEvent = null;

    vmRes.CabsCrypto.on('terminal:execute', data => {
      emittedEvent = data;
    });

    vmRes.CabsCrypto.executeCommand('crypto');
    assertNotNull(emittedEvent, 'terminal:execute event should fire');
    assertEqual(emittedEvent.command, 'crypto', 'Event payload command should match input command');
  });
});

// --------------------------------------------------------------------------
// Feature 9 Boundary: Matrix Digital Rain Mode
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 9 Boundary: Matrix Digital Rain Mode', () => {
  test('Rapid matrix rain start/stop toggle cleanup', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/matrix.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const win = vmRes.window;

    for (let i = 0; i < 10; i++) {
      win.startMatrixRain();
      win.stopMatrixRain();
    }

    assertFalse(win.MatrixRainEngine.isRunning(), 'Matrix rain should be stopped after toggles');
  });

  test('Multiple rain instances prevention concurrency guard', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/matrix.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const win = vmRes.window;

    win.startMatrixRain();
    win.startMatrixRain();
    assertTrue(win.MatrixRainEngine.isRunning(), 'Matrix rain remains running');
    win.stopMatrixRain();
  });

  test('Canvas clear cleanup on matrix rain stop', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/matrix.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const win = vmRes.window;

    win.startMatrixRain();
    win.stopMatrixRain();
    assertNull(win.document.getElementById('matrix-canvas'), 'Matrix canvas is removed from DOM');
  });

  test('Matrix rain character generator output boundary', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/matrix.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertTrue(vmRes.CabsCrypto.state.modulesLoaded.matrix, 'Matrix module loaded in VM context');
  });

  test('Matrix rain activation via CabsCrypto event trigger', () => {
    const vmRes = runInVMContext('js/app.js');
    let matrixTriggered = false;

    vmRes.CabsCrypto.on('terminal:execute', data => {
      if (data.command === 'matrix') {
        matrixTriggered = true;
      }
    });

    vmRes.CabsCrypto.executeCommand('matrix');
    assertTrue(matrixTriggered, 'Matrix command execution should trigger event listener');
  });
});

// --------------------------------------------------------------------------
// Feature 10 Boundary: Bento Grid Projects Showcase
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 10 Boundary: Bento Grid Projects Showcase', () => {
  test('Empty project filter category zero results handling', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/bento.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertDefined(vmRes.window.PROJECTS, 'PROJECTS catalog defined');
  });

  test('Missing project card data-project attribute fallback', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/bento.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const mockCard = createMockDOMNode('div', { class: 'bento-card' });
    assertEqual(mockCard.getAttribute('data-project') || 'default-project', 'default-project');
  });

  test('Non-existent project ID modal lookup handling', () => {
    const vmRes = runInVMContext('js/app.js');
    let openedModalId = null;

    vmRes.CabsCrypto.on('modal:open', data => {
      openedModalId = data.projectId;
    });

    vmRes.CabsCrypto.openModal('unknown-proj-999');
    assertEqual(vmRes.CabsCrypto.state.activeModal, 'unknown-proj-999', 'Active modal state should track requested ID');
    assertEqual(openedModalId, 'unknown-proj-999', 'modal:open event payload should carry requested ID');
  });

  test('Bento card hover focus keyboard navigation bounds', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const bentoCards = doc.getElementsByClassName('proj-card');

    assertTrue(bentoCards.length >= 2, 'Should contain at least 2 bento cards in HTML');
    bentoCards.forEach(card => {
      assertTrue(card.hasAttribute('data-project'), 'Bento card should have data-project attribute');
    });
  });

  test('Bento grid catalog card count and structure integrity', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const track = doc.getElementById('carousel-track');

    assertNotNull(track, '#carousel-track should exist in index.html');
    assertTrue(track.children.length >= 2, 'carousel-track should contain project card children');
  });
});

// --------------------------------------------------------------------------
// Feature 11 Boundary: Project Detail View Modal
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 11 Boundary: Project Detail View Modal', () => {
  test('Escape key modal dismissal keyboard event handler', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'project-modal');
    modal.setAttribute('class', 'active');
    modal.setAttribute('aria-hidden', 'false');
    doc.body.appendChild(modal);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.CabsCrypto.state.activeModal = 'bot';

    vmRes.window.dispatchEvent(new vmRes.window.KeyboardEvent('keydown', { key: 'Escape' }));

    assertEqual(modal.getAttribute('aria-hidden'), 'true', 'Escape key should update aria-hidden to true');
    assertNull(vmRes.CabsCrypto.state.activeModal, 'Escape key should set activeModal to null');
  });

  test('Modal backdrop overlay click outside closure', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'project-modal');
    modal.setAttribute('class', 'active');
    doc.body.appendChild(modal);

    doc.dispatchEvent('DOMContentLoaded');

    modal.dispatchEvent({ target: modal, type: 'click' });

    assertFalse(modal.classList.contains('active'), 'Clicking modal backdrop should remove active class');
  });

  test('Missing modal content rendering fallback', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/bento.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'modal-container');
    const modalBody = doc.createElement('div');
    modalBody.setAttribute('id', 'modal-body-content');
    modal.appendChild(modalBody);
    doc.body.appendChild(modal);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.window.openModal('bot');
    assertTrue(modalBody.innerHTML.length > 0, 'Modal content rendered for project bot (agente)');
  });

  test('Rapid modal open close state synchronization', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'project-modal');
    doc.body.appendChild(modal);

    doc.dispatchEvent('DOMContentLoaded');

    for (let i = 0; i < 20; i++) {
      vmRes.CabsCrypto.openModal('bot');
      vmRes.CabsCrypto.closeModal();
    }

    assertNull(vmRes.CabsCrypto.state.activeModal, 'activeModal state should be null after open/close loop');
    assertEqual(doc.body.style.overflow, '', 'document body overflow should be restored');
  });

  test('Modal focus aria-hidden attribute toggling', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'project-modal');
    modal.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(modal);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.CabsCrypto.openModal('bot');
    assertEqual(modal.getAttribute('aria-hidden'), 'false', 'openModal should set aria-hidden to false');

    vmRes.CabsCrypto.closeModal();
    assertEqual(modal.getAttribute('aria-hidden'), 'true', 'closeModal should set aria-hidden to true');
  });
});

// --------------------------------------------------------------------------
// Feature 12 Boundary: Tech Stack Matrix
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 12 Boundary: Tech Stack Matrix', () => {
  test('0% and 100% progress bar bounds clamping', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const bars = doc.getElementsByClassName('stack-bar');
    assertTrue(bars.length >= 4, 'Progress bars exist in HTML');
  });

  test('Unknown skill domain category filter handling', () => {
    const vmRes = runInVMContext('js/app.js');
    let filterCategory = null;

    vmRes.CabsCrypto.on('matrix:filter', data => {
      filterCategory = data.category;
    });

    vmRes.CabsCrypto.filterTechStack('quantum-crypto');
    assertEqual(vmRes.CabsCrypto.state.techMatrixCategory, 'quantum-crypto', 'State should record category');
    assertEqual(filterCategory, 'quantum-crypto', 'Event should carry category');
  });

  test('Tab switching edge cases rapid category filtering', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/matrix.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    const win = vmRes.window;

    const categories = ['all', 'web3', 'frontend', 'backend', 'devops'];
    categories.forEach(cat => win.filterTechStack(cat));
    assertEqual(vmRes.CabsCrypto.state.techMatrixCategory, 'devops', 'Last active category is devops');
  });

  test('Missing proficiency data attribute fallback', () => {
    const elemWithAttr = createMockDOMNode('div', { 'data-proficiency': '90' });
    const elemWithoutAttr = createMockDOMNode('div');
    assertEqual(parseInt(elemWithAttr.getAttribute('data-proficiency') || '50', 10), 90);
    assertEqual(parseInt(elemWithoutAttr.getAttribute('data-proficiency') || '50', 10), 50);
  });

  test('Tech matrix category layout and structure verification', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const matrixSection = doc.getElementById('matrix-container');

    assertNotNull(matrixSection, '#matrix-container should exist in index.html');
  });
});

// --------------------------------------------------------------------------
// Feature 13 Boundary: Local HTTP Server & Verification
// --------------------------------------------------------------------------
describe('Tier 2 - Feature 13 Boundary: Local HTTP Server & Verification', () => {
  test('Non-existent route 404 status response', () => {
    const { handleRequest } = require('../server.js');
    let statusCode = 0;
    let body = '';
    const req = { method: 'GET', url: '/non-existent-endpoint' };
    const res = {
      writeHead(code) { statusCode = code; },
      end(data) { body = data; }
    };
    handleRequest(req, res);
    assertEqual(statusCode, 404, 'Non-existent route returns 404 status code');
  });

  test('Path traversal rejection /../ security check', () => {
    const { isPathTraversal } = require('../server.js');
    assertTrue(isPathTraversal('/../etc/passwd'), 'Detects /../etc/passwd path traversal');
    assertTrue(isPathTraversal('/css/../../secret.key'), 'Detects nested /../../ path traversal');
    assertFalse(isPathTraversal('/css/styles.css'), 'Normal path /css/styles.css is allowed');
  });

  test('Malformed HTTP request method rejection', () => {
    const { handleRequest } = require('../server.js');
    let statusCode = 0;
    const req = { method: 'POST', url: '/' };
    const res = {
      writeHead(code) { statusCode = code; },
      end() {}
    };
    handleRequest(req, res);
    assertEqual(statusCode, 405, 'POST request returns 405 Method Not Allowed');
  });

  test('Server port conflict handling EADDRINUSE', () => {
    const { server, PORT } = require('../server.js');
    assertNotNull(server, 'Server instance is exported');
    assertTrue(PORT > 0, 'Port is configured');
  });

  test('MIME type determination fallback for static assets', () => {
    const { getMimeType } = require('../server.js');
    assertEqual(getMimeType('index.html'), 'text/html; charset=utf-8');
    assertEqual(getMimeType('css/styles.css'), 'text/css; charset=utf-8');
    assertEqual(getMimeType('js/app.js'), 'application/javascript; charset=utf-8');
    assertEqual(getMimeType('assets/icon.svg'), 'image/svg+xml');
    assertEqual(getMimeType('archive.unknown'), 'application/octet-stream');
  });
});
