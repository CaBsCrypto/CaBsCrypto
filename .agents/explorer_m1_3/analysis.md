# Detailed Analysis & JavaScript Blueprint Report: `js/app.js`

**Milestone 1 — Design System & Layout Infrastructure**  
**Explorer**: Explorer 3 (M1)  
**Target Path**: `js/app.js`  
**Date**: 2026-08-03  

---

## 1. Executive Summary & Scope

`js/app.js` serves as the core foundational JavaScript engine for the CabsCrypto cyber-futuristic portfolio landing page. Under the Milestone 1 architecture (as specified in `PROJECT.md` and `SCOPE.md`), `app.js` operates as the central coordinator, visual effects engine, and event bus for the entire application.

### Key Responsibilities
1. **Global Event Bus (`window.CabsCrypto`)**: Lightweight, framework-free Pub/Sub event emitter, global state management, and interface contract execution (`on`, `emit`, `openModal`, `executeCommand`, `filterTechStack`).
2. **Radial Spotlight Cursor Engine**: High-frequency mouse movement listener tracking cursor coordinates, updating CSS custom variables (`--mouse-x`, `--mouse-y`) globally and per-card for neo-glassmorphism glowing border & radial spotlight effects.
3. **Cyber Grid & Particle Background Canvas**: High-performance HTML5 2D Canvas engine (`#bg-canvas`) rendering an interactive particle network with neon cyan/magenta node links and seamless resizing across mobile/desktop displays.
4. **Navigation Interactivity & Mobile Shell**: Smooth section scrolling, Scroll-Spy nav link highlighting, and mobile menu hamburger toggle (`#mobile-menu-toggle`).
5. **Global Modal Controller**: Central backdrop click handler, ESC key listener, and accessibility management for `#project-modal`.
6. **Sub-Module Lifecycle Hooks**: Module registration registry allowing M2 (`hero.js`, `terminal.js`) and M3 (`bento.js`, `matrix.js`) modules to safely attach, emit, and listen to application events without load-order race conditions.

---

## 2. Event Bus & Interface Contract Blueprint (`window.CabsCrypto`)

### 2.1 Design & State Management
`window.CabsCrypto` acts as the single source of truth and communication channel across independent scripts. It exposes:

- `state`: Application runtime state holding current section, active modal ID, active matrix domain filter, and module load flags.
- `listeners`: Internal `Map<string, Set<Function>>` mapping event names to registered callbacks.
- Core PubSub Methods: `on(event, callback)`, `off(event, callback)`, `emit(event, data)`.
- Global Interface Contracts:
  - `CabsCrypto.openModal(projectId)`: Dispatches `'modal:open'` with project details or delegates to modal engine.
  - `CabsCrypto.executeCommand(cmdString)`: Scrolls to `#terminal` and dispatches `'terminal:execute'`.
  - `CabsCrypto.filterTechStack(category)`: Scrolls to `#stack` and dispatches `'matrix:filter'`.
- Module Lifecycle Registry:
  - `CabsCrypto.registerModule(name, initFn)`: Registers and initializes sub-modules.
  - `CabsCrypto.onReady(callback)`: Executes callback when DOM and base app are ready.

### 2.2 Interface Contracts Summary Table

| Method / Event | Direction | Payload | Description |
|---|---|---|---|
| `CabsCrypto.on(event, fn)` | Subscriber | `(eventName, callback)` | Subscribes callback to event. Returns unsubscribe function. |
| `CabsCrypto.emit(event, data)` | Emitter | `(eventName, data)` | Emits event with optional payload data to all listeners. |
| `CabsCrypto.openModal(id)` | Call | `projectId: string` | Triggers modal for specified project ID. Emits `'modal:open'`. |
| `CabsCrypto.executeCommand(cmd)` | Call | `cmdString: string` | Triggers command execution in CLI terminal. Emits `'terminal:execute'`. |
| `CabsCrypto.filterTechStack(cat)` | Call | `category: string` | Filters tech matrix by category. Emits `'matrix:filter'`. |
| `'modal:open'` | Event | `{ projectId: string }` | Emitted when a project modal is requested. |
| `'modal:close'` | Event | `{}` | Emitted when any modal is closed. |
| `'terminal:execute'` | Event | `{ command: string }` | Emitted when CLI command is dispatched from external trigger. |
| `'matrix:filter'` | Event | `{ category: string }` | Emitted when tech stack matrix tab filter changes. |
| `'module:registered'` | Event | `{ name: string }` | Emitted when a sub-module registers with `app.js`. |
| `'app:ready'` | Event | `{ version: string }` | Emitted when `app.js` bootstrap completes. |

