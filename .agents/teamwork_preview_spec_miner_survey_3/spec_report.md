# Specification Mining Report: CabsCrypto Portfolio Landing Page

**Agent ID**: Spec Miner 3 (`teamwork_preview_spec_miner_survey_3`)  
**Target Workspace**: `c:\Users\MGC\Documents\antigravity\goofy-salk`  
**Authoritative Source**: `c:\Users\MGC\Documents\antigravity\goofy-salk\ORIGINAL_REQUEST.md`  
**Date**: 2026-08-03  

---

## 1. Executive Summary

This report establishes the complete specification, structural requirements, interaction models, data schemas, edge cases, and verification expectations for three critical modules of the **CabsCrypto Cyber-Futuristic Portfolio Landing Page**:
1. **Bento Grid Showcase** for Web3, Crypto, and Software Development projects.
2. **Tech Stack Matrix** organized across four key domain categories with visual proficiency indicators.
3. **Local HTTP Server Hosting & Automated Verification Suite** expectations.

All findings are extracted directly from `ORIGINAL_REQUEST.md`, design system rules (`#08090f` background, dark neo-glassmorphism, cyan `#00f3ff`, magenta `#ff007a`, lime `#00ff66` neon accents), and modern Web3 developer showcase best practices.

---

## 2. Feature Discovery & Detailed Requirements

### 2.1 Module 1: Bento Grid Showcase for Web3/Crypto/Dev Projects

#### A. Architecture & Layout Specification
- **Grid Layout**: CSS Grid / Flexbox implementation adhering to an asymmetric Bento Box layout design (e.g., 12-column grid on desktop, 6-column on tablet, single column on mobile).
- **Visual Hierarchy**:
  - **Hero / Flagship Project Card**: Spans larger dimensions (e.g., 2 columns x 2 rows or full-width top span) showcasing premier Web3 protocol / dApp (e.g., DEX Aggregator, Zero-Knowledge Privacy Protocol, or Cross-Chain Bridge).
  - **Standard Feature Cards**: Medium size (e.g., 1 column x 1 row or 2 columns x 1 row) representing specialized projects (e.g., Solidity Smart Contract Security Suite, DeFi Yield Vaults, High-Frequency Trading Bot).
  - **Micro / Metric Cards**: Compact Bento cells displaying stats or real-time status badges (e.g., "$1.2B Total Volume Processed", "100% Audit Score", "50k+ Contract Deployments").

#### B. Component Specifications & Interaction Mechanics
- **Hover States**:
  - Border transition: Cyber neon cyan (`#00f3ff`) or magenta (`#ff007a`) glowing border highlight with CSS `box-shadow` or SVG gradient glow on hover.
  - Scale & Elevation: Subtle micro-scaling (`transform: scale(1.02)`) with `transition: transform 0.3s ease, box-shadow 0.3s ease`.
  - Cursor Spotlight Integration: Dynamic radial spotlight background effect tracking cursor position (`radial-gradient(circle at X Y, rgba(0,243,255,0.15), transparent 70%)`).
  - Image / Canvas Effect: Subtle zoom or overlay brightness shift on card thumbnail/graphic.
- **Tags & Metadata System**:
  - **Category Tags**: Pill badges indicating domain (`Web3`, `DeFi`, `Smart Contracts`, `Zero-Knowledge`, `Full Stack`, `Rust / Solana`, `AI / Agentic Crypto`).
  - **Status Indicators**: Pulsing neon dots or badges (`● Live Mainnet` [Lime], `● Testnet` [Cyan], `● Security Audited` [Magenta], `● Open Source` [Purple/Blue]).
  - **Key Metrics Pill**: Compact indicators for TVL, Transactions, Stars, or Gas savings.
