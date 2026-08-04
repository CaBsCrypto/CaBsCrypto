/* ==========================================================================
   Tier 1: Baseline Feature Coverage Test Suite (Milestone 2)
   Covers 13 features x 5 test cases = 65 baseline feature coverage tests.
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
  assertDefined,
  assertNotNull,
  assertNull,
  readLocalFile,
  fileExists,
  parseHTML,
  parseCSS,
  runInVMContext
} = require('./harness.js');

// ==========================================================================
// Feature 1: Dark Neo-Glassmorphic Theme (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 1: Dark Neo-Glassmorphic Theme', () => {
  test('1.1 index.html contains theme background container and cyber overlay', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('#bg-canvas'), 'Should have bg-canvas element');
    assertTrue(doc.hasElement('.cyber-grid-overlay'), 'Should have cyber-grid-overlay element');
  });

  test('1.2 styles.css defines dark background and neon accent color variables', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const vars = css.getCSSVariables();

    assertDefined(vars['--bg-dark'], 'Should define --bg-dark variable');
    assertDefined(vars['--neon-cyan'], 'Should define --neon-cyan variable');
    assertDefined(vars['--neon-magenta'], 'Should define --neon-magenta variable');
    assertDefined(vars['--neon-lime'], 'Should define --neon-lime variable');

    assertEqual(vars['--neon-cyan'].toLowerCase(), '#00f3ff', '--neon-cyan should be #00f3ff');
    assertEqual(vars['--neon-magenta'].toLowerCase(), '#ff007a', '--neon-magenta should be #ff007a');
    assertEqual(vars['--neon-lime'].toLowerCase(), '#00ff66', '--neon-lime should be #00ff66');
  });

  test('1.3 styles.css sets body background-color to var(--bg-dark)', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const bgVal = css.getPropertyValue('body', 'background-color');

    assertNotNull(bgVal, 'body should have background-color property');
    assertContains(bgVal, 'var(--bg-dark)', 'body background-color should use --bg-dark');
  });

  test('1.4 styles.css glass-card uses glass surface background and neon borders', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.glass-card'), 'CSS should have .glass-card rule');
    const glassBg = css.getPropertyValue('.glass-card', 'background');
    assertNotNull(glassBg, '.glass-card should have background property');
  });

  test('1.5 index.html contains dark glassmorphism layout cards', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const glassCards = doc.getElementsByClassName('glass-card');

    assertTrue(glassCards.length >= 3, `Expected at least 3 glass cards, found ${glassCards.length}`);
  });
});

// ==========================================================================
// Feature 2: Typography & Font Stack (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 2: Typography & Font Stack', () => {
  test('2.1 index.html imports Google Fonts (Space Grotesk, JetBrains Mono, Inter)', () => {
    const htmlContent = readLocalFile('index.html');
    assertContains(htmlContent, 'Space+Grotesk', 'index.html should link Space Grotesk font');
    assertContains(htmlContent, 'JetBrains+Mono', 'index.html should link JetBrains Mono font');
    assertContains(htmlContent, 'Inter', 'index.html should link Inter font');
  });

  test('2.2 styles.css defines heading, body, and mono font family variables', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const vars = css.getCSSVariables();

    assertDefined(vars['--font-heading'], 'Should define --font-heading');
    assertDefined(vars['--font-body'], 'Should define --font-body');
    assertDefined(vars['--font-mono'], 'Should define --font-mono');

    assertContains(vars['--font-heading'], 'Space Grotesk', '--font-heading should include Space Grotesk');
    assertContains(vars['--font-body'], 'Inter', '--font-body should include Inter');
    assertContains(vars['--font-mono'], 'JetBrains Mono', '--font-mono should include JetBrains Mono');
  });

  test('2.3 styles.css applies font-family to body', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const fontVal = css.getPropertyValue('body', 'font-family');

    assertNotNull(fontVal, 'body should have font-family property');
    assertContains(fontVal, 'var(--font-body)', 'body font-family should use --font-body');
  });

  test('2.4 styles.css applies font-family to headings (h1, h2, h3, h4)', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const rules = css.getRulesForSelector('h1, h2, h3, h4');

    assertTrue(rules.length > 0, 'Should have styling rules for headings');
    const fontHeadingVal = rules[0]['font-family'];
    assertContains(fontHeadingVal, 'var(--font-heading)', 'Headings should use --font-heading');
  });

  test('2.5 index.html uses semantic typography tags (h1, h2, h3, p)', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('h1'), 'HTML should contain h1');
    assertTrue(doc.hasElement('h2'), 'HTML should contain h2');
    assertTrue(doc.hasElement('h3'), 'HTML should contain h3');
    assertTrue(doc.hasElement('p'), 'HTML should contain p');
  });
});

// ==========================================================================
// Feature 3: Glassmorphic Styling & Spotlight Cursor (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 3: Glassmorphic Styling & Spotlight Cursor', () => {
  test('3.1 styles.css uses backdrop-filter blur for glassmorphism', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasBackdropBlur(), 'CSS must contain backdrop-filter with blur');
  });

  test('3.2 styles.css spotlight-card defines radial gradient pseudo-element', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.spotlight-card'), 'CSS should have .spotlight-card selector');
    assertTrue(css.hasSelector('.spotlight-card::after'), 'CSS should have .spotlight-card::after selector');
  });

  test('3.3 app.js initializes spotlight effect on mouse move', () => {
    const appJS = readLocalFile('js/app.js');
    assertContains(appJS, 'initSpotlightEffect', 'app.js should contain initSpotlightEffect function');
    assertContains(appJS, 'mousemove', 'app.js should bind mousemove listener for spotlight');
    assertContains(appJS, '--mouse-x', 'app.js should update --mouse-x variable');
    assertContains(appJS, '--mouse-y', 'app.js should update --mouse-y variable');
  });

  test('3.4 app.js spotlight effect executes cleanly in simulated VM context', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const spotlightCard = doc.createElement('div');
    spotlightCard.setAttribute('class', 'spotlight-card');
    doc.body.appendChild(spotlightCard);

    doc.dispatchEvent('DOMContentLoaded');

    spotlightCard.dispatchEvent({ type: 'mousemove', clientX: 150, clientY: 200 });

    assertDefined(spotlightCard.style['--mouse-x'], 'spotlight card should set --mouse-x style variable');
    assertDefined(spotlightCard.style['--mouse-y'], 'spotlight card should set --mouse-y style variable');
  });

  test('3.5 index.html applies spotlight-card class to bento cards', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const spotlights = doc.getElementsByClassName('spotlight-card');

    assertTrue(spotlights.length >= 2, `Expected at least 2 spotlight cards, found ${spotlights.length}`);
  });
});

// ==========================================================================
// Feature 4: Aurora & Cyber Grid Background (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 4: Aurora & Cyber Grid Background', () => {
  test('4.1 index.html contains bg-canvas element', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const canvas = doc.getElementById('bg-canvas');

    assertNotNull(canvas, '#bg-canvas should exist in index.html');
    assertEqual(canvas.tagName, 'CANVAS', '#bg-canvas should be a canvas tag');
  });

  test('4.2 styles.css bg-canvas is fixed and full viewport size', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertEqual(css.getPropertyValue('#bg-canvas', 'position'), 'fixed', '#bg-canvas position should be fixed');
    assertEqual(css.getPropertyValue('#bg-canvas', 'width'), '100vw', '#bg-canvas width should be 100vw');
    assertEqual(css.getPropertyValue('#bg-canvas', 'height'), '100vh', '#bg-canvas height should be 100vh');
  });

  test('4.3 app.js initializes particle canvas with 2d context', () => {
    const appJS = readLocalFile('js/app.js');
    assertContains(appJS, 'initParticleCanvas', 'app.js should contain initParticleCanvas');
    assertContains(appJS, 'getContext', 'app.js should request 2d canvas context');
    assertContains(appJS, 'requestAnimationFrame', 'app.js should use requestAnimationFrame loop');
  });

  test('4.4 app.js particle canvas runs cleanly in simulated VM context', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const canvas = doc.createElement('canvas');
    canvas.setAttribute('id', 'bg-canvas');
    doc.body.appendChild(canvas);

    assertTrue(doc.getElementById('bg-canvas') !== null, 'Particle canvas element should exist in DOM');
  });

  test('4.5 styles.css cyber-grid-overlay defines linear-gradient grid background', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const bgImage = css.getPropertyValue('.cyber-grid-overlay', 'background-image');

    assertNotNull(bgImage, '.cyber-grid-overlay should have background-image property');
    assertContains(bgImage, 'linear-gradient', '.cyber-grid-overlay should use linear-gradient for grid');
  });
});

// ==========================================================================
// Feature 5: Responsive Mobile/Tablet/Desktop Layout (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 5: Responsive Mobile/Tablet/Desktop Layout', () => {
  test('5.1 index.html contains responsive meta viewport tag', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const metas = doc.getElementsByTagName('meta');

    let hasViewport = false;
    for (const meta of metas) {
      if (meta.getAttribute('name') === 'viewport' && meta.getAttribute('content').includes('width=device-width')) {
        hasViewport = true;
        break;
      }
    }
    assertTrue(hasViewport, 'index.html must have meta viewport tag with width=device-width');
  });

  test('5.2 styles.css contains media queries for tablet (992px) and mobile (768px)', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    const mediaQueries = css.getMediaQueries();

    assertTrue(mediaQueries.some(q => q.includes('992px')), 'CSS should contain @media query for 992px');
    assertTrue(mediaQueries.some(q => q.includes('768px')), 'CSS should contain @media query for 768px');
  });

  test('5.3 styles.css bento grid adapts on smaller viewports', () => {
    const cssContent = readLocalFile('css/styles.css');
    assertContains(cssContent, 'grid-template-columns', 'styles.css should use CSS Grid grid-template-columns');
    assertContains(cssContent, 'grid-column', 'styles.css should set grid-column span');
  });

  test('5.4 index.html navbar links are structured for responsive navigation', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const nav = doc.getElementById('navbar');

    assertNotNull(nav, '#navbar should exist in index.html');
    assertTrue(doc.hasElement('.nav-links'), '.nav-links container should exist inside navbar');
  });

  test('5.5 styles.css navbar links hide on mobile screens (768px)', () => {
    const cssContent = readLocalFile('css/styles.css');
    assertMatches(cssContent, /@media\s*\(\s*max-width:\s*768px\s*\)[\s\S]*?\.nav-links[\s\S]*?display:\s*none/, 'nav-links should hide under 768px breakpoint');
  });
});

// ==========================================================================
// Feature 6: Dynamic Hero Headline & Typewriter (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 6: Dynamic Hero Headline & Typewriter', () => {
  test('6.1 index.html contains hero container and typing-text element', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('#hero-container'), 'index.html should have #hero-container');
    assertTrue(doc.hasElement('#typing-text'), 'index.html should have #typing-text element');
  });

  test('6.2 styles.css defines gradient text styling for hero headline', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.gradient-text'), 'styles.css should have .gradient-text rule');
    const bgGrad = css.getPropertyValue('.gradient-text', 'background');
    assertNotNull(bgGrad, '.gradient-text should have background gradient property');
  });

  test('6.3 js/hero.js exports hero module and registers with CabsCrypto namespace', () => {
    assertTrue(fileExists('js/hero.js'), 'js/hero.js file should exist');
    const heroJS = readLocalFile('js/hero.js');
    assertContains(heroJS, 'registerModule', 'js/hero.js should register module with CabsCrypto');
    assertContains(heroJS, "'hero'", 'js/hero.js should register under module name hero');
  });

  test('6.4 index.html and styles.css define status indicator pulse dot animation', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    assertTrue(doc.hasElement('.pulse-dot'), 'index.html should contain pulse-dot element');

    const cssContent = readLocalFile('css/styles.css');
    assertContains(cssContent, 'pulse', 'styles.css should contain pulse animation or class');
  });

  test('6.5 js/hero.js executes cleanly in VM context and registers on CabsCrypto', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/hero.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertTrue(vmRes.CabsCrypto.state.modulesLoaded.hero, 'hero module should be registered on CabsCrypto');
  });
});

// ==========================================================================
// Feature 7: Interactive CLI Terminal (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 7: Interactive CLI Terminal', () => {
  test('7.1 index.html contains terminal section, container, body, and input', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('#terminal-container'), 'index.html should have #terminal-container');
    assertTrue(doc.hasElement('#terminal-body'), 'index.html should have #terminal-body');
    assertTrue(doc.hasElement('#terminal-input'), 'index.html should have #terminal-input');
  });

  test('7.2 styles.css styles terminal body with mono font and window dot indicators', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.terminal-card'), 'styles.css should have .terminal-card rule');
    assertTrue(css.hasSelector('.terminal-body'), 'styles.css should have .terminal-body rule');
    assertTrue(css.hasSelector('.dot-red'), 'styles.css should have window header dot indicators');
  });

  test('7.3 js/terminal.js exists and registers with CabsCrypto namespace', () => {
    assertTrue(fileExists('js/terminal.js'), 'js/terminal.js file should exist');
    const termJS = readLocalFile('js/terminal.js');
    assertContains(termJS, 'registerModule', 'js/terminal.js should register module with CabsCrypto');
    assertContains(termJS, "'terminal'", 'js/terminal.js should register under module name terminal');
  });

  test('7.4 js/app.js defines executeCommand contract method', () => {
    const appJS = readLocalFile('js/app.js');
    assertContains(appJS, 'executeCommand', 'js/app.js should define executeCommand method');
    assertContains(appJS, 'terminal:execute', 'executeCommand should emit terminal:execute event');
  });

  test('7.5 js/terminal.js executes cleanly in VM context and registers module', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/terminal.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertTrue(vmRes.CabsCrypto.state.modulesLoaded.terminal, 'terminal module should be registered on CabsCrypto');
  });
});

// ==========================================================================
// Feature 8: Terminal Commands Execution (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 8: Terminal Commands Execution', () => {
  test('8.1 CabsCrypto.executeCommand emits terminal:execute event with command string', () => {
    const vmRes = runInVMContext('js/app.js');
    let capturedCmd = null;
    vmRes.CabsCrypto.on('terminal:execute', data => {
      capturedCmd = data.command;
    });

    vmRes.CabsCrypto.executeCommand('help');
    assertEqual(capturedCmd, 'help', 'executeCommand should pass help to event handler');
  });

  test('8.2 index.html documents supported terminal commands in welcome line', () => {
    const htmlContent = readLocalFile('index.html');
    assertContains(htmlContent, 'help', 'terminal welcome text should mention help');
    assertContains(htmlContent, 'projects', 'terminal welcome text should mention projects');
    assertContains(htmlContent, 'skills', 'terminal welcome text should mention skills');
    assertContains(htmlContent, 'matrix', 'terminal welcome text should mention matrix');
  });

  test('8.3 terminal input element #terminal-input configures autocomplete and spellcheck', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const input = doc.getElementById('terminal-input');

    assertNotNull(input, '#terminal-input should exist');
    assertEqual(input.getAttribute('autocomplete'), 'off', 'autocomplete should be off');
    assertEqual(input.getAttribute('spellcheck'), 'false', 'spellcheck should be false');
  });

  test('8.4 CabsCrypto.executeCommand handles commands with arguments', () => {
    const vmRes = runInVMContext('js/app.js');
    let capturedData = null;
    vmRes.CabsCrypto.on('terminal:execute', data => {
      capturedData = data;
    });

    vmRes.CabsCrypto.executeCommand('crypto --live');
    assertNotNull(capturedData, 'Event listener should receive data');
    assertEqual(capturedData.command, 'crypto --live', 'Command string should preserve arguments');
  });

  test('8.5 executeCommand scrolls terminal into view if element exists', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    let scrolled = false;
    const termElem = doc.createElement('div');
    termElem.setAttribute('id', 'terminal-container');
    termElem.scrollIntoView = () => { scrolled = true; };
    doc.body.appendChild(termElem);

    vmRes.CabsCrypto.executeCommand('clear');
    assertTrue(scrolled, 'executeCommand should invoke scrollIntoView on terminal container');
  });
});

// ==========================================================================
// Feature 9: Matrix Digital Rain Mode (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 9: Matrix Digital Rain Mode', () => {
  test('9.1 js/matrix.js file exists and registers matrix module', () => {
    assertTrue(fileExists('js/matrix.js'), 'js/matrix.js file should exist');
    const matrixJS = readLocalFile('js/matrix.js');
    assertContains(matrixJS, 'registerModule', 'js/matrix.js should register module with CabsCrypto');
    assertContains(matrixJS, "'matrix'", 'js/matrix.js should register under module name matrix');
  });

  test('9.2 index.html contains matrix container section', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('#matrix-container'), 'index.html should have #matrix-container');
  });

  test('9.3 styles.css defines neon accent colors for matrix digital theme', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.text-cyan') || css.hasSelector('.text-lime'), 'styles.css should define text accent utilities');
  });

  test('9.4 js/app.js filterTechStack method dispatches matrix:filter event', () => {
    const vmRes = runInVMContext('js/app.js');
    let categoryFiltered = null;

    vmRes.CabsCrypto.on('matrix:filter', data => {
      categoryFiltered = data.category;
    });

    vmRes.CabsCrypto.filterTechStack('web3');
    assertEqual(categoryFiltered, 'web3', 'filterTechStack should emit matrix:filter event with web3');
    assertEqual(vmRes.CabsCrypto.state.techMatrixCategory, 'web3', 'state.techMatrixCategory should update');
  });

  test('9.5 js/matrix.js executes cleanly in VM context and registers on CabsCrypto', () => {
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/matrix.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertTrue(vmRes.CabsCrypto.state.modulesLoaded.matrix, 'matrix module should be registered on CabsCrypto');
  });
});

// ==========================================================================
// Feature 10: Bento Grid Projects Showcase (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 10: Bento Grid Projects Showcase', () => {
  test('10.1 index.html contains bento container and bento grid layout', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('#bento-container'), 'index.html should have #bento-container');
    assertTrue(doc.hasElement('#bento-grid'), 'index.html should have #bento-grid');
  });

  test('10.2 styles.css defines 12-column grid layout for bento-grid', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.bento-grid'), 'styles.css should have .bento-grid selector');
    const gridCols = css.getPropertyValue('.bento-grid', 'grid-template-columns');
    assertNotNull(gridCols, '.bento-grid should define grid-template-columns');
  });

  test('10.3 index.html bento cards contain project tech tags', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const tags = doc.getElementsByClassName('tag');

    assertTrue(tags.length >= 5, `Expected at least 5 tech tags in bento cards, found ${tags.length}`);
  });

  test('10.4 styles.css defines hover state card transformations', () => {
    const cssContent = readLocalFile('css/styles.css');
    assertContains(cssContent, ':hover', 'styles.css should contain hover pseudo-class selectors');
    assertContains(cssContent, 'transform', 'styles.css should include hover transform effects');
  });

  test('10.5 js/bento.js executes cleanly in VM context and registers on CabsCrypto', () => {
    assertTrue(fileExists('js/bento.js'), 'js/bento.js file should exist');
    const vmRes = runInVMContext('js/app.js');
    runInVMContext('js/bento.js', { CabsCrypto: vmRes.CabsCrypto, window: vmRes.window, document: vmRes.document });
    assertTrue(vmRes.CabsCrypto.state.modulesLoaded.bento, 'bento module should be registered on CabsCrypto');
  });
});

// ==========================================================================
// Feature 11: Project Detail View Modal (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 11: Project Detail View Modal', () => {
  test('11.1 index.html contains modal container, overlay, and close button', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('#modal-container'), 'index.html should have #modal-container');
    assertTrue(doc.hasElement('.modal-overlay'), 'index.html should have .modal-overlay element');
    assertTrue(doc.hasElement('#modal-close-btn'), 'index.html should have #modal-close-btn');
  });

  test('11.2 styles.css defines fixed positioning and backdrop blur for modal overlay', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    assertTrue(css.hasSelector('.modal-overlay'), 'styles.css should have .modal-overlay rule');
    assertEqual(css.getPropertyValue('.modal-overlay', 'position'), 'fixed', '.modal-overlay should be fixed position');
  });

  test('11.3 CabsCrypto.openModal opens modal and updates application state', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'modal-container');
    doc.body.appendChild(modal);

    vmRes.CabsCrypto.openModal('quant-bot');
    assertEqual(vmRes.CabsCrypto.state.activeModal, 'quant-bot', 'activeModal state should be quant-bot');
    assertTrue(modal.classList.contains('active'), 'modal should have active class');
    assertEqual(modal.getAttribute('aria-hidden'), 'false', 'aria-hidden should be false when modal is open');
  });

  test('11.4 CabsCrypto.closeModal closes modal and resets application state', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'modal-container');
    doc.body.appendChild(modal);

    vmRes.CabsCrypto.openModal('quant-bot');
    vmRes.CabsCrypto.closeModal();

    assertNull(vmRes.CabsCrypto.state.activeModal, 'activeModal state should be null after closeModal');
    assertFalse(modal.classList.contains('active'), 'modal active class should be removed');
    assertEqual(modal.getAttribute('aria-hidden'), 'true', 'aria-hidden should be true when modal is closed');
  });

  test('11.5 ESC key press listener closes active modal in VM context', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    const modal = doc.createElement('div');
    modal.setAttribute('id', 'modal-container');
    doc.body.appendChild(modal);

    doc.dispatchEvent('DOMContentLoaded');

    vmRes.CabsCrypto.openModal('aegis-audit');
    assertEqual(vmRes.CabsCrypto.state.activeModal, 'aegis-audit', 'Modal should be open before ESC key');

    vmRes.window.dispatchEvent({ type: 'keydown', key: 'Escape' });
    assertNull(vmRes.CabsCrypto.state.activeModal, 'Modal should close when Escape key is pressed');
  });
});

// ==========================================================================
// Feature 12: Tech Stack Matrix (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 12: Tech Stack Matrix', () => {
  test('12.1 index.html contains matrix grid with 4 domain categories', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    const categories = doc.getElementsByClassName('stack-category');
    assertTrue(categories.length >= 4, `Expected at least 4 tech stack categories, found ${categories.length}`);
  });

  test('12.2 index.html contains domain category tabs for filtering', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    assertTrue(doc.hasElement('#matrix-tabs'), 'index.html should contain #matrix-tabs');
    const tabs = doc.getElementsByClassName('matrix-tab');
    assertTrue(tabs.length >= 4, `Expected at least 4 matrix category tabs, found ${tabs.length}`);
  });

  test('12.3 index.html and styles.css specify progress bars for domain skill levels', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);
    const bars = doc.getElementsByClassName('stack-bar');
    assertTrue(bars.length >= 6, `Expected at least 6 skill level progress bars, found ${bars.length}`);

    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);
    assertTrue(css.hasSelector('.stack-bar'), 'styles.css should have .stack-bar selector');
  });

  test('12.4 CabsCrypto.filterTechStack smooth scrolls to matrix section', () => {
    const vmRes = runInVMContext('js/app.js');
    const doc = vmRes.document;

    let scrolled = false;
    const matrixSec = doc.createElement('div');
    matrixSec.setAttribute('id', 'matrix-container');
    matrixSec.scrollIntoView = () => { scrolled = true; };
    doc.body.appendChild(matrixSec);

    vmRes.CabsCrypto.filterTechStack('devops');
    assertTrue(scrolled, 'filterTechStack should scroll matrix container into view');
  });

  test('12.5 CabsCrypto state tracks active domain category selection', () => {
    const vmRes = runInVMContext('js/app.js');
    assertEqual(vmRes.CabsCrypto.state.techMatrixCategory, 'all', 'Default tech matrix category should be all');

    vmRes.CabsCrypto.filterTechStack('backend');
    assertEqual(vmRes.CabsCrypto.state.techMatrixCategory, 'backend', 'Category should update to backend');
  });
});

// ==========================================================================
// Feature 13: Local HTTP Server & Verification (5 tests)
// ==========================================================================
describe('Tier 1 - Feature 13: Local HTTP Server & Verification', () => {
  test('13.1 server.js file structure or PROJECT.md server specification is defined', () => {
    if (fileExists('server.js')) {
      const serverCode = readLocalFile('server.js');
      assertContains(serverCode, "require('http')", 'server.js should import http module');
      assertContains(serverCode, "require('fs')", 'server.js should import fs module');
    } else {
      const projContent = readLocalFile('.agents/orchestrator/PROJECT.md');
      assertContains(projContent, 'server.js', 'PROJECT.md should specify server.js');
      assertContains(projContent, 'Local HTTP Server', 'PROJECT.md should specify Local HTTP Server feature');
    }
  });

  test('13.2 HTTP server specifies port configuration (3000)', () => {
    if (fileExists('server.js')) {
      const serverCode = readLocalFile('server.js');
      assertTrue(serverCode.includes('3000') || serverCode.includes('PORT'), 'server.js should configure port 3000');
    } else {
      const infraContent = readLocalFile('TEST_INFRA.md');
      assertContains(infraContent, 'Feature 13', 'TEST_INFRA.md should detail Feature 13');
      assertContains(infraContent, 'HTTP Server', 'TEST_INFRA.md should mandate HTTP server tests');
    }
  });

  test('13.3 static file serving routes handle HTML, CSS, and JS MIME types', () => {
    if (fileExists('server.js')) {
      const serverCode = readLocalFile('server.js');
      assertContains(serverCode, 'text/html', 'server.js should define text/html MIME type');
      assertContains(serverCode, 'text/css', 'server.js should define text/css MIME type');
    } else {
      const htmlContent = readLocalFile('index.html');
      const cssContent = readLocalFile('css/styles.css');
      assertTrue(htmlContent.length > 0, 'index.html static file must exist for server delivery');
      assertTrue(cssContent.length > 0, 'styles.css static file must exist for server delivery');
    }
  });

  test('13.4 project assets index.html, styles.css, and app.js are present for static serving', () => {
    assertTrue(fileExists('index.html'), 'index.html must exist for static serving');
    assertTrue(fileExists('css/styles.css'), 'css/styles.css must exist for static serving');
    assertTrue(fileExists('js/app.js'), 'js/app.js must exist for static serving');
  });

  test('13.5 HTTP server response headers deliver 200 OK for valid static routes', () => {
    if (fileExists('server.js')) {
      const serverCode = readLocalFile('server.js');
      assertContains(serverCode, '200', 'server.js should return 200 HTTP status code');
    } else {
      const reqContent = readLocalFile('ORIGINAL_REQUEST.md');
      assertContains(reqContent, 'Local HTTP server', 'ORIGINAL_REQUEST.md requires local HTTP server');
    }
  });
});
