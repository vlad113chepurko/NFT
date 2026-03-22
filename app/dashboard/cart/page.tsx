"use client";
import { useRouter } from "next/navigation";
import styles from "./cart.module.css";
import { useCartStore } from "@/zustand/use-cart-store";

export default function Cart() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const totalItems = useCartStore((s) => s.totalItems());

  const totalSol = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const goCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Cart</h1>
        <div className={styles.cartSubtitle}>
          <p>
            You have <b>{totalItems}</b> item(s) in your cart.
          </p>
          <p>
            Total SOL to pay: <b>{totalSol.toFixed(4)}</b> SOL
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 w-full h-full text-center">
          <p className={styles.cartSubtitle}>
            Cart is empty. Go to Shop and add items.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.cardsGrid}>
            {items.map((p) => (
              <article key={p.id} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <img
                    className={styles.cardImage}
                    src={p.image_url}
                    alt={p.name}
                  />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h2 className={styles.cardTitle}>{p.name}</h2>
                    <div className={styles.price}>
                      <p className={styles.priceValue}>
                        {p.price} <span className={styles.priceUnit}>SOL</span>
                      </p>
                    </div>
                  </div>

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
