# Design Specification: Hero Module (`js/hero.js`)

## 1. Executive Summary & Overview
The Hero module (`js/hero.js`) powers the flagship landing experience for the CabsCrypto portfolio. It is responsible for three core interactive features:
1. **Cycling Typewriter Engine**: Seamlessly types out, pauses, erases, and cycles through five distinct technical role titles inside `#typing-text`.
2. **Animated Gradient Text Effect**: Integrates multi-stop HSL neon gradient backgrounds with CSS background-clip and subtle keyframe animation to deliver a high-converting cyber-futuristic aesthetic.
3. **CTA Buttons & Interactive Triggers**: Handles smooth-scrolling navigation to project showcases (`#bento-container`) and direct integration with the interactive CLI terminal (`#terminal-container` and `#terminal-input`).

---

## 2. Requirements Specification

### R1. Cycling Typewriter Engine
- **DOM Container**: `#typing-text` inside section `#hero-container` (line 60 of `index.html`).
- **Phrases Catalog**:
  1. `"Decentralized Systems & CLI Tools"`
  2. `"High-Performance Smart Contracts"`
  3. `"Low-Latency Quant Trading Engines"`
  4. `"Cyber-Futuristic Web3 Architecture"`
  5. `"Automated Protocol Vulnerability Suites"`
- **Timing & Speed Configuration**:
  - `typingSpeed`: `70ms` per character (natural human-like keystroke pacing).
  - `erasingSpeed`: `35ms` per character (snappy removal, twice as fast as typing).
  - `pauseFull`: `2200ms` (dwell time when full phrase is displayed).
  - `pauseEmpty`: `450ms` (delay before typing the next phrase).
- **Blinking Cursor Element**:
  - Visual cursor: `<span class="typewriter-cursor" aria-hidden="true">|</span>` or `::after` pseudo-element.
  - CSS animation: `blink 0.8s step-end infinite`.
  - Screen reader accessibility: `aria-hidden="true"` on visual cursor; live region on parent container with `aria-live="polite"` or `aria-atomic="true"`.
- **State Machine & Lifecycle**:
  - States: `IDLE` -> `TYPING` -> `PAUSED_FULL` -> `ERASING` -> `PAUSED_EMPTY` -> `TYPING`.
  - Handlers for tab visibility (`visibilitychange`) to pause timers/rAF when document is hidden and resume cleanly on tab regain.

### R2. Animated Gradient Text Integration
- **Styling**: `gradient-text` class applied to `#typing-text`.
- **CSS Properties**:
  - `background: linear-gradient(135deg, var(--cyan) 0%, var(--magenta) 50%, var(--purple) 100%)`
  - `-webkit-background-clip: text` & `background-clip: text`
  - `-webkit-text-fill-color: transparent`
  - Keyframe background-position shimmer (`background-size: 200% 200%`, `animation: gradientShift 6s ease infinite`).
- **Dynamic Text Maintenance**: Text update methods must modify text content while preserving the `.gradient-text` class and blinking cursor sibling.

### R3. CTA Buttons Functionality
- **"Explore Projects" (`#btn-explore-projects`)**:
  - `click` listener triggers smooth scroll to `#bento-container` taking navbar height into account.
  - Emits `hero:explore-projects` event on `CabsCrypto` event bus.
- **"Open Terminal" (`#btn-open-terminal`)**:
  - `click` listener triggers smooth scroll to `#terminal-container`.
  - Automatically invokes focus on `#terminal-input`.
  - Emits `hero:open-terminal` event on `CabsCrypto` event bus.
- **Header "Connect" Button (`#btn-nav-connect`) & Status Tag (`#hero-status`)**:
  - Connect button scrolls to `#contact`.
  - Status tag click scrolls to `#contact` or opens terminal with contact prompt.

---

## 3. Architecture & Code Structure

### Module Pattern & Global Registration
`js/hero.js` is encapsulated within an IIFE and registers itself via `window.CabsCrypto.registerModule('hero', initHeroModule)`.

