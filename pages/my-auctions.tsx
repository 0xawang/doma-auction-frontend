import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Progress } from '@heroui/progress'
import { Tabs, Tab } from '@heroui/tabs'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Link } from '@heroui/link'
import { motion } from 'framer-motion'

import { title } from '@/components/primitives'
import DefaultLayout from '@/layouts/default'
import { useWeb3 } from '@/hooks/useWeb3'

interface UserAuction {
  id: number
  tokenCount: number
  startPrice: string
  currentPrice: string
  reservePrice: string
  timeLeft: string
  filled: number
  status: 'active' | 'ended' | 'cleared'
  totalBids: number
  createdAt: string
}

interface UserBid {
  auctionId: number
  type: 'soft' | 'hard'
  threshold?: string
  currentPrice: string
  fraction: number
  status: 'pending' | 'converted' | 'refunded'
  placedAt: string
  bondAmount?: string
}

const mockUserAuctions: UserAuction[] = [
  {
    id: 1,
    tokenCount: 100,
    startPrice: '1000',
    currentPrice: '850',
    reservePrice: '700',
    timeLeft: '2h 15m',
    filled: 65,
    status: 'active',
    totalBids: 12,
    createdAt: '2024-01-15'
  },
  {
    id: 4,
    tokenCount: 50,
    startPrice: '500',
    currentPrice: '0',
    reservePrice: '300',
    timeLeft: 'Ended',
    filled: 100,
    status: 'cleared',
    totalBids: 8,
    createdAt: '2024-01-10'
  }
]

const mockUserBids: UserBid[] = [
  {
    auctionId: 2,
    type: 'soft',
    threshold: '420',
    currentPrice: '450',
    fraction: 25,
    status: 'pending',
    placedAt: '2024-01-16',
    bondAmount: '2.1'
  },
  {
    auctionId: 3,
    type: 'hard',
    currentPrice: '85',
    fraction: 100,
    status: 'converted',
    placedAt: '2024-01-14'
  },
  {
    auctionId: 5,
    type: 'soft',
    threshold: '200',
    currentPrice: '180',
    fraction: 50,
    status: 'refunded',
    placedAt: '2024-01-12',
    bondAmount: '5.0'
  }
]

