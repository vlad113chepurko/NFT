"use client";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./main.module.css";
import { useState } from "react";
import { handleLogin } from "@/utils/handleLogin";
export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <main className={styles.wrapper}>
      <motion.section className={styles.card}>
        <motion.header className={styles.header}>
          <motion.h1 className={styles.title}>
            Welcome to the NFT Store
          </motion.h1>

          <motion.p className={styles.subtitle}>
            Connect your wallet to start exploring and shopping for unique NFTs.
          </motion.p>
        </motion.header>

        <motion.div className={styles.actions}>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => handleLogin({ setLoading, router })}
              disabled={loading}
              className={styles.connectButton}
            >
              {loading ? (
                <div className="flex flex-row gap-3">
                  <Spinner />
                  <p>Connecting...</p>
                </div>
              ) : (
                <>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 8V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H12C12.5304 20 13.0391 19.7893 13.4142 19.4142C13.7893 19.0391 14 18.5304 14 18V16M7 12H21M21 12L18 9M21 12L18 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