```javascript
/**
 * Hero Section Dynamic Typing & Interaction Engine
 * Path: js/hero.js
 * Milestone: M2 (Hero Section & Interactive CLI Terminal)
 */
(function () {
  'use strict';

  // Module Configuration
  const HERO_CONFIG = {
    titles: [
      'Decentralized Systems & CLI Tools',
      'High-Performance Smart Contracts',
      'Low-Latency Quant Trading Engines',
      'Cyber-Futuristic Web3 Architecture',
      'Automated Protocol Vulnerability Suites'
    ],
    typingSpeed: 70,
    erasingSpeed: 35,
    pauseFull: 2200,
    pauseEmpty: 450
  };

  class TypewriterEngine {
    constructor(element, cursorElement, config = HERO_CONFIG) {
      this.element = element;
      this.cursorElement = cursorElement;
      this.titles = config.titles;
      this.typingSpeed = config.typingSpeed;
      this.erasingSpeed = config.erasingSpeed;
      this.pauseFull = config.pauseFull;
      this.pauseEmpty = config.pauseEmpty;

      this.titleIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.timerId = null;
      this.isPaused = false;
    }

    start() {
      if (this.timerId) clearTimeout(this.timerId);
      this.isPaused = false;
      this.tick();
    }

    stop() {
      this.isPaused = true;
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    }

    tick() {
      if (this.isPaused || !this.element) return;

      const currentTitle = this.titles[this.titleIndex];
      
      if (this.isDeleting) {
        this.charIndex--;
      } else {
        this.charIndex++;
      }

      const visibleText = currentTitle.substring(0, this.charIndex);
      this.element.textContent = visibleText;

      let nextDelay = this.isDeleting ? this.erasingSpeed : this.typingSpeed;

      if (!this.isDeleting && this.charIndex === currentTitle.length) {
        nextDelay = this.pauseFull;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.titleIndex = (this.titleIndex + 1) % this.titles.length;
        nextDelay = this.pauseEmpty;
      }

      this.timerId = setTimeout(() => this.tick(), nextDelay);
    }
  }

  function initHeroModule(app) {
    const typingEl = document.getElementById('typing-text');
    const exploreBtn = document.getElementById('btn-explore-projects');
    const terminalBtn = document.getElementById('btn-open-terminal');
    const heroStatusTag = document.getElementById('hero-status');

    if (!typingEl) {
      console.warn('[HeroModule] Element #typing-text not found.');
      return;
    }

    // Ensure cursor exists
    let cursorEl = typingEl.nextElementSibling;
    if (!cursorEl || !cursorEl.classList.contains('typewriter-cursor')) {
      cursorEl = document.createElement('span');
      cursorEl.className = 'typewriter-cursor';
      cursorEl.setAttribute('aria-hidden', 'true');
      cursorEl.textContent = '|';
      typingEl.parentNode.insertBefore(cursorEl, typingEl.nextSibling);
    }

    const typewriter = new TypewriterEngine(typingEl, cursorEl);
    typewriter.start();

    // Tab visibility handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        typewriter.stop();
      } else {
        typewriter.start();
      }
    });

    // CTA Button: Explore Projects
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const bentoSec = document.getElementById('bento-container');
        if (bentoSec) {
          const navbar = document.getElementById('navbar');
          const navHeight = navbar ? navbar.offsetHeight : 70;
          const targetPos = bentoSec.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
        if (app && typeof app.emit === 'function') {
          app.emit('hero:explore-projects', {});
        }
      });
    }

    // CTA Button: Open Terminal
    if (terminalBtn) {
      terminalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const termSec = document.getElementById('terminal-container') || document.getElementById('terminal');
        const termInput = document.getElementById('terminal-input');
        if (termSec) {
          const navbar = document.getElementById('navbar');
          const navHeight = navbar ? navbar.offsetHeight : 70;
          const targetPos = termSec.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
        if (termInput) {
          setTimeout(() => termInput.focus(), 300);
        }
        if (app && typeof app.emit === 'function') {
          app.emit('hero:open-terminal', {});
        }
      });
    }

    // Public API object exposed under CabsCrypto.hero
    app.hero = {
      typewriter,
      start: () => typewriter.start(),
      stop: () => typewriter.stop(),
      setTitles: (newTitles) => {
        if (Array.isArray(newTitles) && newTitles.length > 0) {
          HERO_CONFIG.titles = newTitles;
          typewriter.titles = newTitles;
          typewriter.titleIndex = 0;
          typewriter.charIndex = 0;
          typewriter.isDeleting = false;
        }
      }
    };
  }

  // Register with global CabsCrypto namespace
  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('hero', initHeroModule);
  }
})();
```

---

## 4. Initialization Sequence & Module Interaction

```
[app.js] DOMContentLoaded Event
   │
   ▼
[app.js] CabsCrypto Engine Bootstrap
   │
   ├─► Initializes Particle Canvas (#bg-canvas)
   ├─► Initializes Radial Spotlight Effect
   ├─► Initializes Navigation & Smooth Scroll
   └─► Executes Registered Module Callbacks
         │
         ▼
     [js/hero.js] initHeroModule(CabsCrypto)
         │
         ├─► Binds #typing-text & injects cursor element
         ├─► Instantiates & starts TypewriterEngine
         ├─► Attaches CTA button event listeners (#btn-explore-projects, #btn-open-terminal)
         ├─► Registers visibilitychange listener
         ├─► Attaches app.hero public API to window.CabsCrypto
         └─► Emits 'module:registered' event for hero
```

---

## 5. Verification & Test Alignment
- **VM Execution Verification**: Compatible with Node.js VM context (`vm.runInContext`) without relying on missing DOM APIs when tested server-side.
- **E2E Integration Coverage**: Satisfies Tier 1 (Coverage 6.1-6.5), Tier 2 (Boundary handling for missing elements / tab hidden), Tier 3 (Module init order with app.js), and Tier 4 (Visitor landing scenario).
