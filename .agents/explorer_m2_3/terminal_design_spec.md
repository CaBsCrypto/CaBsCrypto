# Technical Design Specification: `js/terminal.js` (Interactive CLI Terminal Engine)

## 1. Overview & Objectives
`js/terminal.js` provides the interactive CLI terminal engine for the CabsCrypto portfolio landing page. It provides visitors with a developer-centric CLI interface to query portfolio information, execute Web3/crypto telemetry commands, trigger project modal dialogs, navigate command history, use tab completion, and toggle full-screen Matrix Digital Rain visual effects.

---

## 2. Requirements & Command Specification

### 2.1 Input Prompt
- **Prompt String**: `CabsCrypto@cyber-sec:~$`
- Rendered in HTML input wrappers and line prompt symbols using `<span class="prompt-symbol">CabsCrypto@cyber-sec:~$</span>`.

### 2.2 Supported Interactive Commands
The terminal engine supports 8 core commands (case-insensitive, whitespace-normalized):
1. **`help`**: Displays available commands, syntax, and description table.
2. **`skills`**: Displays technical matrix proficiencies grouped by domain with visual ASCII progress bars. Interacts with `CabsCrypto.filterTechStack('all')`.
3. **`projects`**: Lists featured portfolio projects (`bot`, `aegis`, `cli`). Supports optional subcommand `projects view <id>` to invoke `CabsCrypto.openModal(id)`.
4. **`stats`**: Displays live GitHub activity metrics (Commits: 1,420+, Repos: 34, PRs: 180+, Stars: 520+).
5. **`crypto`**: Displays real-time Web3 network metrics (ETH gas fees, RPC latency, DEX arbitrage status, BTC/ETH prices).
6. **`contact`**: Displays developer contact endpoints (Email, GitHub, Twitter, Discord).
7. **`clear`**: Clears all output nodes inside `#terminal-body`.
8. **`matrix`**: Toggles full-screen Matrix Digital Rain mode overlay canvas animation.

### 2.3 Output Formatting & Aesthetic
- Monospace font (`JetBrains Mono`).
- Styled using cyber neon accent spans (`.prompt-symbol`, `.gradient-text-lime`, `.text-cyan`, `.text-magenta`, `.text-lime`).
- Structured box drawing / table borders for tabular data.
- Standardized HTML output wrapper function `appendOutput(htmlContent)` for safe and consistent rendering.

### 2.4 Auto-Scroll Window
- Upon appending any new input line or command output, `#terminal-body.scrollTop` is set to `#terminal-body.scrollHeight` to automatically auto-scroll down.

### 2.5 Command History Navigation
- Maintain `history` array of entered commands.
- `historyIndex` pointer initialized to `history.length`.
- `ArrowUp`: Decrements `historyIndex` down to `0` (bounded), restoring previous commands.
- `ArrowDown`: Increments `historyIndex` up to `history.length` (bounded). When reaching `history.length`, restores draft input (`tempInput`).

### 2.6 Tab Completion
- Intercepts `Tab` key press (`preventDefault()`).
- Matches current input prefix against command list `['help', 'skills', 'projects', 'stats', 'crypto', 'contact', 'clear', 'matrix']`.
- If exactly 1 match: autocompletes input field value.
- If multiple matches: appends matching command suggestions to terminal output window.

### 2.7 Clear Command
- Removes previous `.terminal-line` and `.command-output` children from `#terminal-body` (or resets body while preserving the active prompt wrapper).

### 2.8 Matrix Digital Rain Mode Overlay
- Toggled via `matrix` command or ESC key.
- Creates fixed overlay `<canvas id="matrix-rain-canvas">` covering `100vw` x `100vh`.
- Renders green/cyan falling katakana and hex characters (`0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ`).
- Safely manages `requestAnimationFrame`, handles window resize, and ensures clean cleanup on stop.

---

## 3. Module Architecture & Code Structure

```javascript
/**
 * Interactive CLI Terminal Module
 * Path: js/terminal.js
 * Milestone: M2 (Hero Section & Interactive CLI Terminal)
 */
(function () {
  'use strict';

  const PROMPT = 'CabsCrypto@cyber-sec:~$';
  const COMMANDS = ['help', 'skills', 'projects', 'stats', 'crypto', 'contact', 'clear', 'matrix'];

  class TerminalEngine {
    constructor(app) {
      this.app = app;
      this.history = [];
      this.historyIndex = 0;
      this.tempInput = '';
      this.isMatrixActive = false;
      this.matrixCanvas = null;
      this.matrixAnimId = null;

      this.initDOMReferences();
      this.bindEvents();
      this.bindAppEvents();
    }

    initDOMReferences() {
      this.terminalContainer = document.getElementById('terminal-container') || document.getElementById('terminal');
      this.terminalBody = document.getElementById('terminal-body');
      this.terminalInput = document.getElementById('terminal-input');
    }

    bindEvents() {
      if (!this.terminalInput) return;

      // Input keyboard navigation
      this.terminalInput.addEventListener('keydown', (e) => this.handleKeyDown(e));

      // Click terminal body to focus input
      if (this.terminalBody) {
        this.terminalBody.addEventListener('click', () => {
          this.terminalInput.focus();
        });
      }
    }

    bindAppEvents() {
      if (!this.app) return;
      this.app.on('terminal:execute', (data) => {
        if (data && data.command) {
          this.execute(data.command);
        }
      });
    }

    handleKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const raw = this.terminalInput.value;
        this.terminalInput.value = '';
        this.execute(raw);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory('down');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabComplete();
      } else if (e.key === 'Escape' && this.isMatrixActive) {
        this.stopMatrixRain();
      }
    }

    execute(rawInput) {
      const trimmed = (rawInput || '').trim();
      
      // Append prompt line with entered command
      this.appendLine(trimmed);

      if (!trimmed) {
        this.scrollToBottom();
        return;
      }

      // Add to history if non-empty
      this.history.push(trimmed);
      this.historyIndex = this.history.length;

      // Parse command and args
      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case 'help':
          this.cmdHelp();
          break;
        case 'skills':
          this.cmdSkills();
          break;
        case 'projects':
          this.cmdProjects(args);
          break;
        case 'stats':
          this.cmdStats();
          break;
        case 'crypto':
          this.cmdCrypto();
          break;
        case 'contact':
          this.cmdContact();
          break;
        case 'clear':
          this.cmdClear();
          break;
        case 'matrix':
          this.cmdMatrix();
          break;
        default:
          this.appendOutput(`<span class="text-red">Command not found: '${cmd}'. Type 'help' for available commands.</span>`);
          break;
      }

      this.scrollToBottom();
    }

    // Command implementations, history handlers, tab complete, matrix rain canvas, etc.
  }

  function initTerminalModule(app) {
    new TerminalEngine(app);
  }

  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('terminal', initTerminalModule);
  }
})();
```

---

## 4. Verification & Testing Strategy
- Executed via `node test/run_e2e_tests.js`.
- Verifies Feature 7 (Interactive Terminal), Feature 8 (Commands Execution), Feature 9 (Matrix Mode).
- Tests input normalization, empty string handling, case insensitivity, long inputs (1000+ chars), command history upper/lower bounds, tab completion, auto-scrolling, and Matrix mode canvas cleanup.
