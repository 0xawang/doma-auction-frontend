export const ERC721_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const BETTING_ABI = [
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "startPrice", type: "uint256" },
      { name: "reservePrice", type: "uint256" },
      { name: "priceDecrement", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "highPrice", type: "uint256" },
      { name: "lowPrice", type: "uint256" },
    ],
    name: "createAuctionBetting",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "placeBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "auctionId", type: "uint256" },
      { name: "commitHash", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    name: "commitBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "auctionId", type: "uint256" },
      { name: "choice", type: "uint8" },
      { name: "amount", type: "uint256" },
      { name: "secret", type: "uint256" },
    ],
    name: "revealBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "settleBetting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "getCurrentPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionCounter",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "auctions",
    outputs: [
      { name: "seller", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "startPrice", type: "uint256" },
      { name: "reservePrice", type: "uint256" },
      { name: "priceDecrement", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "highPrice", type: "uint256" },
      { name: "lowPrice", type: "uint256" },
      { name: "cleared", type: "bool" },
      { name: "winner", type: "address" },
      { name: "finalPrice", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "bettingPools",
    outputs: [
      { name: "commitDeadline", type: "uint256" },
      { name: "revealDeadline", type: "uint256" },
      { name: "totalPool", type: "uint256" },
      { name: "settled", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const AUCTION_ABI = [
  {
    inputs: [
      { name: "tokenIds", type: "uint256[]" },
      { name: "startPrice", type: "uint256" },
      { name: "reservePrice", type: "uint256" },
      { name: "priceDecrement", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "rewardBudgetBps", type: "uint256" },
      { name: "royaltyIncrement", type: "uint256" },
      { name: "paymentToken", type: "address" },
    ],
    name: "createBatchAuction",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "threshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "desiredCount",
        type: "uint256",
      },
    ],
    name: "placeSoftBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "desiredCount",
        type: "uint256",
      },
    ],
    name: "placeHardBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256",
      },
    ],
    name: "getCurrentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256",
      },
    ],
    name: "getCurrentRoyalty",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256",
      },
    ],
    name: "getAuctionTokenIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionCounter",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "auctions",
    outputs: [
      { name: "seller", type: "address" },
      { name: "startPrice", type: "uint256" },
      { name: "reservePrice", type: "uint256" },
      { name: "priceDecrement", type: "uint256" },
      { name: "startBlock", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "startedAt", type: "uint256" },
      { name: "endedAt", type: "uint256" },
      { name: "active", type: "bool" },
      { name: "cleared", type: "bool" },
      { name: "rewardBudgetBps", type: "uint256" },
      { name: "royaltyIncrement", type: "uint256" },
      { name: "paymentToken", type: "address" },
      { name: "totalConverted", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256",
      },
    ],
    name: "getAuctionFilled",
    outputs: [
      {
        internalType: "uint256",
        name: "filled",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
