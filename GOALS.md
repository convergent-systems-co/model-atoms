# model-atoms — Goals

> AI model definitions canonicalized — Claude, GPT, Llama, Gemini, Mistral variants with capabilities, context windows, pricing tiers, deprecation policy, tool-use shape, vision support, modality. One typed source-of-truth for what a model is, what it can do, and when it goes away.

*This document is derived from `aish/ARCHITECTURE.md` (now `xdao/xdao/ARCHITECTURE.md` §The *-Atoms Catalogs). Sections marked **Generated** are pattern-based and are intended as a starting point for revision, not as decided plan.*

---

## What this catalog makes civilization-grade

Every AI runtime maintains a table of "what model can do what" — context window, tool-use shape, supports JSON mode, supports vision, prompt-caching available, current pricing. The same matrix gets rebuilt in every codebase that touches a model. Vendor changes (a new variant, a deprecation, a price drop) ripple through every consumer because the data lives in code, not in a shared catalog.

By cataloging the primitives, `model-atoms` turns this domain from opaque-and-ephemeral to typed, versioned, composable, machine-readable, and open — the civilization-grade properties the ecosystem requires.

## What it catalogs

### Atom types

- **`model-card`** — A specific model variant: vendor + family + version + reference id (e.g., `claude-opus-4-7`, `gpt-4o-2024-11-20`, `llama-3.1-70b-instruct`). Anchor identity.
- **`capability`** — A discrete capability the model supports: `tool-use`, `parallel-tool-use`, `vision`, `extended-thinking`, `prompt-caching`, `json-mode`, `streaming`, `structured-output`, `prompt-caching-1m`.
- **`pricing-tier`** — Input / output / cache-hit / cache-write rates with currency and effective date. Track over time as vendors adjust.
- **`deprecation-policy`** — End-of-life shape: announced date, replacement model, hard stop date, minimum notice window the vendor commits to.
- **`tool-use-shape`** — Vendor's tool-use API contract: native function-calling vs XML-tagged tools vs JSON tool blocks; parallel vs serial; streaming during tool use.
- **`modality`** — Input/output modality: text, image, audio, video, structured-output.

### Compositions: `models`

A model composition assembles model-card + capabilities + pricing-tier + deprecation-policy + tool-use-shape + modalities into a complete description of a callable model. Each is versioned; downstream code pins to a composition rather than scattering capability checks.

### Rule types

- **`model-compatibility`** — Which atoms a given model supports (e.g., `gpt-4o` supports `parallel-tool-use`; `llama-3.1` does not).
- **`capability-grant`** — How a capability is gated (request flag, beta header, account tier, region restriction).
- **`deprecation-window`** — Time between deprecation announcement and hard stop (e.g., Anthropic 6 months minimum, OpenAI varies).

## Runtime consumers

- **aish** — Model selection per command. `aish summarize --model claude-opus` resolves the latest non-deprecated `claude-opus-*` model-card and dispatches via the appropriate `tool-use-shape`.
- **olympus** — Routing decisions in Hermes. Pantheon Modules declare required capabilities; Hermes resolves to the cheapest model that satisfies them.

## Status & priority

**Current status:** `proposed`

**Priority tier:** Tier 3 — Build when supporting runtimes mature

**Trigger / activation condition:** First aish / olympus integration that needs to route across more than two model families.

## Roadmap *(Generated — milestone shapes mirror aish's roadmap pattern; revise as actual work begins)*

### v0.1 — Bootstrap & spec acceptance

**Goal:** Schema accepted. Model-cards for current Claude, GPT, Llama, Gemini families. Capability matrix for at least tool-use, vision, prompt-caching.

**Success criterion:** aish can route a request to the cheapest model that satisfies a declared capability set, using only model-atoms data.

**Kill criterion:** Vendor model APIs diverge so fast that the catalog can't stay current without per-vendor automation — pivot to vendor-supplied feeds.

**Work:**

- [ ] XAIP: model composition schema with capability + pricing tracking over time
- [ ] Define 6 atom type schemas
- [ ] Seed atoms: ~10 model-cards (Claude Opus 4.7, Sonnet 4.6, Haiku 4.5; GPT-4o; Gemini 2.5 Pro; Llama 3.1 70B; Mistral Large) + ~10 capabilities + ~6 tool-use-shapes
- [ ] aish model selection integration

### v0.2 — Adoption & expansion

**Goal:** Pricing-tier history. Deprecation-window enforcement. Olympus Hermes routing pulls.

**Work:**

- [ ] Pricing-tier change tracking (effective_from / effective_to)
- [ ] Deprecation-window rule enforcement (warn when consumers pin a deprecated model)
- [ ] Olympus Hermes integration

### v1.0 — Operational

**Goal:** Default model vocabulary across the AI ecosystem. Vendor announcement → catalog update → consumer behavior change, all without rebuilding routing logic.

## Concrete atom example *(Generated — illustrative, not seed content)*

```yaml
models/claude-opus-4-7/definition.yml
---
id: claude-opus-4-7
type: composition
version: 1.0.0
model_card: { ref: atoms/model-card/claude-opus-4-7 }
capabilities:
  - { ref: atoms/capability/tool-use }
  - { ref: atoms/capability/parallel-tool-use }
  - { ref: atoms/capability/vision }
  - { ref: atoms/capability/extended-thinking }
  - { ref: atoms/capability/prompt-caching-1m }
pricing:  { ref: atoms/pricing-tier/claude-opus-4-7-may-2026 }
tool_use: { ref: atoms/tool-use-shape/anthropic-native-tools }
modalities:
  - { ref: atoms/modality/text }
  - { ref: atoms/modality/image }
deprecation: { ref: atoms/deprecation-policy/anthropic-default-6mo }
```

## Adoption strategy *(Generated)*

aish + olympus pull first. Wider adoption follows once the catalog tracks vendor changes faster than each consumer can update its own internal matrix. Vendors themselves may eventually publish their own model-atoms feeds.

## Civilization-grade property checklist

Every catalog must satisfy these before v1.0. Failing any blocks a release.

| Property | Mechanism in this catalog |
|---|---|
| Typed | JSON Schema in `schemas/` validates every atom, composition, rule |
| Versioned | Every atom has a semver `version` field; compositions reference atoms by version-pinned ID |
| Machine-readable | `exports/catalog.json` published on every release |
| Composable | Compositions reference atoms by ID; CI verifies references resolve and no circular dependencies |
| Open | Apache-2.0 licensed; LICENSE file present |
| Durable | No external dependencies for primary content (no remote image URLs, no vendor APIs in the hot path) |

## Related

- **Spec:** [atoms-spec](https://github.com/convergent-systems-co/atoms-spec) — the canonical structure every catalog conforms to
- **Tools:** [atoms-tools](https://github.com/convergent-systems-co/atoms-tools) — CLI for validate / export / bootstrap / resolve
- **Federation:** [xdao](https://github.com/convergent-systems-co/xdao) — ecosystem directory and discovery
- **Umbrella:** [atoms](https://github.com/convergent-systems-co/atoms) — every catalog as a git submodule
- **Manifest:** [`ATOMS.yml`](./ATOMS.yml) — this catalog's machine-readable manifest
- **Standard:** [`README.md`](./README.md) — catalog overview and contribution flow
