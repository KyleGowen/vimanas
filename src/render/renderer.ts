export function clear(ctx: CanvasRenderingContext2D, width: number, height: number, color = '#0a0a0f'): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function drawImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w?: number,
  h?: number
): void {
  if (w !== undefined && h !== undefined) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.drawImage(img, x, y);
  }
}

/**
 * Draw image scaled to fit within target rect, preserving aspect ratio.
 * Centers the image and pads with empty space when the image is not square.
 */
export function drawImageFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  targetW: number,
  targetH: number
): void {
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  if (!srcW || !srcH) {
    ctx.drawImage(img, x, y, targetW, targetH);
    return;
  }
  const scale = Math.min(targetW / srcW, targetH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const padX = (targetW - drawW) / 2;
  const padY = (targetH - drawH) / 2;
  ctx.drawImage(img, x + padX, y + padY, drawW, drawH);
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: { font?: string; color?: string; align?: CanvasTextAlign; baseline?: CanvasTextBaseline } = {}
): void {
  ctx.font = options.font ?? '24px sans-serif';
  ctx.fillStyle = options.color ?? '#ffffff';
  ctx.textAlign = options.align ?? 'left';
  ctx.textBaseline = options.baseline ?? 'alphabetic';
  ctx.fillText(text, x, y);
}
