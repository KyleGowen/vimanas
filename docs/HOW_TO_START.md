# How to Start Vimanas

## Prerequisites

- Node.js 18+
- npm or pnpm

## Steps

### 1. Install dependencies

```bash
npm install
```

### 2. Run the game (development)

```bash
npm run dev
```

Vite starts a dev server. Open the URL shown (typically `http://localhost:5173`) in your browser.

### 3. What works now

- **Boot (title screen):** Approved title mock; Enter or click anywhere → Gameplay
- **Gameplay:** Sparrow ship; WASD movement; Space to fire

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server.

## Troubleshooting

### Blank screen

1. Check the browser console (F12 → Console) for errors
2. Ensure `public/images/` contains required sprites
3. Verify `index.html` loads `src/main.ts` correctly

### Input not working

1. Click the canvas to focus it (browser may require user interaction)
2. Check that InputService is initialized before game loop starts

### CORS or asset loading errors

Assets in `public/` are served at root. Use paths like `/images/ships/sparrow/sparrow_facing_n.png` (no `public/` in path).
