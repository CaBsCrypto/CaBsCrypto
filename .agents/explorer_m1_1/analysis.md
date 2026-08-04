# Milestone 1 (M1) — `index.html` Layout & Infrastructure Blueprint Report

**Author**: Explorer 1 (M1)  
**Target File**: `index.html`  
**Date**: 2026-08-03  

---

## 1. Executive Summary & Scope Alignment

Milestone 1 (M1) lays the structural, visual, and operational foundation for the CabsCrypto Cyber-Futuristic Portfolio landing page. This report provides a complete, production-grade semantic HTML blueprint for `index.html` to guide Implementer 1.

The blueprint incorporates:
- Full HTML5 semantic layout containing Header, Hero, CLI Terminal, Bento Grid, Tech Matrix, GitHub Stats, Footer, and Modal components.
- Standardized section container IDs (`#hero-container`, `#terminal-container`, `#bento-container`, `#matrix-container`, `#modal-container`) that align with project scope contracts.
- Modular asset linkage for CSS (`css/styles.css`) and JS (`js/app.js` along with modular scripts `js/hero.js`, `js/terminal.js`, `js/bento.js`, `js/matrix.js`).
- Complete preparation for Milestone 2 (Hero dynamic typing engine & CLI terminal interactive prompt) and Milestone 3 (Bento Grid project modals & Tech Matrix category filter tabs).

---

## 2. Current State vs Target Blueprint Gap Analysis

| Aspect | Current Workspace State (`index.html`) | Target Blueprint for M1 | Action Required |
|---|---|---|---|
| **Title Tag** | `CabsCrypto — Web3 & Software Engineering Portfolio` | `CabsCrypto \| Cyber-Futuristic Portfolio` | Update title tag to exact mandate string |
| **Language Tag** | `<html lang="es">` | `<html lang="en">` | Standardize document language to English |
| **CSS Path** | `<link rel="stylesheet" href="styles.css">` | `<link rel="stylesheet" href="css/styles.css">` | Point link tag to modular `css/` directory |
| **JS Script Paths** | `<script src="app.js"></script>` | `<script src="js/app.js"></script>` + modular script tags | Point scripts to `js/` directory and add modular placeholders |
| **Hero Container ID** | `<section class="hero container" id="hero">` | `<section class="hero container" id="hero-container">` | Update ID to `#hero-container` (keeping anchor reference `#hero` alias if needed) |
| **Terminal Container ID** | `<div class="terminal-container glass-card" id="terminal">` | `<section class="terminal-section" id="terminal-container">` | Standardize outer wrapper ID to `#terminal-container` |
| **Bento Grid Container ID**| `<div class="bento-grid">` inside `<section id="projects">` | `<section class="bento-section container" id="bento-container">` | Explicitly bind container ID `#bento-container` |
| **Tech Matrix Container ID**| `<div class="stack-grid">` inside `<section id="stack">` | `<section class="matrix-section container" id="matrix-container">` | Explicitly bind container ID `#matrix-container` and add `#matrix-tabs` |
| **Modal Container ID** | `<div class="modal-overlay" id="project-modal">` | `<div class="modal-overlay" id="modal-container">` | Update ID to `#modal-container` for global event bus compatibility |
| **Tech Matrix Filter Tabs** | None present | Tab bar `#matrix-tabs` with category filter buttons | Add tab controls for M3 Tech Matrix dynamic filtering |

---

