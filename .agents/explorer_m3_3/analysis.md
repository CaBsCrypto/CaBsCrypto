# Comprehensive Technical Analysis: Integration, Event Handling, Accessibility & DOM Architecture for Milestone 3

**Author**: Explorer 3 (Milestone 3 — Bento Grid Showcase, Project Modals & Tech Stack Matrix)  
**Date**: 2026-08-03  
**Working Directory**: `c:\Users\MGC\Documents\antigravity\goofy-salk\.agents\explorer_m3_3`  
**Target Files Analyzed**: `index.html`, `css/styles.css`, `js/app.js`, `js/hero.js`, `js/terminal.js`, `js/bento.js`, `js/matrix.js`, `test/*.test.js`

---

## 1. System Integration Architecture & Global Event Bus (`window.CabsCrypto`)

### 1.1 Global Application Bus Contract
The CabsCrypto application uses a lightweight, framework-free PubSub event bus exposed on `window.CabsCrypto` (initialized in `js/app.js`).

```javascript
window.CabsCrypto = {
  version: '2.5.0',
  state: {
    activeModal: null,           // String (projectId) or null
    currentSection: 'hero',      // Active section ID for scroll-spy
    techMatrixCategory: 'all',  // Active domain filter category
    isMobileMenuOpen: false,    // Mobile navbar toggle state
    modulesLoaded: {
      hero: false,
      terminal: false,
      bento: false,
      matrix: false
    }
  },
  on(event, callback),           // Subscribe to global event bus
  off(event, callback),          // Unsubscribe from global event bus
  emit(event, data),             // Emit payload to listeners
  openModal(projectId),          // Triggers modal:open, updates state & DOM active class
  closeModal(),                  // Triggers modal:close, resets state & DOM active class
  executeCommand(cmdString),     // Triggers terminal:execute, smooth scrolls to terminal
  filterTechStack(category),     // Triggers matrix:filter, smooth scrolls to matrix
  registerModule(name, initFn),  // Sub-module registration & lifecycle handler
  onReady(fn)                    // Queues callback until DOM & app engine are ready
};
```

### 1.2 Event Lifecycle Mapping
| Event Name | Emitter | Expected Payload | Purpose / Subscriber Action |
|------------|---------|------------------|-----------------------------|
| `modal:open` | `app.js` / `openModal()` | `{ projectId: string }` | `bento.js` listens to populate `#modal-body-content`, set focus, trap tab focus |
| `modal:close` | `app.js` / `closeModal()` | `{}` | `bento.js` restores previous focus, clears modal content if needed |
| `matrix:filter` | `app.js` / `filterTechStack()` | `{ category: string }` | `matrix.js` updates active tab styling, filters grid cards, triggers progress bar animations |
| `terminal:execute` | `app.js` / `terminal.js` | `{ command: string }` | Inter-module triggers (e.g., `projects`, `skills`, `matrix` commands) |
| `module:registered` | `app.js` / `registerModule()` | `{ name: string }` | Fired when a module successfully initializes |
| `app:ready` | `app.js` / `bootstrap()` | `{ version: string }` | Fired when DOMContentLoaded & all queued modules finish bootstrapping |

---

## 2. Event Handling & Inter-Module Interaction

### 2.1 Bento Grid & Project Detail Modal Flow
1. **Modal Trigger Sources**:
   - Direct click on `.modal-trigger` or `.bento-card` in the Bento Grid (`index.html`).
   - Execution of CLI command `projects <id>` or `open <id>` in `terminal.js`.
   - Programmatic invocation via `CabsCrypto.openModal(projectId)`.
2. **Execution Steps**:
   - `CabsCrypto.openModal(projectId)` updates `CabsCrypto.state.activeModal = projectId`.
   - Adds `.active` class to `#modal-container` and sets `aria-hidden="false"`.
   - Locks background scrolling via `document.body.style.overflow = 'hidden'`.
   - Emits `modal:open` with `{ projectId }`.
   - `bento.js` intercepts `modal:open`, looks up project metadata from its internal catalog matching `projectId`, renders formatted HTML into `#modal-body-content`, and activates the accessibility focus trap.
