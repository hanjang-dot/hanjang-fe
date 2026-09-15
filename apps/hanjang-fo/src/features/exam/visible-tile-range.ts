export interface TileRange {
  start: number;
  end: number;
}

export const visibleTileRange = (
  scrollY: number,
  viewportHeight: number,
  tileHeight: number,
  tileCount: number,
): TileRange => {
  if (tileHeight <= 0 || tileCount <= 0) return { start: 0, end: 0 };
  const start = Math.min(
    tileCount,
    Math.max(0, Math.floor(scrollY / tileHeight)),
  );
  const end = Math.min(
    tileCount,
    Math.ceil((scrollY + viewportHeight) / tileHeight),
  );
  return { start, end: Math.max(start, end) };
};

export const tileCountFor = (imageHeight: number, tileHeight: number): number =>
  Math.max(0, Math.ceil(imageHeight / tileHeight));
