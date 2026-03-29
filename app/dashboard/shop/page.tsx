"use client";

import NFTModal from "@/components/modals/nft-modal";
import { useNftModal } from "@/zustand/use-nft-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/zustand/use-cart-store";
import { useGetNfts } from "@/hooks/nfts/use-get-nfts";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import type { NFT } from "@/types/nft.types";

import styles from "./shop.module.css";
import { Spinner } from "@/components/ui/spinner";

const SKELETON_COUNT = 8;

export default function Shop() {
  const { isOpen, openModal } = useNftModal();
  const [selected, setSelected] = useState<NFT | null>(null);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const { data = [], isLoading, error } = useGetNfts();
  const hydrated = useHasHydrated();

  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) => s.totalItems());

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.page}>
      <AnimatePresence>
        {isOpen && <NFTModal addItem={addItem} data={selected as NFT} />}
      </AnimatePresence>

      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>NFT Shop</h1>
          <p className={styles.subtitle}>Items priced in SOL</p>
        </div>

        <p className={styles.subtitle}>In cart: {hydrated ? totalItems : 0}</p>
      </div>

      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[200px] h-[260px] rounded-[14px]"
              />
            ))
          : data.map((item) => {
              const isImgLoaded = !!loaded[item.id];

              return (
                <article key={item.id} className={styles.card}>
                  <div className={styles.image}>
                    {!isImgLoaded && (
                      <div className={styles.loaderWrap}>
                        <Spinner className="size-8" />
                      </div>
                    )}

                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className={styles.cardImage}
                      onLoad={() =>
                        setLoaded((p) => ({ ...p, [item.id]: true }))
                      }
                      style={{ opacity: isImgLoaded ? 1 : 0 }}
                    />
                  </div>

                  <div className={styles.body}>
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.price}>{item.price} SOL</div>

                    <div className={styles.ctaWrap}>
                      <motion.button
                        className={styles.cta}
                        onClick={() => {
                          setSelected(item);
                          openModal();
                        }}
                      >
                        Buy
                      </motion.button>
                    </div>
                  </div>
                </article>
              );
            })}
      </div>
    </div>
  );
}
