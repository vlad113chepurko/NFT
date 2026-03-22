"use client";
import styles from "./main.module.css";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <article className="flex flex-col gap-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to our NFT marketplace
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Create an account to start exploring and trading NFTs
          </motion.h2>
        </article>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-row gap-3 w-full items-center"
        >
          <Link className="self-baseline" href="/auth/signup">
            Create Account
          </Link>
          <p>OR</p>
          <Link className="self-baseline" href="/auth/login">
            Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
