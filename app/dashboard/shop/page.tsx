"use client";

import styles from "../cart/cart.module.css";
import { useCartStore } from "@/zustand/use-cart-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

const shopItems = [
  {
    id: "shop-001",
    title: "Eternal Genesis",
    subtitle: "Founder Edition",
    priceEternal: 1250,
    image: "https://picsum.photos/seed/eternal-genesis/640/420",
    rarity: "Legendary",
    stock: 12,
  },
  {
    id: "shop-002",
    title: "Void Runner",
    subtitle: "Cyber Drift",
    priceEternal: 420,
    image: "https://picsum.photos/seed/void-runner/640/420",
    rarity: "Epic",
    stock: 48,
  },
  {
    id: "shop-003",
    title: "Crystal Bloom",
    subtitle: "Nature Protocol",
    priceEternal: 95,
    image: "https://picsum.photos/seed/crystal-bloom/640/420",
    rarity: "Rare",
    stock: 203,
  },
] as const;

export default function Shop() {
  const hydrated = useHasHydrated();

  const addItem = useCartStore((s) => s.addItem);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <div className={styles.dashboard}>
      <div className={styles.cartHeader}>
        <div>
          <h1 className={styles.cartTitle}>Shop</h1>
          <p className={styles.cartSubtitle}>NFT items • prices in Eternal</p>
        </div>

        <p className={styles.cartSubtitle}>
          In cart: {hydrated ? totalItems : 0}
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {shopItems.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardImageWrap}>
              <img className={styles.cardImage} src={p.image} alt={p.title} />
              <span className={styles.badge}>{p.rarity}</span>
              <span className={styles.stockPill}>{p.stock} left</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardTop}>
                <h2 className={styles.cardTitle}>{p.title}</h2>

                <div className={styles.price}>
                  <span className={styles.priceValue}>{p.priceEternal}</span>
                  <span className={styles.priceUnit}>ETERNAL</span>
                </div>
              </div>

              <p className={styles.cardSubtitle}>{p.subtitle}</p>

              <div className={styles.cardActions}>
                <button
                  className={styles.secondaryBtn}
                  type="button"
                  onClick={() =>
                    addItem({
                      id: p.id,
                      title: p.title,
                      subtitle: p.subtitle,
                      priceEternal: p.priceEternal,
                      image: p.image,
                      rarity: p.rarity,
                    })
                  }
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
