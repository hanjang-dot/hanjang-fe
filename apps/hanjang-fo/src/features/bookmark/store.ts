import { create } from "zustand";

interface BookmarkState {
  examIds: string[];
  toggle: (examId: string) => void;
}

export const useBookmarkStore = create<BookmarkState>((set) => ({
  examIds: [],
  toggle: (examId) =>
    set((state) => ({
      examIds: state.examIds.includes(examId)
        ? state.examIds.filter((id) => id !== examId)
        : [...state.examIds, examId],
    })),
}));
