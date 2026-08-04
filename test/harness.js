/* ==========================================================================
   CabsCrypto E2E Test Harness & Assertions Framework
   Standard Node.js Library Only (fs, path, http, https, url, vm)
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const urlModule = require('url');
const vm = require('vm');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// --------------------------------------------------------------------------
// 1. Suite & Test Registry
// --------------------------------------------------------------------------
const suites = [];
let currentSuite = null;

function getOrCreateDefaultSuite() {
  if (!currentSuite) {
    currentSuite = {
      name: 'Global',
      tests: [],
      beforeAll: [],
      afterAll: [],
      beforeEach: [],
      afterEach: []
    };
    suites.push(currentSuite);
  }
  return currentSuite;
}

function describe(name, fn) {
  const previousSuite = currentSuite;
  currentSuite = {
    name,
    tests: [],
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: []
  };
  suites.push(currentSuite);
  if (typeof fn === 'function') {
    fn();
  }
  currentSuite = previousSuite;
}

function test(name, fn) {
  const s = currentSuite || getOrCreateDefaultSuite();
  s.tests.push({ name, fn });
}
const it = test;

function beforeAll(fn) {
  const s = currentSuite || getOrCreateDefaultSuite();
  s.beforeAll.push(fn);
}

function afterAll(fn) {
  const s = currentSuite || getOrCreateDefaultSuite();
  s.afterAll.push(fn);
}

function beforeEach(fn) {
  const s = currentSuite || getOrCreateDefaultSuite();
  s.beforeEach.push(fn);
}

function afterEach(fn) {
  const s = currentSuite || getOrCreateDefaultSuite();
  s.afterEach.push(fn);
}

function getRegisteredSuites() {
  return suites;
}

function clearRegisteredSuites() {
  suites.length = 0;
  currentSuite = null;
}

// --------------------------------------------------------------------------
// 2. Custom Assertions
// --------------------------------------------------------------------------
class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message || 'Assertion failed');
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

function assert(condition, message = 'Expected condition to be truthy') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

function assertTrue(value, message = 'Expected value to be true') {
  if (value !== true && !value) {
    throw new AssertionError(message || `Expected ${value} to be true`, value, true);
  }
}

function assertFalse(value, message = 'Expected value to be false') {
  if (value) {
    throw new AssertionError(message || `Expected ${value} to be false`, value, false);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertNotEqual(actual, expected, message) {
  if (actual === expected) {
    const msg = message || `Expected ${JSON.stringify(actual)} to not equal ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertContains(container, item, message) {
  if (typeof container === 'string') {
    if (!container.includes(item)) {
      throw new AssertionError(message || `Expected string to contain "${item}"`, container, item);
    }
  } else if (Array.isArray(container)) {
    if (!container.includes(item)) {
      throw new AssertionError(message || `Expected array to contain item ${JSON.stringify(item)}`, container, item);
    }
  } else if (container instanceof Set) {
    if (!container.has(item)) {
      throw new AssertionError(message || `Expected Set to contain item ${JSON.stringify(item)}`, container, item);
    }
  } else if (container instanceof Map) {
    if (!container.has(item)) {
      throw new AssertionError(message || `Expected Map to contain key ${JSON.stringify(item)}`, container, item);
    }
  } else if (typeof container === 'object' && container !== null) {
    if (!(item in container)) {
      throw new AssertionError(message || `Expected object to contain key "${item}"`, container, item);
    }
  } else {
    throw new AssertionError(message || `Invalid container for assertContains`, container, item);
  }
}

function assertNotContains(container, item, message) {
  let hasItem = false;
  if (typeof container === 'string' || Array.isArray(container)) {
    hasItem = container.includes(item);
  } else if (container instanceof Set || container instanceof Map) {
    hasItem = container.has(item);
  } else if (typeof container === 'object' && container !== null) {
    hasItem = item in container;
  }
  if (hasItem) {
    throw new AssertionError(message || `Expected container to NOT contain "${item}"`, container, item);
  }
}

function assertMatches(string, regex, message) {
  const re = typeof regex === 'string' ? new RegExp(regex) : regex;
  if (!re.test(string)) {
    throw new AssertionError(message || `Expected "${string}" to match pattern ${re}`, string, regex);
  }
}

function assertNull(value, message = 'Expected value to be null') {
  if (value !== null) {
    throw new AssertionError(message, value, null);
  }
}

function assertNotNull(value, message = 'Expected value to not be null') {
  if (value === null) {
    throw new AssertionError(message, value, 'not null');
  }
}

function assertUndefined(value, message = 'Expected value to be undefined') {
  if (value !== undefined) {
    throw new AssertionError(message, value, undefined);
  }
}

function assertDefined(value, message = 'Expected value to be defined') {
  if (value === undefined) {
    throw new AssertionError(message, value, 'defined');
  }
}

function isDeepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!keysB.includes(k) || !isDeepEqual(a[k], b[k])) return false;
  }
  return true;
}

function assertDeepEqual(actual, expected, message) {
  if (!isDeepEqual(actual, expected)) {
    const msg = message || `Expected deep equality:\nActual: ${JSON.stringify(actual)}\nExpected: ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

function assertThrows(fn, expectedError, message) {
  let threw = false;
  let error = null;
  try {
    fn();
  } catch (err) {
    threw = true;
    error = err;
  }
  if (!threw) {
    throw new AssertionError(message || 'Expected function to throw error, but it executed without error', null, expectedError);
  }
  if (expectedError) {
    if (typeof expectedError === 'string') {
      if (!error.message.includes(expectedError)) {
        throw new AssertionError(message || `Expected error message to contain "${expectedError}", got "${error.message}"`, error.message, expectedError);
      }
    } else if (expectedError instanceof RegExp) {
      if (!expectedError.test(error.message)) {
        throw new AssertionError(message || `Expected error message to match ${expectedError}, got "${error.message}"`, error.message, expectedError);
      }
    } else if (typeof expectedError === 'function') {
      if (!(error instanceof expectedError)) {
        throw new AssertionError(message || `Expected error instance of ${expectedError.name}`, error, expectedError);
      }
    }
  }
}

async function assertRejects(asyncFn, expectedError, message) {
  let threw = false;
  let error = null;
  try {
    await asyncFn();
  } catch (err) {
    threw = true;
    error = err;
  }
  if (!threw) {
    throw new AssertionError(message || 'Expected async function to reject, but it resolved', null, expectedError);
  }
  if (expectedError) {
    if (typeof expectedError === 'string') {
      if (!error.message.includes(expectedError)) {
        throw new AssertionError(message || `Expected rejection message to contain "${expectedError}", got "${error.message}"`, error.message, expectedError);
      }
    } else if (expectedError instanceof RegExp) {
      if (!expectedError.test(error.message)) {
        throw new AssertionError(message || `Expected rejection message to match ${expectedError}, got "${error.message}"`, error.message, expectedError);
      }
    }
  }
}

function assertInRange(value, min, max, message) {
  if (typeof value !== 'number' || value < min || value > max) {
    throw new AssertionError(message || `Expected ${value} to be in range [${min}, ${max}]`, value, `${min}-${max}`);
  }
}

// --------------------------------------------------------------------------
// 3. HTTP & File System Helpers
// --------------------------------------------------------------------------
function readLocalFile(relativePath) {
  const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(PROJECT_ROOT, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function fileExists(relativePath) {
  const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(PROJECT_ROOT, relativePath);
  return fs.existsSync(fullPath);
}

function httpRequest(targetUrl, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = typeof targetUrl === 'string' ? new urlModule.URL(targetUrl) : targetUrl;
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;

    const reqOptions = {
      hostname: parsedUrl.hostname || 'localhost',
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + (parsedUrl.search || ''),
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 5000
    };

    const req = client.request(reqOptions, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body,
          json: () => {
            try { return JSON.parse(body); } catch(e) { return null; }
          }
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`HTTP request to ${targetUrl} timed out`));
    });

    if (postData) {
      if (typeof postData === 'object' && !Buffer.isBuffer(postData)) {
        req.write(JSON.stringify(postData));
      } else {
        req.write(postData);
      }
    }

    req.end();
  });
}

// --------------------------------------------------------------------------
// 4. HTML & CSS Static Analysis Helpers
// --------------------------------------------------------------------------
class HTMLNode {
  constructor(tagName = 'ROOT', attributes = {}, parent = null) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes || {};
    this.id = this.attributes.id || '';
    this.className = this.attributes.class || this.attributes.className || '';
    this.classList = new Set(this.className.trim().split(/\s+/).filter(Boolean));
    this.children = [];
    this.parentNode = parent;
    this.style = {};
    this.value = this.attributes.value || '';
    this._listeners = {};
  }

  getAttribute(name) {
    return this.attributes[name] !== undefined ? this.attributes[name] : null;
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
    if (name === 'id') this.id = String(val);
    if (name === 'class') this.className = String(val);
  }

  hasAttribute(name) {
    return this.attributes[name] !== undefined;
  }

  hasClass(cls) {
    return this.classList.has(cls);
  }

  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }

  removeEventListener(event, fn) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter(f => f !== fn);
    }
  }

  dispatchEvent(evt) {
    const eventName = typeof evt === 'string' ? evt : evt.type;
    const eventObj = typeof evt === 'string' ? { type: evt, target: this } : { target: this, ...evt };
    let curr = this;
    while (curr) {
      if (curr._listeners && curr._listeners[eventName]) {
        curr._listeners[eventName].forEach(fn => fn.call(this, eventObj));
      }
      curr = curr.parentNode;
    }
  }

  querySelectorAll(selector) {
    const results = [];
    const search = (node) => {
      for (const child of node.children) {
        if (matchesSelector(child, selector)) {
          results.push(child);
        }
        search(child);
      }
    };
    search(this);
    return results;
  }

  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }
}

function matchesSelector(node, selector) {
  selector = selector.trim();
  if (!selector) return false;

  if (selector.includes(' ')) {
    const parts = selector.split(/\s+/);
    const targetSelector = parts[parts.length - 1];
    if (!matchesSimpleSelector(node, targetSelector)) return false;

    let current = node.parentNode;
    let partIdx = parts.length - 2;
    while (current && partIdx >= 0) {
      if (matchesSimpleSelector(current, parts[partIdx])) {
        partIdx--;
      }
      current = current.parentNode;
    }
    return partIdx < 0;
  }

  return matchesSimpleSelector(node, selector);
}

function matchesSimpleSelector(node, selector) {
  if (selector === '*') return true;

  const tagMatch = selector.match(/^([a-zA-Z0-9-]+)/);
  if (tagMatch) {
    if (node.tagName !== tagMatch[1].toUpperCase()) return false;
  }

  const idMatches = selector.match(/#([a-zA-Z0-9_-]+)/g);
  if (idMatches) {
    for (const idSel of idMatches) {
      const idVal = idSel.substring(1);
      if (node.id !== idVal) return false;
    }
  }

  const classMatches = selector.match(/\.([a-zA-Z0-9_-]+)/g);
  if (classMatches) {
    for (const clsSel of classMatches) {
      const clsVal = clsSel.substring(1);
      if (typeof node.hasClass === 'function') {
        if (!node.hasClass(clsVal)) return false;
      } else if (node.classList && typeof node.classList.contains === 'function') {
        if (!node.classList.contains(clsVal)) return false;
      } else {
        const clsName = typeof node.className === 'string' ? node.className : '';
        if (!clsName.split(/\s+/).includes(clsVal)) return false;
      }
    }
  }

  const attrMatches = selector.matchAll(/\[([a-zA-Z0-9_-]+)(?:=|\*=|\^=|\$=)?["']?([^\]"']*)?["']?\]/g);
  for (const match of attrMatches) {
    const attrName = match[1];
    const attrVal = match[2];
    if (!node.hasAttribute(attrName)) return false;
    if (attrVal !== undefined && attrVal !== '' && node.getAttribute(attrName) !== attrVal) return false;
  }

  return true;
}

function parseAttributes(attrString) {
  const attrs = {};
  if (!attrString) return attrs;
  const attrRegex = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1];
    const val = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : (match[4] !== undefined ? match[4] : 'true'));
    attrs[key] = val;
  }
  return attrs;
}

function parseHTML(htmlString) {
  const root = new HTMLNode('ROOT');
  const cleanHTML = htmlString.replace(/<!--[\s\S]*?-->/g, '');
  const selfClosing = new Set(['META', 'LINK', 'IMG', 'BR', 'HR', 'INPUT', 'SOURCE', 'EMBED', 'PARAM', 'TRACK', 'AREA', 'BASE', 'COL']);
  const stack = [root];

  const tagRegex = /<(?:\/([a-zA-Z0-9-]+)|([a-zA-Z0-9-]+)((?:\s+[a-zA-Z0-9_-]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/|>))/g;
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(cleanHTML)) !== null) {
    const textBefore = cleanHTML.substring(lastIndex, match.index);
    if (textBefore.trim() && stack.length > 0) {
      const current = stack[stack.length - 1];
      current.textContent += (current.textContent ? ' ' : '') + textBefore.trim();
    }

    const isClosing = Boolean(match[1]);
    const tagName = (match[1] || match[2]).toUpperCase();
    const attrString = match[3] || '';
    const isSelfClosingSymbol = match[4] === '/';

    if (isClosing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === tagName) {
          stack.splice(i);
          break;
        }
      }
    } else {
      const attributes = parseAttributes(attrString);
      const parent = stack[stack.length - 1];
      const newNode = createMockDOMNode(tagName, attributes);
      newNode.parentNode = parent;
      parent.children.push(newNode);

      if (!selfClosing.has(tagName) && !isSelfClosingSymbol) {
        if (tagName === 'SCRIPT' || tagName === 'STYLE') {
          const closeTag = `</${tagName.toLowerCase()}>`;
          const closeIdx = cleanHTML.indexOf(closeTag, tagRegex.lastIndex);
          if (closeIdx !== -1) {
            const inner = cleanHTML.substring(tagRegex.lastIndex, closeIdx);
            newNode.innerHTML = inner;
            newNode.textContent = inner;
            tagRegex.lastIndex = closeIdx + closeTag.length;
          }
        } else {
          stack.push(newNode);
        }
      }
    }
    lastIndex = tagRegex.lastIndex;
  }

  return {
    root,
    rawHTML: htmlString,
    getElementById: (id) => root.querySelector(`#${id}`),
    getElementsByClassName: (cls) => root.querySelectorAll(`.${cls}`),
    getElementsByTagName: (tag) => root.querySelectorAll(tag),
    querySelector: (sel) => root.querySelector(sel),
    querySelectorAll: (sel) => root.querySelectorAll(sel),
    hasElement: (sel) => root.querySelector(sel) !== null,
    countElements: (sel) => root.querySelectorAll(sel).length
  };
}

function parseCSS(cssString) {
  const cleanCSS = cssString.replace(/\/\*[\s\S]*?\*\//g, '');

  const variables = {};
  const varRegex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let vMatch;
  while ((vMatch = varRegex.exec(cleanCSS)) !== null) {
    variables[`--${vMatch[1]}`] = vMatch[2].trim();
  }

  const fontFamilies = new Set();
  const fontRegex = /(?:font-family|--font-[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/gi;
  let fMatch;
  while ((fMatch = fontRegex.exec(cleanCSS)) !== null) {
    const fonts = fMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    fonts.forEach(f => fontFamilies.add(f));
  }

  const importFontRegex = /family=([a-zA-Z0-9+:]+)/g;
  let impMatch;
  while ((impMatch = importFontRegex.exec(cleanCSS)) !== null) {
    const families = impMatch[1].split('&')[0].split('|');
    families.forEach(fam => {
      const name = fam.split(':')[0].replace(/\+/g, ' ');
      fontFamilies.add(name);
    });
  }

  const mediaQueries = [];
  const mediaRegex = /@media\s*\(([^)]+)\)/gi;
  let mMatch;
  while ((mMatch = mediaRegex.exec(cleanCSS)) !== null) {
    mediaQueries.push(mMatch[1].trim());
  }

  const rules = [];
  const ruleRegex = /([^{}@]+)\{([^}]+)\}/g;
  let rMatch;
  while ((rMatch = ruleRegex.exec(cleanCSS)) !== null) {
    const selectorGroup = rMatch[1].trim();
    if (selectorGroup.startsWith('@')) continue;

    const declsString = rMatch[2];
    const decls = {};
    declsString.split(';').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const prop = line.substring(0, colonIdx).trim().toLowerCase();
        const val = line.substring(colonIdx + 1).trim();
        if (prop && val) {
          decls[prop] = val;
        }
      }
    });

    rules.push({ selector: selectorGroup, declarations: decls });
    selectorGroup.split(',').forEach(sel => {
      rules.push({ selector: sel.trim(), declarations: decls });
    });
  }

  return {
    rawCSS: cssString,
    variables,
    rules,
    mediaQueries,
    fontFamilies: Array.from(fontFamilies),
    getCSSVariables: () => ({ ...variables }),
    getCSSVariable: (name) => variables[name] || null,
    getFontFamilies: () => Array.from(fontFamilies),
    getRulesForSelector: (sel) => rules.filter(r => r.selector === sel).map(r => r.declarations),
    hasSelector: (sel) => rules.some(r => r.selector === sel || r.selector.includes(sel)),
    hasProperty: (sel, prop) => rules.some(r => (r.selector === sel || r.selector.includes(sel)) && r.declarations[prop] !== undefined),
    getPropertyValue: (sel, prop) => {
      for (const r of rules) {
        if ((r.selector === sel || r.selector.includes(sel)) && r.declarations[prop] !== undefined) {
          return r.declarations[prop];
        }
      }
      return null;
    },
    getMediaQueries: () => mediaQueries,
    hasBackdropBlur: () => {
      return rules.some(r => {
        const bf = r.declarations['backdrop-filter'] || r.declarations['-webkit-backdrop-filter'];
        return bf && bf.includes('blur');
      });
    }
  };
}

// --------------------------------------------------------------------------
// 5. JS Module / VM Context Runner Helper
// --------------------------------------------------------------------------
function createMockDOMNode(tagName = 'div', attributes = {}) {
  const attrs = new Map(Object.entries(attributes));
  const classListSet = new Set((attributes.class || '').split(/\s+/).filter(Boolean));
  const listeners = {};
  const children = [];

  const styleObj = {};
  const styleProxy = new Proxy(styleObj, {
    get(target, prop) {
      if (prop === 'setProperty') {
        return (k, v) => { target[k] = v; };
      }
      return target[prop];
    },
    set(target, prop, val) {
      target[prop] = val;
      return true;
    }
  });

  const node = {
    tagName: tagName.toUpperCase(),
    id: attributes.id || '',
    className: attributes.class || '',
    classList: {
      add: (...cls) => {
        cls.forEach(c => classListSet.add(c));
        node.className = Array.from(classListSet).join(' ');
      },
      remove: (...cls) => {
        cls.forEach(c => classListSet.delete(c));
        node.className = Array.from(classListSet).join(' ');
      },
      toggle: (c) => {
        if (classListSet.has(c)) {
          classListSet.delete(c);
          node.className = Array.from(classListSet).join(' ');
          return false;
        } else {
          classListSet.add(c);
          node.className = Array.from(classListSet).join(' ');
          return true;
        }
      },
      contains: (c) => classListSet.has(c)
    },
    style: styleProxy,
    textContent: '',
    value: attributes.value || '',
    children,
    parentNode: null,
    attributes: attrs,
    _listeners: listeners,

    getAttribute: (name) => attrs.get(name) || null,
    setAttribute: (name, val) => {
      attrs.set(name, String(val));
      if (name === 'id') node.id = String(val);
      if (name === 'class') {
        node.className = String(val);
        classListSet.clear();
        String(val).split(/\s+/).filter(Boolean).forEach(c => classListSet.add(c));
      }
    },
    removeAttribute: (name) => attrs.delete(name),
    hasAttribute: (name) => attrs.has(name),

    insertBefore: (child, refNode) => {
      if (child) {
        child.parentNode = node;
        if (node.ownerDocument) child.ownerDocument = node.ownerDocument;
        const idx = refNode ? children.indexOf(refNode) : -1;
        if (idx !== -1) {
          children.splice(idx, 0, child);
        } else {
          children.push(child);
        }
      }
      return child;
    },
    remove: () => {
      if (node.parentNode && typeof node.parentNode.removeChild === 'function') {
        node.parentNode.removeChild(node);
      }
    },
    appendChild: (child) => {
      if (child) {
        child.parentNode = node;
        if (node.ownerDocument) child.ownerDocument = node.ownerDocument;
        children.push(child);
      }
      return child;
    },
    removeChild: (child) => {
      const idx = children.indexOf(child);
      if (idx !== -1) children.splice(idx, 1);
      if (child) child.parentNode = null;
      return child;
    },

    addEventListener: (event, fn) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
    },
    removeEventListener: (event, fn) => {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(f => f !== fn);
    },
    dispatchEvent: (evt) => {
      const eventName = typeof evt === 'string' ? evt : evt.type;
      const eventObj = typeof evt === 'string' ? { type: evt, target: node } : { target: node, ...evt };
      let curr = node;
      while (curr) {
        if (curr._listeners && curr._listeners[eventName]) {
          curr._listeners[eventName].forEach(fn => fn.call(node, eventObj));
        }
        curr = curr.parentNode;
      }
      if (node.ownerDocument && typeof node.ownerDocument.dispatchEvent === 'function' && node !== node.ownerDocument.documentElement) {
        node.ownerDocument.dispatchEvent(eventObj);
      }
    },
    click: () => node.dispatchEvent('click'),
    focus: () => node.dispatchEvent('focus'),
    blur: () => node.dispatchEvent('blur'),

    querySelector: (sel) => {
      for (const child of children) {
        if (child.tagName && matchesSimpleSelector(child, sel)) return child;
        const found = child.querySelector ? child.querySelector(sel) : null;
        if (found) return found;
      }
      return null;
    },
    querySelectorAll: (sel) => {
      let res = [];
      for (const child of children) {
        if (child.tagName && matchesSimpleSelector(child, sel)) res.push(child);
        if (child.querySelectorAll) res = res.concat(child.querySelectorAll(sel));
      }
      return res;
    },
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 800, height: 600, right: 800, bottom: 600 }),
    scrollIntoView: () => {},
    getContext: (type) => {
      if (tagName.toUpperCase() === 'CANVAS') {
        return createMockCanvasContext();
      }
      return null;
    }
  };

  let rawInnerHTML = '';
  Object.defineProperty(node, 'innerHTML', {
    get() {
      if (rawInnerHTML) return rawInnerHTML;
      return children.map(c => c.innerHTML || c.textContent || '').join('');
    },
    set(val) {
      rawInnerHTML = String(val);
      children.length = 0;
      if (val && typeof parseHTML === 'function') {
        try {
          const parsed = parseHTML(val);
          const parsedChildren = (parsed && parsed.root && parsed.root.children) || (parsed && parsed.children) || [];
          for (const child of parsedChildren) {
            child.parentNode = node;
            children.push(child);
          }
        } catch (e) {}
      }
    },
    configurable: true,
    enumerable: true
  });

  return node;
}

function createMockCanvasContext() {
  return {
    fillRect: () => {},
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    fillText: () => {},
    strokeText: () => {},
    measureText: (text) => ({ width: text ? text.length * 8 : 0 }),
    moveTo: () => {},
    lineTo: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {},
    save: () => {},
    restore: () => {},
    scale: () => {},
    rotate: () => {},
    translate: () => {},
    transform: () => {},
    setTransform: () => {},
    globalAlpha: 1,
    lineWidth: 1,
    strokeStyle: '#000',
    fillStyle: '#000',
    shadowBlur: 0,
    shadowColor: ''
  };
}

function createVMContext(options = {}) {
  const custom = options.customSandbox || options;
  if (custom.window) {
    const win = custom.window;
    if (custom.CabsCrypto && !win.CabsCrypto) win.CabsCrypto = custom.CabsCrypto;
    if (custom.document && !win.document) win.document = custom.document;
    return win;
  }

  const windowListeners = {};
  const docListeners = {};

  const docRoot = createMockDOMNode('html');
  const docBody = createMockDOMNode('body');
  const docHead = createMockDOMNode('head');
  docRoot.appendChild(docHead);
  docRoot.appendChild(docBody);

  const elementRegistry = new Map();

  const mockDoc = {
    documentElement: docRoot,
    body: docBody,
    head: docHead,
    createElement: (tag) => {
      const n = createMockDOMNode(tag);
      n.ownerDocument = mockDoc;
      return n;
    },
    createTextNode: (text) => ({ textContent: text }),
    getElementById: (id) => {
      const found = docRoot.querySelector(`#${id}`);
      if (found) return found;
      if (elementRegistry.has(id)) return elementRegistry.get(id);
      return null;
    },
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
      const target = (evt && evt.target) || mockDoc;
      if (docListeners[evtName]) docListeners[evtName].forEach(fn => fn.call(target, evt));
    },
    registerElement: (id, elem) => elementRegistry.set(id, elem)
  };

  docRoot.ownerDocument = mockDoc;
  docBody.ownerDocument = mockDoc;
  docHead.ownerDocument = mockDoc;

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    matchMedia: (query) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {}
    }),
    innerWidth: options.innerWidth || 1280,
    innerHeight: options.innerHeight || 800,
    localStorage: {
      _store: {},
      getItem(k) { return this._store[k] !== undefined ? this._store[k] : null; },
      setItem(k, v) { this._store[k] = String(v); },
      removeItem(k) { delete this._store[k]; },
      clear() { this._store = {}; }
    },
    sessionStorage: {
      _store: {},
      getItem(k) { return this._store[k] !== undefined ? this._store[k] : null; },
      setItem(k, v) { this._store[k] = String(v); },
      removeItem(k) { delete this._store[k]; },
      clear() { this._store = {}; }
    },
    location: {
      href: 'http://localhost:3000/',
      origin: 'http://localhost:3000',
      protocol: 'http:',
      host: 'localhost:3000',
      hostname: 'localhost',
      port: '3000',
      pathname: '/',
      search: '',
      hash: '',
      reload: () => {}
    },
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Simulated Node VM'
    },
    document: mockDoc,
    Event: function Event(type) { this.type = type; },
    CustomEvent: function CustomEvent(type, detail) { this.type = type; this.detail = detail; },
    MouseEvent: function MouseEvent(type, opts = {}) { this.type = type; Object.assign(this, opts); },
    KeyboardEvent: function KeyboardEvent(type, opts = {}) { this.type = type; Object.assign(this, opts); },
    CabsCrypto: {
      openModal: () => {},
      executeCommand: () => {},
      filterTechStack: () => {}
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
      if (windowListeners[evtName]) windowListeners[evtName].forEach(fn => fn(evt));
    },
    ...(options.customSandbox || options)
  };

  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.self = sandbox;

  return sandbox;
}

function runInVMContext(filePathOrCode, customSandbox = {}) {
  let code = filePathOrCode;
  let filename = 'vm_execution.js';

  if (typeof filePathOrCode === 'string' && (filePathOrCode.endsWith('.js') || fileExists(filePathOrCode))) {
    code = readLocalFile(filePathOrCode);
    filename = path.basename(filePathOrCode);
  }

  const sandbox = createVMContext(customSandbox);
  const context = vm.createContext(sandbox);

  vm.runInContext(code, context, { filename, timeout: 5000 });

  return {
    context,
    window: sandbox.window,
    document: sandbox.document,
    CabsCrypto: sandbox.CabsCrypto
  };
}

module.exports = {
  describe,
  test,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  getRegisteredSuites,
  clearRegisteredSuites,
  AssertionError,
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
  httpRequest,
  parseHTML,
  parseCSS,
  createMockDOMNode,
  createMockCanvasContext,
  createVMContext,
  runInVMContext
};
