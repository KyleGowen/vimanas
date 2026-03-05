# Build Verification

**Status:** Active  
**Canon reference:** [tech_architecture.md](../tech_architecture.md)

## Verification Cadence

**After each milestone that touches gameplay or visuals:** Run `npm run build`, serve the `dist/` output, and verify the gate criteria in a browser. Do not mark a milestone complete until the build has been run and confirmed.

**Why:** Some issues (asset paths, production optimizations) only appear in production builds, not in dev server.

## Production Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server:

```bash
npx serve dist
```

Or open `dist/index.html` directly (some features may require a server for correct paths).

## Dev vs Production

- **Dev:** `npm run dev` — Vite HMR; assets from `public/` at root
- **Production:** `npm run build` — Bundled; assets copied to `dist/`; paths remain `/images/...`

## Still true?

- [ ] Review if Vite or build config changes
