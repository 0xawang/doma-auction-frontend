import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Chip } from '@heroui/chip'
import { Progress } from '@heroui/progress'
import { Tabs, Tab } from '@heroui/tabs'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import { Slider } from '@heroui/slider'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { title } from '@/components/primitives'
import DefaultLayout from '@/layouts/default'
import { useAuction, useAuctionData } from '@/hooks/useAuction'
import { useWeb3 } from '@/hooks/useWeb3'

export default function AuctionDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const auctionId = id ? parseInt(id as string) : undefined

  const { isConnected, address } = useWeb3()
  const { auction } = useAuctionData(auctionId)
  const { placeSoftBid, placeHardBid, isPending, isSuccess } = useAuction()
  
  const { isOpen: isSoftBidOpen, onOpen: onSoftBidOpen, onClose: onSoftBidClose } = useDisclosure()
  const { isOpen: isHardBidOpen, onOpen: onHardBidOpen, onClose: onHardBidClose } = useDisclosure()

  const [softBidThreshold, setSoftBidThreshold] = useState('')
  const [softBidFraction, setSoftBidFraction] = useState(10)
  const [hardBidFraction, setHardBidFraction] = useState(10)

  // Mock data for demonstration
  const mockAuction = {
    id: auctionId || 1,
    seller: '0x1234567890123456789012345678901234567890',
    tokenIds: Array.from({length: 100}, (_, i) => i + 1),
    startPrice: '1000',
    currentPrice: '850',
    reservePrice: '700',
    priceDecrement: '1',
    startBlock: 1000000,
    duration: 300,
    active: true,
    cleared: false,
    rewardBudgetBps: 100,
    royaltyIncrement: 0,
    paymentToken: '0x0000000000000000000000000000000000000000',
    totalConverted: 65,
    currentRoyalty: '0'
  }

  const currentAuction = auction || mockAuction
  const fillPercentage = (currentAuction.totalConverted / currentAuction.tokenIds.length) * 100

  const handleSoftBid = async () => {
    if (!softBidThreshold || !auctionId) return
    
    try {
      const desiredCount = Math.floor((currentAuction.tokenIds.length * softBidFraction) / 100)
      await placeSoftBid(auctionId, softBidThreshold, desiredCount)
      toast.success('Soft bid placed successfully!')
      onSoftBidClose()
    } catch (error) {
      toast.error('Failed to place soft bid')
    }
  }

  const handleHardBid = async () => {
    if (!auctionId) return
    
    try {
      const desiredCount = Math.floor((currentAuction.tokenIds.length * hardBidFraction) / 100)
      await placeHardBid(auctionId, desiredCount, currentAuction.currentPrice!)
      toast.success('Hard bid placed successfully!')
      onHardBidClose()
    } catch (error) {
      toast.error('Failed to place hard bid')
    }
  }

  const bondRequired = softBidThreshold ? 
    (parseFloat(softBidThreshold) * (currentAuction.tokenIds.length * softBidFraction / 100) * 0.002).toFixed(4) : '0'

  const hardBidCost = (parseFloat(currentAuction.currentPrice!) * (currentAuction.tokenIds.length * hardBidFraction / 100)).toFixed(2)

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="light"
                onPress={() => router.back()}
              >
                ← Back
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className={title()}>Auction #{currentAuction.id}</h1>
                <p className="text-gray-600 mt-2">
                  {currentAuction.tokenIds.length} Domain NFTs • Seller: {currentAuction.seller.slice(0, 10)}...
                </p>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                {currentAuction.rewardBudgetBps > 0 && (
                  <Chip color="success" variant="flat">
                    {currentAuction.rewardBudgetBps / 100}% Rewards
                  </Chip>
                )}
                {currentAuction.royaltyIncrement > 0 && (
                  <Chip color="secondary" variant="flat">
                    Reverse Royalty
                  </Chip>
                )}
                <Chip color={currentAuction.active ? "success" : "default"}>
                  {currentAuction.active ? "Active" : "Ended"}
                </Chip>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Chart */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Price Information</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Current Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {currentAuction.currentPrice} DOMA
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Started At</p>
                      <p className="text-xl font-semibold">
                        {currentAuction.startPrice} DOMA
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Reserve Price</p>
                      <p className="text-xl font-semibold">
                        {currentAuction.reservePrice} DOMA
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Price Decay</span>
                      <span>{currentAuction.priceDecrement} DOMA per block</span>
                    </div>
                    <Progress 
                      value={((parseFloat(currentAuction.startPrice) - parseFloat(currentAuction.currentPrice!)) / 
                              (parseFloat(currentAuction.startPrice) - parseFloat(currentAuction.reservePrice))) * 100}
                      color="warning"
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Auction Progress */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Auction Progress</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tokens Sold</span>
                        <span>{currentAuction.totalConverted} / {currentAuction.tokenIds.length}</span>
                      </div>
                      <Progress 
                        value={fillPercentage}
                        color={fillPercentage > 80 ? "success" : fillPercentage > 50 ? "warning" : "primary"}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Fill Percentage:</span>
                        <span className="font-semibold">{fillPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-semibold">
                          {currentAuction.tokenIds.length - currentAuction.totalConverted} tokens
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Token Details */}
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Bundle Details</h3>
                </CardHeader>
                <CardBody>
                  <Tabs>
                    <Tab key="overview" title="Overview">
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Total Tokens:</span>
                            <span className="font-semibold">{currentAuction.tokenIds.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Contract:</span>
                            <span className="font-mono text-xs">0x424b...F90f</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Auction Type:</span>
                            <span className="font-semibold">Batch Dutch</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment Token:</span>
                            <span className="font-semibold">DOMA</span>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab key="tokens" title="Token IDs">
                      <div className="max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-10 gap-1 text-xs">
                          {currentAuction.tokenIds.slice(0, 50).map(tokenId => (
                            <span key={tokenId} className="p-1 bg-gray-100 rounded text-center">
                              #{tokenId}
                            </span>
                          ))}
                          {currentAuction.tokenIds.length > 50 && (
                            <span className="p-1 bg-gray-200 rounded text-center">
                              +{currentAuction.tokenIds.length - 50}
                            </span>
                          )}
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </div>

            {/* Bidding Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Place Bid</h3>
                </CardHeader>
                <CardBody>
                  {!isConnected ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Connect your wallet to participate</p>
                      <Button color="primary" className="w-full">
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        color="primary"
                        variant="solid"
                        className="w-full"
                        onPress={onSoftBidOpen}
                        isDisabled={!currentAuction.active}
                      >
                        Place Soft Bid
                      </Button>
                      
                      <Button
                        color="secondary"
                        variant="bordered"
                        className="w-full"
                        onPress={onHardBidOpen}
                        isDisabled={!currentAuction.active}
                      >
                        Place Hard Bid
                      </Button>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Soft Bid: Auto-converts when price drops to your threshold</p>
                        <p>• Hard Bid: Immediate purchase at current price</p>
                        <p>• Bond: 0.2% of intended spend (refundable)</p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Auction Stats */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Statistics</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Start Block:</span>
                      <span className="font-mono">{currentAuction.startBlock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{currentAuction.duration} blocks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Royalty:</span>
                      <span>{currentAuction.currentRoyalty}%</span>
                    </div>
                    {currentAuction.rewardBudgetBps > 0 && (
                      <div className="flex justify-between">
                        <span>Reward Pool:</span>
                        <span className="text-green-600">
                          {currentAuction.rewardBudgetBps / 100}%
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Soft Bid Modal */}
        <Modal isOpen={isSoftBidOpen} onClose={onSoftBidClose}>
          <ModalContent>
            <ModalHeader>Place Soft Bid</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Price Threshold (DOMA)"
                  placeholder="Enter price per token"
                  value={softBidThreshold}
                  onChange={(e) => setSoftBidThreshold(e.target.value)}
                  description="Bid will auto-convert when price drops to this level"
                />
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Desired Fraction: {softBidFraction}%
                  </label>
                  <Slider
                    value={softBidFraction}
                    onChange={(value) => setSoftBidFraction(Array.isArray(value) ? value[0] : value)}
                    min={1}
                    max={100}
                    step={1}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    {Math.floor((currentAuction.tokenIds.length * softBidFraction) / 100)} tokens
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Max Payment:</span>
                    <span className="font-semibold">
                      {softBidThreshold ? 
                        (parseFloat(softBidThreshold) * (currentAuction.tokenIds.length * softBidFraction / 100)).toFixed(2) 
                        : '0'} DOMA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bond Required:</span>
                    <span className="font-semibold">{bondRequired} DOMA</span>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onSoftBidClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSoftBid}
                isLoading={isPending}
                isDisabled={!softBidThreshold}
              >
                Place Soft Bid
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Hard Bid Modal */}
        <Modal isOpen={isHardBidOpen} onClose={onHardBidClose}>
          <ModalContent>
            <ModalHeader>Place Hard Bid</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Current price: <strong>{currentAuction.currentPrice} DOMA per token</strong>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Desired Fraction: {hardBidFraction}%
                  </label>
                  <Slider
                    value={hardBidFraction}
                    onChange={(value) => setHardBidFraction(Array.isArray(value) ? value[0] : value)}
                    min={1}
                    max={100}
                    step={1}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    {Math.floor((currentAuction.tokenIds.length * hardBidFraction) / 100)} tokens
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-semibold text-lg">{hardBidCost} DOMA</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Immediate purchase at current price
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onHardBidClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleHardBid}
                isLoading={isPending}
              >
                Place Hard Bid
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  )
}