- **Detail View Modal**:
  - **Trigger**: Click anywhere on a Bento Card (or explicitly on an "Inspect Project" / "View Details" button).
  - **Backdrop Overlay**: Darkened backdrop (`#08090f` at 80% opacity) with `backdrop-filter: blur(12px)` and smooth fade-in overlay transition.
  - **Modal Container**: Cyber-glassmorphic panel (`background: rgba(15, 23, 42, 0.75)`, `border: 1px solid rgba(0, 243, 255, 0.3)`, rounded corners `16px` to `24px`, inner neon glow).
  - **Modal Header**: Project Title, Subtitle, Category Pills, Status Badge, and Close Button (`[X]` icon button and keyboard trigger `Escape`).
  - **Modal Body Sections**:
    1. **Visual Showcase**: High-resolution screenshot, interactive demo iframe placeholder, or animated architecture diagram.
    2. **Overview & Problem Statement**: Detailed narrative of the project's goal, technical architecture, and impact.
    3. **Tech Stack & Protocols**: Explicit listing of languages, frameworks, smart contract standards (ERC-20, ERC-721, Anchor, Hardhat, Ethers.js, etc.).
    4. **Key Features & Metrics**: Bullet points with benchmarks (e.g., "Sub-second finality", "Formal verification complete", "Zero-knowledge proof generation in <50ms").
    5. **Action Links**: Primary buttons with neon hover states for:
       - `[ Live App / Demo ]` (External URL target `_blank` with `rel="noopener noreferrer"`)
       - `[ Source Code / GitHub ]`
       - `[ Audit Report / Etherscan ]`
  - **Modal Accessibility & Behavior**:
    - Body scroll lock (`overflow: hidden` on `<body>` when modal open).
    - Focus trap inside modal for accessibility.
    - Dismiss on backdrop click or `Escape` keypress.

---

### 2.2 Module 2: Tech Stack Matrix

#### A. Categorization Structure
The matrix must categorize CabsCrypto's technical competencies into four distinct domain clusters:
1. **Blockchain & Web3**:
   - Languages: Solidity, Rust, Vyper, Move.
   - Frameworks & Tools: Hardhat, Foundry, Anchor, Truffle.
   - Client Libraries: Ethers.js, Viem, Wagmi, Web3.js, Solana Web3.js.
   - Protocols & Standards: EVM, ERC-20/721/1155, IPFS, Arweave, ZK-SNARKs, Layer 2 (Arbitrum, Optimism, zkSync), Chainlink Oracles.
2. **Frontend Development**:
   - Core & Frameworks: React, Next.js, Vue.js, TypeScript, JavaScript (ESNext), HTML5/CSS3.
   - Styling & Design: Tailwind CSS, CSS Modules, Styled Components, Glassmorphic Design Systems.
   - Graphics & Animation: WebGL, Three.js, Framer Motion, Canvas API, GSAP.
3. **Backend & CLI Tools**:
   - Runtimes & Languages: Node.js, Python, Go, Rust.
   - Frameworks: Express, FastAPI, NestJS, Gin.
   - CLI Development: Node CLI (Commander/Inquirer), Python Rich/Typer, Rust Clap.
   - Databases & Caching: PostgreSQL, MongoDB, Redis, GraphQL, REST APIs.
4. **DevOps & Cloud Infrastructure**:
   - Containerization & Orchestration: Docker, Docker Compose, Kubernetes.
   - CI/CD Pipelines: GitHub Actions, Vercel Build Workflows.
   - Web Servers & Cloud: Nginx, AWS (S3, EC2, CloudFront), Cloudflare Workers.
   - Web3 Infrastructure: RPC Nodes (Alchemy, Infura, QuickNode), Graph Protocol (Subgraphs).

#### B. Visual Representation & UI Mechanics
- **Layout**: 4-column responsive grid (or 2x2 matrix on desktop, stack on mobile) with glowing section headers matching HSL neon accents.
- **Proficiency Indicators**:
  - Numerical / Percentage Rating (e.g., `95%`, `90%`, `85%`) or Qualitative Tier (`Mastery`, `Expert`, `Advanced`, `Production Ready`).
  - **Animated Neon Progress Bars**:
    - Gradient fill matching domain color (Cyan for Web3, Magenta for Frontend, Lime for Backend/CLI, Purple/Cyan for DevOps).
    - Smooth expansion animation on viewport scroll into view (`width: 0%` to `X%` over `1.2s ease-out`).
    - Outer glow on progress bar tip (`box-shadow: 0 0 10px currentColor`).
