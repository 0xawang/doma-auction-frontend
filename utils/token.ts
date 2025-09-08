import { CONTRACT_ADDRESSES } from "@/config/web3";

export const shortenAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const linkToBlockExplorer = (address: string) => {
  return `${process.env.NEXT_PUBLIC_DOMA_BLOCK_EXPLORER}/address/${address}`;
};

export const linkToDomainOnBlockExplorer = (tokenId: string) => {
  return `${process.env.NEXT_PUBLIC_DOMA_BLOCK_EXPLORER}/token/${CONTRACT_ADDRESSES.OWNERSHIP_TOKEN}/instance/${tokenId}`;
};

export const timeLeft = (endTime: number) => {
  const remaining = endTime - Math.floor(Date.now() / 1000);

  if (remaining <= 0) return "0h 0m";

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);

  return `${h}h ${m}m`;
};
