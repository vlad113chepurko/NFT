"use client";

import useGetUser from "@/hooks/use-get-user";
import { Spinner } from "@/components/ui/spinner";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./styles/dashboard.module.css";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  wallet: string | null;
  avatar: string | null;
}

const ease = [0.22, 1, 0.36, 1] as const;

const cardIn: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease },
  },
};

export default function Dashboard() {
  const [userData, setUserData] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUserData = useGetUser({ setUserData, setLoading });

  useEffect(() => {
    fetchUserData();

  }, []);

  if (loading || !userData) {
    return (
      <div className={styles.dashboard}>
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <motion.section
        className={styles.profileCard}
        variants={cardIn}
        initial="hidden"
        animate="show"
      >
        <div className={styles.profileInner}>
          <img
            src={userData.avatar ?? "https://i.pravatar.cc/150?img=12"}
            className={styles.avatar}
            alt="avatar"
          />
          <h1 className={styles.name}>{userData.name || "Anonymous"}</h1>
          <p className={styles.email}>{userData.email ?? "—"}</p>

          <div className={styles.walletInfo}>
            <p className={styles.walletLabel}>Wallet</p>
            <p className={styles.walletValue}>{userData.wallet ?? "-"}</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
