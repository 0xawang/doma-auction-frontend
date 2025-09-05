export interface Auction {
  id: number
  seller: string
  tokenIds: number[]
  startPrice: string
  reservePrice: string
  priceDecrement: string
  startBlock: number
  duration: number
  startedAt: Date
  endedAt: Date
  active: boolean
  cleared: boolean
  rewardBudgetBps: number
  royaltyIncrement: number
  paymentToken: string
  totalConverted: number
  currentPrice: string
  currentRoyalty: number
  timeLeft: string
  filled: number
}