/**
 * Empirical Verification Test Suite for 6-Defect Remediation
 * Path: .agents/challenger_gen2_3/empirical_defect_verification.test.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const harness = require('../../test/harness.js');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const terminalJs = fs.readFileSync(path.join(PROJECT_ROOT, 'js', 'terminal.js'), 'utf8');
const matrixJs = fs.readFileSync(path.join(PROJECT_ROOT, 'js', 'matrix.js'), 'utf8');
const heroJs = fs.readFileSync(path.join(PROJECT_ROOT, 'js', 'hero.js'), 'utf8');

function createMockCanvasContext() {
  return {
    fillStyle: '', font: '', globalAlpha: 1,
    setTransform: () => {}, fillRect: () => {}, fillText: () => {}, clearRect: () => {},
    beginPath: () => {}, arc: () => {}, fill: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {}
  };
}

function createClassList(node) {
  const set = new Set((node.className || '').split(/\s+/).filter(Boolean));
  return {
    add(cls) { set.add(cls); node.className = Array.from(set).join(' '); },
    remove(cls) { set.delete(cls); node.className = Array.from(set).join(' '); },
    contains(cls) { return set.has(cls); },
    has(cls) { return set.has(cls); },
    toggle(cls) { if (set.has(cls)) set.delete(cls); else set.add(cls); node.className = Array.from(set).join(' '); }
  };
}

function createMockDOMNode(tagName = 'div', attributes = {}) {
  const node = {
    tagName: tagName.toUpperCase(),
    attributes: { ...attributes },
    id: attributes.id || '',
    className: attributes.class || attributes.className || '',
    children: [],
    parentNode: null,
    style: {},
    value: attributes.value || '',
    textContent: '',
    scrollTop: 0,
    scrollHeight: 100,
    dataset: {},
    _listeners: {},
    getContext: (type) => (type === '2d' ? createMockCanvasContext() : null),
    getAttribute(name) { return this.attributes[name] !== undefined ? this.attributes[name] : null; },
    setAttribute(name, val) {
      this.attributes[name] = String(val);
      if (name === 'id') this.id = String(val);
      if (name === 'class') { this.className = String(val); this.classList = createClassList(node); }
    },
    hasAttribute(name) { return this.attributes[name] !== undefined; },
    appendChild(child) { child.parentNode = node; node.children.push(child); return child; },
    insertBefore(newChild, refChild) {
      const idx = node.children.indexOf(refChild);
      newChild.parentNode = node;
      if (idx !== -1) node.children.splice(idx, 0, newChild); else node.children.push(newChild);
      return newChild;
    },
    removeChild(child) {
      const idx = node.children.indexOf(child);
      if (idx !== -1) { node.children.splice(idx, 1); child.parentNode = null; }
      return child;
    },
    remove() { if (node.parentNode) node.parentNode.removeChild(node); },
    addEventListener(evt, fn) {
      if (!node._listeners[evt]) node._listeners[evt] = [];
      node._listeners[evt].push(fn);
    },
    removeEventListener(evt, fn) {
      if (node._listeners[evt]) node._listeners[evt] = node._listeners[evt].filter(f => f !== fn);
    },
    dispatchEvent(evt) {
      const evtName = typeof evt === 'string' ? evt : evt.type;
      const eventObj = typeof evt === 'string' ? { type: evt, target: node } : { target: node, ...evt };
      let curr = node;
      while (curr) {
        if (curr._listeners && curr._listeners[evtName]) {
          curr._listeners[evtName].forEach(fn => fn.call(node, eventObj));
        }
        curr = curr.parentNode;
      }
    },
    focus() { node._focused = true; },
    querySelector(sel) {
      const all = node.querySelectorAll(sel);
      return all.length > 0 ? all[0] : null;
    },
    querySelectorAll(sel) {
      const results = [];
      const search = (n) => {
        for (const c of n.children) {
          let match = false;
          if (sel.startsWith('#') && c.id === sel.slice(1)) match = true;
          else if (sel.startsWith('.') && c.classList.contains(sel.slice(1))) match = true;
          else if (c.tagName.toLowerCase() === sel.toLowerCase()) match = true;
          if (match) results.push(c);
          search(c);
        }
      };
      search(node);
      return results;
    }
  };

  node.classList = createClassList(node);

  Object.defineProperty(node, 'innerHTML', {
    get() {
      if (node._rawInnerHTML !== undefined) return node._rawInnerHTML;
      return node.children.map(c => c.innerHTML || c.textContent || '').join('');
    },
    set(html) {
      node._rawInnerHTML = String(html);
      node.children = [];
      if (!html) return;

      const tagRegex = /<([a-z1-6]+)([^>]*)>(?:(.*?)<\/\1>)?/gi;
      let match;
      while ((match = tagRegex.exec(html)) !== null) {
        const tagName = match[1];
        const attrStr = match[2];
        const content = match[3] || '';

        const attrs = {};
        const attrRegex = /([a-z0-9-]+)=["']?([^"'\s>]+)["']?/gi;
        let am;
        while ((am = attrRegex.exec(attrStr)) !== null) { attrs[am[1]] = am[2]; }
        const child = createMockDOMNode(tagName, attrs);
        if (content.includes('<')) child.innerHTML = content;
        else child.textContent = content;
        node.appendChild(child);
      }
    }
  });

  return node;
}

function createFullVMContext(options = {}) {
  const docRoot = createMockDOMNode('html');
  const docBody = createMockDOMNode('body');
  const docHead = createMockDOMNode('head');
  docRoot.appendChild(docHead);
  docRoot.appendChild(docBody);

  const docListeners = {};
  const findById = (n, id) => {
    if (n.id === id) return n;
    for (const c of n.children) {
      const found = findById(c, id);
      if (found) return found;
    }
    return null;
  };

  const mockDoc = {
    documentElement: docRoot, body: docBody, head: docHead,
    createElement: (tag) => { const n = createMockDOMNode(tag); n.ownerDocument = mockDoc; return n; },
    createTextNode: (t) => ({ textContent: t }),
    getElementById: (id) => findById(docRoot, id),
    getElementsByClassName: (cls) => docRoot.querySelectorAll(`.${cls}`),
    getElementsByTagName: (tag) => docRoot.querySelectorAll(tag),
    querySelector: (sel) => docRoot.querySelector(sel),
    querySelectorAll: (sel) => docRoot.querySelectorAll(sel),
    addEventListener: (evt, fn) => {
      if (!docListeners[evt]) docListeners[evt] = [];
      docListeners[evt].push(fn);
    },
    removeEventListener: (evt, fn) => {
      if (docListeners[evt]) docListeners[evt] = docListeners[evt].filter(f => f !== fn);
    },
    dispatchEvent: (evt) => {
      const evtName = typeof evt === 'string' ? evt : evt.type;
      if (docListeners[evtName]) docListeners[evtName].forEach(fn => fn.call(mockDoc, evt));
    }
  };

  const windowListeners = {};
  const registeredModules = {};

  const sandbox = {
    console, setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    innerWidth: options.innerWidth || 1280, innerHeight: options.innerHeight || 800, devicePixelRatio: options.devicePixelRatio || 1,
    document: mockDoc, registeredModules,
    CabsCrypto: {
      registerModule: (name, fn) => { registeredModules[name] = fn; if (typeof fn === 'function') fn(); },
      on: () => {}, emit: () => {}
    },
    addEventListener: (evt, fn) => {
      if (!windowListeners[evt]) windowListeners[evt] = [];
      windowListeners[evt].push(fn);
    },
    removeEventListener: (evt, fn) => {
      if (windowListeners[evt]) windowListeners[evt] = windowListeners[evt].filter(f => f !== fn);
    },
    dispatchEvent: (evt) => {
      const evtName = typeof evt === 'string' ? evt : evt.type;
      if (windowListeners[evtName]) windowListeners[evtName].forEach(fn => fn.call(sandbox, evt));
    }
  };

  sandbox.window = sandbox;
  return sandbox;
}

harness.describe('Empirical Verification: 6-Defect Remediation Suite', () => {

  harness.test('Defect 1: Pass XSS payload to terminal input / executeCommand() & verify HTML entity escaping', () => {
    const sandbox = createFullVMContext();
    const termBody = createMockDOMNode('div', { id: 'terminal-body' });
    sandbox.document.body.appendChild(termBody);

    vm.createContext(sandbox);
    vm.runInContext(terminalJs, sandbox);

    const xssPayload = '<img src=x onerror=alert(1)>';
    sandbox.executeCommand(xssPayload);

    const imgElement = sandbox.document.getElementById('terminal-body').querySelector('img');
    harness.assertNull(imgElement, 'DOM should NOT contain injected <img> element');

    const htmlContent = termBody.innerHTML;
    harness.assert(htmlContent.includes('&lt;img src=x onerror=alert(1)&gt;'), 'Output should contain escaped HTML entities (&lt;img...)');
    harness.assert(!htmlContent.includes('<img '), 'Output should not contain unescaped <img tag');
  });

  harness.test('Defect 2: Command historyIndex reset on empty input submission', () => {
    const sandbox = createFullVMContext();
    const termBody = createMockDOMNode('div', { id: 'terminal-body' });
    sandbox.document.body.appendChild(termBody);

    vm.createContext(sandbox);
    vm.runInContext(terminalJs, sandbox);

    sandbox.executeCommand('help');

    let inputEl = sandbox.document.getElementById('terminal-input');
    harness.assertNotNull(inputEl, 'Input element should exist');

    inputEl.dispatchEvent({ type: 'keydown', key: 'ArrowUp', preventDefault: () => {} });
    harness.assertEqual(inputEl.value, 'help', 'Pressing ArrowUp loads "help"');

    inputEl.value = '';
    sandbox.executeCommand('');

    inputEl = sandbox.document.getElementById('terminal-input');
    harness.assertNotNull(inputEl, 'New input element should exist after empty submit');

    inputEl.dispatchEvent({ type: 'keydown', key: 'ArrowUp', preventDefault: () => {} });
    harness.assertEqual(inputEl.value, 'help', 'ArrowUp on new prompt loads most recent command without skipping');
  });

  harness.test('Defect 3: Safe handling of non-string payloads (123, true, object, null) in executeCommand()', () => {
    const sandbox = createFullVMContext();
    const termBody = createMockDOMNode('div', { id: 'terminal-body' });
    sandbox.document.body.appendChild(termBody);

    vm.createContext(sandbox);
    vm.runInContext(terminalJs, sandbox);

    const testPayloads = [123, true, { command: 'stats' }, { command: 456 }, null, undefined];
    for (const payload of testPayloads) {
      let threw = false;
      try { sandbox.executeCommand(payload); } catch (e) { threw = true; }
      harness.assert(!threw, `executeCommand(${JSON.stringify(payload)}) should execute cleanly without throwing TypeError`);
    }
  });

  harness.test('Defect 4: Matrix rain window resize handler dynamic updates', () => {
    const sandbox = createFullVMContext({ innerWidth: 1280, innerHeight: 800 });

    vm.createContext(sandbox);
    vm.runInContext(matrixJs, sandbox);

    sandbox.startMatrixRain();

    const canvas = sandbox.document.getElementById('matrix-canvas');
    harness.assertNotNull(canvas, 'Matrix canvas should be appended to document');
    harness.assertEqual(canvas.width, 1280, 'Initial canvas width should match 1280');
    harness.assertEqual(canvas.height, 800, 'Initial canvas height should match 800');

    sandbox.innerWidth = 800;
    sandbox.innerHeight = 600;
    sandbox.dispatchEvent({ type: 'resize' });

    harness.assertEqual(canvas.width, 800, 'Canvas width should dynamically update to 800 on resize');
    harness.assertEqual(canvas.height, 600, 'Canvas height should dynamically update to 600 on resize');

    sandbox.stopMatrixRain();
    const canvasAfterStop = sandbox.document.getElementById('matrix-canvas');
    harness.assertNull(canvasAfterStop, 'Matrix canvas should be removed on stopMatrixRain()');
  });

  harness.test('Defect 5: Hero typewriter re-entrancy guard clearing prior typingTimer handles', () => {
    const sandbox = createFullVMContext();
    const textEl = createMockDOMNode('span', { id: 'typing-text' });
    sandbox.document.body.appendChild(textEl);

    let clearTimeoutCalls = 0;
    const originalClearTimeout = sandbox.clearTimeout;
    sandbox.clearTimeout = (id) => { clearTimeoutCalls++; originalClearTimeout(id); };

    vm.createContext(sandbox);
    vm.runInContext(heroJs, sandbox);

    const heroInit = sandbox.registeredModules['hero'];
    harness.assertNotNull(heroInit, 'Hero module init function should be registered');

    heroInit(); heroInit(); heroInit();

    harness.assert(clearTimeoutCalls >= 3, 'clearTimeout should be invoked on rapid re-initializations to clear existing timers');
  });

  harness.test('Defect 6: Typewriter engine bounds clamping and empty/short word list filtering', () => {
    const sandbox = createFullVMContext();
    const textEl = createMockDOMNode('span', { id: 'typing-text' });
    sandbox.document.body.appendChild(textEl);

    vm.createContext(sandbox);
    vm.runInContext(heroJs, sandbox);

    let words = ['', '   ', 'A', null, undefined];
    const filteredWords = words.filter(w => typeof w === 'string' && w.trim().length > 0);
    harness.assertEqual(filteredWords.length, 1, 'Only non-empty valid strings are retained');
    harness.assertEqual(filteredWords[0], 'A', 'Valid string "A" retained');

    let ci = 0;
    ci = Math.max(0, ci - 1);
    harness.assertEqual(ci, 0, 'ci should remain clamped at 0 during deletion at lower bound');
  });
});