- **Interactive Matrix Controls**:
  - **Category Filter Tabs**: `[ All ]`, `[ Web3 ]`, `[ Frontend ]`, `[ Backend ]`, `[ DevOps ]` allowing users to focus on specific domains.
  - **Skill Hover Card / Tooltip**: Hovering over a tech skill pill reveals detailed context:
    - Years of experience.
    - Associated projects in Bento Grid.
    - Core libraries/tools mastered.
  - **Search / Filter Highlight**: Real-time text filter to search for specific technology (e.g. typing "Rust" highlights all Rust skills across matrix).

---

### 2.3 Module 3: Local HTTP Server Hosting Requirements & Verification Suite Expectations

#### A. Local HTTP Server Hosting Requirements
- **Runtime Choice**: Lightweight, zero-external-dependency or standard static file server.
  - Python Built-in: `python -m http.server <port>` (Python 3.x available in environment).
  - Node.js Built-in / Static: `npx serve`, `npx http-server`, or express static server script `server.js`.
- **Port Strategy**:
  - Preferred default port: `8080` or `3000`.
  - Fallback mechanism: Auto-detect port availability or try alternate ports (`8081`, `8082`, `3001`, `5000`) if default port is occupied.
- **Static Asset Serving Rules**:
  - MIME type mapping for `.html`, `.css`, `.js`, `.json`, `.svg`, `.png`, `.jpg`, `.webp`, `.woff2`.
  - UTF-8 encoding headers (`Content-Type: text/html; charset=utf-8`).
  - SPA / Single-page navigation fallback to `index.html` if sub-routes are requested.
  - Cache control headers appropriate for local development (`Cache-Control: no-cache`).
- **Host Binding**: Bind to `localhost` (`127.0.0.1`) for local network access and testing accessibility.

#### B. Automated Verification Suite Expectations
The verification suite must evaluate the application across visual, interactive, structural, and performance vectors:

1. **Server Accessibility & Health Check**:
   - Issue GET request to `http://localhost:<port>/`.
   - Expect HTTP status code `200 OK`.
   - Content-Type header matches `text/html`.

2. **DOM Integrity & Structural Element Test**:
   - Verify presence of document title ("CabsCrypto Portfolio" or similar cyber-futuristic title).
   - Verify core sections: `#hero`, `#terminal`, `#bento-grid`, `#tech-stack`, `#github-stats` (or equivalent selectors).
   - Verify font loading links for `Space Grotesk`, `JetBrains Mono`, `Inter`.

3. **Bento Grid Functional & Interactive Verification**:
   - Count Bento Grid items (minimum expected project items present).
   - Verify each Bento card contains: Title, Category tag, Status indicator, Description, and inspect action.
   - Simulate click event on Bento project card:
     - Check modal element appears in DOM and removes `hidden` / adds `active` state.
     - Check modal content populates matching project data (Title, Detailed description, Stack tags, External links).
     - Check body overflow style changes to `hidden`.
   - Simulate modal close (click close button `[X]`, press `Escape` key, or click backdrop):
     - Check modal element hides/removes active class.
     - Check body overflow style restores to original.

4. **Tech Stack Matrix Functional Verification**:
   - Verify 4 main categories exist (Blockchain/Web3, Frontend, Backend & CLI, DevOps).
   - Check presence of skill items within each category.
   - Verify progress bar values or level indicators render correctly.
   - Test category filter buttons (switching tabs filters displayed skills cleanly without breaking layout).

5. **Visual Aesthetic & Styling Verification**:
   - Computed styles verify background color `#08090f` or dark glass equivalent.
   - Verify CSS variable definitions for HSL neon cyan (`#00f3ff`), magenta (`#ff007a`), lime (`#00ff66`).
   - Check backdrop-blur styling on glassmorphic panels.

6. **Responsive Layout & Viewport Verification**:
   - Desktop Viewport (`1920x1080` and `1280x800`): Bento grid displays multi-column layout without overflow.
   - Tablet Viewport (`768x1024`): Bento grid and Tech Stack Matrix adjust gracefully.
   - Mobile Viewport (`375x812`): Single-column stack, terminal scales responsively without horizontal scrollbar.

