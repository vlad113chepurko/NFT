"use client";
import { getIncomingSolAmountForAddress } from "@/lib/solana/deposits";
import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "@/lib/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import styles from "../styles/dashboard.module.css";
import { Spinner } from "@/components/ui/spinner";
import {
  getRecentSignatures,
  getSolBalance,
  getSplTokenBalances,
} from "@/lib/solana/client";

export default function DepositPage() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<string | null>(null);

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [lastDeposits, setLastDeposits] = useState<string[]>([]);
  const seenSigs = useRef<Set<string>>(new Set());

  const qrValue = useMemo(() => {
    if (!wallet) return "";

    return wallet;
  }, [wallet]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          setWallet(null);
          return;
        }

        const { data: profile, error } = await supabase
          .from("users")
          .select("id, email, wallet")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("users select error:", error);
          setWallet(null);
          return;
        }

        setWallet(profile.wallet);
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

    const id = window.setInterval(() => {
      refreshBalances();
    }, 15_000);

    return () => window.clearInterval(id);
  }, [wallet]);

  useEffect(() => {
    if (!wallet) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const authUser = authData?.user;
        if (!authUser) return;

        const sigs = await getRecentSignatures(wallet, 10);

        if (seenSigs.current.size === 0) {
          sigs.forEach((s) => seenSigs.current.add(s.signature));
          return;
        }

        for (const s of sigs) {
          const sig = s.signature;
          if (seenSigs.current.has(sig)) continue;

          seenSigs.current.add(sig);

          const incoming = await getIncomingSolAmountForAddress({
            signature: sig,
            address: wallet,
          });

          if (!incoming) continue;

          const { error: insertError } = await supabase
            .from("deposits")
            .insert({
              user_id: authUser.id,
              wallet_address: wallet,
              signature: sig,
              amount_sol: incoming.amountSol,
              slot: incoming.slot ?? null,
              block_time: incoming.blockTime
                ? new Date(incoming.blockTime * 1000).toISOString()
                : null,
            });

          if (insertError) {
            if (
              !String(insertError.message).toLowerCase().includes("duplicate")
            ) {
              console.error("deposit insert error:", insertError);
            }
          } else {
            if (cancelled) return;
            setLastDeposits((prev) => [sig, ...prev].slice(0, 10));

            await refreshBalances();
          }
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
  }, [wallet]);

  const copyAddress = async () => {
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet);
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className={styles.dashboard}>
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
          <h1 className="text-xl font-bold">Deposit</h1>
          <p className="text-gray-300 mt-2">
            Wallet address not found in profile. Create it first in Dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold tracking-wide">Deposit (Devnet)</h1>

        <div className="mt-6 flex flex-col items-center gap-4">
          <QRCodeCanvas value={qrValue} size={180} includeMargin />

          <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400">Your Solana address</p>
            <p className="font-mono text-sm break-all text-purple-200">
              {wallet}
            </p>

            <button
              className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 text-sm"
              onClick={copyAddress}
              type="button"
            >
              Copy address
            </button>
          </div>

          <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Balance (SOL)</p>
              <button
                type="button"
                onClick={refreshBalances}
                disabled={refreshing}
                className="text-xs text-purple-300 hover:text-purple-200"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <p className="font-mono text-lg text-purple-400 mt-1">
              {solBalance === null ? "-" : solBalance.toFixed(6)}
            </p>
          </div>

          <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">
              Recent incoming activity (polling)
            </p>
            {lastDeposits.length === 0 ? (
              <p className="text-sm text-gray-300">
                No new transactions detected yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {lastDeposits.map((sig) => (
                  <li
                    key={sig}
                    className="font-mono text-xs break-all text-purple-200"
                  >
                    {sig}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
