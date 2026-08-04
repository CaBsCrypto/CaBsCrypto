# Milestone 2 Investigation Report: Hero Section & Interactive CLI Terminal

## Executive Summary
This investigation maps the existing DOM elements, CSS styles, and JavaScript contracts in `index.html`, `css/styles.css`, and `js/app.js` to define exact requirements and integration hooks for `js/hero.js` and `js/terminal.js`.

---

## 1. Hero Section Analysis (`js/hero.js`)

### Existing DOM Elements in `index.html`
- **Section Container**: `<section class="hero container" id="hero-container">` (Line 53)
- **Status Badge**: `<div class="hero-status-tag" id="hero-status">` (Line 54) containing `<span class="pulse-dot"></span>` (Line 55).
- **Hero Title**: `<h1 class="hero-title">` (Line 58)
- **Dynamic Typing Target**: `<span class="gradient-text" id="typing-text">Decentralized Systems & CLI Tools</span>` (Line 60).
- **Hero Subtitle**: `<p class="hero-subtitle">` (Line 63).
- **CTA Actions Container**: `<div class="hero-actions">` (Line 67)
  - **Explore Projects Button**: `<a href="#bento-container" class="btn-primary" id="btn-explore-projects">` (Line 68).
  - **Open Terminal Button**: `<a href="#terminal-container" class="btn-secondary" id="btn-open-terminal">` (Line 71).

### Required Behaviors for `js/hero.js`
1. **Typewriter Engine**:
   - Target: `#typing-text` (Line 60).
   - Array of strings to cycle through:
     - `"Decentralized Systems & CLI Tools"`
     - `"Smart Contracts & EVM Protocols"`
     - `"Low-Latency Quant Trading Bots"`
     - `"High-Efficiency CLI Infrastructure"`
   - Type/erase speeds: ~100ms per character typing, ~50ms erasing, ~2000ms pause when complete string is displayed.
   - Cursor: Requires a blinking typing cursor element or CSS class (`.typing-cursor`).
2. **CTA Button Event Bindings**:
   - Smooth scrolling is already handled by `app.js` via `a[href^="#"]`.
   - `#btn-open-terminal` event listener: When clicked, after scrolling to `#terminal-container`, automatically call focus on `#terminal-input`.

### Existing CSS Styles in `css/styles.css`
- `.hero` (Lines 425–432): Layout flexbox, column direction, centered text, padding `10rem 0 4rem 0`.
- `.hero-status-tag` & `.pulse-dot` (Lines 434–461): Monospace font, neon lime border, pulsing glow keyframes.
- `.hero-title` (Lines 463–468): Font family `Space Grotesk`, size `clamp(2.5rem, 6vw, 4.5rem)`.
- `.gradient-text` (Lines 180–185): 135deg linear gradient (`var(--cyan)` to `var(--magenta)` to `var(--purple)`), `background-clip: text`.
- `.btn-primary` & `.btn-secondary` (Lines 484–527): Cyan gradient button with glow shadow & glassmorphism secondary button.

### Recommended CSS Additions for Hero
- Add typewriter cursor blink styling in `css/styles.css`:
```css
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background-color: var(--cyan);
  margin-left: 2px;
  vertical-align: middle;
  animation: cursor-blink 0.8s infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

---

## 2. Interactive CLI Terminal Analysis (`js/terminal.js`)

### Existing DOM Elements in `index.html`
- **Terminal Section Container**: `<section class="terminal-section container" id="terminal-container">` (Line 78)
- **Terminal Card Window**: `<div class="terminal-card glass-card" id="terminal">` (Line 79)
- **Terminal Header**: `<div class="terminal-header">` (Line 80)
  - Window Control Dots: `<div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>` (Lines 81–85)
  - Window Title: `<div class="terminal-title">cabscrypto@mainnet:~ (zsh)</div>` (Line 86)
  - Security Badge: `<div class="terminal-status"><i class="fa-solid fa-shield-halved text-cyan"></i> SECURE</div>` (Line 87)
- **Terminal Body / Output Container**: `<div class="terminal-body" id="terminal-body">` (Line 89)
  - Welcome Prompt: `<div class="terminal-line"><span class="prompt-symbol">cabscrypto@web3:~$</span> welcome --verbose</div>` (Lines 90–92)
  - Welcome Output: `<div class="command-output">...</div>` (Lines 93–96)
  - Input Line Wrapper: `<div class="terminal-input-wrapper">` (Line 97)
    - Prompt Prefix: `<span class="prompt-symbol">cabscrypto@web3:~$</span>` (Line 98)
    - Input Element: `<input type="text" class="terminal-input" id="terminal-input" placeholder="type 'help' here..." autocomplete="off" spellcheck="false" autofocus>` (Line 99)

### Matrix Rain Canvas
- `#bg-canvas` exists for general particles, but Matrix Digital Rain requires a full-screen canvas overlay `<canvas id="matrix-canvas">`.
- Can be dynamically appended to `document.body` when `matrix` command is executed, or pre-rendered with CSS overlay rules (`position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9998; pointer-events: none;`).