---

## 3. Features Discovered Table

Below is the exhaustive catalog of discovered features across all assigned domains.

## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Bento Grid | Asymmetric Bento Grid Layout | Responsive 12-col grid displaying Web3/Crypto/Dev project cards in variable spans (Hero 2x2, Standard 2x1/1x1, Micro stats). | Viewport width, card metadata array | Structured CSS Grid layout of cyber-glass cards | Fallback to 1-column responsive stack on small viewports | ORIGINAL_REQUEST.md R3 |
| 2 | Bento Grid | Interactive Hover Glow & Spotlight | Card hover effect with neon glowing border (cyan/magenta/lime), scale (1.02x), and mouse-tracking spotlight radial gradient. | Mouse move / hover events on card | CSS transform, neon box-shadow, dynamic background radial gradient | Graceful degradation to static hover border if WebGL/pointer events unsupported | ORIGINAL_REQUEST.md R1 & R3 |
| 3 | Bento Grid | Category & Status Tag Badges | Visual pill tags showing project category (Web3, DeFi, ZK) and live status badges (● Mainnet, ● Testnet, ● Audited). | Tag strings, status status level | Styled glass badges with neon pulsing indicator dot | Render plain text badge if icon or status dot fails | ORIGINAL_REQUEST.md R3 |
| 4 | Bento Grid | Project Detail View Modal | Popup overlay opening full project details when card is clicked. | Click event on Bento card | Cyber-glass modal panel over blurred backdrop (`backdrop-filter: blur(12px)`) | Close modal on error, log to console, keep background page scrollable if modal crashes | ORIGINAL_REQUEST.md R3 |
| 5 | Bento Grid | Modal Action Links & CTAs | External link buttons inside detail modal for Live App, GitHub Repo, and Audit / Explorer links. | URL strings, target metadata | Styled neon buttons opening target links in new tab (`_blank`) | Disable button or hide link if URL is missing/empty | ORIGINAL_REQUEST.md R3 |
| 6 | Bento Grid | Modal Dismiss & Focus Trap | Modal closing mechanisms via `[X]` button, backdrop click, or `Escape` key; locks body scroll when open. | Keydown `Escape`, click backdrop/button | Modal hide animation, restore body scroll, focus return to triggered card | Ensure body scroll is restored even if modal unmounts unexpectedly | Spec Analysis |
| 7 | Tech Matrix | Domain Skill Grouping (4 Categories) | Categorization of skills into Blockchain/Web3, Frontend, Backend & CLI, and DevOps. | Skill array grouped by category | 4 distinct section blocks / cards with neon category headers | Render uncategorized items under "General" if group missing | ORIGINAL_REQUEST.md R3 |
| 8 | Tech Matrix | Visual Proficiency Indicators | Skill progress bars with percentage text (`95%`) and glowing neon gradient fills (cyan, magenta, lime). | Skill level values (0-100%) | Animated progress bar fill with glowing tip and numeric label | Clamp values between 0% and 100% | ORIGINAL_REQUEST.md R3 |
| 9 | Tech Matrix | Category Filter Tab Bar | Interactive tab controls (`All`, `Web3`, `Frontend`, `Backend`, `DevOps`) to filter matrix view. | Click event on tab button | Smooth filter transition showing only matching skills/categories | Default to showing `All` skills if invalid tab selected | Spec Analysis |
| 10 | Tech Matrix | Skill Detail Tooltip / Hover State | Hovering skill badge reveals experience context, key projects, or related libraries. | Mouse hover on skill item | Tooltip overlay with context details | Hide tooltip on mouse leave or touch start | Spec Analysis |
| 11 | Local Server | Static Asset HTTP Server | Local HTTP server serving HTML, CSS, JS, fonts, and images on localhost. | CLI command (`python -m http.server` or `node server.js`) | Local HTTP server running at `http://localhost:<port>` | Port collision fallback: select next available free port | ORIGINAL_REQUEST.md R4 |
| 12 | Local Server | MIME Type & SPA Route Handling | Correct headers for static assets and fallback handling for single-page routing. | GET request paths | Correct `Content-Type` header (e.g. `text/html`, `text/css`, `application/javascript`) | Return `404 Not Found` page or fallback to `index.html` | Spec Analysis |
| 13 | Verification | Automated E2E & DOM Inspector Suite | Verification checks validating HTTP 200, DOM elements, Bento modal interaction, and layout integrity. | Automated test script / browser check | Test report status (Pass/Fail) with detailed log output | Report exact failed assertion, element selector, or HTTP status | ORIGINAL_REQUEST.md R4 |

