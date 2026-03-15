import styles from "../cart/cart.module.css";

const favoriteNfts = [
  {
    id: "fav-001",
    title: "Eternal Genesis",
    subtitle: "Founder Edition",
    priceEternal: 1250,
    image: "https://picsum.photos/seed/eternal-genesis/640/420",
    rarity: "Legendary",
    savedAt: "2026-03-15",
  },
  {
    id: "fav-002",
    title: "Void Runner",
    subtitle: "Cyber Drift",
    priceEternal: 420,
    image: "https://picsum.photos/seed/void-runner/640/420",
    rarity: "Epic",
    savedAt: "2026-03-15",
  },
  {
    id: "fav-003",
    title: "Crystal Bloom",
    subtitle: "Nature Protocol",
    priceEternal: 95,
    image: "https://picsum.photos/seed/crystal-bloom/640/420",
    rarity: "Rare",
    savedAt: "2026-03-15",
  },
] as const;

export default function Favorites() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Favorites</h1>
        <p className={styles.cartSubtitle}>
          Saved NFT items • prices in Eternal
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {favoriteNfts.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardImageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.cardImage} src={p.image} alt={p.title} />
              <span className={styles.badge}>{p.rarity}</span>

              <span
                className={styles.savedPill}
                title={`Saved at ${p.savedAt}`}
              >
                Saved
              </span>
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
                <button className={styles.primaryBtn} type="button">
                  Move to cart
                </button>
                <button className={styles.secondaryBtn} type="button">
                  Unsave
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