## 3. Complete Semantic HTML Blueprint for `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CabsCrypto | Cyber-Futuristic Portfolio</title>
  <meta name="description" content="CabsCrypto Cyber-Futuristic Portfolio: Smart Contracts, Low-Latency Quant Bots, Web3 Architecture, and High-Performance CLI Tools.">
  
  <!-- Google Fonts: Space Grotesk (Headings), JetBrains Mono (Terminal/Code), Inter (Body) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">
  
  <!-- FontAwesome Cyber Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Main CSS Stylesheet -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>

  <!-- Background Canvas & Cyber Grid Layer -->
  <canvas id="bg-canvas"></canvas>
  <div class="cyber-grid-overlay"></div>

  <!-- Header / Navigation Bar -->
  <header>
    <nav class="navbar" id="navbar">
      <a href="#hero-container" class="nav-brand">
        <i class="fa-solid fa-cube gradient-text"></i>
        <span>CabsCrypto</span>
        <span class="brand-badge">WEB3 DEV</span>
      </a>
      <ul class="nav-links">
        <li><a href="#hero-container">Home</a></li>
        <li><a href="#terminal-container">Terminal</a></li>
        <li><a href="#bento-container">Projects</a></li>
        <li><a href="#matrix-container">Tech Matrix</a></li>
        <li><a href="#stats">Metrics</a></li>
      </ul>
      <a href="#contact" class="btn-nav" id="btn-nav-connect">
        Connect <i class="fa-solid fa-arrow-right"></i>
      </a>
    </nav>
  </header>

  <!-- Hero Section (#hero-container) -->
  <section class="hero container" id="hero-container">
    <div class="hero-status-tag" id="hero-status">
      <span class="pulse-dot"></span> Available for Web3 Infrastructure & Smart Contracts
    </div>
    
    <h1 class="hero-title">
      Engineering the Future of <br>
      <span class="gradient-text" id="typing-text">Decentralized Systems & CLI Tools</span>
    </h1>

    <p class="hero-subtitle">
      Software Engineer specializing in Web3 protocol architecture, EVM/Solidity smart contracts, low-latency quantitative trading engines, and high-efficiency CLI automation.
    </p>

    <div class="hero-actions">
      <a href="#bento-container" class="btn-primary" id="btn-explore-projects">
        <i class="fa-solid fa-rocket"></i> Explore Projects
      </a>
      <a href="#terminal-container" class="btn-secondary" id="btn-open-terminal">
        <i class="fa-solid fa-terminal"></i> Open Terminal
      </a>
    </div>
  </section>

  <!-- CLI Terminal Container (#terminal-container) -->
  <section class="terminal-section container" id="terminal-container">
    <div class="terminal-card glass-card">
      <div class="terminal-header">
        <div class="terminal-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="terminal-title">cabscrypto@mainnet:~ (zsh)</div>
        <div class="terminal-status"><i class="fa-solid fa-shield-halved text-cyan"></i> SECURE</div>
      </div>
      <div class="terminal-body" id="terminal-body">
        <div class="terminal-line">
          <span class="prompt-symbol">cabscrypto@web3:~$</span> welcome --verbose
        </div>
        <div class="command-output">
⚡ Welcome to CabsCrypto Interactive Terminal v2.5.0!
Type <span class="gradient-text-lime">'help'</span> for available commands (`projects`, `skills`, `stats`, `crypto`, `contact`, `matrix`, `clear`).
        </div>
        <div class="terminal-input-wrapper">
          <span class="prompt-symbol">cabscrypto@web3:~$</span>
          <input type="text" class="terminal-input" id="terminal-input" placeholder="type 'help' here..." autocomplete="off" spellcheck="false" autofocus>
        </div>
      </div>
    </div>
  </section>

  <!-- Bento Grid Projects Showcase (#bento-container) -->
  <section class="bento-section container" id="bento-container">
    <div class="section-header">
      <span class="section-tag">// PORTFOLIO SHOWCASE</span>
      <h2 class="section-title">Featured <span class="gradient-text">Projects</span></h2>
    </div>

    <div class="bento-grid" id="bento-grid">
      <!-- Project 1: Quant Trading Engine (Featured Card) -->
      <div class="glass-card spotlight-card bento-card featured" id="proj-card-1" data-project="bot">
        <div class="bento-content">
          <div class="project-img-wrapper">
            <img src="assets/images/crypto_bot.jpg" alt="Crypto Trading Bot Dashboard" loading="lazy">
          </div>
          <h3>CabsCrypto Quant Trading Engine</h3>
          <p class="project-desc">
            High-performance multithreaded quantitative trading bot for DEX arbitrage (Uniswap V3 / PancakeSwap) and real-time low-latency MEV execution.
          </p>
          <div class="project-tags">
            <span class="tag">Node.js</span>
            <span class="tag tag-purple">Ethers.js</span>
            <span class="tag tag-lime">Solidity</span>
            <span class="tag">WebSocket</span>
          </div>
        </div>
        <div class="project-footer">
          <span class="project-status text-lime">
            <i class="fa-solid fa-circle-check"></i> In Production
          </span>
          <a href="#" class="project-link modal-trigger" data-project="bot">
            View Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>

      <!-- Project 2: Aegis DeFi Audit Suite -->
      <div class="glass-card spotlight-card bento-card" id="proj-card-2" data-project="aegis">
        <div class="bento-content">
          <div class="project-img-wrapper">
            <img src="assets/images/defi_protocol.jpg" alt="DeFi Protocol Security Audit" loading="lazy">
          </div>
          <h3>Aegis DeFi Audit Suite</h3>
          <p class="project-desc">
            Static vulnerability analysis and security audit suite for smart contracts prior to mainnet deployment.
          </p>
          <div class="project-tags">
            <span class="tag tag-purple">Python</span>
            <span class="tag">Slither</span>
            <span class="tag tag-lime">Hardhat</span>
          </div>
        </div>
        <div class="project-footer">
          <span class="project-status text-cyan">
            <i class="fa-solid fa-code-branch"></i> Open Source
          </span>
          <a href="#" class="project-link modal-trigger" data-project="aegis">
            View Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>

      <!-- Project 3: Subnet CLI Agent & Orchestrator -->
      <div class="glass-card spotlight-card bento-card wide" id="proj-card-3" data-project="cli">
        <div class="bento-content-wide">
          <div class="project-img-wrapper wide-img">
            <img src="assets/images/cli_agent.jpg" alt="CLI Agent Telemetry" loading="lazy">
          </div>
          <div class="project-details">
            <h3>Subnet CLI Agent & Orchestrator</h3>
            <p class="project-desc">
              Command-line interface suite for node operations, automated contract compilation, multi-chain deployment, and network telemetry.
            </p>
            <div class="project-tags">
              <span class="tag">Rust</span>
              <span class="tag tag-lime">Bash / PowerShell</span>
              <span class="tag tag-purple">Web3 RPC</span>
            </div>
            <div class="project-footer">
              <span class="project-status text-gold">
                <i class="fa-solid fa-star"></i> 480+ GitHub Stars
              </span>
              <a href="#" class="project-link modal-trigger" data-project="cli">
                View Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Tech Stack Matrix Container (#matrix-container) -->
  <section class="matrix-section container" id="matrix-container">
    <div class="section-header">
      <span class="section-tag">// TECHNICAL MATRIX</span>
      <h2 class="section-title">Skills & <span class="gradient-text">Proficiencies</span></h2>
    </div>

    <!-- Category Filter Tabs (M3 Hook) -->
    <div class="matrix-tabs" id="matrix-tabs">
      <button class="matrix-tab active" data-category="all">All Domains</button>
      <button class="matrix-tab" data-category="web3">Web3 & Blockchain</button>
      <button class="matrix-tab" data-category="frontend">Frontend Architecture</button>
      <button class="matrix-tab" data-category="backend">Backend & CLI</button>
      <button class="matrix-tab" data-category="devops">DevOps & Systems</button>
    </div>

    <div class="stack-grid" id="matrix-grid">
      <!-- Web3 & Blockchain Domain -->
      <div class="glass-card stack-category" data-domain="web3">
        <h3 class="stack-category-title">
          <i class="fa-solid fa-link text-cyan"></i> Web3 & Smart Contracts
        </h3>
        <div class="stack-items">
          <div class="stack-item">
            <span class="stack-name">Solidity / EVM</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 95%;"></div>
              <span class="stack-level">Expert</span>
            </div>
          </div>
          <div class="stack-item">
            <span class="stack-name">Ethers.js / Viem</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 90%;"></div>
              <span class="stack-level">Expert</span>
            </div>
          </div>
          <div class="stack-item">
            <span class="stack-name">Foundry / Hardhat</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 85%;"></div>
              <span class="stack-level">Advanced</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Frontend Architecture Domain -->
      <div class="glass-card stack-category" data-domain="frontend">
        <h3 class="stack-category-title">
          <i class="fa-solid fa-desktop text-cyan"></i> Frontend & UX
        </h3>
        <div class="stack-items">
          <div class="stack-item">
            <span class="stack-name">JavaScript (ES6+)</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 95%;"></div>
              <span class="stack-level">Expert</span>
            </div>
          </div>
          <div class="stack-item">
            <span class="stack-name">HTML5 / CSS3 Glassmorphism</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 90%;"></div>
              <span class="stack-level">Expert</span>
            </div>
          </div>
          <div class="stack-item">
            <span class="stack-name">Responsive Design & Canvas API</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 85%;"></div>
              <span class="stack-level">Advanced</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Backend & CLI Domain -->
      <div class="glass-card stack-category" data-domain="backend">
        <h3 class="stack-category-title">
          <i class="fa-solid fa-terminal text-lime"></i> Backend & CLI Tools
        </h3>
        <div class="stack-items">
          <div class="stack-item">
            <span class="stack-name">Node.js / Async Core</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 92%;"></div>
              <span class="stack-level">Expert</span>
            </div>
          </div>
          <div class="stack-item">
            <span class="stack-name">Python (Data / Quant Bots)</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 88%;"></div>
              <span class="stack-level">Advanced</span>
            </div>
          </div>
          <div class="stack-item">
            <span class="stack-name">Rust / Shell Automation</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 75%;"></div>
              <span class="stack-level">Intermediate</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DevOps & Infrastructure Domain -->
      <div class="glass-card stack-category" data-domain="devops">
        <h3 class="stack-category-title">
          <i class="fa-solid fa-server text-magenta"></i> DevOps & Infra
        </h3>
        <div class="stack-items">
          <div class="stack-item">
            <span class="stack-name">Docker & Containerization</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 85%;"></div>
              <span class="stack-level">Advanced</span>
            </div>
          </div>
          <div class="stack-item">
            <span class="stack-name">Git & GitHub Actions CI/CD</span>
            <div class="stack-progress-wrap">
              <div class="stack-bar" style="width: 90%;"></div>
              <span class="stack-level">Expert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- GitHub Metrics & Activity Section (#stats) -->
  <section class="container" id="stats">
    <div class="section-header">
      <span class="section-tag">// GITHUB METRICS</span>
      <h2 class="section-title">Live Code <span class="gradient-text">Activity</span></h2>
    </div>

    <div class="stats-grid">
      <div class="glass-card stat-box">
        <div class="stat-number" id="stat-commits">1,420+</div>
        <div class="stat-label">Commits This Year</div>
      </div>
      <div class="glass-card stat-box">
        <div class="stat-number" id="stat-repos">34</div>
        <div class="stat-label">Public Repositories</div>
      </div>
      <div class="glass-card stat-box">
        <div class="stat-number" id="stat-prs">180+</div>
        <div class="stat-label">Pull Requests Merged</div>
      </div>
      <div class="glass-card stat-box">
        <div class="stat-number" id="stat-stars">520+</div>
        <div class="stat-label">Stars Earned</div>
      </div>
    </div>
  </section>

  <!-- Footer & Contact Section -->
  <footer class="footer" id="contact">
    <div class="container">
      <div class="footer-content">
        <div>
          <h3 class="gradient-text footer-heading">Ready to Collaborate?</h3>
          <p class="footer-desc">
            Connect via CLI terminal or social channels to build your next Web3 protocol or high-efficiency automation tool.
          </p>
        </div>

        <div class="social-links">
          <a href="https://github.com/CabsCrypto" target="_blank" rel="noopener noreferrer" class="social-icon" title="GitHub Profile" id="link-github">
            <i class="fa-brands fa-github fa-lg"></i>
          </a>
          <a href="#" class="social-icon" title="Twitter / X" id="link-twitter">
            <i class="fa-brands fa-x-twitter fa-lg"></i>
          </a>
          <a href="#" class="social-icon" title="Discord" id="link-discord">
            <i class="fa-brands fa-discord fa-lg"></i>
          </a>
          <a href="mailto:contact@cabscrypto.dev" class="social-icon" title="Send Email" id="link-email">
            <i class="fa-solid fa-envelope fa-lg"></i>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 CabsCrypto — Built with Cyber-Futuristic Neo-Glassmorphism & Vanilla Web Tech.</p>
      </div>
    </div>
  </footer>

  <!-- Modal Container (#modal-container) -->
  <div class="modal-overlay" id="modal-container">
    <div class="modal-content">
      <button class="modal-close" id="modal-close-btn" aria-label="Close modal">&times;</button>
      <div id="modal-body-content">
        <!-- Injected dynamically by M3 js/bento.js / CabsCrypto.openModal() -->
      </div>
    </div>
  </div>

  <!-- JavaScript Scripts -->
  <script src="js/app.js"></script>
  <!-- Modular Scripts (loaded or deferred as initialized in M2/M3) -->
  <script src="js/hero.js" defer></script>
  <script src="js/terminal.js" defer></script>
  <script src="js/bento.js" defer></script>
  <script src="js/matrix.js" defer></script>

</body>
</html>
```

---

## 4. Element ID & Class Directory for Downstream Developers

| Container / Element | Target ID | Core CSS Classes | Purpose / Milestone Hook |
|---|---|---|---|
| Navigation Bar | `navbar` | `navbar` | Sticky navigation, branding, links |
| Hero Container | `hero-container` | `hero container` | M1 shell, M2 dynamic text hook (`#typing-text`) |
| Hero Title Dynamic Text | `typing-text` | `gradient-text` | M2 typewriter animation engine target |
| Terminal Section | `terminal-container` | `terminal-section container` | M1 layout shell for CLI terminal |
| Terminal Body | `terminal-body` | `terminal-body` | M2 scrollable output console |
| Terminal Input | `terminal-input` | `terminal-input` | M2 interactive CLI input element |
| Bento Grid Container | `bento-container` | `bento-section container` | M1 layout shell, M3 Bento card grid (`#bento-grid`) |
| Bento Project Cards | `proj-card-1`, `proj-card-2`, `proj-card-3` | `glass-card spotlight-card bento-card` | M3 hover spotlight & detail modal triggers (`.modal-trigger`) |
| Tech Matrix Container | `matrix-container` | `matrix-section container` | M1 layout shell, M3 Tech matrix grid (`#matrix-grid`) |
| Tech Matrix Tabs | `matrix-tabs` | `matrix-tabs` | M3 category filter bar (`data-category="all\|web3\|frontend\|backend\|devops"`) |
| GitHub Stats Section | `stats` | `container` | M1 static stats grid, M4 integration testing |
| Footer / Contact | `contact` | `footer` | Footer info & social links (`#link-github`, `#link-twitter`, `#link-discord`, `#link-email`) |
| Modal Container | `modal-container` | `modal-overlay` | M3 project detail modal overlay & body container (`#modal-body-content`) |

---

## 5. Milestone Integration Contracts

1. **M1 ↔ M2 Handshake (Hero & CLI Terminal)**:
   - `#typing-text` in `index.html` provides the mount point for `js/hero.js` dynamic headline rotator.
   - `#terminal-input` and `#terminal-body` inside `#terminal-container` provide the DOM targets for `js/terminal.js` event listeners, command execution, and history scroll.

2. **M1 ↔ M3 Handshake (Bento Grid & Tech Matrix)**:
   - Cards in `#bento-container` carry `data-project="[id]"` attributes and `.modal-trigger` class, allowing `js/bento.js` to attach click delegation and trigger `CabsCrypto.openModal(projectId)`.
   - `#matrix-tabs` contains buttons with `data-category="[cat]"` attributes, allowing `js/matrix.js` to listen for tab switches and invoke `CabsCrypto.filterTechStack(category)`.
   - `#modal-container` overlay with `#modal-close-btn` and `#modal-body-content` accepts innerHTML payloads injected by `CabsCrypto.openModal()`.

3. **M1 ↔ M4 Handshake (Server & E2E Integration)**:
   - `css/styles.css` and `js/app.js` relative path structure matches standard static HTTP server routing in `server.js`.
   - Zero hardcoded domain URLs ensure flawless operation under `localhost:<PORT>`.

---

## 6. Recommendations for Implementer 1

1. **Directory Structure Setup**:
   Ensure `css/` and `js/` subdirectories exist and place `styles.css` into `css/styles.css` and `app.js` into `js/app.js`.
2. **Modular Script Stubs**:
   Create stub files for `js/hero.js`, `js/terminal.js`, `js/bento.js`, and `js/matrix.js` if they do not exist yet, so that `<script>` tags load cleanly with 200 OK responses.
3. **Validation**:
   Validate standard HTML5 compliance and verify that all container IDs match the contract exactly (`#hero-container`, `#terminal-container`, `#bento-container`, `#matrix-container`, `#modal-container`).
