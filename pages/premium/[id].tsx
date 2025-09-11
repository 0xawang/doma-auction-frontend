import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Chip } from '@heroui/chip'
import { Progress } from '@heroui/progress'
import { Tabs, Tab } from '@heroui/tabs'
import { motion } from 'framer-motion'

import { title } from '@/components/primitives'
import DefaultLayout from '@/layouts/default'
import { useWeb3 } from '@/hooks/useWeb3'
import { usePremiumAuction } from '@/hooks/usePremiumAuctions'
import { formatEther } from 'viem'
import { Image } from '@heroui/react'

export default function PremiumAuctionDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { isConnected } = useWeb3()

  const [activeTab, setActiveTab] = useState('auction')
  const [bidAmount, setBidAmount] = useState('')
  const [betAmount, setBetAmount] = useState('')
  const [betCategory, setBetCategory] = useState('')

  const {auction, domainInfo} = usePremiumAuction(id as string) 

  const totalBets = (Math.random() * 10).toFixed(4)
  const bettingPhase = Math.random() > 2 / 3 ? "commit" : Math.random() > 1 / 3 ? "reveal" : "ended"

  const now = Math.floor(new Date().getTime() / 1000)
  const startTime = Number(auction?.startedAt || now)
  const timeLeft = Math.max(0, (auction?.endedAt || now + 36000) - now);

  const priceDecrement = auction?.priceDecrement ? formatEther(auction?.priceDecrement) : '0'
  const startPrice = auction?.startPrice ? formatEther(auction?.startPrice) : '0'
  const reservePrice = auction?.startPrice ? formatEther(auction?.reservePrice) : '0'
  const highPrice = auction?.startPrice ? formatEther(auction?.highPrice) : '0'
  const lowPrice = auction?.startPrice ? formatEther(auction?.lowPrice) : '0'

  const currentPrice = (parseFloat(startPrice) - (now - startTime) * parseFloat(priceDecrement) / 60)?.toFixed(4)
  
  if (auction?.id == undefined) {
    return <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-120">
        <div className='mb-6'>
          <h1 className={title({ class: "gradient-metal" })}>
            Premium Domain Auction 
          </h1>
        </div>
      </div>
    </DefaultLayout>
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className='mb-6'>
          <h1 className={title({ class: "gradient-metal" })}>
            Premium Domain Auction #{auction?.id?.toString()}
          </h1>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Auction Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-4">
                <CardHeader>
                  <div className="flex justify-between items-start w-full">
                    <div className='flex items-center gap-4'>
                      <Image
                        alt="Token Image"
                        className="object-cover rounded-lg"
                        height={72}
                        src={
                          domainInfo?.image  || "/images/domain.png"
                        }
                        width={72}
                      />
                      <h1 className={title({ size: 'lg' })}>{domainInfo?.name || ''}</h1>
                    </div>
                    <Chip color="success" variant="flat">
                      {auction?.active ? 'active' : auction?.cleared ? 'cleared' : 'ended' }
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Current Price:</span>
                        <span className="font-bold text-2xl text-blue-600">{currentPrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Start Price:</span>
                        <span>{startPrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reserve Price:</span>
                        <span>{reservePrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Left:</span>
                        <span className="font-semibold">{timeLeft}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>High Price Threshold:</span>
                        <span className="text-orange-600">{highPrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Low Price Threshold:</span>
                        <span className="text-purple-600">{lowPrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Betting Pool:</span>
                        <span className="text-green-600">{totalBets} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Betting Phase:</span>
                        <Chip size="sm" color={bettingPhase === 'commit' ? 'warning' : 'primary'}>
                          {bettingPhase}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Betting Categories */}
              <Card className="p-4">
                <CardHeader>
                  <h3 className="text-xl font-semibold">4-Tier Price Betting Categories</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-semibold text-red-700">Category 3: Above High</h4>
                      <p className="text-sm text-red-600">Final price &gte; {highPrice} ETH</p>
                    </div>
                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <h4 className="font-semibold text-orange-700">Category 2: High~Low Range</h4>
                      <p className="text-sm text-orange-600">{lowPrice} ETH ≤ Final price ≤ {highPrice} ETH</p>
                    </div>
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-blue-700">Category 1: Below Low</h4>
                      <p className="text-sm text-blue-600">Final price &lte; {lowPrice} ETH</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-700">Category 0: Uncleared</h4>
                      <p className="text-sm text-gray-600">Auction fails to clear</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
              >
                <Tab key="auction" title="Place Bid">
                  <Card className="p-4">
                    <CardHeader className='flex flex-col items-start gap-1'>
                      <h3 className="text-lg font-semibold">Place Bid</h3>
                      <p className="text-sm text-gray-600">First bid wins and ends auction</p>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <Input
                        label="Bid Amount (ETH)"
                        placeholder={`Min: ${currentPrice}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                      <Button
                        color="primary"
                        className="w-full"
                        size="lg"
                        isDisabled={!isConnected || !bidAmount}
                      >
                        {isConnected ? 'Place Bid & Win' : 'Connect Wallet'}
                      </Button>
                      <p className="text-xs text-gray-500">
                        ⚠️ First valid bid immediately wins the auction
                      </p>
                    </CardBody>
                  </Card>
                </Tab>

                <Tab key="betting" title="Place Bet">
                  <Card className="p-4">
                    <CardHeader className='flex flex-col items-start gap-1'>
                      <h3 className="text-lg font-semibold">Commit Bet</h3>
                      <p className="text-sm text-gray-600">Bet on final auction price category</p>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <Select
                        label="Price Category"
                        aria-label="Price Category"
                        placeholder="Select betting category"
                        selectedKeys={betCategory ? [betCategory] : []}
                        onSelectionChange={(keys) => setBetCategory(Array.from(keys)[0] as string)}
                      >
                        <SelectItem key="3">Category 3: Above High (&gte;{highPrice} ETH)</SelectItem>
                        <SelectItem key="2">Category 2: High~Low Range ({lowPrice}-{highPrice} ETH)</SelectItem>
                        <SelectItem key="1">Category 1: Below Low (&lte;{lowPrice} ETH)</SelectItem>
                        <SelectItem key="0">Category 0: Uncleared</SelectItem>
                      </Select>
                      <Input
                        label="Bet Amount (ETH)"
                        placeholder="0.1"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                      />
                      <Button
                        color="secondary"
                        className="w-full"
                        size="lg"
                        isDisabled={!isConnected || !betAmount || !betCategory || bettingPhase !== 'commit'}
                      >
                        {isConnected ? 'Commit Bet' : 'Connect Wallet'}
                      </Button>
                      <p className="text-xs text-gray-500">
                        🔒 Bets are hidden until reveal phase
                      </p>
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>

              {/* Auction Progress */}
              <Card className="p-4">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Auction Progress</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Price Decay</span>
                        <span>{Math.round(((parseFloat(startPrice) - parseFloat(currentPrice)) / parseFloat(startPrice)) * 100)}%</span>
                      </div>
                      <Progress
                        value={((parseFloat(startPrice) - parseFloat(currentPrice)) / parseFloat(startPrice)) * 100}
                        color="warning"
                        size="sm"
                      />
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800">
                        Next price update in 30 seconds
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </DefaultLayout>
  )
}