---

## 4. Edge Cases Matrix

## Edge Cases
| # | Feature | Input / Scenario | Observed / Expected Behavior |
|---|---------|------------------|------------------------------|
| 1 | Bento Grid | Click project card with no external links (e.g., proprietary or WIP project) | Detail view modal renders normally; missing links (e.g. Live Demo or Audit link) are hidden or marked as "Private / In Development" rather than displaying broken/empty buttons. |
| 2 | Bento Grid | Rapid multiple clicks on Bento cards while modal transition animation is running | Debounce modal trigger or lock interaction during transition; ensure only one modal instance is active and backdrop blur does not double-stack. |
| 3 | Bento Grid | Press `Escape` key when modal is NOT open | Event handler ignores `Escape` keypress gracefully; no JS errors thrown. |
| 4 | Bento Grid | Long project title or descriptions in Bento card or modal | Text wraps cleanly using `word-break: break-word` and line clamping (`-webkit-line-clamp: 3`) on cards; modal accommodates scrollable body content (`overflow-y: auto`). |
| 5 | Bento Grid | Screen resize while detail modal is open (e.g. desktop to mobile orientation change) | Modal container dynamically resizes to fit viewport height/width (`max-height: 90vh; width: 95vw`), scrollbar appears inside modal body if needed. |
| 6 | Tech Matrix | Skill proficiency value specified above 100% or below 0% (e.g., -10% or 120%) | Sanitize skill value by clamping to bounds `[0, 100]` before rendering progress bar width. |
| 7 | Tech Matrix | Extremely narrow screen width (<320px) | Skill cards and progress bars stack vertically without label overlap; percentage text wraps or scales down. |
| 8 | Tech Matrix | Fast tab switching on Category Filter Bar | Filter animation cancels previous transition cleanly and displays target category immediately without UI flickering or blank state. |
| 9 | Local Server | Port `8080` (or `3000`) is already bound by another local process | Server detection script catches `EADDRINUSE` / `PermissionError` and automatically attempts fallback ports (`8081`, `3001`, `5000`) or prints clear port configuration instructions. |
| 10 | Local Server | Requesting static asset with non-standard extension or missing file | Server returns `404 Not Found` status with custom cyber-themed error page or standard HTTP error response without crashing the server process. |
| 11 | Verification | Verification script executes before server is fully initialized | Verification runner uses retry loop with backoff (e.g., poll `http://localhost:<port>/` 5 times with 500ms delay) before failing connection assertion. |
| 12 | Verification | Touch device / Mobile viewport emulation during E2E test | Bento grid hover spotlight gracefully handles touch events (`touchstart`/`touchend`) without causing sticky highlight state. |

---

## 5. Data Schema & Model Specifications

To ensure consistent implementation across front-end rendering, state management, and modal popups, the following JSON data schemas are specified.

### 5.1 Bento Project Data Schema (`projects.json` / TS Interface)

