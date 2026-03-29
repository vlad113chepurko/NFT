"use client";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user.types";

import useGetUser from "@/hooks/use-get-user";
import supabase from "@/lib/supabase/client";
import styles from "./styles/dashboard.module.css";

type Order = {
  id: string;
  amount_sol: number;
  status: string;
  tx_hash: string | null;
  paid_at: string | null;
};

export default function Dashboard() {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchUserData = useGetUser({ setUserData, setLoading });

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!userData?.wallet_address) return;

      setOrdersLoading(true);

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("wallet_address", userData.wallet_address)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setOrdersLoading(false);
    };

    loadOrders();
  }, [userData]);

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
        initial="hidden"
        animate="show"
      >
        <div className={styles.profileInner}>
          <img
            src={userData.avatar ?? "https://i.pravatar.cc/150?img=12"}
            className={styles.avatar}
          />

          <h1 className={styles.name}>{userData.username || "Anon"}</h1>

          <div className={styles.walletInfo}>
            <p className={styles.walletLabel}>Wallet</p>
            <p className={styles.walletValue}>{userData.wallet_address}</p>
          </div>
        </div>
      </motion.section>

      <section className={styles.orders}>
        <h2 className={styles.ordersTitle}>Purchases</h2>

        {ordersLoading ? (
          <Spinner className="size-6" />
        ) : orders.length === 0 ? (
          <p className={styles.empty}>No purchases yet</p>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div>
                  <p className={styles.orderAmount}>
                    {order.amount_sol.toFixed(4)} SOL
                  </p>

                  <p className={styles.orderStatus}>{order.status}</p>
                </div>

                {order.tx_hash && (
                  <a
                    href={`https://explorer.solana.com/tx/${order.tx_hash}?cluster=devnet`}
                    target="_blank"
                    className={styles.txLink}
                  >
                    View tx
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
