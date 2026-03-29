"use client";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./checkout.module.css";
import { useCartStore } from "@/zustand/use-cart-store";
import supabase from "@/lib/supabase/client";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const totalSol = useCartStore((s) => s.totalSol());
  const clear = useCartStore((s) => s.clear);

  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const provider =
    typeof window !== "undefined" ? (window as any).solana : null;

  // CONNECT WALLET
  const connectWallet = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      if (!provider?.isPhantom) {
        throw new Error("Phantom wallet not found");
      }

      const res = await provider.connect();
      setWallet(res.publicKey.toString());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // CREATE ORDER
  const createOrder = async (walletAddress: string) => {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        wallet_address: walletAddress,
        amount_sol: totalSol,
        status: "pending",
        items_snapshot: items,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // PAY
  const pay = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      if (!provider?.isPhantom) throw new Error("Wallet not found");
      if (!provider.publicKey) throw new Error("Wallet not connected");
      if (totalSol <= 0) throw new Error("Cart is empty");

      const connection = new Connection("https://api.devnet.solana.com");

      const from = provider.publicKey;

      const order = await createOrder(from.toString());

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from,
          toPubkey: new PublicKey(order.wallet_address),
          lamports: totalSol * LAMPORTS_PER_SOL,
        }),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = from;

      const signed = await provider.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signed.serialize());

      await connection.confirmTransaction(signature);

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          tx_hash: signature,
          paid_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) throw updateError;

      clear();
      router.push("/success");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Checkout</h1>

        <p className={styles.text}>
          Total: <b>{totalSol.toFixed(4)} SOL</b>
        </p>

        {error && <p className={styles.error}>{error}</p>}

        {!wallet ? (
          <button
            onClick={connectWallet}
            className={styles.button}
            disabled={loading}
          >
            {loading ? <Spinner className="size-6" /> : "Connect Wallet"}
          </button>
        ) : (
          <button
            onClick={pay}
            className={styles.button}
            disabled={loading || totalSol <= 0}
          >
            {loading ? (
              <Spinner className="size-6" />
            ) : (
              `Pay ${totalSol.toFixed(4)} SOL`
            )}
          </button>
        )}
      </div>
    </div>
  );
}
