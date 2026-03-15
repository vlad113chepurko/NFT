"use client";
import { useRouter } from "next/navigation";
import styles from "./cart.module.css";
import { useCartStore } from "@/zustand/use-cart-store";
import { eternalToSol, ETERNAL_PER_SOL } from "@/lib/pricing/eternal";

export default function Cart() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const totalEternal = useCartStore((s) => s.totalEternal());
  const totalItems = useCartStore((s) => s.totalItems());

  const totalSol = eternalToSol(totalEternal);

  const goCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Cart</h1>
        <p className={styles.cartSubtitle}>
          {totalItems} items • prices in Eternal • test rate: 1 SOL ={" "}
          {ETERNAL_PER_SOL} ETERNAL
        </p>
      </div>

      {items.length === 0 ? (
        <p className={styles.cartSubtitle}>
          Cart is empty. Go to Shop and add items.
        </p>
      ) : (
        <>
          <div className={styles.cardsGrid}>
            {items.map((p) => (
              <article key={p.id} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <img
                    className={styles.cardImage}
                    src={p.image}
                    alt={p.title}
                  />
                  <span className={styles.badge}>{p.rarity}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h2 className={styles.cardTitle}>{p.title}</h2>
                    <div className={styles.price}>
                      <span className={styles.priceValue}>
                        {p.priceEternal}
                      </span>
                      <span className={styles.priceUnit}>ETERNAL</span>
                    </div>
                  </div>

                  <p className={styles.cardSubtitle}>{p.subtitle}</p>

                  <div className={styles.cardActions}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <button
                        className={styles.secondaryBtn}
                        type="button"
                        onClick={() => setQty(p.id, p.qty - 1)}
                      >
                        -
                      </button>

                      <span className={styles.cartSubtitle}>Qty: {p.qty}</span>

                      <button
                        className={styles.secondaryBtn}
                        type="button"
                        onClick={() => setQty(p.id, p.qty + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={styles.secondaryBtn}
                      type="button"
                      onClick={() => removeItem(p.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <p className={styles.cartSubtitle}>
              Total: <b>{totalEternal}</b> ETERNAL ≈{" "}
              <b>{totalSol.toFixed(4)}</b> SOL
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button
                className={styles.secondaryBtn}
                type="button"
                onClick={clear}
              >
                Clear cart
              </button>
              <button
                className={styles.primaryBtn}
                type="button"
                onClick={goCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
