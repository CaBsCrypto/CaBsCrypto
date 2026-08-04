<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./banner-light.svg">
    <img alt="0xCaBs — Building the authority layer for AI agents that act in the real world" src="./banner-dark.svg" width="100%">
  </picture>
</p>

<p align="center">
  <a href="https://cabscrypto.github.io" target="_blank">
    <img alt="Interactive Web Portfolio" src="https://img.shields.io/badge/⚡_LIVE_INTERACTIVE_PORTFOLIO-00f3ff?style=for-the-badge&labelColor=08090f&logo=terminal&logoColor=00f3ff">
  </a>
</p>

<p align="center">
  <a href="https://cabscrypto.github.io" target="_blank"><img alt="Portfolio Website" src="https://img.shields.io/badge/🌐_Website-cabscrypto.github.io-00ff66?style=for-the-badge&labelColor=0d1117"></a>
  <a href="https://agente-asistente.vercel.app"><img alt="Carmelita" src="https://img.shields.io/badge/Carmelita-live-3fb950?style=for-the-badge&labelColor=0d1117"></a>
  <a href="https://trustleaf-demo.vercel.app/verify/license/1"><img alt="TrustLeaf" src="https://img.shields.io/badge/TrustLeaf-live-2f81f7?style=for-the-badge&labelColor=0d1117"></a>
  <a href="https://slashslice.spicycrust.com"><img alt="Slash Slice Arena" src="https://img.shields.io/badge/Slash%20Slice-play-a371f7?style=for-the-badge&labelColor=0d1117"></a>
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white">
  <img alt="LangGraph" src="https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square&logo=langchain&logoColor=white">
  <img alt="MCP" src="https://img.shields.io/badge/MCP-D97757?style=flat-square&logo=anthropic&logoColor=white">
  <img alt="Stellar" src="https://img.shields.io/badge/Stellar-7D00FF?style=flat-square&logo=stellar&logoColor=white">
  <img alt="Postgres" src="https://img.shields.io/badge/Postgres-4169E1?style=flat-square&logo=postgresql&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white">
</p>

---

An agent that *recommends* is easy. An agent that **books**, **pays**, and can prove it happened **exactly once** — that's the hard part. That's what I build.

Solo founder · Santiago, Chile 🇨🇱

---

## 🤖 Carmelita &nbsp;·&nbsp; [`agente-asistente`](https://github.com/CaBsCrypto/agente-asistente)

> **AI agent that books and pays for you, with limits.**

Every sensitive action runs one lifecycle:

```
freeze intent (SHA-256) → evaluate policy → exact approval → execute once → evidence
```

|  | Proof |
| :--: | :-- |
| 🏢 | Books and cancels a **real day-pass at a physical coworking hub** — confirmed on the operator's own member portal with a scannable QR pass |
| 💸 | **Replay-safe payments** — a retry returns the original receipt, zero second debit |
| ⛓️ | **On-chain deposits** verifiable by transaction hash |
| 🔒 | Execute-once enforced by the **database**, not by application logic |
| 🧠 | The LLM runs **plan-only** — it proposes from a fixed set of intents, it never executes |

**[→ Try it live](https://agente-asistente.vercel.app)**

---

## 🌿 TrustLeaf &nbsp;·&nbsp; [`ficha-onchain`](https://github.com/CaBsCrypto/ficha-onchain)

> **Patient-owned medical records. Portable, verifiable, consent-gated.**

A doctor cannot write to the record until the patient signs consent on-chain — **consent as a transaction, not a promise.**

Hash-on-chain, data off-chain: the chain holds only SHA-256 digests and signatures, while the content stays encrypted and deletable.

> *The content is erasable. The proof that nobody altered it is not.*

|  | Proof |
| :--: | :-- |
| 📜 | **4 contracts** live on testnet |
| 🔓 | Verification with **no login at all** |
| 🔌 | An **MCP endpoint**, so an AI health agent can anchor a record with permission |

**[→ Verify a licence](https://trustleaf-demo.vercel.app/verify/license/1)** &nbsp;·&nbsp; [MCP endpoint](https://trustleaf-demo.vercel.app/api/mcp)

---

## 🍕 Slash Slice Arena &nbsp;·&nbsp; [`pizzaninja`](https://github.com/CaBsCrypto/pizzaninja)

> **Slice pizzas with your hands.** 60 FPS hand tracking in the browser, on-chain scores.

MediaPipe edge AI for gesture control, Privy for zero-friction auth, Soroban for the scoreboard. Built because not everything has to be infrastructure.

**[→ Play](https://slashslice.spicycrust.com)**

---

<details>
<summary><b>🛠️ Also in the workshop</b></summary>

<br>

| Project | What it is |
| :-- | :-- |
| [`stellar-agent-spend-hub`](https://github.com/CaBsCrypto/stellar-agent-spend-hub) | Privacy-first agentic payments on Stellar for MCP/API and digital-service spend |
| [`stellar-agent-merchant-lab`](https://github.com/CaBsCrypto/stellar-agent-merchant-lab) | Independent Stellar testnet merchant for validating MCP and MPP agent purchases |
| [`BrownsStudio`](https://github.com/CaBsCrypto/BrownsStudio) | AI and automation ecosystem — SEO landings, control panel, WhatsApp automation |
| [`biblioteca-de-prompts`](https://github.com/CaBsCrypto/biblioteca-de-prompts) | Full-stack prompt library — folders, tags, remixes, public community |

</details>

---

<p align="center">
  <img alt="Activity graph" src="https://github-readme-activity-graph.vercel.app/graph?username=CaBsCrypto&bg_color=00000000&color=8b949e&line=3fb950&point=2f81f7&area_color=2f81f7&area=true&hide_border=true&custom_title=Contribution%20activity" width="100%">
</p>

<p align="center">
  <img alt="Snake eating my contributions" src="https://raw.githubusercontent.com/CaBsCrypto/CaBsCrypto/output/snake-dark.svg" width="100%">
</p>

---

### What I work on

**Agent-to-business execution** · MCP surfaces, inbound and outbound · Non-custodial wallets and machine payments · And the unglamorous half that actually matters — **idempotency, policy, approval, evidence**

<sub>Since 2021 across Latin America: content for Stellar and Tellus Cooperative, business development and IRL events for Base, IRL events for Avalanche, and content for Immutable today.</sub>

<sub>⚠️ <b>Honest status:</b> the payment and on-chain proofs above run on <b>Stellar Testnet</b>. No mainnet payments, no paying customers yet.</sub>
