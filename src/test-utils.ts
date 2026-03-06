/**
 * Test utilities. jsdom does not implement canvas getContext('2d').
 * Use createMockCanvasContext() for tests that need a canvas context.
 */
export function createMockCanvasContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '',
    fillRect: () => {},
    drawImage: () => {},
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    fillText: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    fill: () => {},
    strokeStyle: '',
    lineWidth: 0,
    strokeRect: () => {},
    // Add other CanvasRenderingContext2D props as needed
  } as unknown as CanvasRenderingContext2D;
}
