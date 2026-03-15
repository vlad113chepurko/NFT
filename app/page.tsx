import styles from "./main.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <article className="flex flex-col gap-2">
        <h1>Welcome to our NFT marketplace</h1>
        <h2>Create an account to start exploring and trading NFTs</h2>
      </article>

      <div className="flex flex-row gap-3">
        <Link href="/auth/signup">Create Account</Link>
      </div>
    </div>
  );
}