export default function MyAuctionsPage() {
  const { isConnected, address } = useWeb3()
  const [activeTab, setActiveTab] = useState('created')

  if (!isConnected) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardBody className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-6">
                Connect your wallet to view your auctions and bids
              </p>
              <Button color="primary" size="lg">
                Connect Wallet
              </Button>
            </CardBody>
          </Card>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className={title()}>My Auctions</h1>
            <p className="text-gray-600 mt-2">
              Manage your created auctions and track your bids
            </p>
          </div>

          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="mb-6"
          >
            <Tab key="created" title="Created Auctions">
              <div className="space-y-6">
                {mockUserAuctions.length === 0 ? (
                  <Card>
                    <CardBody className="text-center py-12">
                      <h3 className="text-lg font-semibold mb-2">No auctions created</h3>
                      <p className="text-gray-600 mb-4">
                        You haven't created any auctions yet
                      </p>
                      <Button as={Link} href="/create" color="primary">
                        Create Your First Auction
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {mockUserAuctions.map((auction, index) => (
                      <motion.div
                        key={auction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start w-full">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  Auction #{auction.id}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {auction.tokenCount} tokens • Created {auction.createdAt}
                                </p>
                              </div>
                              <Chip 
                                color={
                                  auction.status === 'active' ? 'success' : 
                                  auction.status === 'cleared' ? 'primary' : 'default'
                                }
                                variant="flat"
                              >
                                {auction.status}
                              </Chip>
                            </div>
                          </CardHeader>

                          <CardBody className="pt-0">
                            <div className="space-y-4">
                              {/* Price Info */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Current Price:</span>
                                  <span className="font-semibold">
                                    {auction.status === 'cleared' ? 'Sold' : `${auction.currentPrice} DOMA`}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                  <span>Started at:</span>
                                  <span>{auction.startPrice} DOMA</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                  <span>Reserve:</span>
                                  <span>{auction.reservePrice} DOMA</span>
                                </div>
                              </div>

                              {/* Progress */}
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Filled:</span>
                                  <span>{auction.filled}%</span>
                                </div>
                                <Progress 
                                  value={auction.filled} 
                                  color={auction.filled === 100 ? "success" : auction.filled > 50 ? "warning" : "primary"}
                                />
                              </div>

                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                  <span>Total Bids:</span>
                                  <span className="font-semibold">{auction.totalBids}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Time Left:</span>
                                  <span className="font-semibold">{auction.timeLeft}</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button
                                  as={Link}
                                  href={`/auctions/${auction.id}`}
                                  color="primary"
                                  variant="bordered"
                                  size="sm"
                                  className="flex-1"
                                >
                                  View Details
                                </Button>
                                {auction.status === 'active' && (
                                  <Button
                                    color="secondary"
                                    variant="light"
                                    size="sm"
                                  >
                                    Manage
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Tab>

            <Tab key="bids" title="My Bids">
              <div className="space-y-6">
                {mockUserBids.length === 0 ? (
                  <Card>
                    <CardBody className="text-center py-12">
                      <h3 className="text-lg font-semibold mb-2">No bids placed</h3>
                      <p className="text-gray-600 mb-4">
                        You haven't placed any bids yet
                      </p>
                      <Button as={Link} href="/auctions" color="primary">
                        Browse Auctions
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Bid History</h3>
                    </CardHeader>
                    <CardBody>
                      <Table aria-label="Bid history table">
                        <TableHeader>
                          <TableColumn>AUCTION</TableColumn>
                          <TableColumn>TYPE</TableColumn>
                          <TableColumn>PRICE/THRESHOLD</TableColumn>
                          <TableColumn>FRACTION</TableColumn>
                          <TableColumn>STATUS</TableColumn>
                          <TableColumn>BOND</TableColumn>
                          <TableColumn>DATE</TableColumn>
                          <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {mockUserBids.map((bid, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Link href={`/auctions/${bid.auctionId}`}>
                                  Auction #{bid.auctionId}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  size="sm" 
                                  color={bid.type === 'soft' ? 'primary' : 'secondary'}
                                  variant="flat"
                                >
                                  {bid.type}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                {bid.type === 'soft' ? 
                                  `${bid.threshold} DOMA` : 
                                  `${bid.currentPrice} DOMA`
                                }
                              </TableCell>
                              <TableCell>{bid.fraction}%</TableCell>
                              <TableCell>
                                <Chip 
                                  size="sm"
                                  color={
                                    bid.status === 'converted' ? 'success' :
                                    bid.status === 'pending' ? 'warning' : 'default'
                                  }
                                  variant="flat"
                                >
                                  {bid.status}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                {bid.bondAmount ? `${bid.bondAmount} DOMA` : '-'}
                              </TableCell>
                              <TableCell>{bid.placedAt}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    as={Link}
                                    href={`/auctions/${bid.auctionId}`}
                                    size="sm"
                                    variant="light"
                                  >
                                    View
                                  </Button>
                                  {bid.status === 'pending' && bid.bondAmount && (
                                    <Button
                                      size="sm"
                                      color="danger"
                                      variant="light"
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            <Tab key="rewards" title="Rewards">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Loyalty Rewards</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">1,250</p>
                        <p className="text-sm text-gray-600">Total Points Earned</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">45.2 DOMA</p>
                        <p className="text-sm text-gray-600">Total Rewards Claimed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">8</p>
                        <p className="text-sm text-gray-600">Successful Auctions</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Loyalty NFT Status</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Current Tier: <strong>Silver Bidder</strong></p>
                          <p className="text-xs text-gray-500">Next tier at 2,000 points</p>
                        </div>
                        <Progress 
                          value={(1250 / 2000) * 100} 
                          color="secondary"
                          className="w-32"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Rewards</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">Auction #3 Reward</p>
                          <p className="text-sm text-gray-600">Early bidder bonus</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+12.5 DOMA</p>
                          <p className="text-xs text-gray-500">+150 points</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">Auction #1 Reward</p>
                          <p className="text-sm text-gray-600">Participation reward</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+8.3 DOMA</p>
                          <p className="text-xs text-gray-500">+100 points</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>
          </Tabs>
        </motion.div>
      </div>
    </DefaultLayout>
  )
}