3. **Modal Close Sources**:
   - Click on close button `#modal-close-btn`.
   - Click on backdrop overlay `#modal-container` / `.modal-overlay`.
   - Keyboard `Escape` key press.
   - Programmatic invocation via `CabsCrypto.closeModal()`.

### 2.2 Tech Stack Matrix Category Filtering Flow
1. **Filter Trigger Sources**:
   - Click on category tab buttons (`.matrix-tab`) inside `#matrix-tabs`.
   - Execution of CLI command `skills <category>` or `matrix <category>` in `terminal.js`.
   - Programmatic invocation via `CabsCrypto.filterTechStack(category)`.
2. **Execution Steps**:
   - `CabsCrypto.filterTechStack(category)` updates `CabsCrypto.state.techMatrixCategory = category`.
   - Emits `matrix:filter` with `{ category }`.
   - `matrix.js` handles `matrix:filter`:
     - Updates tab `.active` classes across all `.matrix-tab` elements.
     - Updates `aria-selected="true"` on the matching tab button and `"false"` on others.
     - Iterates through `.stack-category` cards (`data-domain="web3|frontend|backend|devops"`).
     - Shows matching domain cards and hides/dims non-matching cards (or shows all if `category === 'all'`).
     - Triggers CSS progress bar width animation (`.stack-bar`) from `0%` to target percentage.

---

## 3. Accessibility (a11y) Deep Dive

### 3.1 Focus Management & Focus Trap for Modal
- **Current Limitation in `app.js`**: `app.js` handles class toggling (`active`), `aria-hidden`, and `document.body.style.overflow`, but does **NOT** trap focus or restore focus on close.
- **Required Implementation in `bento.js`**:
  1. **Focus Capture**: When `modal:open` fires:
     - Store current `document.activeElement` into `lastFocusedElement`.
     - Shift focus to modal container `#modal-container` or close button `#modal-close-btn` using `.focus()`.
  2. **Keyboard Focus Trap Listener**:
     - Intercept `keydown` for `Tab` key while modal is active.
     - Query focusable elements inside `#modal-container`: `a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])`.
     - If `Shift + Tab` on first focusable element -> focus last focusable element.
     - If `Tab` on last focusable element -> focus first focusable element.
  3. **Focus Restoration**: When `modal:close` fires:
     - If `lastFocusedElement` exists and is attached to DOM, call `lastFocusedElement.focus()`.

### 3.2 ARIA Roles & Attributes Checklist
| Target Container / Element | Required ARIA Attributes | Current State in HTML/CSS | Remediation / Verification |
|----------------------------|--------------------------|---------------------------|----------------------------|
| Modal Overlay (`#modal-container`) | `role="dialog"`, `aria-modal="true"`, `aria-hidden="true/false"`, `aria-labelledby="modal-title"` | `aria-hidden="true"` present, `role="dialog"` missing | Add `role="dialog"` and `aria-modal="true"` to `#modal-container` in `index.html` |
| Modal Close Button (`#modal-close-btn`) | `aria-label="Close modal"` | `aria-label="Close modal"` present | Compliant |
| Matrix Tabs Wrapper (`#matrix-tabs`) | `role="tablist"`, `aria-label="Tech Stack Categories"` | Missing `role="tablist"` | Add `role="tablist"` and `aria-label` in HTML or `matrix.js` |
| Matrix Tab Buttons (`.matrix-tab`) | `role="tab"`, `aria-selected="true/false"`, `aria-controls="matrix-grid"` | `data-category` present, `role="tab"` missing | Add `role="tab"`, `aria-selected`, `aria-controls` in `matrix.js` |
| Bento Project Cards (`.bento-card`) | `role="article"`, `tabindex="0"`, `aria-label="..."` | Structurally `<div class="glass-card bento-card">` | Add `tabindex="0"` or keyboard listener (`Enter`/`Space`) to open modal |

### 3.3 Keyboard Navigation Matrix
- `Esc` key: Closes active modal (implemented in `app.js`).
- `Tab` / `Shift+Tab`: Trapped within active modal; cycles cleanly through navbar/page elements when modal is closed.
- `Enter` / `Space`: Activates focused Bento project card or category tab button.
- Arrow Keys (`ArrowLeft` / `ArrowRight`): Optional enhanced keyboard navigation across category filter tabs in Tech Matrix.

