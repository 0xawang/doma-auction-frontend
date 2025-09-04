import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESSES } from '@/config/web3'

const AUCTION_ABI = [
  'function createBatchAuction(address nftContract, uint256[] tokenIds, uint256 startPrice, uint256 reservePrice, uint256 priceDecrement, uint256 duration, uint256 rewardBudgetBps, uint256 royaltyIncrement, address paymentToken) external returns (uint256)',
  'function placeSoftBid(uint256 auctionId, uint256 threshold, uint256 desiredCount) external payable',
  'function placeHardBid(uint256 auctionId, uint256 desiredCount) external payable',
  'function processConversions(uint256 auctionId) external',
  'function getCurrentPrice(uint256 auctionId) external view returns (uint256)',
  'function getCurrentRoyalty(uint256 auctionId) external view returns (uint256)',
  'function getFractionalOwnership(uint256 auctionId, address owner) external view returns (uint256)',
  'function auctions(uint256) external view returns (address seller, address nftContract, uint256 startPrice, uint256 reservePrice, uint256 priceDecrement, uint256 startBlock, uint256 duration, bool active, bool cleared, uint256 rewardBudgetBps, uint256 royaltyIncrement, address paymentToken, uint256 totalConverted)',
  'function auctionCounter() external view returns (uint256)',
  'event AuctionCreated(uint256 indexed auctionId, address seller, uint256 startPrice, uint256 reservePrice, bool hasReverseRoyalty)',
  'event SoftBidPlaced(uint256 indexed auctionId, address bidder, uint256 threshold, uint256 count, uint256 bond)',
  'event SoftBidConverted(uint256 indexed auctionId, address bidder, uint256 price, uint256 count)',
  'event AuctionCleared(uint256 indexed auctionId, uint256 clearingPrice, uint256 totalRewards, uint256 royaltyAmount)'
]

export interface Auction {
  id: number
  seller: string
  nftContract: string
  tokenIds: number[]
  startPrice: string
  reservePrice: string
  priceDecrement: string
  startBlock: number
  duration: number
  active: boolean
  cleared: boolean
  rewardBudgetBps: number
  royaltyIncrement: number
  paymentToken: string
  totalConverted: number
  currentPrice?: string
  currentRoyalty?: string
}

export function useAuction() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const createAuction = async (params: {
    tokenIds: number[]
    startPrice: string
    reservePrice: string
    priceDecrement: string
    duration: number
    rewardBudgetBps: number
    royaltyIncrement: number
  }) => {
    writeContract({
      address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: 'createBatchAuction',
      args: [
        CONTRACT_ADDRESSES.OWNERSHIP_TOKEN,
        params.tokenIds,
        parseEther(params.startPrice),
        parseEther(params.reservePrice),
        parseEther(params.priceDecrement),
        params.duration,
        params.rewardBudgetBps,
        params.royaltyIncrement,
        '0x0000000000000000000000000000000000000000' // ETH
      ]
    })
  }

  const placeSoftBid = async (auctionId: number, threshold: string, desiredCount: number) => {
    const value = parseEther((parseFloat(threshold) * desiredCount).toString())
    writeContract({
      address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: 'placeSoftBid',
      args: [auctionId, parseEther(threshold), desiredCount],
      value
    })
  }

  const placeHardBid = async (auctionId: number, desiredCount: number, currentPrice: string) => {
    const value = parseEther((parseFloat(currentPrice) * desiredCount).toString())
    writeContract({
      address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: 'placeHardBid',
      args: [auctionId, desiredCount],
      value
    })
  }

  return {
    createAuction,
    placeSoftBid,
    placeHardBid,
    isPending,
    isConfirming,
    isSuccess,
    hash
  }
}

export function useAuctionData(auctionId?: number) {
  const { data: auctionCounter } = useReadContract({
    address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
    abi: AUCTION_ABI,
    functionName: 'auctionCounter'
  })

  const { data: auctionData } = useReadContract({
    address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
    abi: AUCTION_ABI,
    functionName: 'auctions',
    args: auctionId ? [auctionId] : undefined,
    query: { enabled: !!auctionId }
  })

  const { data: currentPrice } = useReadContract({
    address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
    abi: AUCTION_ABI,
    functionName: 'getCurrentPrice',
    args: auctionId ? [auctionId] : undefined,
    query: { enabled: !!auctionId, refetchInterval: 5000 }
  })

  const { data: currentRoyalty } = useReadContract({
    address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
    abi: AUCTION_ABI,
    functionName: 'getCurrentRoyalty',
    args: auctionId ? [auctionId] : undefined,
    query: { enabled: !!auctionId, refetchInterval: 5000 }
  })

  const auction: Auction | null = auctionData ? {
    id: auctionId!,
    seller: auctionData[0] as string,
    nftContract: auctionData[1] as string,
    tokenIds: [], // Would need separate call to get token IDs
    startPrice: formatEther(auctionData[2] as bigint),
    reservePrice: formatEther(auctionData[3] as bigint),
    priceDecrement: formatEther(auctionData[4] as bigint),
    startBlock: Number(auctionData[5]),
    duration: Number(auctionData[6]),
    active: auctionData[7] as boolean,
    cleared: auctionData[8] as boolean,
    rewardBudgetBps: Number(auctionData[9]),
    royaltyIncrement: Number(auctionData[10]),
    paymentToken: auctionData[11] as string,
    totalConverted: Number(auctionData[12]),
    currentPrice: currentPrice ? formatEther(currentPrice as bigint) : undefined,
    currentRoyalty: currentRoyalty ? (Number(currentRoyalty) / 100).toString() : undefined
  } : null

  return {
    auction,
    auctionCounter: auctionCounter ? Number(auctionCounter) : 0
  }
}