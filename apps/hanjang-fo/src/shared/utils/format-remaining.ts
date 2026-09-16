export const formatRemaining = (ms: number): string => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const formatRelativeDay = (timestamp: number): string => {
  const days = Math.floor((Date.now() - timestamp) / DAY_MS);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  return `${days}일 전`;
};
