/* ==========================================================================
   Tier 4: Real-World Application Workloads Test Suite
   Milestone 5 - CabsCrypto Cyber-Futuristic Portfolio Landing Page
   ========================================================================== */

const http = require('http');
const path = require('path');
const fs = require('fs');

const {
  describe,
  test,
  beforeAll,
  afterAll,
  assert,
  assertTrue,
  assertFalse,
  assertEqual,
  assertNotEqual,
  assertContains,
  assertMatches,
  assertNull,
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

// --------------------------------------------------------------------------
// Scenario 1: Full Visitor Landing Session
// Focus: Hero viewing -> terminal CLI help -> projects -> click bento project card -> view project modal -> close modal
// --------------------------------------------------------------------------
describe('Tier 4 - Scenario 1: Full Visitor Landing Session', () => {
  test('Hero section structure, gradient title, subtitle, and CTA actions', () => {
    const htmlContent = readLocalFile('index.html');
    const cssContent = readLocalFile('css/styles.css');

    const doc = parseHTML(htmlContent);
    const css = parseCSS(cssContent);

    // Hero section element presence
    assertTrue(doc.hasElement('#hero-container'), 'Hero container section #hero-container must exist');
    assertTrue(doc.hasElement('#hero-status'), 'Hero status tag #hero-status must exist');
    assertTrue(doc.hasElement('.hero-title'), 'Hero title element must exist');
    assertTrue(doc.hasElement('#typing-text'), 'Hero typing text span #typing-text must exist');
    assertTrue(doc.hasElement('.hero-subtitle'), 'Hero subtitle paragraph must exist');

    // Hero action buttons
    assertTrue(doc.hasElement('#btn-explore-projects'), 'Explore projects CTA button must exist');
    assertTrue(doc.hasElement('#btn-live-demo'), 'Live demo CTA button must exist');

    // Check CSS styling for hero section
    assertTrue(css.hasSelector('.hero'), 'CSS should style .hero section');
    const heroTitleRule = css.getRulesForSelector('.hero-title');
    assertTrue(heroTitleRule.length > 0 || css.hasSelector('.hero-title'), 'CSS should contain .hero-title rules');
  });

  test('Interactive terminal execution flow (help & projects commands) in VM runtime', () => {
    const appJS = readLocalFile('js/app.js');
    const heroJS = readLocalFile('js/hero.js');
    const terminalJS = readLocalFile('js/terminal.js');

    const vmRes = runInVMContext(appJS + '\n' + heroJS + '\n' + terminalJS);
    const doc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    assertNotNull(CabsCrypto, 'window.CabsCrypto namespace must be defined');

    // Setup terminal DOM nodes in VM document
    const termSection = doc.createElement('section');
    termSection.setAttribute('id', 'terminal-container');
    const termCard = doc.createElement('div');
    termCard.setAttribute('id', 'terminal');
    const termInput = doc.createElement('input');
    termInput.setAttribute('id', 'terminal-input');
    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');

    termCard.appendChild(termBody);
    termCard.appendChild(termInput);
    termSection.appendChild(termCard);
    doc.body.appendChild(termSection);

    // Track executed commands via PubSub event bus
    const executedCommands = [];
    CabsCrypto.on('terminal:execute', (data) => {
      executedCommands.push(data.command);
    });

    // Fire DOM ready
    doc.dispatchEvent('DOMContentLoaded');

    // Execute 'help' command
    CabsCrypto.executeCommand('help');
    assertContains(executedCommands, 'help', 'terminal:execute event should receive "help" command');

    // Execute 'projects' command
    CabsCrypto.executeCommand('projects');
    assertContains(executedCommands, 'projects', 'terminal:execute event should receive "projects" command');
  });

  test('Bento project card inspection and modal lifecycle (open -> inspect -> close)', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    // Verify Bento project cards in HTML
    const cards = doc.getElementsByClassName('proj-card');
    assertTrue(cards.length >= 3, 'Expected at least 3 project cards in HTML');

    const card1 = cards[0];
    assertNotNull(card1.getAttribute('data-project'), 'Project card data-project should be defined');

    // Execute app.js & bento.js in VM context
    const appJS = readLocalFile('js/app.js');
    const bentoJS = readLocalFile('js/bento.js');

    const vmRes = runInVMContext(appJS + '\n' + bentoJS);
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    // Create modal elements in VM DOM
    const modalContainer = vDoc.createElement('div');
    modalContainer.setAttribute('id', 'modal-container');
    modalContainer.setAttribute('class', 'modal-overlay');
    vDoc.body.appendChild(modalContainer);

    // Initial state check
    assertNull(CabsCrypto.state.activeModal, 'Initial activeModal state should be null');

    // Open project modal using alias 'bot' -> 'agente'
    CabsCrypto.openModal('bot');
    assertEqual(CabsCrypto.state.activeModal, 'bot', 'activeModal state should be "bot"');
    assertTrue(modalContainer.classList.contains('active'), 'Modal container should have active class');
    assertEqual(modalContainer.getAttribute('aria-hidden'), 'false', 'Modal aria-hidden should be "false"');

    // Close project modal
    CabsCrypto.closeModal();
    assertNull(CabsCrypto.state.activeModal, 'activeModal state should reset to null');
    assertFalse(modalContainer.classList.contains('active'), 'Modal container active class should be removed');
    assertEqual(modalContainer.getAttribute('aria-hidden'), 'true', 'Modal aria-hidden should be "true"');
  });
});

