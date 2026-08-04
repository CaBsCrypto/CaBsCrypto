# CSS Design System & Infrastructure Blueprint

**Milestone**: M1 (Design System & Layout Infrastructure)  
**Agent**: Explorer 2 (`c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m1_2`)  
**Target Output**: `css/styles.css` & `styles.css`  
**Date**: 2026-08-03  

---

## 1. Executive Summary & Design System Architecture

This report provides the definitive CSS architecture and implementation blueprint for the **CabsCrypto** cyber-futuristic portfolio landing page. The design system leverages **dark neo-glassmorphism** aesthetics, vibrant neon HSL accents (cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66`), hardware-accelerated animations (`@keyframes aurora`, pulse, floating elements), radial mouse spotlight tracking, custom grid overlays, and strict responsive breakpoint structures.

### Core Architectural Goals
1. **Zero External CSS Framework Dependency**: Pure CSS3 written with modern standard features (CSS Grid, Flexbox, CSS Variables, `clamp()`, `backdrop-filter`, `mix-blend-mode`).
2. **Unified CSS Custom Properties (`:root`)**: Centralized design tokens for colors, typography, elevations, border radii, neon glows, and animation timing functions.
3. **High-Performance Glassmorphism**: Optimized `backdrop-filter` rules combined with subtle pseudo-element inner borders to prevent layout shift and maximize GPU acceleration.
4. **Fluid Layout Architecture**: CSS Grid bento structures and flex layout systems that reflow seamlessly across Mobile (<768px), Tablet (768px-1023px), and Desktop (>=1024px) viewports.

---

## 2. Design System Tokens (`:root`)

The CSS custom properties in `:root` define the dark mode palette, neon highlights, typography hierarchy, and glassmorphism parameters. Standard variable names explicitly fulfill all prompt mandates (`--bg-primary: #08090f`, `--cyan: #00f3ff`, `--magenta: #ff007a`, `--lime: #00ff66`) while preserving backward-compatibility aliases (`--bg-dark`, `--neon-cyan`, etc.) for existing project files.

```css
:root {
  /* ==========================================================================
     1. Color Palette & Dark Theme Tokens
     ========================================================================== */
  --bg-primary: #08090f;
  --bg-dark: #08090f;
  --bg-secondary: #0e111b;
  --bg-surface: rgba(14, 17, 27, 0.65);
  --bg-surface-hover: rgba(22, 27, 44, 0.85);
  --bg-card: rgba(18, 22, 36, 0.5);
  --bg-card-alt: rgba(10, 12, 20, 0.75);

  /* Neon HSL Accent Tokens */
  --cyan: #00f3ff;
  --neon-cyan: #00f3ff;
  --magenta: #ff007a;
  --neon-magenta: #ff007a;
  --lime: #00ff66;
  --neon-lime: #00ff66;
  --purple: #9d4edd;
  --neon-purple: #9d4edd;
  --gold: #ffaa00;
  --neon-gold: #ffaa00;

  /* Text & Surface Contrast Colors */
  --text-main: #f0f4fc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --text-bright: #ffffff;

  /* Glassmorphism Borders */
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-hover: rgba(255, 255, 255, 0.18);
  --border-neon-cyan: rgba(0, 243, 255, 0.4);
  --border-neon-magenta: rgba(255, 0, 122, 0.4);
  --border-neon-lime: rgba(0, 255, 102, 0.4);

  /* ==========================================================================
     2. Typography Hierarchy
     ========================================================================== */
  --font-heading: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* ==========================================================================
     3. Elevations, Shadows & Glass Parameters
     ========================================================================== */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 9999px;

  --glass-blur: blur(16px);
  --glass-blur-heavy: blur(24px);

  --glow-cyan: 0 0 25px rgba(0, 243, 255, 0.25);
  --glow-cyan-intense: 0 0 35px rgba(0, 243, 255, 0.6);
  --glow-magenta: 0 0 25px rgba(255, 0, 122, 0.25);
  --glow-magenta-intense: 0 0 35px rgba(255, 0, 122, 0.6);
  --glow-lime: 0 0 25px rgba(0, 255, 102, 0.25);
  --glow-lime-intense: 0 0 35px rgba(0, 255, 102, 0.6);

  --transition-fast: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-normal: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. Neo-Glassmorphism & Utility Rulesets

### 3.1 Neo-Glass Panel (`.glass-panel` & `.glass-card`)
```css
.glass-panel,
.glass-card {
  background: var(--bg-surface);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  transition: var(--transition-normal);
}

.glass-panel::before,
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  pointer-events: none;
}

