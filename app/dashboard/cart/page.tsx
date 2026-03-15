import styles from "./cart.module.css";

const nftProducts = [
  {
    id: "nft-001",
    title: "Eternal Genesis",
    subtitle: "Founder Edition",
    priceEternal: 1250,
    image: "https://picsum.photos/seed/eternal-genesis/640/420",
    rarity: "Legendary",
  },
  {
    id: "nft-002",
    title: "Void Runner",
    subtitle: "Cyber Drift",
    priceEternal: 420,
    image: "https://picsum.photos/seed/void-runner/640/420",
    rarity: "Epic",
  },
  {
    id: "nft-003",
    title: "Crystal Bloom",
    subtitle: "Nature Protocol",
    priceEternal: 95,
    image: "https://picsum.photos/seed/crystal-bloom/640/420",
    rarity: "Rare",
  },
] as const;

export default function Cart() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Cart</h1>
        <p className={styles.cartSubtitle}>3 NFT items • prices in Eternal</p>
      </div>

      <div className={styles.cardsGrid}>
        {nftProducts.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardImageWrap}>
              <img className={styles.cardImage} src={p.image} alt={p.title} />
              <span className={styles.badge}>{p.rarity}</span>
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
                  Checkout
                </button>
                <button className={styles.secondaryBtn} type="button">
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