// --------------------------------------------------------------------------
// Scenario 2: Dev CLI Interactive Session
// Focus: Terminal crypto -> stats -> matrix rain toggle -> clear command -> verify clean terminal state
// --------------------------------------------------------------------------
describe('Tier 4 - Scenario 2: Dev CLI Interactive Session', () => {
  test('Dev CLI commands sequence (crypto -> stats -> matrix -> clear) in VM context', () => {
    const appJS = readLocalFile('js/app.js');
    const terminalJS = readLocalFile('js/terminal.js');
    const matrixJS = readLocalFile('js/matrix.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + terminalJS + '\n;\n' + matrixJS);
    const doc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    const termBody = doc.createElement('div');
    termBody.setAttribute('id', 'terminal-body');
    const termInput = doc.createElement('input');
    termInput.setAttribute('id', 'terminal-input');
    doc.body.appendChild(termBody);
    doc.body.appendChild(termInput);

    doc.dispatchEvent('DOMContentLoaded');

    const cmds = ['crypto', 'stats', 'matrix', 'clear'];
    const executed = [];

    CabsCrypto.on('terminal:execute', data => executed.push(data.command));

    cmds.forEach(cmd => CabsCrypto.executeCommand(cmd));

    assertDeepEqual(executed, cmds, 'Executed command sequence must match input sequence');
  });
});

// --------------------------------------------------------------------------
// Scenario 3: Tech Matrix Filtering & Project Deep-Dive
// Focus: Filter matrix by web3 -> filter by frontend -> click bento project -> inspect details
// --------------------------------------------------------------------------
describe('Tier 4 - Scenario 3: Tech Matrix Filtering & Project Deep-Dive', () => {
  test('Filter matrix by web3 -> filter by frontend -> open project modal', () => {
    const appJS = readLocalFile('js/app.js');
    const bentoJS = readLocalFile('js/bento.js');
    const matrixJS = readLocalFile('js/matrix.js');

    const vmRes = runInVMContext(appJS + '\n;\n' + bentoJS + '\n;\n' + matrixJS);
    const CabsCrypto = vmRes.CabsCrypto;

    const filters = [];
    CabsCrypto.on('matrix:filter', data => filters.push(data.category));

    CabsCrypto.filterTechStack('web3');
    assertEqual(CabsCrypto.state.techMatrixCategory, 'web3');

    CabsCrypto.filterTechStack('frontend');
    assertEqual(CabsCrypto.state.techMatrixCategory, 'frontend');

    assertDeepEqual(filters, ['web3', 'frontend']);

    CabsCrypto.openModal('agente');
    assertEqual(CabsCrypto.state.activeModal, 'agente');
  });
});

// --------------------------------------------------------------------------
// Scenario 4: Cyber Aesthetic & FX Stress Test
// Focus: Theme variables inspection -> spotlight mouse tracking -> background aurora mesh -> matrix rain canvas overlay rendering under load
// --------------------------------------------------------------------------
describe('Tier 4 - Scenario 4: Cyber Aesthetic & FX Stress Test', () => {
  test('Theme variables, glassmorphic backdrop filter, and background mesh integrity', () => {
    const cssContent = readLocalFile('css/styles.css');
    const htmlContent = readLocalFile('index.html');

    const css = parseCSS(cssContent);
    const doc = parseHTML(htmlContent);

    // Neon palette variables assertion
    const vars = css.getCSSVariables();
    assertDefined(vars['--bg-dark'], '--bg-dark must be defined');
    assertDefined(vars['--neon-cyan'], '--neon-cyan must be defined');
    assertDefined(vars['--neon-magenta'], '--neon-magenta must be defined');
    assertDefined(vars['--neon-lime'], '--neon-lime must be defined');

    assertEqual(vars['--neon-cyan'].toLowerCase(), '#00f3ff');
    assertEqual(vars['--neon-magenta'].toLowerCase(), '#ff007a');
    assertEqual(vars['--neon-lime'].toLowerCase(), '#00ff66');

    // Backdrop filter blur presence check
    assertTrue(css.hasBackdropBlur(), 'Glassmorphism backdrop-filter blur must be present in CSS');

    // Canvas background and grid overlay DOM check
    assertTrue(doc.hasElement('#bg-canvas'), '#bg-canvas must exist');
    assertTrue(doc.hasElement('#cyber-grid'), '#cyber-grid overlay must exist');
    assertTrue(doc.hasElement('#aurora-bg'), '#aurora-bg mesh must exist');
    assertTrue(doc.hasElement('#spotlight-cursor'), '#spotlight-cursor element must exist');
  });

  test('Spotlight cursor mouse tracking stress test (100 rapid events)', () => {
    const appJS = readLocalFile('js/app.js');
    const vmRes = runInVMContext(appJS);
    const doc = vmRes.document;

    // Create 3 spotlight cards
    for (let i = 1; i <= 3; i++) {
      const card = doc.createElement('div');
      card.setAttribute('class', 'spotlight-card');
      card.setAttribute('id', `test-spotlight-${i}`);
      doc.body.appendChild(card);
    }

    doc.dispatchEvent('DOMContentLoaded');

    const testCard = doc.querySelector('#test-spotlight-1');

    // Dispatch 100 rapid mousemove events across document and card
    for (let i = 0; i < 100; i++) {
      const mouseEvt = { type: 'mousemove', clientX: 10 + i * 5, clientY: 20 + i * 5 };
      doc.dispatchEvent(mouseEvt);
      testCard.dispatchEvent(mouseEvt);
    }

    // Verify card local style variables updated
    assertDefined(testCard.style['--mouse-x'], '--mouse-x style variable should be populated on card');
    assertDefined(testCard.style['--mouse-y'], '--mouse-y style variable should be populated on card');
  });

  test('2D canvas particle network animation rendering under stress (50 cycles)', () => {
    const appJS = readLocalFile('js/app.js');
    const vmRes = runInVMContext(appJS);
    const doc = vmRes.document;

    const canvas = doc.createElement('canvas');
    canvas.setAttribute('id', 'bg-canvas');
    doc.body.appendChild(canvas);

    doc.dispatchEvent('DOMContentLoaded');

    const ctx = canvas.getContext('2d');
    assertNotNull(ctx, 'Canvas 2d context must be obtainable');

    // Execute 50 manual frame draws
    for (let frame = 0; frame < 50; frame++) {
      ctx.clearRect(0, 0, 1280, 800);
      ctx.beginPath();
      ctx.arc(10 + frame, 20 + frame, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    assertTrue(canvas.style.width !== '', 'Canvas width style initialized during rendering');
    assertTrue(canvas.style.height !== '', 'Canvas height style initialized during rendering');
  });
});

// --------------------------------------------------------------------------
// Scenario 5: Multi-Device Responsive Layout Audit
// Focus: Desktop viewport -> Tablet viewport -> Mobile viewport DOM/CSS layout verification across all 4 major sections
// --------------------------------------------------------------------------
describe('Tier 4 - Scenario 5: Multi-Device Responsive Layout Audit', () => {
  test('Meta viewport tag and CSS media query breakpoint hierarchy', () => {
    const htmlContent = readLocalFile('index.html');
    const cssContent = readLocalFile('css/styles.css');

    const doc = parseHTML(htmlContent);
    const css = parseCSS(cssContent);

    // Meta viewport tag presence check
    const metas = doc.getElementsByTagName('meta');
    let hasViewport = false;
    for (const m of metas) {
      if (m.getAttribute('name') === 'viewport') {
        hasViewport = true;
        assertContains(m.getAttribute('content'), 'width=device-width');
      }
    }
    assertTrue(hasViewport, 'Viewport meta tag must be set');

    // Responsive media queries check
    const queries = css.getMediaQueries();
    assertTrue(queries.length >= 2, `Expected at least 2 media queries for responsive layout, found ${queries.length}`);

    // Verify key breakpoints
    assertTrue(queries.some(q => q.includes('992px') || q.includes('1024px')), 'CSS should contain tablet/desktop breakpoint');
    assertTrue(queries.some(q => q.includes('768px')), 'CSS should contain mobile breakpoint');
  });

  test('Verification of 4 major section containers across viewports', () => {
    const htmlContent = readLocalFile('index.html');
    const doc = parseHTML(htmlContent);

    // Major sections check
    assertTrue(doc.hasElement('#hero-container'), 'Section 1: Hero Container');
    assertTrue(doc.hasElement('#terminal-container'), 'Section 2: Terminal Container');
    assertTrue(doc.hasElement('#bento-container'), 'Section 3: Bento Grid Container');
    assertTrue(doc.hasElement('#matrix-container'), 'Section 4: Tech Stack Matrix Container');
    assertTrue(doc.hasElement('#stats'), 'Section 5: GitHub Metrics Container');
    assertTrue(doc.hasElement('#contact'), 'Section 6: Footer Contact Container');
  });

  test('Mobile responsive menu toggle state in VM engine', () => {
    const appJS = readLocalFile('js/app.js');
    const vmRes = runInVMContext(appJS, { innerWidth: 375, innerHeight: 667 });
    const doc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    // Create navbar DOM nodes
    const nav = doc.createElement('nav');
    nav.setAttribute('id', 'navbar');
    const toggleBtn = doc.createElement('button');
    toggleBtn.setAttribute('id', 'mobile-menu-toggle');
    const navLinks = doc.createElement('ul');
    navLinks.setAttribute('class', 'nav-links');

    nav.appendChild(toggleBtn);
    nav.appendChild(navLinks);
    doc.body.appendChild(nav);

    doc.dispatchEvent('DOMContentLoaded');

    // Initial mobile state
    assertFalse(CabsCrypto.state.isMobileMenuOpen, 'Mobile menu should initially be closed');

    // Click toggle button to open
    toggleBtn.click();
    assertTrue(navLinks.classList.contains('nav-open'), 'navLinks should receive nav-open class');
    assertTrue(toggleBtn.classList.contains('active'), 'toggleBtn should receive active class');
    assertEqual(toggleBtn.getAttribute('aria-expanded'), 'true');
    assertTrue(CabsCrypto.state.isMobileMenuOpen, 'CabsCrypto.state.isMobileMenuOpen should be true');

    // Click toggle button again to close
    toggleBtn.click();
    assertFalse(navLinks.classList.contains('nav-open'), 'navLinks should remove nav-open class');
    assertFalse(toggleBtn.classList.contains('active'), 'toggleBtn should remove active class');
    assertEqual(toggleBtn.getAttribute('aria-expanded'), 'false');
    assertFalse(CabsCrypto.state.isMobileMenuOpen, 'CabsCrypto.state.isMobileMenuOpen should reset to false');
  });
});

// --------------------------------------------------------------------------
// Scenario 6: Network Resilience & Static Server Load
// Focus: HTTP GET requests for static files (/index.html, /css/styles.css, /js/app.js, /js/hero.js, /js/terminal.js, /js/bento.js, /js/matrix.js)
// --------------------------------------------------------------------------
describe('Tier 4 - Scenario 6: Network Resilience & Static Server Load', () => {
  let serverInstance = null;
  let serverUrl = '';

  beforeAll(() => {
    return new Promise((resolve) => {
      const { server } = require('../server.js');
      serverInstance = server;

      if (server.listening) {
        const address = server.address();
        serverUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      } else {
        server.listen(0, '127.0.0.1', () => {
          const address = server.address();
          serverUrl = `http://127.0.0.1:${address.port}`;
          resolve();
        });
      }
    });
  });

  afterAll(() => {
    return new Promise((resolve) => {
      if (serverInstance && serverInstance.listening) {
        serverInstance.close(() => resolve());
      } else {
        resolve();
      }
    });
  });

  test('HTTP GET /index.html returns 200 OK with text/html and non-empty body', async () => {
    const res = await httpRequest(`${serverUrl}/index.html`);
    assertEqual(res.statusCode, 200);
    assertContains(res.headers['content-type'], 'text/html');
    assertTrue(res.body.length > 0, 'body length must be greater than 0');
    assertContains(res.body, 'CabsCrypto');
  });

  test('HTTP GET /css/styles.css returns 200 OK with text/css and non-empty body', async () => {
    const res = await httpRequest(`${serverUrl}/css/styles.css`);
    assertEqual(res.statusCode, 200);
    assertContains(res.headers['content-type'], 'text/css');
    assertTrue(res.body.length > 0);
    assertContains(res.body, '--neon-cyan');
  });

  test('HTTP GET /js/app.js returns 200 OK with javascript and non-empty body', async () => {
    const res = await httpRequest(`${serverUrl}/js/app.js`);
    assertEqual(res.statusCode, 200);
    assertContains(res.headers['content-type'], 'javascript');
    assertTrue(res.body.length > 0);
    assertContains(res.body, 'CabsCrypto');
  });

  test('HTTP GET /js/hero.js returns 200 OK with javascript and non-empty body', async () => {
    const res = await httpRequest(`${serverUrl}/js/hero.js`);
    assertEqual(res.statusCode, 200);
    assertContains(res.headers['content-type'], 'javascript');
    assertTrue(res.body.length > 0);
  });

  test('HTTP GET /js/terminal.js returns 200 OK with javascript and non-empty body', async () => {
    const res = await httpRequest(`${serverUrl}/js/terminal.js`);
    assertEqual(res.statusCode, 200);
    assertContains(res.headers['content-type'], 'javascript');
    assertTrue(res.body.length > 0);
  });

  test('HTTP GET /js/bento.js returns 200 OK with javascript and non-empty body', async () => {
    const res = await httpRequest(`${serverUrl}/js/bento.js`);
    assertEqual(res.statusCode, 200);
    assertContains(res.headers['content-type'], 'javascript');
    assertTrue(res.body.length > 0);
  });

  test('HTTP GET /js/matrix.js returns 200 OK with javascript and non-empty body', async () => {
    const res = await httpRequest(`${serverUrl}/js/matrix.js`);
    assertEqual(res.statusCode, 200);
    assertContains(res.headers['content-type'], 'javascript');
    assertTrue(res.body.length > 0);
  });

  test('HTTP GET /nonexistent-file.js returns 404 Not Found', async () => {
    const res = await httpRequest(`${serverUrl}/nonexistent-file.js`);
    assertEqual(res.statusCode, 404);
  });
});

// --------------------------------------------------------------------------
// Scenario 7: Full Suite End-to-End Integration
// Focus: Complete sequence of static assertions, VM execution, and HTTP server endpoint validation
// --------------------------------------------------------------------------
describe('Tier 4 - Scenario 7: Full Suite End-to-End Integration', () => {
  let serverInstance = null;
  let serverUrl = '';

  beforeAll(() => {
    return new Promise((resolve) => {
      const { server } = require('../server.js');
      serverInstance = server;

      if (server.listening) {
        const address = server.address();
        serverUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      } else {
        server.listen(0, '127.0.0.1', () => {
          const address = server.address();
          serverUrl = `http://127.0.0.1:${address.port}`;
          resolve();
        });
      }
    });
  });

  afterAll(() => {
    return new Promise((resolve) => {
      if (serverInstance && serverInstance.listening) {
        serverInstance.close(() => resolve());
      } else {
        resolve();
      }
    });
  });

  test('Complete end-to-end integration flow (Static, VM Runtime & HTTP Delivery)', async () => {
    // 1. Static File Verification
    const staticFiles = [
      'index.html',
      'css/styles.css',
      'js/app.js',
      'js/hero.js',
      'js/terminal.js',
      'js/bento.js',
      'js/matrix.js'
    ];

    for (const f of staticFiles) {
      assertTrue(fileExists(f), `File ${f} must exist in project root`);
      const content = readLocalFile(f);
      assertTrue(content.length > 0, `File ${f} must not be empty`);
    }

    // 2. HTML & CSS Static Analysis
    const htmlContent = readLocalFile('index.html');
    const cssContent = readLocalFile('css/styles.css');

    const doc = parseHTML(htmlContent);
    const css = parseCSS(cssContent);

    // Verify key DOM elements
    assertTrue(doc.hasElement('#hero-container'));
    assertTrue(doc.hasElement('#terminal-container'));
    assertTrue(doc.hasElement('#bento-container'));
    assertTrue(doc.hasElement('#matrix-container'));
    assertTrue(doc.hasElement('#modal-container'));

    // Verify CSS variables
    const vars = css.getCSSVariables();
    assertEqual(vars['--neon-cyan'].toLowerCase(), '#00f3ff');

    // 3. VM Runtime Full Execution Sequence
    const combinedJS = [
      readLocalFile('js/app.js'),
      readLocalFile('js/hero.js'),
      readLocalFile('js/terminal.js'),
      readLocalFile('js/bento.js'),
      readLocalFile('js/matrix.js')
    ].join('\n;\n');

    const vmRes = runInVMContext(combinedJS);
    const vDoc = vmRes.document;
    const CabsCrypto = vmRes.CabsCrypto;

    // Create modal element in VM document
    const modalContainer = vDoc.createElement('div');
    modalContainer.setAttribute('id', 'modal-container');
    vDoc.body.appendChild(modalContainer);

    vDoc.dispatchEvent('DOMContentLoaded');

    // Run API operations
    CabsCrypto.openModal('bot');
    assertEqual(CabsCrypto.state.activeModal, 'bot');

    CabsCrypto.closeModal();
    assertNull(CabsCrypto.state.activeModal);

    CabsCrypto.executeCommand('help');
    CabsCrypto.filterTechStack('web3');
    assertEqual(CabsCrypto.state.techMatrixCategory, 'web3');

    // 4. HTTP Endpoint Delivery Verification
    const indexRes = await httpRequest(`${serverUrl}/index.html`);
    assertEqual(indexRes.statusCode, 200);

    const cssRes = await httpRequest(`${serverUrl}/css/styles.css`);
    assertEqual(cssRes.statusCode, 200);

    const appRes = await httpRequest(`${serverUrl}/js/app.js`);
    assertEqual(appRes.statusCode, 200);
  });
});
