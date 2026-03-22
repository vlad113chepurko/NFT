"use client";
import NFTModal from "@/components/modals/nft-modal";
import { useNftModal } from "@/zustand/use-nft-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/zustand/use-cart-store";
import { useGetNfts } from "@/hooks/nfts/use-get-nfts";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import type { NFT } from "@/types/nft.types";
import shopStyles from "./shop.module.css";
import styles from "../cart/cart.module.css";

const SKELETON_COUNT = 8;

export default function Shop() {
  const { isOpen, openModal } = useNftModal();
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);

  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const { data = [], isLoading, error } = useGetNfts();
  const hydrated = useHasHydrated();

  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) => s.totalItems());

  useMemo(() => {
    const ids = new Set(data.map((x) => x.id));
    setLoaded((prev) => {
      const next: Record<number, boolean> = {};
      for (const k of Object.keys(prev)) {
        const id = Number(k);
        if (ids.has(id)) next[id] = prev[id];
      }
      return next;
    });
  }, [data.length]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.dashboard}>
      <AnimatePresence mode="wait">
        {isOpen && <NFTModal addItem={addItem} data={selectedNft as NFT} />}
      </AnimatePresence>
      <div className={styles.cartHeader}>
        <div>
          <h1 className={styles.cartTitle}>NFT Shop</h1>
          <p className={styles.cartSubtitle}>NFT items - prices in SOL</p>
        </div>
        <p className={styles.cartSubtitle}>
          In cart: {hydrated ? totalItems : 0}
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Skeleton
                key={i}
                className="rounded-[16px] w-[200px] h-[260px] skeleton"
              />
            ))
          : data.map((p) => {
              const isHover = hoverId === p.id;
              const isImgLoaded = !!loaded[p.id];

              return (
                <article
                  key={p.id}
                  onMouseEnter={() => setHoverId(p.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={shopStyles.card}
                >
                  <div className={shopStyles.image}>
                    {!isImgLoaded && (
                      <Skeleton
                        className={`${shopStyles.imgSkeleton} skeleton`}
                      />
                    )}

                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className={shopStyles.cardImage}
                      onLoad={() =>
                        setLoaded((prev) => ({ ...prev, [p.id]: true }))
                      }
                      style={{
                        opacity: isImgLoaded ? 1 : 0,
                      }}
                    />
                  </div>

                  <div className={shopStyles.cardHead}>
                    <h2>{p.name}</h2>
                  </div>

                  <div className={shopStyles.price}>
                    <h3>
                      {p.price}{" "}
                      <span className="text-gray-500 text-[16px] font-bold">
                        SOL
                      </span>
                    </h3>
                  </div>

                  <div className={shopStyles.cardBody}>
                    <span>rarity: test</span>

                    <div className={shopStyles.ctaWrap}>
                      <motion.button
                        className={shopStyles.cta}
                        type="button"
                        onClick={() => {
                          setSelectedNft(p);
                          openModal();
                        }}
                        initial={false}
                        animate={{
                          opacity: isHover ? 1 : 0,
                          y: isHover ? 0 : 6,
                        }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        style={{ pointerEvents: isHover ? "auto" : "none" }}
                      >
                        Connect
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
