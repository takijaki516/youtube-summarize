import { create } from "zustand";

type YouTubeStore = {
  startTime: number;
  currentTime: number;
  setStartTime: (time: number) => void;
  setCurrentTime: (time: number) => void;
};

export const useYouTubeStore = create<YouTubeStore>((set) => ({
  startTime: 0,
  currentTime: 0,
  setStartTime: (time) => set({ startTime: time }),
  setCurrentTime: (time) => set({ currentTime: time }),
}));
