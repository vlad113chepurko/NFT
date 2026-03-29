"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NFT } from "@/types/nft.types";

export type CartItem = NFT & {
  qty: number;
};

type CartState = {
  items: CartItem[];

  addItem: (item: NFT, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;

  totalItems: () => number;
  totalSol: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, qty }],
          };
        });
      },

      removeItem: (id: number) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      setQty: (id: number, qty: number) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalSol: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: "cart-storage",
      version: 1,
    },
  ),
);
