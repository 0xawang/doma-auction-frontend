export const ERC721_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  }  
] as const


export const AUCTION_ABI = [
  {
    inputs: [
      { name: 'tokenIds', type: 'uint256[]' },
      { name: 'startPrice', type: 'uint256' },
      { name: 'reservePrice', type: 'uint256' },
      { name: 'priceDecrement', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
      { name: 'rewardBudgetBps', type: 'uint256' },
      { name: 'royaltyIncrement', type: 'uint256' },
      { name: 'paymentToken', type: 'address' }
    ],
    name: 'createBatchAuction',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "threshold",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "desiredCount",
        "type": "uint256"
      }
    ],
    "name": "placeSoftBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "desiredCount",
        "type": "uint256"
      }
    ],
    "name": "placeHardBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "auctions",
    "outputs": [
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reservePrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "priceDecrement",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "cleared",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "rewardBudgetBps",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "royaltyIncrement",
        "type": "uint256"
      },
      {
        "internalType": "contract IERC20",
        "name": "paymentToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "totalConverted",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      }
    ],
    "name": "getCurrentPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      }
    ],
    "name": "getCurrentRoyalty",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    inputs: [],
    name: 'auctionCounter',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const
