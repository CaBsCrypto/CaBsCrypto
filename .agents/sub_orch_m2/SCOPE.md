# Scope: Milestone 2 (Hero Section & Interactive CLI Terminal)

## Architecture
- `js/hero.js`: Dynamic Hero headline with cycling typewriter engine, animated gradient text, and CTA buttons linking to sections/terminal.
- `js/terminal.js`: Interactive CLI terminal supporting commands (`help`, `skills`, `projects`, `stats`, `crypto`, `contact`, `clear`, `matrix`), prompt `CabsCrypto@cyber-sec:~$`, auto-scroll output window, command history (Up/Down arrow keys), tab completion, clear command, and matrix digital rain mode execution.

## Deliverables & Write Ownership
- `js/hero.js`
- `js/terminal.js`

## Interface Contracts & Integration Points
- HTML structures in `index.html` (Hero container `#hero`, Terminal container `#terminal`, input element `#terminal-input`, output window `#terminal-output`, canvas for matrix rain `#matrix-canvas` or dynamic creation).
- CSS styles in `css/style.css` / components for typography, neon glow, typewriter cursor, matrix rain overlay.
- Event listeners for CTA buttons (scrolling to terminal or section).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M2 | Hero Section & Interactive CLI Terminal | `js/hero.js`, `js/terminal.js` | M1 (Foundation) | IN_PROGRESS |
