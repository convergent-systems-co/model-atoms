# model-atoms

> AI model definitions canonicalized — Claude, GPT, Llama, Gemini, Mistral variants with capabilities, context windows, pricing tiers, deprecation policy, tool-use shape, vision support, modality. One typed source-of-truth for what a model is, what it can do, and when it goes away.

`model-atoms` is a `*-Atoms` catalog in the [Convergent Systems](https://xdao.co) ecosystem. It defines what exists in its domain — typed, versioned, machine-readable, composable, and open — so runtimes (and humans) can stand on shared infrastructure instead of reinventing it.

## Structure

```
model-atoms/
├── ATOMS.yml              # Catalog manifest
├── atoms/                 # Reusable building blocks
├── models/                # Compositions assembled from atoms
├── rules/                 # Typed constraint vocabulary
├── schemas/               # Catalog-specific JSON Schemas
├── exports/               # CI-generated machine-readable exports
└── docs/                  # Human-readable documentation
```

### Atom types

- `model-card` — A specific model variant (claude-opus-4-7, gpt-4o, llama-3.1-70b-instruct) with vendor, family, and reference identifiers.
- `capability` — Discrete capability (tool-use, vision, function-calling, json-mode, streaming, prompt-caching, extended-thinking).
- `pricing-tier` — Input / output / cache-hit / cache-write rates with currency and effective date.
- `deprecation-policy` — End-of-life shape (announced date, replacement model, hard stop date).
- `tool-use-shape` — Vendor's tool-use API shape (parallel function calls, XML tool tags, JSON tool blocks).
- `modality` — Input/output modality (text, image, audio, video, structured-output).

### Rule types

- `model-compatibility` — Which atoms a model supports (e.g., gpt-4o supports parallel tool calls; llama 3.1 does not).
- `capability-grant` — How a capability is enabled (request flag, API version, account tier).
- `deprecation-window` — Time between announcement and hard stop (e.g., Anthropic: 6 months minimum).

### Runtime consumers

`aish`, `olympus`

## How to consume

Machine-readable exports are published in [`exports/`](./exports/) on every release:

- `exports/catalog.json` — full catalog dump (every atom, composition, rule)

Exports are deterministic, signed, and versioned. See [`ATOMS.yml`](./ATOMS.yml) for the manifest and the conformance spec.

## How to contribute

1. Read [`ATOMS.yml`](./ATOMS.yml) to understand the catalog's atom types, compositions, and rules.
2. Add a new atom under `atoms/<type>/` or a composition under `models/<name>/`.
3. Open a PR. CI validates the schema, references, and exports.
4. Larger structural changes go through the [XAIP process](https://github.com/convergent-systems-co/xaips).

## Ecosystem

- **Federation:** [xdao.co](https://xdao.co) · [github.com/convergent-systems-co/xdao](https://github.com/convergent-systems-co/xdao)
- **Spec:** [github.com/convergent-systems-co/atoms-spec](https://github.com/convergent-systems-co/atoms-spec)
- **Tools:** [github.com/convergent-systems-co/atoms-tools](https://github.com/convergent-systems-co/atoms-tools)
- **Umbrella:** [github.com/convergent-systems-co/atoms](https://github.com/convergent-systems-co/atoms) — all catalogs as submodules

## License

Apache-2.0 — see [`LICENSE`](./LICENSE).
