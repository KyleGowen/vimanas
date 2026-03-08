/**
 * Test utilities. jsdom does not implement canvas getContext('2d').
 * Use createMockCanvasContext() for tests that need a canvas context.
 */
export function createMockCanvasContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '',
    globalAlpha: 1,
    fillRect: () => {},
    drawImage: () => {},
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    fillText: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
    createRadialGradient: () => ({
      addColorStop: () => {},
    }),
    save: () => {},
    restore: () => {},
    clip: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    stroke: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
    fill: () => {},
    strokeStyle: '',
    lineWidth: 0,
    strokeRect: () => {},
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    // Add other CanvasRenderingContext2D props as needed
  } as unknown as CanvasRenderingContext2D;
}
