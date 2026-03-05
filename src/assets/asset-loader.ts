const cache = new Map<string, HTMLImageElement>();

/** Clear image cache. Used by tests. */
export function clearImageCache(): void {
  cache.clear();
}

export function loadImage(path: string): Promise<HTMLImageElement> {
  const cached = cache.get(path);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      cache.set(path, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    img.src = path;
  });
}

export function getImage(path: string): HTMLImageElement | undefined {
  return cache.get(path);
}

export async function loadImages(paths: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(paths.map(loadImage));
}
