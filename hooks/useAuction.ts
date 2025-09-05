import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESSES } from '@/config/web3'
import { AUCTION_ABI } from '@/contracts/abi'


export interface Auction {
  id: number
  seller: string
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

const AUCTION_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`

export function useAuction() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })


  const createAuction = async (params: {
    tokenIds: bigint[]
    startPrice: string
    reservePrice: string
    priceDecrement: string
    duration: number
    rewardBudgetBps: number
    royaltyIncrement: number
  }) => {
    return await writeContractAsync({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_ABI,
      functionName: 'createBatchAuction',
      args: [
        params.tokenIds,
        parseEther(params.startPrice),
        parseEther(params.reservePrice),
        parseEther((parseFloat(params.priceDecrement) / 30).toFixed(18)),
        BigInt(params.duration * 30),
        BigInt(params.rewardBudgetBps),
        BigInt(params.royaltyIncrement),
        '0x0000000000000000000000000000000000000000' // ETH
      ]
    })
  }

  const placeSoftBid = async (auctionId: number, threshold: string, desiredCount: number) => {
    const value = parseEther((parseFloat(threshold) * desiredCount).toString())
    return await writeContractAsync({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_ABI,
      functionName: 'placeSoftBid',
      args: [
        BigInt(auctionId), 
        parseEther(threshold), 
        BigInt(desiredCount)
      ],
      value
    })
  }

  const placeHardBid = async (auctionId: number, desiredCount: number, currentPrice: string) => {
    const value = parseEther((parseFloat(currentPrice) * desiredCount).toString())
    return await writeContractAsync({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_ABI,
      functionName: 'placeHardBid',
      args: [BigInt(auctionId), BigInt(desiredCount)],
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
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: 'auctionCounter'
  })

  const { data: auctionData } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: 'auctions',
    args: [BigInt(auctionId!)],
    query: { enabled: !!auctionId }
  })

  const { data: currentPrice } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: 'getCurrentPrice',
    args: [BigInt(auctionId!)],
    query: { enabled: !!auctionId, refetchInterval: 5000 }
  })

  const { data: currentRoyalty } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: 'getCurrentRoyalty',
    args: [BigInt(auctionId!)],
    query: { enabled: !!auctionId, refetchInterval: 5000 }
  })

  const auction: Auction | null = auctionData ? {
    id: auctionId!,
    seller: (auctionData as unknown as any[])[0] as string,
    tokenIds: [], // Would need separate call to get token IDs
    startPrice: formatEther((auctionData as unknown as any[])[1] as bigint),
    reservePrice: formatEther((auctionData as unknown as any[])[2] as bigint),
    priceDecrement: formatEther((auctionData as unknown as any[])[3] as bigint),
    startBlock: Number((auctionData as unknown as any[])[4]),
    duration: Number((auctionData as unknown as any[])[5]),
    active: (auctionData as unknown as any[])[6] as boolean,
    cleared: (auctionData as unknown as any[])[7] as boolean,
    rewardBudgetBps: Number((auctionData as unknown as any[])[8]),
    royaltyIncrement: Number((auctionData as unknown as any[])[9]),
    paymentToken: (auctionData as unknown as any[])[10] as string,
    totalConverted: Number((auctionData as unknown as any[])[11]),
    currentPrice: currentPrice ? formatEther(currentPrice as bigint) : undefined,
    currentRoyalty: currentRoyalty ? (Number(currentRoyalty) / 100).toString() : undefined
  } : null

  return {
    auction,
    auctionCounter: auctionCounter ? Number(auctionCounter) : 0
  }
}