---

## 3. Detailed Component Architecture

### 3.1 Radial Spotlight Cursor Engine
- **Mechanism**: Captures `mousemove` events on `document` and `.spotlight-card` elements.
- **Root CSS Variables**: Sets `--mouse-x` and `--mouse-y` on `document.documentElement` for overall page spotlight effects.
- **Card-Level Tracking**: On elements matching `.spotlight-card`, computes element-relative offset `x = e.clientX - rect.left` and `y = e.clientY - rect.top`, setting `--card-mouse-x: ${x}px` and `--card-mouse-y: ${y}px`.
- **Performance Optimization**: Uses `requestAnimationFrame` throttling to ensure cursor updates coincide with screen refresh cycles (60Hz/144Hz) without layout thrashing.
- **Touch Fallback**: Gracefully disables or ignores touch events to prevent console errors on touch screens.

### 3.2 Cyber Particle Network & Grid Background (`#bg-canvas`)
- **Canvas Container**: `#bg-canvas` positioned `fixed` top:0, left:0, z-index:-2.
- **DPI Scaling**: Uses `window.devicePixelRatio` for retina clarity.
- **Particle Model**:
  - Density: Math.floor(window.innerWidth / 25) particles (scaled dynamically).
  - Velocity: random float between -0.4 and 0.4.
  - Colors: Neon Cyan (`#00f3ff`), Neon Magenta (`#ff007a`), Neon Lime (`#00ff66`).
  - Node Connections: Calculates Euclidean distance between particles ($d < 120\text{px}$), drawing semi-transparent neon lines with dynamic opacity `(1 - d / 120) * 0.15`.
- **Power Optimization**: Listens to `visibilitychange` API (`document.hidden`). Automatically pauses `requestAnimationFrame` loop when the browser tab is hidden/minimized, saving battery and GPU resources.

### 3.3 Navigation & Smooth Scroll Integration
- **Smooth Scroll**: Listens for click on `a[href^="#"]` elements. Calculates header offset (~80px navbar height) and calls `window.scrollTo({ top: targetTop, behavior: 'smooth' })`.
- **Scroll-Spy Active Link**: Uses `IntersectionObserver` observing all main `<section>` elements (`#hero`, `#projects`, `#terminal`, `#stack`, `#stats`, `#contact`). Highlights corresponding nav item `.nav-links a[href="#<id>"]` with class `.active`.
- **Mobile Menu Toggle**: Listens for click on `#mobile-menu-toggle`. Toggles `.nav-open` on `.nav-links` and sets `aria-expanded` true/false. Closes menu automatically when any nav link is clicked.

### 3.4 Global Modal Dialog Controller
- **Target Modal**: `#project-modal`.
- **Open Mechanism**: Adds `.active` class to modal overlay, sets `aria-hidden="false"`, locks body scroll (`document.body.style.overflow = 'hidden'`).
- **Close Mechanism**:
  1. Click on `#modal-close-btn` or any element with `[data-close-modal]`.
  2. Click on `.modal-overlay` (backdrop click target matching `e.target === modalOverlay`).
  3. Keydown `ESC` key listener on `window`.
  4. Removes `.active`, sets `aria-hidden="true"`, unlocks body scroll (`document.body.style.overflow = ''`).
  5. Emits `'modal:close'` event.

---

## 4. Full Production JavaScript Blueprint for `js/app.js`

Below is the complete, modular, error-resilient JavaScript blueprint for `js/app.js`.