.glass-panel:hover,
.glass-card:hover {
  background: var(--bg-surface-hover);
  border-color: rgba(0, 243, 255, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), var(--glow-cyan);
}
```

### 3.2 Neon Borders & Glow Utilities (`.neon-border`, `.glow-effect`)
```css
/* Neon Border Modifiers */
.neon-border {
  border: 1px solid var(--border-neon-cyan);
  box-shadow: var(--glow-cyan);
}

.neon-border-cyan {
  border: 1px solid var(--border-neon-cyan);
  box-shadow: var(--glow-cyan);
}

.neon-border-magenta {
  border: 1px solid var(--border-neon-magenta);
  box-shadow: var(--glow-magenta);
}

.neon-border-lime {
  border: 1px solid var(--border-neon-lime);
  box-shadow: var(--glow-lime);
}

/* Glow Effect Utilities */
.glow-effect {
  box-shadow: var(--glow-cyan);
  transition: var(--transition-normal);
}

.glow-effect:hover {
  box-shadow: var(--glow-cyan-intense);
}

.glow-cyan {
  box-shadow: var(--glow-cyan);
}

.glow-magenta {
  box-shadow: var(--glow-magenta);
}

.glow-lime {
  box-shadow: var(--glow-lime);
}
```

---

## 4. Cyber Grid & Aurora Background Overlay Architecture

### 4.1 Cyber Grid Overlay (`#cyber-grid` & `.cyber-grid-overlay`)
The cyber grid overlay creates a high-tech 2D grid matrix across the viewport.
```css
#cyber-grid,
.cyber-grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1;
  pointer-events: none;
}
```

### 4.2 Aurora Background Mesh & Keyframe Animation (`#aurora-bg`, `@keyframes aurora`)
A dynamic glowing radial gradient mesh operating in the background.
```css
#aurora-bg,
.aurora-mesh {
  position: fixed;
  top: -20%;
  left: -20%;
  width: 140vw;
  height: 140vh;
  z-index: -3;
  pointer-events: none;
  background: 
    radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 30%, rgba(255, 0, 122, 0.12) 0%, transparent 45%),
    radial-gradient(circle at 50% 80%, rgba(157, 78, 221, 0.15) 0%, transparent 50%);
  filter: blur(60px);
  animation: aurora 18s ease-in-out infinite alternate;
}

@keyframes aurora {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translate(5%, 8%) scale(1.1) rotate(5deg);
    opacity: 1;
  }
  100% {
    transform: translate(-4%, -5%) scale(1.05) rotate(-5deg);
    opacity: 0.85;
  }
}
```

---

## 5. Radial Spotlight Cursor Tracking Layer

The spotlight system functions in two tiers:
1. Global radial spotlight element tracking mouse position `#spotlight-cursor`.
2. Card-level interactive spotlight hover effect `.spotlight-card::after`.

```css
/* Global Radial Spotlight Layer */
#spotlight-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 243, 255, 0.08) 0%, rgba(255, 0, 122, 0.03) 40%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  transition: opacity 0.3s ease, transform 0.05s linear;
  mix-blend-mode: screen;
}

/* Card-level Spotlight Hover Follower */
.spotlight-card {
  position: relative;
}

.spotlight-card::after {
  content: '';
  position: absolute;
  top: var(--mouse-y, 50%);
  left: var(--mouse-x, 50%);
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(0, 243, 255, 0.12) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.spotlight-card:hover::after {
  opacity: 1;
}
```

---

## 6. Layout & Section Rulesets

