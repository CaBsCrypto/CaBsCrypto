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
      
      const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
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
      const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('show');
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
      const terminalSection = document.getElementById('terminal-container') || document.getElementById('terminal');
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
      const matrixSection = document.getElementById('matrix-container') || document.getElementById('stack');
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

      if (e.target && e.target.style) {
        const rect = e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : { left: 0, top: 0 };
        const cardX = (e.clientX !== undefined ? e.clientX : 0) - (rect.left || 0);
        const cardY = (e.clientY !== undefined ? e.clientY : 0) - (rect.top || 0);
        const xStr = `${cardX}px`;
        const yStr = `${cardY}px`;
        if (typeof e.target.style.setProperty === 'function') {
          e.target.style.setProperty('--card-mouse-x', xStr);
          e.target.style.setProperty('--card-mouse-y', yStr);
          e.target.style.setProperty('--mouse-x', xStr);
          e.target.style.setProperty('--mouse-y', yStr);
          e.target.style.setProperty('--mx', xStr);
          e.target.style.setProperty('--my', yStr);
        } else {
          e.target.style['--card-mouse-x'] = xStr;
          e.target.style['--card-mouse-y'] = yStr;
          e.target.style['--mouse-x'] = xStr;
          e.target.style['--mouse-y'] = yStr;
          e.target.style['--mx'] = xStr;
          e.target.style['--my'] = yStr;
        }
      }
    }, { passive: true });

    // Direct listener for spotlight cards
    const spotlightCards = document.querySelectorAll('.spotlight-card, .bento-card, .glass-card');
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect ? card.getBoundingClientRect() : { left: 0, top: 0 };
        const cardX = e.clientX - (rect.left || 0);
        const cardY = e.clientY - (rect.top || 0);
        const xStr = `${cardX}px`;
        const yStr = `${cardY}px`;

        if (card.style && typeof card.style.setProperty === 'function') {
          card.style.setProperty('--card-mouse-x', xStr);
          card.style.setProperty('--card-mouse-y', yStr);
          card.style.setProperty('--mouse-x', xStr);
          card.style.setProperty('--mouse-y', yStr);
          card.style.setProperty('--mx', xStr);
          card.style.setProperty('--my', yStr);
        } else if (card.style) {
          card.style['--card-mouse-x'] = xStr;
          card.style['--card-mouse-y'] = yStr;
          card.style['--mouse-x'] = xStr;
          card.style['--mouse-y'] = yStr;
          card.style['--mx'] = xStr;
          card.style['--my'] = yStr;
        }
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

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!animationFrameId) {
          render();
        }
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
    document.addEventListener('click', e => {
      let toggleBtn = document.getElementById('mobile-menu-toggle');
      let navLinks = document.querySelector('.nav-links');
      const clickedToggle = e.target && (e.target.id === 'mobile-menu-toggle' || (e.target.closest && e.target.closest('#mobile-menu-toggle')));
      if (clickedToggle) {
        if (!toggleBtn) toggleBtn = e.target.closest ? e.target.closest('#mobile-menu-toggle') : e.target;
        if (!navLinks) navLinks = document.querySelector('.nav-links');
        if (toggleBtn && navLinks) {
          const isOpen = navLinks.classList.toggle('nav-open');
          toggleBtn.classList.toggle('active');
          toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          CabsCrypto.state.isMobileMenuOpen = isOpen;
        }
      }
    });

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
    document.addEventListener('click', e => {
      const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
      const closeBtn = document.getElementById('modal-close-btn');
      if (closeBtn && (e.target === closeBtn || (e.target.closest && e.target.closest('#modal-close-btn')))) {
        CabsCrypto.closeModal();
      } else if (modal && (e.target === modal || (e.target.classList && (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop'))))) {
        CabsCrypto.closeModal();
      }
    });

    const handleEsc = e => {
      const k = e.key || e.code;
      if (k === 'Escape' || k === 'Esc' || e.keyCode === 27) {
        CabsCrypto.closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.addEventListener('keydown', handleEsc);
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
