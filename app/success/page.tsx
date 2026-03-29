"use client";

import { useRouter } from "next/navigation";
import styles from "./success.module.css";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12L10 17L20 7"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Payment successful</h1>

        <p className={styles.text}>
          Your transaction has been confirmed on Solana network
        </p>

        <button
          className={styles.button}
          onClick={() => router.push("/dashboard")}
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
}
