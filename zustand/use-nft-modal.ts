import { create } from "zustand";

interface NftModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useNftModal = create<NftModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));