### 6.1 Header & Sticky Glass Navbar (`.navbar`, `#navbar`)
```css
.navbar {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1100px;
  background: rgba(10, 12, 20, 0.75);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-glass);
  border-radius: 40px;
  padding: 0.75rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  text-decoration: none;
}

.brand-badge {
  background: linear-gradient(135deg, var(--cyan), var(--magenta));
  color: #000;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: var(--transition-fast);
  position: relative;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--cyan);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--cyan);
  transition: width 0.3s ease;
  box-shadow: var(--glow-cyan);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.btn-nav {
  background: linear-gradient(135deg, var(--cyan), var(--purple));
  color: #000;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.6rem 1.3rem;
  border-radius: 30px;
  text-decoration: none;
  transition: var(--transition-normal);
  border: none;
  cursor: pointer;
}

.btn-nav:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
}
```

### 6.2 Hero Section (`.hero`)
```css
.hero {
  padding-top: 10rem;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 255, 102, 0.1);
  border: 1px solid var(--border-neon-lime);
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--lime);
  margin-bottom: 1.5rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--lime);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--lime);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.4; transform: scale(0.9); }
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.1;
  margin-bottom: 1.25rem;
  max-width: 900px;
}

.hero-subtitle {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  color: var(--text-muted);
  max-width: 680px;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--cyan) 0%, #0099ff 100%);
  color: #050b14;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: var(--transition-normal);
  box-shadow: var(--glow-cyan);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-cyan-intense);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-main);
  border: 1px solid var(--border-glass);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.85rem 2rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: var(--transition-normal);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

### 6.3 Interactive CLI Terminal (`.terminal-container`)
```css
.terminal-container {
  max-width: 950px;
  width: 100%;
  margin: 3rem auto 0 auto;
  border-radius: var(--radius-md);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 243, 255, 0.15);
  border: 1px solid rgba(0, 243, 255, 0.2);
  overflow: hidden;
}

.terminal-header {
  background: #111420;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-glass);
}

.terminal-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.terminal-body {
  background: #090b12;
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.92rem;
  min-height: 280px;
  max-height: 400px;
  overflow-y: auto;
  color: #d1d5db;
}

.terminal-line {
  margin-bottom: 0.5rem;
  line-height: 1.5;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.prompt-symbol {
  color: var(--cyan);
  font-weight: 700;
}

.command-output {
  color: #9ca3af;
  margin-bottom: 0.75rem;
  padding-left: 1.25rem;
  white-space: pre-wrap;
}

.terminal-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.terminal-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--lime);
  font-family: var(--font-mono);
  font-size: 0.92rem;
  width: 100%;
  flex: 1;
}
```

### 6.4 Bento Grid Projects Showcase (`.bento-grid`)
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.bento-card {
  grid-column: span 4;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bento-card.featured {
  grid-column: span 8;
}

.bento-card.wide {
  grid-column: span 12;
}

.project-img-wrapper {
  width: 100%;
  height: 200px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 1.25rem;
  border: 1px solid var(--border-glass);
}

.project-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.bento-card:hover .project-img-wrapper img {
  transform: scale(1.06);
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 1rem 0;
}

.tag {
  background: rgba(0, 243, 255, 0.08);
  border: 1px solid rgba(0, 243, 255, 0.2);
  color: var(--cyan);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.tag-purple {
  background: rgba(157, 78, 221, 0.1);
  border-color: rgba(157, 78, 221, 0.3);
  color: var(--purple);
}

.tag-lime {
  background: rgba(0, 255, 102, 0.1);
  border-color: rgba(0, 255, 102, 0.3);
  color: var(--lime);
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-glass);
}

.project-link {
  color: var(--cyan);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  transition: var(--transition-normal);
}

.project-link:hover {
  gap: 0.7rem;
  color: #ffffff;
}
```

### 6.5 Tech Stack Matrix (`.matrix-container`, `.stack-grid`)
```css
.matrix-container,
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stack-category {
  padding: 1.75rem;
}

.stack-category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
  color: var(--cyan);
}

.stack-items {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.stack-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-sm);
  transition: var(--transition-normal);
}

.stack-item:hover {
  background: rgba(0, 243, 255, 0.05);
  border-color: rgba(0, 243, 255, 0.3);
}

.stack-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.stack-level {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--lime);
}

/* Optional Progress Bar Utilities for Tech Matrix */
.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.4rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--magenta));
  border-radius: 3px;
  transition: width 1s ease-in-out;
}
```