---

## 4. DOM Mounting Points & Structure Analysis (`index.html`)

### 4.1 Bento Grid Section Structure
- **Section Mount Point**: `<section class="bento-section container" id="bento-container">`
- **Header**: `<div class="section-header" id="projects">`
- **Grid Container**: `<div class="bento-grid" id="bento-grid">`
- **Current Cards**:
  1. `#proj-card-1` (`data-project="bot"`, class `bento-card featured spotlight-card`)
  2. `#proj-card-2` (`data-project="aegis"`, class `bento-card spotlight-card`)
  3. `#proj-card-3` (`data-project="cli"`, class `bento-card wide spotlight-card`)
- **Trigger Links**: `<a href="#" class="project-link modal-trigger" data-project="...">`

### 4.2 Modal Container Structure
- **Overlay Mount Point**: `<div class="modal-overlay" id="modal-container">`
- **Content Box**: `<div class="modal-content">`
- **Close Button**: `<button class="modal-close" id="modal-close-btn" aria-label="Close modal">&times;</button>`
- **Dynamic Content Container**: `<div id="modal-body-content">`

### 4.3 Tech Stack Matrix Section Structure
- **Section Mount Point**: `<section class="matrix-section container" id="matrix-container">`
- **Header**: `<div class="section-header" id="stack">`
- **Tab Buttons Container**: `<div class="matrix-tabs" id="matrix-tabs">`
- **Tabs**: `<button class="matrix-tab active" data-category="all">`, `data-category="web3"`, `data-category="frontend"`, `data-category="backend"`, `data-category="devops"`.
- **Grid Container**: `<div class="stack-grid" id="matrix-grid">`
- **Category Domain Cards**: `<div class="glass-card stack-category" data-domain="web3|frontend|backend|devops">`
- **Progress Bars**: `<div class="stack-bar" style="width: XX%;">`

---

## 5. Script Inclusion Order & Loading Lifecycle

### 5.1 Script Tag Sequence in `index.html`
```html
<script src="js/app.js"></script>
<script src="js/hero.js" defer></script>
<script src="js/terminal.js" defer></script>
<script src="js/bento.js" defer></script>
<script src="js/matrix.js" defer></script>
```

### 5.2 Execution Order Mechanics
1. `js/app.js` runs synchronously during HTML parsing, initializing `window.CabsCrypto` global object, state store, and event bus.
2. `hero.js`, `terminal.js`, `bento.js`, and `matrix.js` carry the `defer` attribute. They execute in document order after parsing completes, but before `DOMContentLoaded`.
3. Each sub-module executes its IIFE and calls `window.CabsCrypto.registerModule('<name>', initFn)`.
4. `registerModule` checks `isDOMReady`. Since DOM loading is still in progress, `initFn` is queued into `readyCallbacks`.
5. `DOMContentLoaded` fires. `app.js` sets `isDOMReady = true` and executes all `readyCallbacks` sequentially:
   `initHeroModule` -> `initTerminalModule` -> `initBentoModule` -> `initMatrixModule`.
6. Emits `app:ready` event.

---

## 6. CSS Selectors, Styling Gaps & Responsive Design

### 6.1 Existing CSS Infrastructure in `css/styles.css`
- **Grid Layout**: `.bento-grid` (12 columns, 1.5rem gap), `.bento-card` (span 4), `.bento-card.featured` (span 8), `.bento-card.wide` (span 12).
- **Breakpoints**: Desktop (`>=1024px`), Tablet (`768px - 1023px`), Mobile (`<768px`).
- **Modal Overlay**: `.modal-overlay` (fixed position, z-index 2000, blur 10px, opacity transition).
- **Matrix Grid**: `.stack-grid` (auto-fit grid minmax 270px), `.matrix-tabs`, `.matrix-tab`, `.matrix-tab.active`.

### 6.2 Styling Gaps Identified
1. **Modal Body Content Overflow & Max-Height**:
   - `.modal-content` currently has `max-width: 650px; width: 90%; padding: 2rem;` but **no `max-height` or `overflow-y` rule**.
   - On small screens or when rendering rich project details, long content will overflow past the viewport height.
   - **Recommendation**: Add `max-height: 85vh; overflow-y: auto;` to `.modal-content` or `#modal-body-content`.