```javascript
/* ==========================================================================
   CabsCrypto - Cyber-Futuristic Portfolio Landing Page Core Engine
   Path: js/app.js
   Milestone: M1 (Design System & Layout Infrastructure)
   ========================================================================== */

(function () {
  'use strict';

  // =========================================================================
  // 1. Global Namespace & PubSub Event Bus (window.CabsCrypto)
  // =========================================================================
  const eventListeners = new Map();
  const readyCallbacks = [];
  let isDOMReady = false;

  const CabsCrypto = {
    version: '2.5.0',
    
    // Application State Store
    state: {
      activeModal: null,
      currentSection: 'hero',
      techMatrixCategory: 'all',
      isMobileMenuOpen: false,
      modulesLoaded: {
        hero: false,
        terminal: false,
        bento: false,
        matrix: false
      }
    },

    /**
     * Subscribe to a global event
     * @param {string} event - Event name
     * @param {Function} callback - Callback handler
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
      if (typeof callback !== 'function') return () => {};
      if (!eventListeners.has(event)) {
        eventListeners.set(event, new Set());
      }
      eventListeners.get(event).add(callback);
      return () => this.off(event, callback);
    },

    /**
     * Unsubscribe from a global event
     * @param {string} event - Event name
     * @param {Function} callback - Callback handler
     */
    off(event, callback) {
      if (eventListeners.has(event)) {
        eventListeners.get(event).delete(callback);
      }
    },

    /**
     * Emit a global event
     * @param {string} event - Event name
     * @param {*} [data] - Event payload
     */
    emit(event, data) {
      if (!eventListeners.has(event)) return;
      eventListeners.get(event).forEach(fn => {
        try {
          fn(data);
        } catch (err) {
          console.error(`[CabsCrypto Event Error] (${event}):`, err);
        }
      });
    },

    /**
     * Interface Contract: Open project detail modal
     * @param {string} projectId - ID of project
     */
    openModal(projectId) {
      this.state.activeModal = projectId;
      this.emit('modal:open', { projectId });
      
      const modal = document.getElementById('project-modal');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    },

    /**
     * Interface Contract: Close project detail modal
     */
    closeModal() {
      const modal = document.getElementById('project-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      this.state.activeModal = null;
      this.emit('modal:close', {});
    },

    /**
     * Interface Contract: Execute CLI command via terminal
     * @param {string} cmdString - Command string to execute
     */
    executeCommand(cmdString) {
      this.emit('terminal:execute', { command: cmdString });
      const terminalSection = document.getElementById('terminal');
      if (terminalSection) {
        terminalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },

    /**
     * Interface Contract: Filter Tech Stack Matrix domain category
     * @param {string} category - Skill category (all, web3, frontend, backend, devops)
     */
    filterTechStack(category) {
      this.state.techMatrixCategory = category;
      this.emit('matrix:filter', { category });
      const matrixSection = document.getElementById('stack');
      if (matrixSection) {
        matrixSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    /**
     * Sub-Module Lifecycle Register: Sub-modules call this when loaded
     * @param {string} name - Module name ('hero'|'terminal'|'bento'|'matrix')
     * @param {Function} initFn - Initializer callback receiving CabsCrypto instance
     */
    registerModule(name, initFn) {
      if (this.state.modulesLoaded[name]) {
        console.warn(`[CabsCrypto] Module '${name}' is already registered.`);
        return;
      }
      this.state.modulesLoaded[name] = true;
      if (typeof initFn === 'function') {
        this.onReady(() => {
          try {
            initFn(this);
            this.emit('module:registered', { name });
          } catch (err) {
            console.error(`[CabsCrypto] Failed to initialize module '${name}':`, err);
          }
        });
      }
    },

    /**
     * Queue callbacks to execute when DOM & CabsCrypto engine are ready
     * @param {Function} fn - Callback function
     */
    onReady(fn) {
      if (typeof fn !== 'function') return;
      if (isDOMReady) {
        fn(this);
      } else {
        readyCallbacks.push(fn);
      }
    }
  };

  // Expose to window namespace globally
  window.CabsCrypto = CabsCrypto;

  // =========================================================================
  // 2. Radial Spotlight Cursor Engine
  // =========================================================================
  function initSpotlightEffect() {
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;

    // Track global document cursor position
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Track card-relative position for glassmorphism cards with glowing borders
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        card.style.setProperty('--card-mouse-x', `${cardX}px`);
        card.style.setProperty('--card-mouse-y', `${cardY}px`);
        card.style.setProperty('--mouse-x', `${cardX}px`); // Fallback compatibility
        card.style.setProperty('--mouse-y', `${cardY}px`);
      }, { passive: true });
    });
  }

  // =========================================================================
  // 3. Cyber Particle Network & Background Canvas (#bg-canvas)
  // =========================================================================
  function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = null;
    const particles = [];
    const colors = ['#00f3ff', '#ff007a', '#00ff66'];

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      createParticles();
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.6 + 0.5;
        this.alpha = Math.random() * 0.45 + 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
    }

    function createParticles() {
      particles.length = 0;
      const count = Math.min(Math.floor(width / 22), 80);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const pCount = particles.length;
      for (let i = 0; i < pCount; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < pCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00f3ff';
            ctx.globalAlpha = (1 - dist / 110) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    // Handle tab visibility to pause canvas when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        render();
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    });

    resizeCanvas();
    render();
  }

  // =========================================================================
  // 4. Navigation & Mobile Menu Interactivity
  // =========================================================================
  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a, a[href^="#"]');

    // Mobile Menu Toggle
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('nav-open');
        toggleBtn.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        CabsCrypto.state.isMobileMenuOpen = isOpen;
      });
    }

    // Smooth Scroll & Close Mobile Nav on Selection
    navAnchors.forEach(anchor => {
      anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#') || href === '#') return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const navHeight = navbar ? navbar.offsetHeight : 70;
          const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;

          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (navLinks && navLinks.classList.contains('nav-open')) {
            navLinks.classList.remove('nav-open');
            if (toggleBtn) {
              toggleBtn.classList.remove('active');
              toggleBtn.setAttribute('aria-expanded', 'false');
            }
            CabsCrypto.state.isMobileMenuOpen = false;
          }
        }
      });
    });

    // Scroll-Spy: Active Nav Link Highlighting
    const sections = document.querySelectorAll('section[id], footer[id]');
    if ('IntersectionObserver' in window && sections.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            CabsCrypto.state.currentSection = id;
            
            document.querySelectorAll('.nav-links a').forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach(sec => observer.observe(sec));
    }
  }

  // =========================================================================
  // 5. Global Modal Dialog Handlers (ESC key & Backdrop Click)
  // =========================================================================
  function initModalHandlers() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal) return;

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        CabsCrypto.closeModal();
      });
    }

    // Backdrop click listener
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.classList.contains('modal-overlay')) {
        CabsCrypto.closeModal();
      }
    });

    // Global ESC key press listener
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (modal.classList.contains('active') || CabsCrypto.state.activeModal !== null) {
          CabsCrypto.closeModal();
        }
      }
    });
  }

  // =========================================================================
  // 6. Application Bootstrap Sequence
  // =========================================================================
  function bootstrap() {
    isDOMReady = true;

    initParticleCanvas();
    initSpotlightEffect();
    initNavigation();
    initModalHandlers();

    // Execute queued module initializers
    readyCallbacks.forEach(fn => {
      try {
        fn(CabsCrypto);
      } catch (err) {
        console.error('[CabsCrypto Bootstrap Error]:', err);
      }
    });
    readyCallbacks.length = 0;

    CabsCrypto.emit('app:ready', { version: CabsCrypto.version });
  }

  // Listen for DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
```