### 6.6 GitHub Stats Grid & Footer (`.stats-grid`, `.footer`)
```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  padding: 1.5rem;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-family: var(--font-heading);
  font-weight: 800;
  color: var(--cyan);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Footer Section */
.footer {
  padding: 4rem 0 2rem 0;
  border-top: 1px solid var(--border-glass);
  background: rgba(5, 6, 10, 0.9);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  text-decoration: none;
  transition: var(--transition-normal);
}

.social-icon:hover {
  background: var(--cyan);
  color: #000;
  box-shadow: var(--glow-cyan);
  transform: translateY(-3px);
}

.footer-bottom {
  text-align: center;
  color: var(--text-dim);
  font-size: 0.85rem;
  font-family: var(--font-mono);
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}
```

### 6.7 Project Detail Modal Overlay (`.modal-overlay`)
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(4, 5, 8, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  background: #0f121e;
  border: 1px solid var(--border-neon-cyan);
  border-radius: var(--radius-lg);
  max-width: 650px;
  width: 90%;
  padding: 2rem;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), var(--glow-cyan);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.modal-overlay.active .modal-content {
  transform: scale(1);
}

.modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition-fast);
}

.modal-close:hover {
  color: var(--magenta);
}
```

---

## 7. Responsive Breakpoint Specification

The breakpoint system is structured into three discrete device tiers as mandated by the project requirements:

| Tier | Range | Key Structural Adaptations |
|---|---|---|
| **Mobile** | `< 768px` | `nav-links` hidable/collapsible, 1-col Bento cards, 1-col Stats grid, stacked hero action buttons, smaller typography scale. |
| **Tablet** | `768px <= width < 1024px` | 2-col Stats grid, Bento grid cards wrap into single or half-span items, floating navbar padding adjustments. |
| **Desktop** | `>= 1024px` | Full 12-column Bento grid (`span 4`, `span 8`, `span 12`), 4-column Stats grid, horizontal nav bar, desktop spotlight cursor enabled. |

### Responsive CSS Implementation Code
```css
/* ==========================================================================
   Responsive Breakpoints
   ========================================================================== */

/* 1. Desktop & Wide Screens (>= 1024px) */
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(12, 1fr);
  }
  .bento-card {
    grid-column: span 4;
  }
  .bento-card.featured {
    grid-column: span 8;
  }
  .bento-card.wide {
    grid-column: span 12;
  }
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 2. Tablet Viewports (768px to 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .bento-grid {
    grid-template-columns: repeat(12, 1fr);
  }
  .bento-card {
    grid-column: span 6;
  }
  .bento-card.featured {
    grid-column: span 12;
  }
  .bento-card.wide {
    grid-column: span 12;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-title {
    font-size: 3rem;
  }
}

/* 3. Mobile Viewports (< 768px) */
@media (max-width: 767px) {
  .navbar {
    width: 95%;
    padding: 0.6rem 1rem;
  }
  .nav-links {
    display: none; /* Can be toggled with mobile nav toggle */
  }
  .hero {
    padding-top: 7rem;
    padding-bottom: 3rem;
  }
  .hero-title {
    font-size: 2.1rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-card, .bento-card.featured, .bento-card.wide {
    grid-column: span 1;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  #spotlight-cursor {
    display: none; /* Disable global spotlight follower on touch devices */
  }
}
```

---

## 8. Verification & Implementation Guidance for Implementer

When writing `css/styles.css` and `styles.css`:
1. Ensure both `css/styles.css` and `styles.css` are updated or linked so HTML paths (`href="styles.css"` and `href="css/styles.css"`) resolve seamlessly.
2. Verify that Google Fonts link in `<head>` contains:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">
   ```
3. Test layout rendering across Desktop (1440px), Tablet (768px), and Mobile (375px) width boundaries to guarantee zero horizontal scroll overflow.
