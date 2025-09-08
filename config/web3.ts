import { createConfig, http } from "wagmi";
import { injected, metaMask, walletConnect } from "@wagmi/connectors";

export const domaChain = {
  id: 97476,
  name: "Doma Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "DOMA",
    symbol: "DOMA",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.doma.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url:
        process.env.NEXT_PUBLIC_DOMA_BLOCK_EXPLORER ||
        "https://explorer-testnet.doma.xyz",
    },
  },
};

export const config = createConfig({
  chains: [domaChain],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: "170f854b82b100289c65898d1e8a7cb6" }),
  ],
  transports: {
    [domaChain.id]: http(),
  },
});

export const DOMA_CHAINID = 97476;

export const CONTRACT_ADDRESSES = {
  HYBRID_DUTCH_AUCTION: "0xE680A0F580f742a536B33C142757b4C8BE5CfB40",
  LOYALTY_NFT: "0x04B36cADFD85F2561c0e8A676E0aCe5cBA8c7485",
  OWNERSHIP_TOKEN: "0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f",
};