2. **Modal Content Element Styles**:
   - `css/styles.css` contains styles for `.modal-overlay`, `.modal-content`, and `.modal-close`, but lacks dedicated classes for elements inside `#modal-body-content` (e.g., `.modal-header`, `.modal-title`, `.modal-badge`, `.modal-description`, `.modal-features`, `.modal-tech-stack`, `.modal-actions`, `.btn-modal`).
   - `bento.js` can either use inline styles, standard utility classes (`.gradient-text`, `.tag`, `.btn-primary`), or add clear modal typography classes in CSS.
3. **Matrix Filtering Display Transition**:
   - `css/styles.css` does not currently define a `.stack-category.hidden` or `.hidden` rule.
   - `matrix.js` can control filtering via `card.style.display = 'none'` / `card.style.display = 'block'` or `card.classList.toggle('hidden')` (if `.hidden { display: none !important; }` is provided).

---

## 7. Potential Conflicts & Edge Cases Inventory

| # | Conflict / Edge Case | Risk Level | Description & Root Cause | Prevention & Mitigation |
|---|----------------------|------------|--------------------------|-------------------------|
| 1 | Modal ID Selector Inconsistency | Low | `app.js` queries `document.getElementById('modal-container') || document.getElementById('project-modal')`. | Ensure `bento.js` targets `#modal-container` or `#modal-body-content` consistently. |
| 2 | Modal Content Population Race | Medium | `CabsCrypto.openModal(projectId)` toggles `.active` class immediately. If content is injected after toggle, unstyled/empty modal flashes. | `bento.js` should populate `#modal-body-content` synchronously inside `modal:open` event listener or click handler before CSS animation finishes. |
| 3 | Focus Trap Leakage | High | Pressing `Tab` inside open modal focuses navbar or hidden page links behind modal overlay. | Implement full keyboard focus trap in `bento.js` on `modal:open` and remove on `modal:close`. |
| 4 | Terminal Command Integration | Medium | CLI commands `projects` and `skills` must integrate seamlessly with M3 UI. | `bento.js` and `matrix.js` should listen to `terminal:execute` or handle state emitted by `executeCommand`. |
| 5 | Rapid Tab Switch Animation Interruption | Low | Rapidly clicking matrix tabs while progress bars are animating width. | `matrix.js` should reset bar width to `0%` then trigger reflow (`void bar.offsetWidth`) before setting target width. |
| 6 | Mobile Viewport Modal Clipping | Medium | Modal taller than screen on mobile devices (<768px). | Apply `max-height: 85vh; overflow-y: auto;` to `.modal-content` in CSS. |

---

## 8. Concrete Implementation Guidelines

### 8.1 Guidelines for `js/bento.js`
- Define project catalog data array with full metadata for `bot`, `aegis`, `cli` (and additional projects if desired).
- In `initBentoModule(app)`:
  1. Bind click event listeners to `.modal-trigger` links and `.bento-card` elements.
  2. Subscribe to `app.on('modal:open', ({ projectId }) => ...)`:
     - Render project template into `#modal-body-content`.
     - Activate focus trap & focus close button `#modal-close-btn`.
  3. Subscribe to `app.on('modal:close', () => ...)`:
     - Deactivate focus trap & restore focus to `lastFocusedElement`.
  4. Implement `keydown` focus trap listener for `Tab` / `Shift+Tab`.

### 8.2 Guidelines for `js/matrix.js`
- In `initMatrixModule(app)`:
  1. Bind click event listeners to `.matrix-tab` buttons.
  2. Subscribe to `app.on('matrix:filter', ({ category }) => ...)`:
     - Update tab `.active` classes and `aria-selected` attributes.
     - Filter `.stack-category` cards (`[data-domain]`).
     - Trigger `.stack-bar` progress bar animations.
  3. Optionally observe scroll entry via `IntersectionObserver` to trigger bar animation when scrolling into matrix section.

---

## 9. Verification & Test Suite Compatibility
- All integration hooks comply with tests in `test/tier1_feature_coverage.test.js` (Features 10, 11, 12), `test/tier2_boundary_corner.test.js`, and `test/tier3_cross_feature.test.js` (Tests 1, 2, 6, 8, 13).
