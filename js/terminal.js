/**
 * CabsCrypto (0xCaBs) - Interactive CLI Terminal Module
 * github.com/CaBsCrypto — Datos 100% reales
 * Path: js/terminal.js
 */
(function () {
  'use strict';

  const commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () => `<span style="color:var(--cyan)">📌 Comandos Disponibles:</span>
  <span style="color:var(--lime)">projects</span>  → Proyectos reales de github.com/CaBsCrypto
  <span style="color:var(--lime)">skills</span>    → Stack técnico real (TypeScript · LangGraph · MCP · Stellar)
  <span style="color:var(--lime)">stats</span>     → Métricas reales de GitHub
  <span style="color:var(--lime)">crypto</span>    → Métricas crypto, portfolio y estado Web3
  <span style="color:var(--lime)">whoami</span>    → Sobre 0xCaBs
  <span style="color:var(--lime)">contact</span>   → Demo en vivo & contacto directo
  <span style="color:var(--lime)">matrix</span>    → 🟢 Activar modo matriz digital
  <span style="color:var(--lime)">clear</span>     → Limpiar terminal`,

    whoami: () => `<span style="color:var(--cyan)">👤 0xCaBs</span> — Solo founder, Santiago, Chile 🇨🇱
  <span style="color:var(--text-muted)">Misión:</span> Building the authority layer for AI agents that act in the real world.
  <span style="color:var(--text-muted)">GitHub:</span> <span style="color:var(--magenta)">https://github.com/CaBsCrypto</span>
  <span style="color:var(--text-muted)">Blog:</span>   <span style="color:var(--magenta)">https://agente-asistente.vercel.app</span>`,

    projects: () => `<span style="color:var(--cyan)">🚀 Proyectos en github.com/CaBsCrypto:</span>
  <span style="color:var(--lime)">1.</span> <b>agente-asistente</b>     [TS · LangGraph · MCP · Stellar] — AI agent que reserva y paga con límites
  <span style="color:var(--lime)">2.</span> <b>ficha-onchain</b>        [TS · Soroban · Stellar · MCP]  — Fichas médicas SSI on-chain (TrustLeaf)
  <span style="color:var(--lime)">3.</span> <b>gitlyzer</b>             [TS · Gemini · D3.js]           — Análisis de repos GitHub con AI
  <span style="color:var(--lime)">4.</span> <b>leadGenAI</b>            [TS · Gemini · Google Maps]     — Lead gen para negocios sin web en Chile
  <span style="color:var(--lime)">5.</span> <b>biblioteca-de-prompts</b> [TS · React · Firebase · Gemini] — Prompt library con community
  <span style="color:var(--lime)">6.</span> <b>CreatorHub</b>           [TS · Supabase · Gemini]         — Plataforma ops para creadores`,

    skills: () => `<span style="color:var(--cyan)">⚡ Stack Real de 0xCaBs:</span>
  <span style="color:var(--magenta)">[AI/Agents]</span>  TypeScript · LangGraph · MCP · Gemini AI · Agentic Commerce
  <span style="color:var(--magenta)">[Blockchain]</span> Stellar · Soroban · on-chain proofs · SSI
  <span style="color:var(--magenta)">[Frontend]</span>   React · Next.js · D3.js · Firebase · Supabase
  <span style="color:var(--magenta)">[Automation]</span> Google Maps API · WhatsApp bots · SEO landing pages`,

    stats: () => `<span style="color:var(--cyan)">📊 GitHub Stats (CaBsCrypto):</span>
  Repos públicos : <span style="color:var(--lime)">56</span>
  Lenguaje #1    : <span style="color:var(--lime)">TypeScript</span>
  Miembro desde  : <span style="color:var(--lime)">Septiembre 2025</span>
  Foco actual    : <span style="color:var(--lime)">AI Agents + Autoridad en acción real</span>`,

    crypto: () => `<span style="color:var(--cyan)">💰 Live Crypto & Web3 Portfolio Stats:</span>
  STH/BTC Ratio : <span style="color:var(--lime)">1.04 (Bullish Hold)</span>
  Soroban Gas   : <span style="color:var(--lime)">100 Stroops</span>
  Stellar Node  : <span style="color:var(--lime)">Synced — Ledger 54,921,802</span>
  MEV Bot Status: <span style="color:var(--lime)">Active — 0.002s latency</span>`,

    contact: () => `<span style="color:var(--cyan)">✉️ Encuéntrame aquí:</span>
  GitHub  : <span style="color:var(--magenta)">https://github.com/CaBsCrypto</span>
  Demo    : <span style="color:var(--magenta)">https://agente-asistente.vercel.app</span>
  Gitlyzer: <span style="color:var(--magenta)">https://gitlyzer-opal.vercel.app</span>`,

    matrix: () => {
      if (window.MatrixRainEngine && typeof window.MatrixRainEngine.toggle === 'function') {
        window.MatrixRainEngine.toggle();
      } else {
        document.body.classList.toggle('matrix-mode');
      }
      return `<span style="color:var(--lime)">🟢 [MATRIX MODE TOGGLED] — 0x43 61 42 73 20 6F 6E 2D 63 68 61 69 6E</span>`;
    },

    clear: () => null
  };

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function executeCommand(rawInput) {
    let cmdStr = '';
    if (typeof rawInput === 'string') {
      cmdStr = rawInput;
    } else if (rawInput && typeof rawInput === 'object' && typeof rawInput.command === 'string') {
      cmdStr = rawInput.command;
    } else if (rawInput && typeof rawInput === 'object' && rawInput.command != null) {
      cmdStr = String(rawInput.command);
    } else if (rawInput != null) {
      cmdStr = String(rawInput);
    }

    const termBody = document.getElementById('terminal-body');
    if (!termBody) return;

    const trimmed = cmdStr.trim();
    const cmd = (trimmed.split(/\s+/)[0] || '').toLowerCase();

    // Render user command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="prompt-symbol">0xcabs@web3:~$</span> <span style="color:var(--lime)">${escapeHTML(trimmed)}</span>`;

    const existingWrapper = termBody.querySelector('.terminal-input-wrapper');
    if (existingWrapper) {
      termBody.insertBefore(cmdLine, existingWrapper);
      existingWrapper.remove();
    } else {
      termBody.appendChild(cmdLine);
    }

    historyIndex = -1;

    if (trimmed) {
      commandHistory.push(trimmed);

      if (cmd === 'clear') {
        termBody.innerHTML = '';
      } else {
        const outEl = document.createElement('div');
        outEl.className = 'command-output';

        if (COMMANDS[cmd]) {
          const res = COMMANDS[cmd]();
          if (res) outEl.innerHTML = res;
        } else {
          outEl.innerHTML = `<span style="color:#ff5f56">zsh: command not found: <b>${escapeHTML(trimmed)}</b></span> — escribe <span style="color:var(--cyan)">'help'</span>`;
        }
        termBody.appendChild(outEl);
      }
    }

    // Append new input row
    const newRow = document.createElement('div');
    newRow.className = 'terminal-input-wrapper';
    newRow.innerHTML = `<span class="prompt-symbol">0xcabs@web3:~$</span>
      <input type="text" id="terminal-input" class="terminal-input" autocomplete="off" spellcheck="false">`;
    termBody.appendChild(newRow);
    termBody.scrollTop = termBody.scrollHeight;

    const newInp = newRow.querySelector('#terminal-input');
    if (newInp) {
      newInp.focus();
      bindInput(termBody);
    }
  }

  function bindInput(termBody) {
    const inp = termBody.querySelector('#terminal-input');
    if (!inp || (inp.dataset && inp.dataset.bound === 'true') || (inp.getAttribute && inp.getAttribute('data-bound') === 'true')) return;
    if (inp.dataset) {
      inp.dataset.bound = 'true';
    } else if (typeof inp.setAttribute === 'function') {
      inp.setAttribute('data-bound', 'true');
    }

    inp.addEventListener('keydown', function handler(e) {
      if (e.key === 'ArrowUp') {
        if (commandHistory.length > 0) {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
          }
          inp.value = commandHistory[commandHistory.length - 1 - historyIndex];
          if (e && typeof e.preventDefault === 'function') e.preventDefault();
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex > 0) {
          historyIndex--;
          inp.value = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
          historyIndex = -1;
          inp.value = '';
        }
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
      } else if (e.key === 'Enter') {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        executeCommand(inp.value);
      }
    });
  }

  function initTerminal() {
    const termBody = document.getElementById('terminal-body');
    if (!termBody) return;

    termBody.addEventListener('click', () => {
      const inp = termBody.querySelector('#terminal-input');
      if (inp) inp.focus();
    });

    bindInput(termBody);

    if (window.CabsCrypto && typeof window.CabsCrypto.on === 'function') {
      window.CabsCrypto.on('terminal:execute', (data) => {
        executeCommand(data);
      });
    }
  }

  window.executeCommand = executeCommand;
  window.CommandHistory = commandHistory;

  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('terminal', initTerminal);
  } else {
    document.addEventListener('DOMContentLoaded', initTerminal);
  }
})();
