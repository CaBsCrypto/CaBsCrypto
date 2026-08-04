/**
 * CabsCrypto - Tech Stack Matrix & Matrix Digital Rain Module
 * Path: js/matrix.js
 */
(function () {
  'use strict';

  let rainCanvas = null;
  let rainCtx = null;
  let animationFrameId = null;
  let isRainRunning = false;

  const MATRIX_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';

  /**
   * Filter Tech Stack Matrix domain categories
   * @param {string|object} rawCategory - Domain category string or payload object
   */
  function filterTechStack(rawCategory) {
    const category = (typeof rawCategory === 'string'
      ? rawCategory
      : (rawCategory && rawCategory.category ? rawCategory.category : 'all')).toLowerCase();

    // Update active tab buttons
    const tabs = document.querySelectorAll('.matrix-tab');
    tabs.forEach(tab => {
      const tabCat = (tab.dataset.category || tab.getAttribute('data-category') || '').toLowerCase();
      if (tabCat === category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Filter stack categories / items
    const cards = document.querySelectorAll('.stack-category, .matrix-item, .skill-card');
    cards.forEach(card => {
      const domain = (card.dataset.domain || card.getAttribute('data-domain') || '').toLowerCase();
      if (category === 'all' || domain === category || !domain) {
        card.style.display = '';
        card.classList.remove('hidden');
      } else {
        card.style.display = 'none';
        card.classList.add('hidden');
      }
    });

    if (window.CabsCrypto && window.CabsCrypto.state) {
      window.CabsCrypto.state.techMatrixCategory = category;
    }
  }

  let resizeHandler = null;

  /**
   * Start Matrix Digital Rain 2D Canvas Animation
   */
  function startMatrixRain() {
    if (isRainRunning) return;

    if (!rainCanvas) {
      rainCanvas = document.createElement('canvas');
      rainCanvas.id = 'matrix-canvas';
      rainCanvas.style.position = 'fixed';
      rainCanvas.style.top = '0';
      rainCanvas.style.left = '0';
      rainCanvas.style.width = '100vw';
      rainCanvas.style.height = '100vh';
      rainCanvas.style.zIndex = '9998';
      rainCanvas.style.pointerEvents = 'none';
      rainCanvas.style.opacity = '0.85';
      document.body.appendChild(rainCanvas);
    }

    rainCtx = rainCanvas.getContext('2d');
    if (!rainCtx) return;

    let width = window.innerWidth || 1280;
    let height = window.innerHeight || 800;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    rainCanvas.width = width * dpr;
    rainCanvas.height = height * dpr;
    rainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = 16;
    let columns = Math.floor(width / fontSize) + 1;
    let drops = new Array(columns).fill(1);

    function updateDimensions() {
      if (!rainCanvas || !rainCtx) return;
      width = window.innerWidth || 1280;
      height = window.innerHeight || 800;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      rainCanvas.width = width * dpr;
      rainCanvas.height = height * dpr;
      rainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.floor(width / fontSize) + 1;
      const newDrops = new Array(columns).fill(1);
      for (let i = 0; i < Math.min(drops.length, columns); i++) {
        newDrops[i] = drops[i];
      }
      drops = newDrops;
    }

    resizeHandler = updateDimensions;
    window.addEventListener('resize', resizeHandler);

    isRainRunning = true;
    document.body.classList.add('matrix-mode');

    function renderRain() {
      if (!isRainRunning) return;

      rainCtx.fillStyle = 'rgba(8, 9, 15, 0.08)';
      rainCtx.fillRect(0, 0, width, height);

      rainCtx.fillStyle = '#00ff41';
      rainCtx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        rainCtx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(renderRain);
    }

    renderRain();
  }

  /**
   * Stop Matrix Digital Rain 2D Canvas Animation
   */
  function stopMatrixRain() {
    isRainRunning = false;
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (rainCanvas && rainCanvas.parentNode) {
      rainCanvas.parentNode.removeChild(rainCanvas);
      rainCanvas = null;
      rainCtx = null;
    }
    document.body.classList.remove('matrix-mode');
  }

  /**
   * Toggle Matrix Digital Rain Mode
   */
  function toggleMatrixRain() {
    if (isRainRunning) {
      stopMatrixRain();
    } else {
      startMatrixRain();
    }
  }

  function initMatrix() {
    // Matrix Mode CSS Injection
    if (!document.getElementById('matrix-mode-style')) {
      const style = document.createElement('style');
      style.id = 'matrix-mode-style';
      style.textContent = `
        body.matrix-mode {
          --cyan: #00ff41 !important;
          --neon-cyan: #00ff41 !important;
        }
        body.matrix-mode .gradient-text {
          background: linear-gradient(135deg, #00ff41, #00cc33) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        body.matrix-mode .navbar {
          border-color: rgba(0,255,65,0.4) !important;
        }
        body.matrix-mode .pulse-dot {
          background: #00ff41 !important;
          box-shadow: 0 0 10px #00ff41 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Attach click listeners to .matrix-tab buttons
    const tabs = document.querySelectorAll('.matrix-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        const cat = tab.dataset.category || tab.getAttribute('data-category') || 'all';
        filterTechStack(cat);
        if (window.CabsCrypto && typeof window.CabsCrypto.filterTechStack === 'function') {
          window.CabsCrypto.state.techMatrixCategory = cat;
        }
      });
    });

    // Subscribe to PubSub event bus
    if (window.CabsCrypto && typeof window.CabsCrypto.on === 'function') {
      window.CabsCrypto.on('matrix:filter', (data) => {
        const cat = typeof data === 'string' ? data : (data && data.category ? data.category : 'all');
        filterTechStack(cat);
      });
    }
  }

  // Expose global methods
  window.filterTechStack = filterTechStack;
  window.startMatrixRain = startMatrixRain;
  window.stopMatrixRain = stopMatrixRain;
  window.MatrixRainEngine = {
    start: startMatrixRain,
    stop: stopMatrixRain,
    toggle: toggleMatrixRain,
    isRunning: () => isRainRunning
  };

  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('matrix', initMatrix);
  } else {
    document.addEventListener('DOMContentLoaded', initMatrix);
  }
})();
