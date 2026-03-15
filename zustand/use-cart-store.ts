"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ShopItem = {
  id: string;
  title: string;
  subtitle: string;
  priceEternal: number;
  image: string;
  rarity: string;
};

export type CartItem = ShopItem & {
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: ShopItem, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalEternal: () => number;
  totalItems: () => number;
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
          return { items: [...state.items, { ...item, qty }] };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),

      clear: () => set({ items: [] }),

      totalEternal: () =>
        get().items.reduce((sum, i) => sum + i.priceEternal * i.qty, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: "cart-storage",
      version: 1,
    },
  ),
);
