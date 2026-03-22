"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import styles from "./main.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const shell: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export default function HomePage() {
  return (
    <main className={styles.wrapper}>
      <motion.div
        aria-hidden
        className={styles.bg}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <motion.div
          className={styles.orbOne}
          animate={{ y: [0, -14, 0], x: [0, 10, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={styles.orbTwo}
          animate={{ y: [0, 16, 0], x: [0, -10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Card */}
      <motion.section
        className={styles.card}
        variants={shell}
        initial="hidden"
        animate="show"
      >
        <motion.header
          className={styles.header}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className={styles.brand} variants={item}>
            <span className={styles.logo}>
              <svg
                width="39"
                height="29"
                viewBox="0 0 39 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.31288 4.17801C6.10897 7.49906 15.0444 13.2958 20.4173 9.91438C20.7093 9.61246 8.44503 23.1986 4.64894 24.4063C0.85285 25.6139 -1.77521 4.17801 2.31288 4.17801Z" />
                <path d="M12.8251 20.7833C19.6386 13.8393 33.908 0.0115919 36.4777 0.253123C39.6898 0.555037 39.1057 23.8024 31.5136 27.7273C29.1775 29.2369 17.2052 25.312 12.8251 20.7833Z" />
              </svg>
            </span>
            <span className={styles.brandText}>NFT</span>
          </motion.div>

          <motion.h1 className={styles.title} variants={item}>
            Welcome to the NFT Store
          </motion.h1>

          <motion.p className={styles.subtitle} variants={item}>
            Login to browse the marketplace
          </motion.p>
        </motion.header>

        <motion.div
          className={styles.actions}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={item}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              className={`${styles.button} ${styles.primary}`}
              href="/auth/login"
            >
              Login
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              className={`${styles.button} ${styles.ghost}`}
              href="/dashboard"
            >
              Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
