/**
 * CabsCrypto - Hero Typing Effect & Particle Canvas
 * Path: js/hero.js
 */
(function () {
  'use strict';

  let typingTimer = null;

  function initHero() {
    initTypingEffect();
    initParticleCanvas();
    initSpotlightCursor();
  }

  function initTypingEffect() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }

    const el = document.getElementById('typing-text');
    if (!el) return;

    let words = [
      'Descentralizado & CLI Tools',
      'Smart Contracts en Solidity',
      'Bots MEV & Quant Trading',
      'Sistemas de Alta Eficiencia',
      'Web3 Architecture & DeFi'
    ];

    words = words.filter(w => typeof w === 'string' && w.trim().length > 0);
    if (words.length === 0) return;

    let wi = 0, ci = 0, deleting = false;

    function tick() {
      const word = words[wi];
      if (deleting) {
        ci = Math.max(0, ci - 1);
        el.textContent = word.substring(0, ci);
      } else {
        ci = Math.min(word.length, ci + 1);
        el.textContent = word.substring(0, ci);
      }

      let delay = deleting ? 35 : 75;
      if (!deleting && ci >= word.length) {
        delay = 2400;
        deleting = true;
      } else if (deleting && ci <= 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        delay = 350;
      }

      typingTimer = setTimeout(tick, delay);
    }
    tick();
  }

  function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const N = Math.min(Math.floor(W / 22), 80);
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.5 ? '#00f3ff' : '#ff007a'
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = '#00f3ff';
            ctx.globalAlpha = (1 - d / 115) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
  }

  function initSpotlightCursor() {
    const cursor = document.getElementById('spotlight-cursor');
    if (cursor) {
      document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
    }
    // Card spotlight effect
    document.querySelectorAll('.bento-card, .glass-card, .spotlight-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = `${e.clientX - r.left}px`;
        const y = `${e.clientY - r.top}px`;
        card.style.setProperty('--mouse-x', x);
        card.style.setProperty('--mouse-y', y);
        card.style.setProperty('--card-mouse-x', x);
        card.style.setProperty('--card-mouse-y', y);
        card.style.setProperty('--mx', x);
        card.style.setProperty('--my', y);
      });
    });
  }

  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('hero', initHero);
  } else {
    document.addEventListener('DOMContentLoaded', initHero);
  }
})();
