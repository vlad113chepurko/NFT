"use client";

import { useQuery } from "@tanstack/react-query";
import type { NFT } from "@/types/nft.types";

async function fetchNFTs(): Promise<NFT[]> {
  const res = await fetch("/api/nfts/get");
  if (!res.ok) throw new Error("Ошибка при получении NFT");

  const json = await res.json();
  console.debug('JSON', json);
  
  return Array.isArray(json.nfts) ? json.nfts : [];
}

export function useGetNfts() {
  return useQuery<NFT[], Error>({
    queryKey: ["nfts"],
    queryFn: fetchNFTs,
  });
}
