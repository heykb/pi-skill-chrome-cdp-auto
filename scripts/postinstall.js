#!/usr/bin/env node
// postinstall: expose the CLI as `cdp` on PATH via a symlink in ~/.pi/agent/bin.
// Idempotent and best-effort: any failure degrades silently — the skill still
// works by invoking skills/chrome-cdp/scripts/cdp.mjs directly.
import { symlinkSync, mkdirSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const src = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'chrome-cdp', 'scripts', 'cdp.mjs');
try {
	const bin = resolve(homedir(), '.pi', 'agent', 'bin');
	mkdirSync(bin, { recursive: true });
	const dest = resolve(bin, 'cdp');
	try { unlinkSync(dest); } catch {}
	symlinkSync(src, dest);
	console.log(`[pi-skill-chrome-cdp-auto] created \`cdp\` command: ${dest} -> ${src}`);
} catch (err) {
	console.warn(`[pi-skill-chrome-cdp-auto] skipped cdp symlink: ${err.message}`);
}
