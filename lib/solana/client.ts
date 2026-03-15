import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SOLANA_RPC_URL } from "./config";

export const solanaConnection = new Connection(SOLANA_RPC_URL, "confirmed");

export function toPublicKey(address: string) {
  return new PublicKey(address);
}

export async function getSolBalance(address: string) {
  const lamports = await solanaConnection.getBalance(toPublicKey(address));
  return lamports / LAMPORTS_PER_SOL;
}

export async function getSplTokenBalances(address: string) {
  const owner = toPublicKey(address);
  const resp = await solanaConnection.getParsedTokenAccountsByOwner(owner, {
    programId: toPublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), 
  });

  return resp.value
    .map((acc) => {
      const info: any = acc.account.data.parsed.info;
      const mint = info.mint as string;
      const amount = info.tokenAmount.uiAmount as number | null;
      const decimals = info.tokenAmount.decimals as number;
      return { mint, amount, decimals };
    })
    .filter((t) => (t.amount ?? 0) > 0);
}

export async function getRecentSignatures(address: string, limit = 20) {
  return solanaConnection.getSignaturesForAddress(toPublicKey(address), {
    limit,
  });
}
