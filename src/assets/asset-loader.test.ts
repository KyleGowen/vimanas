import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadImage, getImage, loadImages, clearImageCache } from './asset-loader';

type MockImageInstance = { src: string; onload: (() => void) | null; onerror: (() => void) | null };

describe('asset-loader', () => {
  let instances: MockImageInstance[] = [];

  beforeEach(() => {
    clearImageCache();
    instances = [];
    vi.stubGlobal(
      'Image',
      class MockImage {
        src = '';
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor() {
          instances.push(this as unknown as MockImageInstance);
        }
      }
    );
  });

  it('loadImage resolves when onload fires', async () => {
    const p = loadImage('/test.png');
    instances[0]!.onload!();
    const img = await p;
    expect(img).toBeDefined();
    expect(img.src).toBe('/test.png');
  });

  it('loadImage caches and returns same image for same path', async () => {
    const p1 = loadImage('/cached.png');
    instances[0]!.onload!();
    const a = await p1;
    const b = await loadImage('/cached.png');
    expect(a).toBe(b);
  });

  it('getImage returns cached image after load', async () => {
    const p = loadImage('/cached.png');
    instances[0]!.onload!();
    await p;
    const cached = getImage('/cached.png');
    expect(cached).toBeDefined();
  });

  it('getImage returns undefined for uncached path', () => {
    expect(getImage('/nonexistent.png')).toBeUndefined();
  });

  it('loadImages loads multiple images', async () => {
    const p = loadImages(['/a.png', '/b.png']);
    instances[0]!.onload!();
    instances[1]!.onload!();
    const imgs = await p;
    expect(imgs).toHaveLength(2);
  });
});
