import styles from "./main.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <article className="flex flex-col">
        <h1>Hello on our NFT site</h1>
        <h2>That use our NFT site you must login</h2>
      </article>
      <div className="flex flex-row gap-3 ">
        <Link href={"/auth/signin"}>Sign in</Link>
        <Link href={"/auth/login"}>Login</Link>
      </div>
    </div>
  );
}
