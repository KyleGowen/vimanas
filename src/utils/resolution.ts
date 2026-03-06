const COMMON_16_9: [number, number][] = [
  [640, 360],
  [854, 480],
  [960, 540],
  [1024, 576],
  [1280, 720],
  [1600, 900],
  [1920, 1080],
  [2560, 1440],
  [3840, 2160],
];

export function pickLargest16x9InViewport(): [number, number] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  let best = COMMON_16_9[0];
  for (const [cw, ch] of COMMON_16_9) {
    if (cw <= w && ch <= h) best = [cw, ch];
  }
  return best;
}
