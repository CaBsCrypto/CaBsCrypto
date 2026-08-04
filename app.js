/* ==========================================================================
   CabsCrypto - Cyber-Futuristic Portfolio Landing Page Core Engine
   Path: app.js (Root Fallback)
   Milestone: M1 (Design System & Layout Infrastructure)
   ========================================================================== */

(function () {
  'use strict';

  const eventListeners = new Map();
  const readyCallbacks = [];
  let isDOMReady = false;

  const CabsCrypto = window.CabsCrypto || {
    version: '2.5.0',
    
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

    on(event, callback) {
      if (typeof callback !== 'function') return () => {};
      if (!eventListeners.has(event)) {
        eventListeners.set(event, new Set());
      }
      eventListeners.get(event).add(callback);
      return () => this.off(event, callback);
    },

    off(event, callback) {
      if (eventListeners.has(event)) {
        eventListeners.get(event).delete(callback);
      }
    },

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

    closeModal() {
      const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      this.state.activeModal = null;
      this.emit('modal:close', {});
    },

    executeCommand(cmdString) {
      this.emit('terminal:execute', { command: cmdString });
      const terminalSection = document.getElementById('terminal-container') || document.getElementById('terminal');
      if (terminalSection) {
        terminalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },

    filterTechStack(category) {
      this.state.techMatrixCategory = category;
      this.emit('matrix:filter', { category });
      const matrixSection = document.getElementById('matrix-container') || document.getElementById('stack');
      if (matrixSection) {
        matrixSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    registerModule(name, initFn) {
      if (this.state.modulesLoaded[name]) {
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

    onReady(fn) {
      if (typeof fn !== 'function') return;
      if (isDOMReady) {
        fn(this);
      } else {
        readyCallbacks.push(fn);
      }
    }
  };

  window.CabsCrypto = CabsCrypto;

  function initSpotlightEffect() {
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;

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

    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        card.style.setProperty('--card-mouse-x', `${cardX}px`);
        card.style.setProperty('--card-mouse-y', `${cardY}px`);
        card.style.setProperty('--mouse-x', `${cardX}px`);
        card.style.setProperty('--mouse-y', `${cardY}px`);
      }, { passive: true });
    });
  }

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

  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a, a[href^="#"]');

    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('nav-open');
        toggleBtn.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        CabsCrypto.state.isMobileMenuOpen = isOpen;
      });
    }

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

  function initModalHandlers() {
    const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        CabsCrypto.closeModal();
      });
    }

    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.classList.contains('modal-overlay')) {
        CabsCrypto.closeModal();
      }
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (modal.classList.contains('active') || CabsCrypto.state.activeModal !== null) {
          CabsCrypto.closeModal();
        }
      }
    });
  }

  function bootstrap() {
    isDOMReady = true;

    initParticleCanvas();
    initSpotlightEffect();
    initNavigation();
    initModalHandlers();

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