---

## 5. Verification & Test Protocol

To verify the compliance and functionality of `js/app.js` once written:

1. **Global Object Check**: Open browser developer console and type `window.CabsCrypto`. Confirm `on`, `emit`, `openModal`, `executeCommand`, `filterTechStack`, and `state` are defined.
2. **Event Bus Test**:
   - Run `CabsCrypto.on('test', console.log)`
   - Run `CabsCrypto.emit('test', 'Hello Cyber World!')`
   - Observe console log.
3. **Cursor Spotlight Test**: Move mouse over `.spotlight-card` elements; verify `--mouse-x`, `--mouse-y`, `--card-mouse-x`, `--card-mouse-y` update dynamically in DevTools Element Inspector.
4. **Canvas Performance Test**: Verify `#bg-canvas` renders animated particles. Switch browser tab and return; verify background loop paused and resumed smoothly.
5. **Modal Interactions Test**:
   - Call `CabsCrypto.openModal('bot')` in console -> check `#project-modal` receives `.active` class and body overflow locks.
   - Press `ESC` -> verify modal closes and body scroll unlocks.
   - Click modal background overlay -> verify modal closes.
6. **Mobile Nav Test**: Resize viewport < 768px, click `#mobile-menu-toggle`, verify `.nav-open` class toggles.

---

## 6. Recommendations for Implementers

- Place the code above in `js/app.js`.
- In `index.html`, load `js/app.js` first in the script loading section before `js/hero.js`, `js/terminal.js`, `js/bento.js`, and `js/matrix.js`.
- In subsequent sub-modules, use `window.CabsCrypto.registerModule('hero', (app) => { ... })` or `window.CabsCrypto.on(...)` to attach listeners cleanly.