### Required Commands & Functionality for `js/terminal.js`
1. **Command Parser & Execution Engine**:
   - Reads `#terminal-input` on `Enter` keypress.
   - Clears input field after entry.
   - Appends executed command line `<div class="terminal-line">` and formatted response output `<div class="command-output">` into `#terminal-body` before `.terminal-input-wrapper`.
   - Auto-scrolls `#terminal-body` (`terminalBody.scrollTop = terminalBody.scrollHeight`).
2. **Command History**:
   - Navigates through previous commands using `ArrowUp` and `ArrowDown` keys.
3. **Tab Autocomplete**:
   - Pressing `Tab` autocompletes matching command names (`help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix`).
4. **Command Implementations**:
   - `help`: Formatted list of all commands and descriptions.
   - `skills`: Categorized list of technical proficiencies.
   - `projects`: Summary of portfolio projects; can trigger modal view via `window.CabsCrypto.openModal(projectId)`.
   - `stats`: Live GitHub metrics summary.
   - `crypto`: Simulated live Web3 market ticker (ETH price, gas price in Gwei, BTC, SOL).
   - `contact`: Social channels and email details.
   - `clear`: Clears output elements from `#terminal-body`.
   - `matrix`: Spawns or toggles Matrix digital rain overlay canvas animation.
5. **Event Bus Subscriptions**:
   - Subscribes to `CabsCrypto.on('terminal:execute', data => { ... })` to allow external triggers to execute terminal commands.

### Existing CSS Styles in `css/styles.css`
- `.terminal-card` (Lines 534–542): Glassmorphic styling, max width 950px, border `rgba(0, 243, 255, 0.2)`.
- `.terminal-header` (Lines 544–551): Dark header `#111420` with bottom border.
- `.dot-red`, `.dot-yellow`, `.dot-green` (Lines 564–566): MacOS style window control buttons.
- `.terminal-body` (Lines 580–589): `#090b12` background, font `JetBrains Mono`, min height 280px, max height 400px, `overflow-y: auto`.
- `.prompt-symbol` (Lines 599–602): `color: var(--cyan); font-weight: 700;`.
- `.command-output` (Lines 604–609): `color: #9ca3af; white-space: pre-wrap;`.
- `.terminal-input` (Lines 618–627): Transparent background, no border/outline, `color: var(--lime)`, font `JetBrains Mono`.

### Recommended CSS Additions for Terminal
- Focus style for terminal card when input is active:
```css
.terminal-card:focus-within {
  border-color: var(--cyan);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), var(--glow-cyan);
}
```
- Output color helper utility classes inside `.command-output`:
```css
.term-cyan { color: var(--cyan); }
.term-lime { color: var(--lime); }
.term-magenta { color: var(--magenta); }
.term-gold { color: var(--gold); }
.term-dim { color: var(--text-dim); }
```
- Matrix canvas overlay styling:
```css
#matrix-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
  pointer-events: none;
  display: none;
}
#matrix-canvas.active {
  display: block;
}
```

---

## 3. Global Module Registration Contract (`js/app.js`)

Both `js/hero.js` and `js/terminal.js` must follow the module registration lifecycle defined in `js/app.js`:

```javascript
(function () {
  'use strict';

  function initHeroModule(app) {
    // Hero typewriter & button interaction logic
  }

  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('hero', initHeroModule);
  }
})();
```

```javascript
(function () {
  'use strict';

  function initTerminalModule(app) {
    // Terminal CLI engine & command execution logic
  }

  if (window.CabsCrypto && typeof window.CabsCrypto.registerModule === 'function') {
    window.CabsCrypto.registerModule('terminal', initTerminalModule);
  }
})();
```

`window.CabsCrypto` provides:
- `app.on(event, callback)` / `app.emit(event, data)`
- `app.executeCommand(cmdString)`
- `app.openModal(projectId)`
- `app.state`
