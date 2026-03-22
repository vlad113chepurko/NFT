"use client";
import styles from "./checkout.module.css";
import { useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabase/client";
import { useCartStore } from "@/zustand/use-cart-store";
import { useRouter } from "next/navigation";
import { vectors } from "@/vectors";

type OrderRow = {
  id: string;
  status: "pending" | "paid" | "canceled";
  amount_sol: number;
  wallet_address: string;
  created_at: string;
  paid_at: string | null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const totalSol = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price ?? 0), 0),
    [items],
  );

  const [wallet, setWallet] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const run = async () => {
      setError(null);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        setError("Not logged in");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("wallet")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        return;
      }

      setWallet(profile.wallet);
    };

    run();
  }, []);

  useEffect(() => {
    if (!wallet) return;
    if (order) return;

    const run = async () => {
      setError(null);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        setError("Not logged in");
        return;
      }

      if (!items.length) {
        setError("Cart is empty");
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          amount_sol: totalSol,
          wallet_address: wallet,
        })
        .select("id, status, amount_sol, wallet_address, created_at, paid_at")
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setOrder(created);
    };

    run();
  }, [wallet]);

  const checkPayment = async () => {
    if (!order) return;

    setChecking(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const { data: deposits, error: depError } = await supabase
        .from("deposits")
        .select("amount_sol, wallet_address, block_time, created_at")
        .eq("user_id", user.id)
        .eq("wallet_address", order.wallet_address);

      if (depError) {
        setError(depError.message);
        return;
      }

      const paid = (deposits ?? []).reduce(
        (sum, d) => sum + Number(d.amount_sol),
        0,
      );

      if (paid >= Number(order.amount_sol) && order.status !== "paid") {
        const { data: updated, error: updError } = await supabase
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", order.id)
          .select("id, status, amount_sol, wallet_address, created_at, paid_at")
          .single();

        if (updError) {
          setError(updError.message);
          return;
        }

        setOrder(updated);
        clearCart();
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!order || order.status !== "pending") return;

    checkPayment();
    const id = window.setInterval(checkPayment, 10_000);
    return () => window.clearInterval(id);
  }, [order?.id, order?.status]);

  if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;
  if (!order) return <div style={{ padding: 24 }}>Creating order...</div>;

  return (
    <div className={styles.checkout}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <div className="flex flex-row gap-3 w-full">
              <button onClick={() => router.back()} type="button">
                <vectors.Back />
              </button>
              <h1 className={styles.title}>Checkout</h1>
            </div>
            <p className={styles.subtitle}>
              Send {totalSol} SOL from your Phantom wallet to complete the purchase.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <span className={styles.label}>Amount</span>
            <span className={styles.amount}>
              {Number(order.amount_sol).toFixed(4)} SOL
            </span>
          </div>

          <div className={styles.addressWrap}>
            <div className={styles.addressLabel}>Send SOL to this address:</div>
            <code className={styles.address}>{order.wallet_address}</code>

            <div className={styles.actions}>
              <button
                className={styles.secondaryBtn}
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(order.wallet_address)
                }
              >
                Copy address
              </button>

              <button
                className={styles.primaryBtn}
                type="button"
                onClick={checkPayment}
                disabled={checking}
              >
                {checking ? "Checking..." : "Refresh status"}
              </button>
            </div>
          </div>

          <div className={styles.statusLine}>
            <span className={styles.label}>Status</span>
            <span
              className={`${styles.statusPill} ${
                order.status === "paid"
                  ? styles.statusPaid
                  : order.status === "canceled"
                    ? styles.statusCanceled
                    : styles.statusPending
              }`}
            >
              {order.status}
            </span>
          </div>

          {order.status === "paid" && (
            <div className={styles.successBox}>
              Paid! Access granted (test). Cart cleared.
            </div>
          )}

          <p className={styles.hint}>
            After you send SOL from Phantom, this page checks deposits
            every 10 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
