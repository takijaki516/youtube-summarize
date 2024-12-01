import { create } from "zustand";

type YouTubeStore = {
  startTime: number;
  setStartTime: (time: number) => void;
};

export const useYouTubeStore = create<YouTubeStore>((set) => ({
  startTime: 0,
  setStartTime: (time) => set({ startTime: time }),
}));
