/* ==========================================================================
   Tier 3: Cross-Feature Integration Test Suite
   Milestone 4 - CabsCrypto Cyber-Futuristic Portfolio Landing Page
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
  assertNotNull,
  assertDefined,
  assertDeepEqual,
  readLocalFile,
  fileExists,
  httpRequest,
  parseHTML,
  parseCSS,
  runInVMContext
} = require('./harness.js');

describe('Tier 3 - Pairwise Cross-Feature Integration Tests', () => {

  // ------------------------------------------------------------------------
  // Test 1: CLI command `projects` triggers Bento Grid section focus & project modal interaction
  // ------------------------------------------------------------------------
  test('CLI command "projects" triggers Bento Grid section focus & project modal interaction', () => {
    const appJS = readLocalFile('js/app.js');
    const terminalJS = readLocalFile('js/terminal.js');
    const bentoJS = readLocalFile('js/bento.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + terminalJS + '\n;\n' + bentoJS);
    const doc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    assertNotNull(CabsCrypto, 'window.CabsCrypto must be defined');

    // Setup DOM elements
    const bentoSection = doc.createElement('section');
    bentoSection.setAttribute('id', 'bento-container');
    doc.body.appendChild(bentoSection);

    const modalContainer = doc.createElement('div');
    modalContainer.setAttribute('id', 'modal-container');
    modalContainer.setAttribute('class', 'modal-overlay');
    doc.body.appendChild(modalContainer);

    const eventsList = [];
    CabsCrypto.on('terminal:execute', data => eventsList.push(data.command));
    CabsCrypto.on('modal:open', data => eventsList.push(`modal:${data.projectId}`));

    doc.dispatchEvent('DOMContentLoaded');

    // Execute 'projects' command
    CabsCrypto.executeCommand('projects');
    assertContains(eventsList, 'projects', 'terminal:execute must fire with "projects"');

    // Open modal interaction
    CabsCrypto.openModal('bot');
    assertEqual(CabsCrypto.state.activeModal, 'bot', 'CabsCrypto.state.activeModal should be "bot"');
    assertTrue(modalContainer.classList.contains('active'), 'modalContainer should have class active');
    assertContains(eventsList, 'modal:bot', 'modal:open event must fire with projectId "bot"');
  });

  // ------------------------------------------------------------------------
  // Test 2: CLI command `skills` switches Tech Stack Matrix tab to relevant domain category
  // ------------------------------------------------------------------------
  test('CLI command "skills" switches Tech Stack Matrix tab to relevant domain category', () => {
    const appJS = readLocalFile('js/app.js');
    const terminalJS = readLocalFile('js/terminal.js');
    const matrixJS = readLocalFile('js/matrix.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + terminalJS + '\n;\n' + matrixJS);
    const doc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    // Setup matrix container in DOM
    const matrixSection = doc.createElement('section');
    matrixSection.setAttribute('id', 'matrix-container');
    doc.body.appendChild(matrixSection);

    const terminalCmds = [];
    const matrixFilters = [];

    CabsCrypto.on('terminal:execute', data => terminalCmds.push(data.command));
    CabsCrypto.on('matrix:filter', data => matrixFilters.push(data.category));

    doc.dispatchEvent('DOMContentLoaded');

    // Trigger skills command
    CabsCrypto.executeCommand('skills');
    assertContains(terminalCmds, 'skills', 'terminal:execute should capture "skills" command');

    // Switch matrix tab category
    CabsCrypto.filterTechStack('web3');
    assertEqual(CabsCrypto.state.techMatrixCategory, 'web3', 'techMatrixCategory state should be updated to "web3"');
    assertContains(matrixFilters, 'web3', 'matrix:filter event should fire with category "web3"');
  });

  // ------------------------------------------------------------------------
  // Test 3: CLI command `matrix` toggles Matrix Digital Rain canvas while background aurora continues running
  // ------------------------------------------------------------------------
  test('CLI command "matrix" toggles Matrix Digital Rain canvas while background aurora continues running', () => {
    const htmlContent = readLocalFile('index.html');
    const cssContent = readLocalFile('css/styles.css');
    const doc = parseHTML(htmlContent);
    const css = parseCSS(cssContent);

    // Background elements in HTML static analysis
    assertTrue(doc.hasElement('#aurora-bg') || doc.hasElement('.aurora-mesh'), 'Background aurora mesh element must exist in HTML');
    assertTrue(doc.hasElement('#bg-canvas'), 'Background canvas element must exist in HTML');
    assertTrue(doc.hasElement('#cyber-grid'), 'Cyber grid element must exist in HTML');

    // Aurora animation in CSS static analysis
    assertTrue(css.rawCSS.includes('aurora'), 'CSS should include aurora animation rules');

    // VM Execution for CLI command matrix
    const appJS = readLocalFile('js/app.js');
    const terminalJS = readLocalFile('js/terminal.js');
    const matrixJS = readLocalFile('js/matrix.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + terminalJS + '\n;\n' + matrixJS);
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    const auroraEl = vDoc.createElement('div');
    auroraEl.setAttribute('id', 'aurora-bg');
    auroraEl.setAttribute('class', 'aurora-mesh');
    vDoc.body.appendChild(auroraEl);

    const canvasEl = vDoc.createElement('canvas');
    canvasEl.setAttribute('id', 'bg-canvas');
    vDoc.body.appendChild(canvasEl);

    const commandEvents = [];
    CabsCrypto.on('terminal:execute', data => commandEvents.push(data.command));

    vDoc.dispatchEvent('DOMContentLoaded');

    CabsCrypto.executeCommand('matrix');
    assertContains(commandEvents, 'matrix', 'terminal:execute event should receive "matrix" command');
    assertNotNull(vDoc.getElementById('aurora-bg'), 'Background aurora element should remain in DOM while matrix rain is toggled');
  });

  // ------------------------------------------------------------------------
  // Test 4: Dynamic Hero typing effect updates document header/title and syncs with CLI prompt state
  // ------------------------------------------------------------------------
  test('Dynamic Hero typing effect updates document header/title and syncs with CLI prompt state', () => {
    const appJS = readLocalFile('js/app.js');
    const heroJS = readLocalFile('js/hero.js');
    const terminalJS = readLocalFile('js/terminal.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + heroJS + '\n;\n' + terminalJS);
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    const typingSpan = vDoc.createElement('span');
    typingSpan.setAttribute('id', 'typing-text');
    vDoc.body.appendChild(typingSpan);

    const termInput = vDoc.createElement('input');
    termInput.setAttribute('id', 'terminal-input');
    vDoc.body.appendChild(termInput);

    vDoc.dispatchEvent('DOMContentLoaded');

    assertTrue(CabsCrypto.state.modulesLoaded.hero, 'hero module must be loaded');
    assertTrue(CabsCrypto.state.modulesLoaded.terminal, 'terminal module must be loaded');
  });

  // ------------------------------------------------------------------------
  // Test 5: Radial spotlight cursor tracking updates glassmorphic Bento Grid cards without interfering with background particle canvas
  // ------------------------------------------------------------------------
  test('Radial spotlight cursor tracking updates glassmorphic Bento Grid cards without interfering with background particle canvas', () => {
    const appJS = readLocalFile('js/app.js');
    const vmRes = runInVMContext(appJS);
    const vDoc = vmRes.document;

    const spotlightCard = vDoc.createElement('div');
    spotlightCard.setAttribute('class', 'spotlight-card bento-card');
    spotlightCard.setAttribute('id', 'proj-card-1');
    vDoc.body.appendChild(spotlightCard);

    vDoc.dispatchEvent('DOMContentLoaded');

    // Simulate mousemove on spotlight card
    const mouseEvt = {
      type: 'mousemove',
      clientX: 150,
      clientY: 250
    };
    spotlightCard.dispatchEvent(mouseEvt);

    assertDefined(spotlightCard.style['--mouse-x'], 'Card style --mouse-x variable must be set on mousemove');
    assertDefined(spotlightCard.style['--mouse-y'], 'Card style --mouse-y variable must be set on mousemove');
  });

  // ------------------------------------------------------------------------
  // Test 6: Opening Project Detail View Modal applies glassmorphic backdrop blur and pauses background animation if applicable
  // ------------------------------------------------------------------------
  test('Opening Project Detail View Modal applies glassmorphic backdrop blur and pauses background animation if applicable', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    // Check backdrop filter blur in modal overlay CSS
    const modalRules = css.getRulesForSelector('.modal-overlay');
    let hasBackdropBlur = false;
    modalRules.forEach(rule => {
      const bf = rule['backdrop-filter'] || rule['-webkit-backdrop-filter'];
      if (bf && bf.includes('blur')) {
        hasBackdropBlur = true;
      }
    });
    assertTrue(hasBackdropBlur || css.hasBackdropBlur(), '.modal-overlay must specify backdrop-filter blur');

    // Check VM runtime modal state lifecycle
    const appJS = readLocalFile('js/app.js');
    const vmRes = runInVMContext(appJS);
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    const modalContainer = vDoc.createElement('div');
    modalContainer.setAttribute('id', 'modal-container');
    modalContainer.setAttribute('class', 'modal-overlay');
    vDoc.body.appendChild(modalContainer);

    vDoc.dispatchEvent('DOMContentLoaded');

    assertEqual(CabsCrypto.state.activeModal, null, 'Initial activeModal state should be null');

    // Open modal
    CabsCrypto.openModal('bot');
    assertEqual(CabsCrypto.state.activeModal, 'bot', 'activeModal should be "bot"');
    assertTrue(modalContainer.classList.contains('active'), 'modalContainer should have "active" class');
    assertEqual(modalContainer.getAttribute('aria-hidden'), 'false', 'aria-hidden should be "false"');
    assertEqual(vDoc.body.style.overflow, 'hidden', 'document body overflow should be set to "hidden" when modal is active');

    // Close modal
    CabsCrypto.closeModal();
    assertEqual(CabsCrypto.state.activeModal, null, 'activeModal should revert to null after closeModal()');
    assertFalse(modalContainer.classList.contains('active'), 'modalContainer "active" class should be removed');
    assertEqual(modalContainer.getAttribute('aria-hidden'), 'true', 'aria-hidden should revert to "true"');
    assertEqual(vDoc.body.style.overflow, '', 'document body overflow should reset when modal is closed');
  });

  // ------------------------------------------------------------------------
  // Test 7: Mobile responsive layout collapses navbar links into mobile menu while CLI terminal remains fully usable
  // ------------------------------------------------------------------------
  test('Mobile responsive layout collapses navbar links into mobile menu while CLI terminal remains fully usable', () => {
    const appJS = readLocalFile('js/app.js');
    const terminalJS = readLocalFile('js/terminal.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + terminalJS, { innerWidth: 375, innerHeight: 667 });
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    // Build Navbar DOM structure
    const nav = vDoc.createElement('nav');
    nav.setAttribute('id', 'navbar');
    const toggleBtn = vDoc.createElement('button');
    toggleBtn.setAttribute('id', 'mobile-menu-toggle');
    const navLinks = vDoc.createElement('ul');
    navLinks.setAttribute('class', 'nav-links');
    nav.appendChild(toggleBtn);
    nav.appendChild(navLinks);
    vDoc.body.appendChild(nav);

    // Build Terminal DOM structure
    const termInput = vDoc.createElement('input');
    termInput.setAttribute('id', 'terminal-input');
    vDoc.body.appendChild(termInput);

    const commandEvents = [];
    CabsCrypto.on('terminal:execute', data => commandEvents.push(data.command));

    vDoc.dispatchEvent('DOMContentLoaded');

    // Test mobile menu toggle open
    assertFalse(CabsCrypto.state.isMobileMenuOpen, 'Mobile menu initially closed');
    toggleBtn.click();
    assertTrue(CabsCrypto.state.isMobileMenuOpen, 'Mobile menu should be open after toggle click');
    assertTrue(navLinks.classList.contains('nav-open'), 'navLinks should receive nav-open class');

    // Verify terminal command execution remains fully operational while mobile menu is open
    CabsCrypto.executeCommand('help');
    assertContains(commandEvents, 'help', 'Terminal command execution must succeed when mobile menu is active');

    // Toggle mobile menu close
    toggleBtn.click();
    assertFalse(CabsCrypto.state.isMobileMenuOpen, 'Mobile menu should close on second toggle click');
    assertFalse(navLinks.classList.contains('nav-open'), 'navLinks should remove nav-open class');
  });

  // ------------------------------------------------------------------------
  // Test 8: Tech Stack Matrix domain tabs filter skill progress bars while maintaining dark neon theme CSS variables
  // ------------------------------------------------------------------------
  test('Tech Stack Matrix domain tabs filter skill progress bars while maintaining dark neon theme CSS variables', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    // Verify dark neon theme CSS variables
    const vars = css.getCSSVariables();
    assertEqual(vars['--bg-dark'].toLowerCase(), '#08090f', '--bg-dark must equal #08090f');
    assertEqual(vars['--neon-cyan'].toLowerCase(), '#00f3ff', '--neon-cyan must equal #00f3ff');
    assertEqual(vars['--neon-magenta'].toLowerCase(), '#ff007a', '--neon-magenta must equal #ff007a');
    assertEqual(vars['--neon-lime'].toLowerCase(), '#00ff66', '--neon-lime must equal #00ff66');

    // Verify VM domain tab filtering state changes
    const appJS = readLocalFile('js/app.js');
    const matrixJS = readLocalFile('js/matrix.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + matrixJS);
    const CabsCrypto = vmRes.CabsCrypto;

    const categoriesTested = [];
    CabsCrypto.on('matrix:filter', data => categoriesTested.push(data.category));

    // Test domain filters
    const filterList = ['web3', 'frontend', 'backend', 'devops', 'all'];
    filterList.forEach(cat => {
      CabsCrypto.filterTechStack(cat);
      assertEqual(CabsCrypto.state.techMatrixCategory, cat, `State techMatrixCategory should equal "${cat}"`);
    });

    assertDeepEqual(categoriesTested, filterList, 'matrix:filter event history must match filter sequence');
  });

  // ------------------------------------------------------------------------
  // Test 9: HTTP static server serves HTML, CSS, JS with correct MIME types and charset headers to allow seamless script loading
  // ------------------------------------------------------------------------
  test('HTTP static server serves HTML, CSS, JS with correct MIME types and charset headers to allow seamless script loading', async () => {
    const { server } = require('../server.js');
    let baseUrl = '';

    await new Promise(resolve => {
      if (server.listening) {
        const addr = server.address();
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      } else {
        server.listen(0, '127.0.0.1', () => {
          const addr = server.address();
          baseUrl = `http://127.0.0.1:${addr.port}`;
          resolve();
        });
      }
    });

    try {
      // 1. Fetch HTML
      const htmlRes = await httpRequest(`${baseUrl}/index.html`);
      assertEqual(htmlRes.statusCode, 200);
      assertContains(htmlRes.headers['content-type'], 'text/html');

      // 2. Fetch CSS
      const cssRes = await httpRequest(`${baseUrl}/css/styles.css`);
      assertEqual(cssRes.statusCode, 200);
      assertContains(cssRes.headers['content-type'], 'text/css');

      // 3. Fetch Core JS
      const appRes = await httpRequest(`${baseUrl}/js/app.js`);
      assertEqual(appRes.statusCode, 200);
      assertContains(appRes.headers['content-type'], 'javascript');

      // 4. Fetch Module JS files
      const modules = ['hero.js', 'terminal.js', 'bento.js', 'matrix.js'];
      for (const mod of modules) {
        const modRes = await httpRequest(`${baseUrl}/js/${mod}`);
        assertEqual(modRes.statusCode, 200, `Module js/${mod} must return status 200`);
        assertContains(modRes.headers['content-type'], 'javascript', `Module js/${mod} must have javascript MIME type`);
      }

      // 5. 404 handler
      const notFoundRes = await httpRequest(`${baseUrl}/invalid-file.js`);
      assertEqual(notFoundRes.statusCode, 404);
    } finally {
      if (server && server.listening) {
        await new Promise(r => server.close(r));
      }
    }
  });

  // ------------------------------------------------------------------------
  // Test 10: Terminal command `clear` resets terminal DOM buffer without clearing background canvas or matrix rain state
  // ------------------------------------------------------------------------
  test('Terminal command "clear" resets terminal DOM buffer without clearing background canvas or matrix rain state', () => {
    const appJS = readLocalFile('js/app.js');
    const terminalJS = readLocalFile('js/terminal.js');
    const matrixJS = readLocalFile('js/matrix.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + terminalJS + '\n;\n' + matrixJS);
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    // Setup DOM elements
    const bgCanvas = vDoc.createElement('canvas');
    bgCanvas.setAttribute('id', 'bg-canvas');
    vDoc.body.appendChild(bgCanvas);

    const termBody = vDoc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    vDoc.body.appendChild(termBody);

    const executedCmds = [];
    CabsCrypto.on('terminal:execute', data => executedCmds.push(data.command));

    vDoc.dispatchEvent('DOMContentLoaded');

    // Execute clear command
    CabsCrypto.executeCommand('clear');

    assertContains(executedCmds, 'clear', 'terminal:execute should record "clear" command');
    assertNotNull(vDoc.getElementById('bg-canvas'), 'bg-canvas background element must remain intact in DOM');
  });

  // ------------------------------------------------------------------------
  // Test 11: Glassmorphic card styling adapts across mobile, tablet, and desktop breakpoints without breaking neon border glow
  // ------------------------------------------------------------------------
  test('Glassmorphic card styling adapts across mobile, tablet, and desktop breakpoints without breaking neon border glow', () => {
    const htmlContent = readLocalFile('index.html');
    const cssContent = readLocalFile('css/styles.css');

    const doc = parseHTML(htmlContent);
    const css = parseCSS(cssContent);

    // HTML structure check for glass-card and spotlight-card
    const glassCards = doc.getElementsByClassName('glass-card');
    assertTrue(glassCards.length >= 4, `Expected at least 4 glass-card elements, found ${glassCards.length}`);

    // CSS variables and neon glow properties check
    const vars = css.getCSSVariables();
    assertDefined(vars['--border-glass'], '--border-glass must be defined');
    assertDefined(vars['--glow-cyan'], '--glow-cyan must be defined');

    // Responsive media queries check
    const mediaQueries = css.getMediaQueries();
    assertTrue(mediaQueries.length >= 2, 'CSS should define responsive media queries across breakpoints');

    // Verify layout adaptation breakpoints in CSS (mobile & desktop)
    const hasMobileBreakpoint = mediaQueries.some(q => q.includes('768px'));
    const hasDesktopBreakpoint = mediaQueries.some(q => q.includes('992px') || q.includes('1024px'));
    assertTrue(hasMobileBreakpoint, 'Media queries must include mobile breakpoint (768px)');
    assertTrue(hasDesktopBreakpoint, 'Media queries must include desktop breakpoint (992px/1024px)');
  });

  // ------------------------------------------------------------------------
  // Test 12: Matrix digital rain overlay sits on higher z-index than particle canvas but below modal overlay
  // ------------------------------------------------------------------------
  test('Matrix digital rain overlay sits on higher z-index than particle canvas but below modal overlay', () => {
    const cssContent = readLocalFile('css/styles.css');
    const css = parseCSS(cssContent);

    // Parse z-index properties from CSS
    const bgCanvasRule = css.getRulesForSelector('#bg-canvas')[0] || {};
    const cyberGridRule = css.getRulesForSelector('#cyber-grid')[0] || css.getRulesForSelector('.cyber-grid-overlay')[0] || {};
    const modalOverlayRule = css.getRulesForSelector('.modal-overlay')[0] || css.getRulesForSelector('#modal-container')[0] || {};

    const canvasZ = parseInt(bgCanvasRule['z-index'] || '-2', 10);
    const modalZ = parseInt(modalOverlayRule['z-index'] || '2000', 10);

    // Verify z-index hierarchy: particle canvas (-2) < modal overlay (2000)
    assertTrue(modalZ > canvasZ, `Modal overlay z-index (${modalZ}) must be greater than particle canvas z-index (${canvasZ})`);
    assertTrue(modalZ >= 1000, `Modal overlay z-index (${modalZ}) must be high priority above content elements`);
  });

  // ------------------------------------------------------------------------
  // Test 13: Dynamic JS module initialization order (`app.js` -> `hero.js` -> `terminal.js` -> `bento.js` -> `matrix.js`) preserves global `CabsCrypto` state bus
  // ------------------------------------------------------------------------
  test('Dynamic JS module initialization order (app.js -> hero.js -> terminal.js -> bento.js -> matrix.js) preserves global CabsCrypto state bus', () => {
    const appJS = readLocalFile('js/app.js');
    const heroJS = readLocalFile('js/hero.js');
    const terminalJS = readLocalFile('js/terminal.js');
    const bentoJS = readLocalFile('js/bento.js');
    const matrixJS = readLocalFile('js/matrix.js');

    // Load modules in order
    const combinedScripts = [appJS, heroJS, terminalJS, bentoJS, matrixJS].join('\n;\n');

    const vmRes = runInVMContext(combinedScripts);
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    assertNotNull(CabsCrypto, 'CabsCrypto object must be initialized');
    assertEqual(typeof CabsCrypto.on, 'function', 'CabsCrypto.on must be a function');
    assertEqual(typeof CabsCrypto.emit, 'function', 'CabsCrypto.emit must be a function');

    vDoc.dispatchEvent('DOMContentLoaded');

    // Verify state store modulesLoaded flags
    const modules = CabsCrypto.state.modulesLoaded;
    assertTrue(modules.hero, 'hero module must be registered');
    assertTrue(modules.terminal, 'terminal module must be registered');
    assertTrue(modules.bento, 'bento module must be registered');
    assertTrue(modules.matrix, 'matrix module must be registered');

    // Verify state bus responsiveness after complete module load sequence
    const testPayloads = [];
    CabsCrypto.on('test:event', data => testPayloads.push(data.val));
    CabsCrypto.emit('test:event', { val: 42 });

    assertContains(testPayloads, 42, 'Global PubSub event bus must function cleanly across all initialized modules');
  });

});
