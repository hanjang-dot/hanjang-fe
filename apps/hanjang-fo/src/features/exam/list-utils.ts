export const MAX_EMPTY_PAGE_STREAK = 5;

export interface PagedResult<T> {
  items: T[];
  freshCounts: number[];
}

export const dedupePages = <T extends { examId: string }>(
  pages: T[][],
): PagedResult<T> => {
  const seen = new Set<string>();
  const items: T[] = [];
  const freshCounts: number[] = [];
  for (const page of pages) {
    let fresh = 0;
    for (const item of page) {
      if (seen.has(item.examId)) continue;
      seen.add(item.examId);
      items.push(item);
      fresh += 1;
    }
    freshCounts.push(fresh);
  }
  return { items, freshCounts };
};

export const trailingEmptyPages = (freshCounts: number[]): number => {
  let streak = 0;
  for (let index = freshCounts.length - 1; index >= 0; index -= 1) {
    if (freshCounts[index] !== 0) break;
    streak += 1;
  }
  return streak;
};

export const canFetchNext = (
  hasNextPage: boolean,
  freshCounts: number[],
): boolean =>
  hasNextPage && trailingEmptyPages(freshCounts) < MAX_EMPTY_PAGE_STREAK;
