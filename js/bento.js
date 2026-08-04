/**
 * CabsCrypto - Bento Grid Project Modal Module
 * Proyectos reales de github.com/CaBsCrypto
 * Path: js/bento.js
 */
(function () {
  'use strict';

  const ALIASES = {
    bot: 'agente',
    aegis: 'trustleaf',
    cli: 'gitlyzer'
  };

  const PROJECTS = {
    agente: {
      title: 'agente-asistente',
      img: 'assets/images/agente_asistente.jpg',
      desc: 'AI agent que reserva y paga por ti, con límites. Freeze intent, aplica policy, aprobación exacta, ejecuta una vez, guarda el receipt. Reservas reales en hubs, pagos replay-safe, on-chain proofs en Stellar.',
      stack: ['TypeScript', 'LangGraph', 'MCP', 'Stellar', 'AI Agents', 'Agentic Commerce'],
      features: [
        'Congela el intent antes de ejecutar (freeze-before-act)',
        'Pagos on-chain con receipts verificables en Stellar',
        'Policy engine con aprobación exacta y límites configurables'
      ],
      status: '🌐 Live en Vercel',
      statusColor: 'var(--lime)',
      link: 'https://github.com/CaBsCrypto/agente-asistente',
      demo: 'https://agente-asistente.vercel.app'
    },
    trustleaf: {
      title: 'TrustLeaf — ficha-onchain',
      img: 'assets/images/trustleaf.jpg',
      desc: 'Fichas médicas propiedad del paciente. Portables, verificables, con consent-gate. Hash on-chain en Stellar/Soroban, datos off-chain: el contenido es borrable, la prueba de que nadie lo alteró no.',
      stack: ['TypeScript', 'Soroban', 'Stellar', 'MCP', 'SSI', 'Healthcare'],
      features: [
        'Self-sovereign identity: el paciente controla su ficha',
        'Hash on-chain en Soroban, datos off-chain (privados y borrables)',
        'Demo live en trustleaf-demo.vercel.app'
      ],
      status: '🛡️ SSI + On-Chain Proof',
      statusColor: 'var(--cyan)',
      link: 'https://github.com/CaBsCrypto/ficha-onchain',
      demo: 'https://trustleaf-demo.vercel.app'
    },
    gitlyzer: {
      title: 'Gitlyzer',
      img: 'assets/images/gitlyzer.jpg',
      desc: 'Análisis de repositorios GitHub potenciado por AI — calidad de código, postura de seguridad y potencial de mercado, renderizado como charts interactivos con D3.js y Gemini.',
      stack: ['TypeScript', 'Gemini AI', 'D3.js', 'Code Analysis'],
      features: [
        'Score de calidad de código, seguridad y potencial de mercado',
        'Charts D3 interactivos para explorar el análisis',
        'Powered by Gemini para razonamiento sobre el código'
      ],
      status: '⭐ gitlyzer-opal.vercel.app',
      statusColor: 'var(--gold)',
      link: 'https://github.com/CaBsCrypto/gitlyzer',
      demo: 'https://gitlyzer-opal.vercel.app'
    },
    leadgen: {
      title: 'leadGenAI',
      img: 'assets/images/leadgen.jpg',
      desc: 'Encuentra negocios con mala presencia digital o sin web en comunas de Chile y puntúa la oportunidad de automatización AI. Google Maps + Gemini, mapeado a comunas chilenas.',
      stack: ['TypeScript', 'Gemini', 'Google Maps API', 'Lead Generation', 'Chile'],
      features: [
        'Escaneo de comunas chilenas con Google Maps API',
        'Score de oportunidad de automatización AI por negocio',
        'Forkado 1 vez — proyecto comunitario activo'
      ],
      status: '🔀 1 Fork · Open Source',
      statusColor: 'var(--cyan)',
      link: 'https://github.com/CaBsCrypto/leadGenAI',
      demo: null
    },
    prompts: {
      title: 'biblioteca-de-prompts',
      img: 'assets/images/biblioteca_prompts.jpg',
      desc: 'Prompt library full-stack con carpetas, tags, favoritos, community pública y remixes. React + Firebase + Gemini AI.',
      stack: ['TypeScript', 'React', 'Firebase', 'Gemini', 'Prompts'],
      features: [
        'Sistema de carpetas, tags y favoritos privados',
        'Community pública con remixes de prompts',
        'Live en biblioteca-de-prompts-ashen.vercel.app'
      ],
      status: '🌐 Live en Vercel',
      statusColor: 'var(--lime)',
      link: 'https://github.com/CaBsCrypto/biblioteca-de-prompts',
      demo: 'https://biblioteca-de-prompts-ashen.vercel.app'
    },
    creatorhub: {
      title: 'CreatorHub',
      img: 'assets/images/creatorhub.jpg',
      desc: 'Plataforma de operaciones que conecta creadores de contenido con clientes — dashboards por rol, onboarding, reviews públicos y analytics. Supabase + Gemini + SaaS.',
      stack: ['TypeScript', 'Supabase', 'Gemini', 'Next.js', 'SaaS', 'Creator Economy'],
      features: [
        'Dashboards con roles diferenciados (creador / cliente)',
        'Reviews públicos + sistema de onboarding',
        'Live en creator-hub-three-lake.vercel.app'
      ],
      status: '🌐 Live en Vercel',
      statusColor: 'var(--lime)',
      link: 'https://github.com/CaBsCrypto/CreatorHub',
      demo: 'https://creator-hub-three-lake.vercel.app'
    }
  };

  function resolveProjectId(id) {
    if (!id) return null;
    const lower = String(id).toLowerCase();
    return ALIASES[lower] || lower;
  }

  function openModal(rawId) {
    const key = resolveProjectId(rawId);
    const p = PROJECTS[key];
    const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
    if (!modal) return;

    const modalBody = document.getElementById('modal-body-content') || modal.querySelector('.modal-content');

    if (p && modalBody) {
      modalBody.innerHTML = `
        <h2 class="gradient-text" style="font-size:1.75rem;margin-bottom:0.75rem;">${p.title}</h2>
        <img src="${p.img}" alt="${p.title}" style="width:100%;height:200px;object-fit:cover;border-radius:10px;margin-bottom:1rem;border:1px solid var(--border-glass);">
        <p style="color:var(--text-muted);line-height:1.7;margin-bottom:1.25rem;">${p.desc}</p>
        <h4 style="color:var(--cyan);margin-bottom:0.6rem;">⚡ Features Clave</h4>
        <ul style="padding-left:1.2rem;color:var(--text-main);line-height:1.9;margin-bottom:1.25rem;">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.25rem;">
          <div class="project-tags" style="margin:0;">
            ${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}
          </div>
          <span style="font-family:var(--font-mono);font-size:0.85rem;color:${p.statusColor};">${p.status}</span>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <a href="${p.link}" target="_blank" class="btn-primary" style="display:inline-flex;font-size:0.9rem;padding:0.65rem 1.25rem;">
            <i class="fa-brands fa-github"></i> Ver en GitHub
          </a>
          ${p.demo ? `<a href="${p.demo}" target="_blank" class="btn-secondary" style="display:inline-flex;font-size:0.9rem;padding:0.65rem 1.25rem;">
            <i class="fa-solid fa-globe"></i> Demo Live
          </a>` : ''}
        </div>
      `;
    }

    modal.classList.add('active');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (window.CabsCrypto && window.CabsCrypto.state) {
      window.CabsCrypto.state.activeModal = null;
    }
  }

  function initBento() {
    const modal = document.getElementById('modal-container') || document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    document.querySelectorAll('.modal-trigger, .proj-card').forEach(btn => {
      btn.addEventListener('click', e => {
        const key = btn.dataset.project || btn.getAttribute('data-project');
        if (key) {
          e.preventDefault();
          openModal(key);
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal || (e.target.classList && (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-container')))) {
          closeModal();
        }
      });
    }

    document.addEventListener('keydown', e => {
      const k = e.key || e.code;
      if (k === 'Escape' || k === 'Esc' || e.keyCode === 27) {
        closeModal();
      }
    });

    if (window.CabsCrypto && typeof window.CabsCrypto.on === 'function') {
      window.CabsCrypto.on('modal:open', (data) => {
        const id = typeof data === 'string' ? data : (data && (data.projectId || data.id));
        openModal(id);
      });
      window.CabsCrypto.on('modal:close', () => {
        closeModal();
      });
    }
  }

  window.openModal = openModal;
  window.closeModal = closeModal;
  window.PROJECTS = PROJECTS;

  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('bento', initBento);
  } else {
    document.addEventListener('DOMContentLoaded', initBento);
  }
})();
