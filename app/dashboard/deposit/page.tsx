"use client";
import { motion, AnimatePresence } from "framer-motion";
import { getIncomingSolAmountForAddress } from "@/lib/solana/deposits";
import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "@/lib/supabase/client";
import styles from "../styles/dashboard.module.css";
import { Spinner } from "@/components/ui/spinner";
import {
  getRecentSignatures,
  getSolBalance,
  getSplTokenBalances,
} from "@/lib/solana/client";

type LocalUser = {
  id: string;
  wallet_address: string;
  username?: string;
  avatar?: string | null;
};

export default function DepositPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<LocalUser | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [lastDeposits, setLastDeposits] = useState<string[]>([]);
  const seenSigs = useRef<Set<string>>(new Set());

  const qrValue = useMemo(() => wallet ?? "", [wallet]);

  useEffect(() => {
    const run = () => {
      try {
        setLoading(true);

        const stored = localStorage.getItem("user");

        if (!stored) {
          setUser(null);
          setWallet(null);
          return;
        }

        const parsed: LocalUser = JSON.parse(stored);

        setUser(parsed);
        setWallet(parsed.wallet_address);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const refreshBalances = async () => {
    if (!wallet) return;

    setRefreshing(true);
    try {
      const [sol] = await Promise.all([
        getSolBalance(wallet),
        getSplTokenBalances(wallet),
      ]);

      setSolBalance(sol);
    } catch (e) {
      console.error("refreshBalances error:", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!wallet) return;

    refreshBalances();

    const id = window.setInterval(refreshBalances, 15_000);

    return () => window.clearInterval(id);
  }, [wallet]);

  useEffect(() => {
    if (!wallet || !user) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const sigs = await getRecentSignatures(wallet, 10);

        if (seenSigs.current.size === 0) {
          sigs.forEach((s) => seenSigs.current.add(s.signature));
          return;
        }

        for (const { signature: sig } of sigs) {
          if (cancelled) return;

          if (seenSigs.current.has(sig)) continue;
          seenSigs.current.add(sig);

          const incoming = await getIncomingSolAmountForAddress({
            signature: sig,
            address: wallet,
          });

          if (!incoming) continue;

          const { error } = await supabase.from("deposits").upsert(
            {
              user_id: user.id,
              wallet_address: wallet,
              signature: sig,
              amount_sol: incoming.amountSol,
              slot: incoming.slot ?? null,
              block_time: incoming.blockTime
                ? new Date(incoming.blockTime * 1000).toISOString()
                : null,
            },
            { onConflict: "signature" },
          );

          if (error) {
            console.error("deposit upsert error:", {
              message: error.message,
              code: error.code,
              details: error.details,
            });
            continue;
          }

          setLastDeposits((prev) => [sig, ...prev].slice(0, 10));

          await refreshBalances();
        }
      } catch (e) {
        console.error("deposit poll error:", e);
      }
    };

    const id = window.setInterval(poll, 10_000);
    poll();

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [wallet, user]);
  const copyAddress = async () => {
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 2000);
    setIsSaved(true);
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet);
    return () => clearTimeout(timer);
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!wallet || !user) {
    return (
      <div className={styles.dashboard}>
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
          <h1 className="text-xl font-bold">Deposit</h1>
          <p className="text-gray-300 mt-2">Please login with wallet first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.deposit}>
        <h1 className="text-2xl font-bold tracking-wide">Deposit</h1>

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className={styles.depositItem}>
            <p className="text-xs text-gray-400">Your Solana address</p>

            <article className="flex flex-row gap-5">
              <p className={styles.wallerAddress}>{wallet}</p>
              <button
                title="Copy Wallet Address"
                disabled={isSaved}
                className={styles.copyButton}
                onClick={copyAddress}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 8V6C16 5.46957 15.7893 4.96086 15.4142 4.58579C15.0391 4.21071 14.5304 4 14 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H8M8 10C8 9.46957 8.21071 8.96086 8.58579 8.58579C8.96086 8.21071 9.46957 8 10 8H18C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H10C9.46957 20 8.96086 19.7893 8.58579 19.4142C8.21071 19.0391 8 18.5304 8 18V10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </article>
            <AnimatePresence mode="wait">
              {isSaved && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-400 text-xs ml-2 w-full items-baseline flex"
                >
                  Saved!
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.depositItem}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Balance (SOL)</p>
              <button
                title="Refresh"
                className={styles.copyButton}
                onClick={refreshBalances}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Spinner className="size-4" />
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 11C19.7554 9.24023 18.9391 7.60967 17.6766 6.35951C16.4142 5.10934 14.7758 4.30893 13.0137 4.08156C11.2516 3.8542 9.46362 4.21249 7.9252 5.10126C6.38678 5.99002 5.18325 7.35995 4.5 9.00001M4 5.00001V9.00001H8M4 13C4.24456 14.7598 5.06093 16.3903 6.32336 17.6405C7.58579 18.8907 9.22424 19.6911 10.9863 19.9184C12.7484 20.1458 14.5364 19.7875 16.0748 18.8988C17.6132 18.01 18.8168 16.6401 19.5 15M20 19V15H16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <p className="font-mono text-lg text-purple-400 mt-1">
              {solBalance === null ? "-" : solBalance.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