```typescript
interface BentoProject {
  id: string; // Unique identifier, e.g. "solana-dex-aggregator"
  title: string; // Display title, e.g. "Aura DEX Aggregator"
  subtitle: string; // Short catchphrase, e.g. "Cross-chain liquidity routing protocol"
  description: string; // Card summary text (1-2 sentences)
  fullDescription: string; // Detailed narrative for detail view modal
  gridSpan: {
    cols: number; // Desktop column span (e.g. 1, 2, or 3)
    rows: number; // Desktop row span (e.g. 1 or 2)
    isHero?: boolean; // Flag for flagship project card styling
  };
  category: 'Web3' | 'DeFi' | 'Smart Contracts' | 'Zero-Knowledge' | 'Full Stack' | 'CLI / DevTools';
  status: 'Mainnet' | 'Testnet' | 'Audit Passed' | 'Beta' | 'Open Source';
  tags: string[]; // Tech tags, e.g. ["Solidity", "Rust", "Viem", "Tailwind"]
  metrics?: {
    label: string; // e.g. "Total Volume", "Gas Saved", "GitHub Stars"
    value: string; // e.g. "$1.4B+", "42%", "1.2k"
  }[];
  architectureHighlights?: string[]; // Bullet points for modal detail view
  links: {
    liveDemo?: string; // Target URL for live app
    github?: string; // Target URL for repository
    audit?: string; // Target URL for security audit report
    docs?: string; // Target URL for documentation
  };
  media: {
    thumbnailUrl: string; // Image path or SVG placeholder for Bento card
    bannerUrl?: string; // High-res image/diagram for modal
  };
}
```

### 5.2 Tech Stack Matrix Data Schema (`tech_stack.json` / TS Interface)

```typescript
interface SkillItem {
  id: string; // e.g. "solidity"
  name: string; // e.g. "Solidity"
  proficiency: number; // Percentage integer 0 - 100
  tier: 'Mastery' | 'Expert' | 'Advanced' | 'Production Ready';
  icon?: string; // SVG icon name or URL
  yearsOfExperience?: number;
  featuredInProjects?: string[]; // Array of Bento project IDs
}

interface TechCategory {
  id: 'blockchain-web3' | 'frontend' | 'backend-cli' | 'devops-cloud';
  name: string; // Display header, e.g. "Blockchain / Web3"
  colorAccent: string; // HSL hex color, e.g. "#00f3ff" (cyan) or "#ff007a" (magenta)
  description: string; // Short category summary
  skills: SkillItem[];
}
```

---

## 6. Verification Test Plan Expectations

When the verification suite is run against the local HTTP server, the test harness should execute the following test sequence:

```
[TEST SUITE FLOW]
 ├── 1. Server Launch & Health Check
 │    ├── Spin up local server on available port (e.g., 8080)
 │    └── HTTP GET http://localhost:8080/ -> Assert status === 200 OK
 ├── 2. Asset Integrity Check
 │    ├── GET /css/style.css -> Assert 200 OK
 │    ├── GET /js/app.js -> Assert 200 OK
 │    └── Font/Image URLs -> Assert 200 OK
 ├── 3. DOM Component Check
 │    ├── Assert header/hero elements exist
 │    ├── Assert #bento-grid container exists with >= 4 project cards
 │    ├── Assert #tech-stack matrix exists with 4 categories
 │    └── Assert #terminal container exists
 ├── 4. Bento Grid Interaction Check
 │    ├── Trigger hover event on first Bento card -> Check glow CSS / hover class
 │    ├── Click Bento card -> Assert modal element `.modal-active` visible
 │    ├── Check modal title matches card data
 │    ├── Click modal backdrop / close button -> Assert modal hidden
 │    └── Press 'Escape' key on open modal -> Assert modal hidden
 ├── 5. Tech Stack Matrix Interaction Check
 │    ├── Assert progress bars rendered with correct width %
 │    ├── Click category filter tab (e.g. "Web3") -> Assert non-matching cards filtered
 │    └── Click "All" tab -> Assert all categories visible again
 └── 6. Visual Theme & Responsiveness Check
      ├── Verify dark background `#08090f` computed style
      ├── Test viewport resize to 375px (Mobile) -> Check zero horizontal overflow
      └── Output Verification Report (PASS/FAIL)
```

---

## 7. Conclusion

This specification provides an unambiguous blueprint for implementing the **Bento Grid Showcase**, **Tech Stack Matrix**, and **Local HTTP Server Hosting & Verification Suite**. All functional expectations, interactive mechanics, schemas, edge cases, and test assertions are documented for downstream implementation and testing tracks.
