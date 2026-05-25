#!/usr/bin/env node
// Generates atoms/<type>/<slug>.yml from a source JSON seed.
// Conforms to atoms-spec/v1: flat YAML files, no versioned directories.
//
// Usage:
//   node scripts/generate-atoms.js [--source <path>] [--dry-run] [--force]
//
// Skips existing files unless --force is passed.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const sourceArg = args.find((a, i) => a === '--source' && args[i + 1])
  ? args[args.indexOf('--source') + 1]
  : null;

const sourcePath = sourceArg
  ? join(ROOT, sourceArg)
  : join(ROOT, 'sources', 'cloudflare-workers-ai.json');

const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

let created = 0;
let skipped = 0;

// Derive slug: @cf/meta/llama-3.1-8b-instruct → cf-meta-llama-3.1-8b-instruct
function toSlug(id) {
  return id.replace(/^@/, '').replace(/\//g, '-');
}

// Minimal YAML serialiser for the simple structure we need.
// Avoids adding a yaml dependency to a zero-dep script.
function yaml(obj, indent = 0) {
  const pad = ' '.repeat(indent);
  return Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        if (v.length === 0) return `${pad}${k}: []`;
        return `${pad}${k}:\n${v.map(i => `${pad}  - ${JSON.stringify(i)}`).join('\n')}`;
      }
      if (typeof v === 'object') {
        return `${pad}${k}:\n${yaml(v, indent + 2)}`;
      }
      if (typeof v === 'string') return `${pad}${k}: ${JSON.stringify(v)}`;
      return `${pad}${k}: ${v}`;
    })
    .join('\n');
}

for (const model of source.models) {
  const slug = toSlug(model.id);
  const dir = join(ROOT, 'atoms', 'model-card');
  const filePath = join(dir, `${slug}.yml`);

  if (!force && existsSync(filePath)) {
    console.log(`  skip  ${slug}.yml`);
    skipped++;
    continue;
  }

  const caps = model.capabilities ?? [];
  const atom = {
    id: slug,
    type: 'model-card',
    version: '1.0.0',
    name: model.title,
    description: model.description,
    vendor: model.vendor,
    provider: 'Cloudflare Workers AI',
    provider_id: model.id,
    family: model.family,
    category: model.category,
    capabilities: caps,
    planned_deprecation: model.planned_deprecation,
    ...(model.context_window != null ? { context_window: model.context_window } : {}),
    ...(model.output_dimensions != null ? { output_dimensions: model.output_dimensions } : {}),
    provenance: {
      source: source.source,
      addedBy: 'convergent-systems-co',
      addedAt: now,
    },
  };

  const content = `# model-atoms/model-card/${slug}\n${yaml(atom)}\n`;

  if (dryRun) {
    console.log(`  dry   ${slug}.yml`);
    created++;
    continue;
  }

  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, content);
  console.log(`  write ${slug}.yml`);
  created++;
}

console.log(`\n${dryRun ? '[dry-run] ' : ''}${created} atoms ${dryRun ? 'would be ' : ''}written, ${skipped} skipped.`);
