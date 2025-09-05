import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Progress } from '@heroui/progress'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Link } from '@heroui/link'
import { motion } from 'framer-motion'

import { title } from '@/components/primitives'
import DefaultLayout from '@/layouts/default'
import { useAuctionCounter, useAuctionsData } from '@/hooks/useAuctions'
import { useWeb3 } from '@/hooks/useWeb3'
import { linkToBlockExplorer, shortenAddress } from '@/utils/token'
import { Image } from '@heroui/react'

export default function AuctionsPage() {
  const { isConnected } = useWeb3()
  const { auctionCounter } = useAuctionCounter()
  const { auctions } = useAuctionsData(auctionCounter)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('timeLeft')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAuctions = auctions.filter(auction => {
    if (filter === 'active' && !auction.active) return false
    if (filter === 'ending' && auction.timeLeft > '1h') return false
    if (searchTerm && !auction.seller.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className={title({class: "gradient-metal"})}>Active Auctions</h1>
            <p className="text-gray-600 mt-2">
              {auctionCounter > 0 ? `${auctionCounter} total auctions created` : 'Browse live hybrid Dutch auctions'}
            </p>
          </div>
          
          {!isConnected && (
            <div className="mt-4 md:mt-0">
              <Chip color="warning" variant="flat">
                Connect wallet to participate
              </Chip>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search by seller address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-80"
          />
          
          <Select
            placeholder="Filter auctions"
            selectedKeys={[filter]}
            onSelectionChange={(keys) => setFilter(Array.from(keys)[0] as string)}
            className="md:w-48"
            aria-label="Filter auctions by status"
          >
            <SelectItem key="all">All Auctions</SelectItem>
            <SelectItem key="active">Active Only</SelectItem>
            <SelectItem key="ending">Ending Soon</SelectItem>
          </Select>

          <Select
            placeholder="Sort by"
            selectedKeys={[sortBy]}
            onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
            className="md:w-48"
            aria-label="Sort auctions by criteria"
          >
            <SelectItem key="timeLeft">Time Left</SelectItem>
            <SelectItem key="price">Current Price</SelectItem>
            <SelectItem key="filled">Fill Percentage</SelectItem>
          </Select>
        </div>

        {/* Auctions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow p-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🏷️</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          Auction #{auction.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {auction.tokenIds.length} Domain{auction.tokenIds.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {auction.royaltyIncrement != 0 && (
                        <Chip size="sm" color="secondary" variant="flat">
                          Royalty+
                        </Chip>
                      )}
                      {auction.rewardBudgetBps > 0 && (
                        <Chip size="sm" color="success" variant="flat">
                          Rewards
                        </Chip>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div className="space-y-4">
                    {/* Seller */}
                    <div className="flex justify-between text-sm">
                      <span>Seller:</span>
                      <span className="font-mono">
                        <Link isExternal showAnchorIcon href={linkToBlockExplorer(auction.seller)}>
                          {shortenAddress(auction.seller)}
                        </Link>
                      </span>
                    </div>

                    {/* Price Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Price:</span>
                        <span className="font-semibold text-blue-600">
                          {auction.currentPrice} ETH
                        </span>
                      </div>                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Started at:</span>
                        <span>{auction.startPrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Reserve:</span>
                        <span>{auction.reservePrice} ETH</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Filled:</span>
                        <span>{auction.filled}%</span>
                      </div>
                      <Progress 
                        size="sm"
                        value={auction.filled} 
                        color={auction.filled > 80 ? "success" : auction.filled > 50 ? "warning" : "primary"}
                        className="mb-2"
                        aria-label={`Auction ${auction.filled}% filled`}
                      />
                    </div>

                    {/* Time Left */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Time left:</span>
                      <Chip 
                        size="sm" 
                        color={auction.timeLeft < '1h' ? "danger" : "primary"}
                        variant="flat"
                      >
                        {auction.timeLeft}
                      </Chip>
                    </div>

                    {/* Rewards */}
                    {auction.rewardBudgetBps > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Reward Pool:</span>
                        <span className="text-green-600">
                          {auction.rewardBudgetBps / 100}% of sale
                        </span>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      as={Link}
                      href={`/auctions/${auction.id}`}
                      color="primary"
                      variant={isConnected ? "solid" : "bordered"}
                      className="w-full mt-4"
                      isDisabled={!isConnected}
                    >
                      {isConnected ? 'View & Bid' : 'Connect Wallet to Bid'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
            <div className="flex justify-center mb-4">
              <Image width={200} height={150} src="/images/auction.png" alt="No auctions" />
            </div>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for new auctions.
            </p>
            <Button as={Link} href="/create" color="primary">
              Create First Auction
            </Button>
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}