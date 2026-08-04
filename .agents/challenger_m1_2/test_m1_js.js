/* ==========================================================================
   Empirical Test Runner for M1 JavaScript Runtime & CabsCrypto Contract APIs
   File: .agents/challenger_m1_2/test_m1_js.js
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROJECT_ROOT = path.resolve(__dirname, '../..');

console.log('===========================================================');
console.log(' Challenger 2: M1 Empirical JS Runtime & Contract Test Suite');
console.log('===========================================================');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (!condition) {
    failCount++;
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion Failed: ${message}`);
  } else {
    passCount++;
    console.log(`  ✓ PASS: ${message}`);
  }
}

// --------------------------------------------------------------------------
// Test Suite 1: Node Syntax & Execution Check
// --------------------------------------------------------------------------
console.log('\n--- Suite 1: Syntax & Execution Verification ---');

const jsFiles = [
  'js/app.js',
  'js/hero.js',
  'js/terminal.js',
  'js/bento.js',
  'js/matrix.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(PROJECT_ROOT, file);
  assert(fs.existsSync(filePath), `File exists: ${file}`);
  const code = fs.readFileSync(filePath, 'utf8');
  
  // Syntax check via vm.Script instantiation
  try {
    new vm.Script(code, { filename: file });
    assert(true, `Syntax check passed for ${file}`);
  } catch (err) {
    assert(false, `Syntax check failed for ${file}: ${err.message}`);
  }
});

// --------------------------------------------------------------------------
// Test Suite 2: DOM Sandbox Environment & Bootstrap
// --------------------------------------------------------------------------
console.log('\n--- Suite 2: DOM Sandbox & App Initialization ---');

function createDOMContext() {
  const listeners = {};
  const elementStore = {};

  class MockElement {
    constructor(id = '', tagName = 'DIV') {
      this.id = id;
      this.tagName = tagName.toUpperCase();
      this.classList = new Set();
      this.attributes = {};
      this.style = {};
      this.eventListeners = {};
    }

    setAttribute(key, val) {
      this.attributes[key] = String(val);
    }

    getAttribute(key) {
      return this.attributes[key] || null;
    }

    addEventListener(event, handler) {
      if (!this.eventListeners[event]) this.eventListeners[event] = [];
      this.eventListeners[event].push(handler);
    }

    removeEventListener(event, handler) {
      if (this.eventListeners[event]) {
        this.eventListeners[event] = this.eventListeners[event].filter(h => h !== handler);
      }
    }

    dispatchEvent(eventObj) {
      const type = typeof eventObj === 'string' ? eventObj : eventObj.type;
      if (this.eventListeners[type]) {
        this.eventListeners[type].forEach(fn => fn(eventObj));
      }
    }

    scrollIntoView(options) {
      this.scrolledIntoViewOptions = options;
    }

    getBoundingClientRect() {
      return { top: 100, left: 100, width: 500, height: 300 };
    }
  }

  const mockModal = new MockElement('modal-container');
  mockModal.classList.add('modal-overlay');
  const mockTerminal = new MockElement('terminal-container');
  const mockMatrix = new MockElement('matrix-container');
  const mockCanvas = new MockElement('bg-canvas', 'CANVAS');
  mockCanvas.getContext = () => ({
    scale: () => {},
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {}
  });

  const mockDoc = {
    readyState: 'complete',
    documentElement: new MockElement('html', 'HTML'),
    body: new MockElement('body', 'BODY'),
    hidden: false,
    addEventListener(event, handler) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    removeEventListener(event, handler) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(h => h !== handler);
      }
    },
    getElementById(id) {
      if (id === 'modal-container') return mockModal;
      if (id === 'terminal-container') return mockTerminal;
      if (id === 'matrix-container') return mockMatrix;
      if (id === 'bg-canvas') return mockCanvas;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '.spotlight-card') return [new MockElement('card1')];
      if (selector === 'section[id], footer[id]') return [mockTerminal, mockMatrix];
      if (selector === '.nav-links a') return [];
      return [];
    },
    querySelector(selector) {
      return null;
    }
  };

  const sandbox = {
    window: {
      devicePixelRatio: 1,
      innerWidth: 1024,
      innerHeight: 768,
      pageYOffset: 0,
      scrollTo: () => {},
      requestAnimationFrame: (cb) => setTimeout(cb, 10),
      cancelAnimationFrame: (id) => clearTimeout(id),
      addEventListener(event, handler) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      },
      removeEventListener(event, handler) {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(h => h !== handler);
        }
      }
    },
    document: mockDoc,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    MockElement: MockElement,
    mockModal: mockModal,
    mockTerminal: mockTerminal,
    mockMatrix: mockMatrix,
    docListeners: listeners
  };

  sandbox.window.document = mockDoc;
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);

  return sandbox;
}

// Load and initialize app.js inside sandbox
const sandbox = createDOMContext();
const appJsCode = fs.readFileSync(path.join(PROJECT_ROOT, 'js/app.js'), 'utf8');
vm.runInContext(appJsCode, sandbox);

assert(sandbox.window.CabsCrypto !== undefined, 'CabsCrypto object mounted on window namespace');
assert(sandbox.window.CabsCrypto.version === '2.5.0', 'CabsCrypto.version is 2.5.0');

// Load submodules
['js/hero.js', 'js/terminal.js', 'js/bento.js', 'js/matrix.js'].forEach(file => {
  const code = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf8');
  vm.runInContext(code, sandbox);
});

assert(sandbox.window.CabsCrypto.state.modulesLoaded.hero === true, 'Hero module registered');
assert(sandbox.window.CabsCrypto.state.modulesLoaded.terminal === true, 'Terminal module registered');
assert(sandbox.window.CabsCrypto.state.modulesLoaded.bento === true, 'Bento module registered');
assert(sandbox.window.CabsCrypto.state.modulesLoaded.matrix === true, 'Matrix module registered');

// --------------------------------------------------------------------------
// Test Suite 3: Event Bus Behavior & PubSub API
// --------------------------------------------------------------------------
console.log('\n--- Suite 3: PubSub Event Bus Verification ---');

const CabsCrypto = sandbox.window.CabsCrypto;

// 3.1 Subscribe & Emit
let eventFired = false;
let receivedData = null;
const unsub = CabsCrypto.on('test:event', data => {
  eventFired = true;
  receivedData = data;
});

CabsCrypto.emit('test:event', { foo: 'bar' });
assert(eventFired === true, 'Event callback triggered on emit');
assert(receivedData && receivedData.foo === 'bar', 'Event payload delivered accurately');

// 3.2 Unsubscribe
eventFired = false;
unsub();
CabsCrypto.emit('test:event', { foo: 'baz' });
assert(eventFired === false, 'Callback not invoked after unregistering');

// 3.3 Multiple Listeners
let count = 0;
const listener1 = () => count++;
const listener2 = () => count++;
CabsCrypto.on('multi:event', listener1);
CabsCrypto.on('multi:event', listener2);
CabsCrypto.emit('multi:event');
assert(count === 2, 'Multiple listeners called for same event');

// Clean up
CabsCrypto.off('multi:event', listener1);
CabsCrypto.off('multi:event', listener2);

// 3.4 Callback exception isolation
let callCount = 0;
const buggyListener = () => { throw new Error('Boom!'); };
const safeListener = () => { callCount++; };
CabsCrypto.on('bug:event', buggyListener);
CabsCrypto.on('bug:event', safeListener);

try {
  CabsCrypto.emit('bug:event');
  assert(callCount === 1, 'Safe listener executed despite preceding listener error');
} catch (e) {
  assert(false, 'Emit threw exception when listener threw error');
}

// --------------------------------------------------------------------------
// Test Suite 4: Contract APIs Verification
// --------------------------------------------------------------------------
console.log('\n--- Suite 4: Contract APIs Execution ---');

// 4.1 openModal & closeModal
let modalOpenEmitted = false;
let modalCloseEmitted = false;
let openedId = null;

CabsCrypto.on('modal:open', payload => {
  modalOpenEmitted = true;
  openedId = payload.projectId;
});
CabsCrypto.on('modal:close', () => {
  modalCloseEmitted = true;
});

CabsCrypto.openModal('project_alpha');
assert(CabsCrypto.state.activeModal === 'project_alpha', 'State activeModal updated');
assert(modalOpenEmitted === true && openedId === 'project_alpha', 'modal:open event emitted');
assert(sandbox.mockModal.classList.has('active'), 'Modal DOM element got active class');

CabsCrypto.closeModal();
assert(CabsCrypto.state.activeModal === null, 'State activeModal reset to null');
assert(modalCloseEmitted === true, 'modal:close event emitted');
assert(!sandbox.mockModal.classList.has('active'), 'Modal DOM element lost active class');

// 4.2 executeCommand
let commandExecuted = null;
CabsCrypto.on('terminal:execute', payload => {
  commandExecuted = payload.command;
});

CabsCrypto.executeCommand('help');
assert(commandExecuted === 'help', 'executeCommand triggered terminal:execute event');
assert(sandbox.mockTerminal.scrolledIntoViewOptions !== undefined, 'Terminal section scrolled into view');

// 4.3 filterTechStack
let filterCategory = null;
CabsCrypto.on('matrix:filter', payload => {
  filterCategory = payload.category;
});

CabsCrypto.filterTechStack('web3');
assert(CabsCrypto.state.techMatrixCategory === 'web3', 'State techMatrixCategory updated');
assert(filterCategory === 'web3', 'filterTechStack triggered matrix:filter event');
assert(sandbox.mockMatrix.scrolledIntoViewOptions !== undefined, 'Matrix section scrolled into view');

// --------------------------------------------------------------------------
// Test Suite 5: Edge Case Mining & Stress Testing
// --------------------------------------------------------------------------
console.log('\n--- Suite 5: Edge Cases & Stress Testing ---');

// Edge Case 1: Unknown modal ID
try {
  CabsCrypto.openModal('non_existent_project_999');
  assert(CabsCrypto.state.activeModal === 'non_existent_project_999', 'Unknown modal ID accepted in state without crash');
} catch (err) {
  assert(false, `openModal threw error with unknown ID: ${err.message}`);
}

// Edge Case 2: Emitting events with null/undefined/primitive data
try {
  let nullDataReceived = false;
  const offNull = CabsCrypto.on('null:test', data => {
    nullDataReceived = (data === null);
  });
  CabsCrypto.emit('null:test', null);
  assert(nullDataReceived === true, 'Emitted null payload handled safely');

  let undefinedReceived = false;
  const offUndef = CabsCrypto.on('undef:test', data => {
    undefinedReceived = (data === undefined);
  });
  CabsCrypto.emit('undef:test');
  assert(undefinedReceived === true, 'Emitted undefined payload handled safely');
} catch (err) {
  assert(false, `Emitting null/undefined data threw: ${err.message}`);
}

// Edge Case 3: Registering non-function callback in on()
try {
  const returnFn = CabsCrypto.on('bad:cb', null);
  assert(typeof returnFn === 'function', 'on(event, null) returns dummy unsubscribe function without error');
  CabsCrypto.emit('bad:cb', 'data');
  assert(true, 'Emitting event with invalid listener registration causes no error');
} catch (err) {
  assert(false, `on(event, null) threw error: ${err.message}`);
}

// Edge Case 4: Unregistering non-existent listener or double off()
try {
  const dummyFn = () => {};
  CabsCrypto.off('non_existent_event', dummyFn);
  CabsCrypto.off('test:event', dummyFn);
  assert(true, 'Unregistering non-existent listener completed safely');
} catch (err) {
  assert(false, `off() threw error: ${err.message}`);
}

// Edge Case 5: executeCommand with empty string or null
try {
  CabsCrypto.executeCommand('');
  assert(true, 'executeCommand("") executed safely');
  CabsCrypto.executeCommand(null);
  assert(true, 'executeCommand(null) executed safely');
} catch (err) {
  assert(false, `executeCommand edge case threw: ${err.message}`);
}

// Edge Case 6: Duplicate module registration
try {
  let warnLogged = false;
  const origWarn = sandbox.console.warn;
  sandbox.console.warn = (...args) => {
    warnLogged = true;
    origWarn(...args);
  };
  CabsCrypto.registerModule('hero', () => {});
  sandbox.console.warn = origWarn;
  assert(warnLogged === true, 'Duplicate module registration warned safely');
} catch (err) {
  assert(false, `Duplicate registerModule threw: ${err.message}`);
}

// Edge Case 7: High Volume PubSub Load (10,000 emits & 500 listeners)
try {
  const listenersList = [];
  let totalRecv = 0;
  for (let i = 0; i < 500; i++) {
    const unsub = CabsCrypto.on('stress:event', () => { totalRecv++; });
    listenersList.push(unsub);
  }
  for (let i = 0; i < 20; i++) {
    CabsCrypto.emit('stress:event', { i });
  }
  assert(totalRecv === 10000, '500 listeners processed 20 events (10,000 total callback calls) smoothly');
  
  // Clean up all stress listeners
  listenersList.forEach(fn => fn());
  totalRecv = 0;
  CabsCrypto.emit('stress:event', {});
  assert(totalRecv === 0, 'All 500 stress listeners successfully unsubscribed');
} catch (err) {
  assert(false, `High volume stress test failed: ${err.message}`);
}

// --------------------------------------------------------------------------
// Summary & Exit Status
// --------------------------------------------------------------------------
console.log('\n===========================================================');
console.log(` Test Execution Complete: ${passCount} Passed, ${failCount} Failed`);
console.log('===========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
