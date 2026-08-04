/**
 * CabsCrypto — Projects Carousel Module
 * Path: js/carousel.js
 */
(function () {
  'use strict';

  function initCarousel() {
    const track = document.getElementById('carousel-track');
    const container = document.getElementById('carousel-container');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!track || !container) return;

    const cards = Array.from(track.querySelectorAll('.proj-card'));
    if (!cards.length) return;

    // How many cards visible at a time (responsive)
    function visibleCount() {
      const w = window.innerWidth;
      if (w >= 1100) return 3;
      if (w >= 680) return 2;
      return 1;
    }

    let current = 0;
    let visible = visibleCount();

    // Build dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      const pages = Math.ceil(cards.length / visible);
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a página ${i + 1}`);
        dot.addEventListener('click', () => goTo(i * visible));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      const activePage = Math.floor(current / visible);
      dots.forEach((d, i) => d.classList.toggle('active', i === activePage));
    }

    function getCardWidth() {
      return cards[0].getBoundingClientRect().width + parseInt(getComputedStyle(track).gap || 24);
    }

    function goTo(index) {
      const maxIndex = Math.max(0, cards.length - visible);
      current = Math.max(0, Math.min(index, maxIndex));
      const cardW = getCardWidth();
      track.style.transform = `translateX(-${current * cardW}px)`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= maxIndex;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(current - visible));
    nextBtn.addEventListener('click', () => goTo(current + visible));

    // Drag/swipe
    let startX = 0, isDragging = false;
    container.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
    container.addEventListener('mousemove', e => { if (!isDragging) return; });
    container.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });
    container.addEventListener('mouseleave', () => { isDragging = false; });

    container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    container.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });

    // Init + resize
    function init() {
      visible = visibleCount();
      buildDots();
      goTo(0);
    }
    init();
    window.addEventListener('resize', () => { visible = visibleCount(); buildDots(); goTo(0); });
  }

  document.addEventListener('DOMContentLoaded', initCarousel);
})();
