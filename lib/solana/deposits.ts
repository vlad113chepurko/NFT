import { solanaConnection } from "@/lib/solana/client";

export async function getIncomingSolAmountForAddress(params: {
  signature: string;
  address: string;
}): Promise<{ amountSol: number; slot?: number; blockTime?: number } | null> {
  const { signature, address } = params;

  const tx = await solanaConnection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });

  if (!tx || !tx.meta) return null;

  const accountKeys = tx.transaction.message.accountKeys.map((k: any) =>
    typeof k === "string" ? k : (k.pubkey?.toString?.() ?? k.toString()),
  );

  const idx = accountKeys.findIndex((k) => k === address);
  if (idx === -1) return null;

  const pre = tx.meta.preBalances?.[idx];
  const post = tx.meta.postBalances?.[idx];
  if (typeof pre !== "number" || typeof post !== "number") return null;

  const diffLamports = post - pre; 
  if (diffLamports <= 0) return null;

  const amountSol = diffLamports / 1_000_000_000;

  return {
    amountSol,
    slot: tx.slot,
    blockTime: tx.blockTime ?? undefined,
  };
}
