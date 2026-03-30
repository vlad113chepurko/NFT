"use client";

import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user.types";
import uploadAvatar from "@/utils/uploadAvatar";
import useGetUser from "@/hooks/use-get-user";
import supabase from "@/lib/supabase/client";
import styles from "./styles/dashboard.module.css";

type Order = {
  id: string;
  amount_sol: number;
  status: string;
  tx_hash: string | null;
  paid_at: string | null;
  items_snapshot: any[];
};

export default function Dashboard() {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const fetchUserData = useGetUser({ setUserData, setLoading });

  useEffect(() => {
    fetchUserData();
  }, []);


  useEffect(() => {
    if (isEditing && userData) {
      setUsername(userData.username || "");
    }
  }, [isEditing, userData]);

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
  }, [userData?.wallet_address]);

  const saveProfile = async () => {
    if (!userData) return;

    try {
      setSaving(true);

      let avatarUrl = userData.avatar;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile, userData);
      }

      const updates = {
        username: username.trim(),
        avatar: avatarUrl,
      };

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userData.id);

      if (error) throw error;

      const updatedUser = {
        ...userData,
        ...updates,
      };

      setUserData(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      setAvatarFile(null);
    } catch (e) {
      console.error("saveProfile error:", e);
    } finally {
      setSaving(false);
    }
  };
  if (loading || !userData) {
    return (
      <div className={styles.dashboard}>
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {isEditing && (
        <>
          <div className={styles.editOverlay} />

          <div className={styles.editBox}>
            <input
              type="text"
              maxLength={12}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />

            <div className={styles.editActions}>
              <button onClick={saveProfile} disabled={saving}>
                {saving ? <Spinner /> : "Save"}
              </button>

              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </>
      )}

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

          <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
            Edit profile
          </button>
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
              <div
                key={order.id}
                className={styles.orderCard}
                onClick={() =>
                  setOpenOrderId(openOrderId === order.id ? null : order.id)
                }
              >
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

                {openOrderId === order.id &&
                  order.items_snapshot?.length > 0 && (
                    <div className={styles.orderItems}>
                      {order.items_snapshot.map((item: any) => (
                        <div key={item.id} className={styles.itemCard}>
                          <img
                            src={item.image_url}
                            className={styles.itemImage}
                          />

                          <div className={styles.itemInfo}>
                            <p className={styles.itemName}>
                              {item.name} × {item.qty}
                            </p>

                            <p className={styles.itemPrice}>{item.price} SOL</p>

                            <div className={styles.itemTraits}>
                              {Object.entries(item.traits || {}).map(
                                ([k, v]) => (
                                  <span key={k} className={styles.trait}>
                                    {k}: {String(v)}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
