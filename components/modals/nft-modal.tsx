"use client";
import { motion } from "motion/react";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import styles from "./nft-modal.module.css";
import { useNftModal } from "@/zustand/use-nft-modal";
import { createPortal } from "react-dom";
import type { NFT } from "@/types/nft.types";
import { vectors } from "@/vectors";

interface NFTModalProps {
  data: NFT;
  addItem: (item: any) => void;
}

export default function NFTModal({ data, addItem }: NFTModalProps) {
  const { closeModal } = useNftModal();

  function ConvertSolToDolar(sol: number): string {
    const solPriceInDollars = 20;
    const dollars = sol * solPriceInDollars;
    return dollars.toFixed(2);
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={styles.container}
      >
        {data ? (
          <>
            <div className={styles.head}>
              <button
                className={styles.close}
                onClick={() => closeModal()}
                type="button"
              >
                <vectors.Close />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.imageContainer}>
                {data ? (
                  <Image
                    src={data.image_url}
                    alt={data.name}
                    width={600}
                    height={600}
                    className={styles.nftImage}
                  />
                ) : (
                  <Skeleton className={styles.nftImage} />
                )}
              </div>
              <div className={styles.content}>
                <h2 className={styles.nftName}>{data.name}</h2>
                <h3>Author - Sensei</h3>
                <div className={styles.priceContainer}>
                  <p className={styles.nftPrice}>
                    {data.price} <span className="text-2xl">SOL</span>
                  </p>
                  <p className={styles.priceDollar}>
                    {ConvertSolToDolar(data.price)} $
                  </p>
                  <div>
                    <h3 className={styles.traits}>Traits</h3>
                    <ul className={styles.traitsList}>
                      {Object.entries(data.traits).map(([key, value]) => (
                        <li key={key} className={styles.traitItem}>
                          <span className={styles.traitKey}>{key}:</span>{" "}
                          {value || "None"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className={styles.cta}
                    onClick={() => {
                      addItem(data);
                      closeModal();
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 flex flex-col items-center gap-2">
            <Spinner className="size-8" />
            <p>NFT Loading...</p>
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root") as HTMLElement,
  );
}
