import { useCallback, useState } from "react";

interface ViewTokenLike {
  key?: string | number;
}

export const useVisibleIds = () => {
  const [visibleIds, setVisibleIds] = useState<ReadonlySet<string>>(new Set());
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewTokenLike[] }) => {
      setVisibleIds(
        new Set(
          viewableItems
            .map((token) => token.key)
            .filter((key) => key !== undefined)
            .map(String),
        ),
      );
    },
    [],
  );
  return { visibleIds, onViewableItemsChanged };
};
