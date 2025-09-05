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
import { useAuction } from '@/hooks/useAuction'
import { useAuctionData } from '@/hooks/useAuctions'
import { useWeb3 } from '@/hooks/useWeb3'
import { linkToBlockExplorer, shortenAddress } from '@/utils/token'
import { Link } from '@heroui/react'

export default function AuctionDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const auctionId = id ? parseInt(id as string) - 1 : undefined

  const { isConnected, address } = useWeb3()
  const { auction } = useAuctionData(auctionId)
  const { placeSoftBid, placeHardBid, isPending, isSuccess } = useAuction()
  
  const { isOpen: isSoftBidOpen, onOpen: onSoftBidOpen, onClose: onSoftBidClose } = useDisclosure()
  const { isOpen: isHardBidOpen, onOpen: onHardBidOpen, onClose: onHardBidClose } = useDisclosure()

  const [softBidThreshold, setSoftBidThreshold] = useState('')
  const [softBidFraction, setSoftBidFraction] = useState(10)
  const [hardBidFraction, setHardBidFraction] = useState(10)

  if (!auction) {
    return (
      <DefaultLayout>
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            onPress={() => router.back()}
          >
            ← Back
          </Button>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className={title({class: 'gradient-metal'})}>Auction #{auctionId? auctionId + 1: 1}</h1>
          <p className='mt-4'>Loading auction details...</p>
          <div className='min-h-[360px]'></div>
        </div>
      </DefaultLayout>
    )
  }

  const fillPercentage = (auction.totalConverted / auction.tokenIds.length) * 100

  const handleSoftBid = async () => {
    if (!softBidThreshold || !auctionId) return
    
    try {
      const desiredCount = Math.floor((auction.tokenIds.length * softBidFraction) / 100)
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
      const desiredCount = Math.floor((auction.tokenIds.length * hardBidFraction) / 100)
      await placeHardBid(auctionId, desiredCount, auction.currentPrice!)
      toast.success('Hard bid placed successfully!')
      onHardBidClose()
    } catch (error) {
      toast.error('Failed to place hard bid')
    }
  }

  const bondRequired = softBidThreshold ? 
    (parseFloat(softBidThreshold) * (auction.tokenIds.length * softBidFraction / 100) * 0.002).toFixed(4) : '0'

  const hardBidCost = (parseFloat(auction.currentPrice!) * (auction.tokenIds.length * hardBidFraction / 100)).toFixed(8)

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                <h1 className={title({class: 'gradient-metal'})}>Auction #{auction.id}</h1>
                <p className="text-gray-600 mt-2">
                  {auction.tokenIds.length} 
                  Domain NFTs • Seller: 
                  <Link isExternal showAnchorIcon color='success' href={linkToBlockExplorer(auction.seller)}>
                    {shortenAddress(auction.seller)}
                  </Link> 
                </p>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                {auction.rewardBudgetBps > 0 && (
                  <Chip color="success" variant="flat">
                    {auction.rewardBudgetBps / 100}% Rewards
                  </Chip>
                )}
                {auction.royaltyIncrement > 0 && (
                  <Chip color="secondary" variant="flat">
                    Reverse Royalty
                  </Chip>
                )}
                <Chip color={auction.active ? "success" : "default"}>
                  {auction.active ? "Active" : "Ended"}
                </Chip>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Chart */}
              <Card className='p-4'>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <h3 className="text-xl font-semibold">Price Information</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Current Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {parseFloat(auction.currentPrice).toFixed(5)} ETH
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Started At</p>
                      <p className="text-xl font-semibold">
                        {auction.startPrice} ETH
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Reserve Price</p>
                      <p className="text-xl font-semibold">
                        {auction.reservePrice} ETH
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Price Decay</span>
                      <span>{(parseFloat(auction.priceDecrement) * 30) .toFixed(6)} ETH per min</span>
                    </div>
                    <Progress 
                      value={((parseFloat(auction.startPrice) - parseFloat(auction.currentPrice!)) / 
                              (parseFloat(auction.startPrice) - parseFloat(auction.reservePrice))) * 100}
                      color="warning"
                      aria-label="Price decay progress"
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Auction Progress */}
              <Card className='p-4'>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h3 className="text-xl font-semibold">Auction Progress</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tokens Sold</span>
                        <span>{auction.totalConverted} / {auction.tokenIds.length}</span>
                      </div>
                      <Progress 
                        value={fillPercentage}
                        color={fillPercentage > 80 ? "success" : fillPercentage > 50 ? "warning" : "primary"}
                        aria-label={`Auction ${fillPercentage.toFixed(1)}% filled`}
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
                          {auction.tokenIds.length - auction.totalConverted} tokens
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Token Details */}
              <Card className='p-4'>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📦</span>
                    <h3 className="text-xl font-semibold">Bundle Details</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <Tabs key="bundle-details">
                    <Tab key="overview" title="Overview">
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Total Tokens:</span>
                            <span className="font-semibold">{auction.tokenIds.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Contract:</span>
                            <Link 
                              isExternal 
                              showAnchorIcon 
                              color='success' 
                              className='font-mono'
                              href={linkToBlockExplorer(auction.seller)}>
                              {shortenAddress(auction.seller)}
                            </Link> 
                          </div>
                          <div className="flex justify-between">
                            <span>Auction Type:</span>
                            <span className="font-semibold">Batch Dutch</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment Token:</span>
                            <span className="font-semibold">ETH</span>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab key="tokens" title="Token IDs">
                      <div className="max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-10 gap-1 text-xs">
                          {auction.tokenIds.slice(0, 50).map(tokenId => (
                            <span key={tokenId} className="p-1 bg-gray-100 rounded text-center">
                              #{tokenId}
                            </span>
                          ))}
                          {auction.tokenIds.length > 50 && (
                            <span className="p-1 bg-gray-200 rounded text-center">
                              +{auction.tokenIds.length - 50}
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
              <Card className='p-4'>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <h3 className="text-xl font-semibold">Place Bid</h3>
                  </div>
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
                        isDisabled={!auction.active}
                      >
                        Place Soft Bid
                      </Button>
                      
                      <Button
                        color="success"
                        variant="bordered"
                        className="w-full"
                        onPress={onHardBidOpen}
                        isDisabled={!auction.active}
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
              <Card className='bg-gradient-to-br from-blue-500 to-purple-600 p-4'>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📈</span>
                    <h3 className="text-lg font-semibold">Statistics</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Start Block:</span>
                      <span className="font-mono">{auction.startBlock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{auction.duration} blocks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Royalty:</span>
                      <span>{auction.currentRoyalty}%</span>
                    </div>
                    {auction.rewardBudgetBps > 0 && (
                      <div className="flex justify-between">
                        <span>Reward Pool:</span>
                        <span className="text-green-600">
                          {auction.rewardBudgetBps / 100}%
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
        <Modal backdrop='blur' isOpen={isSoftBidOpen} onClose={onSoftBidClose}>
          <ModalContent>
            <ModalHeader>Place Soft Bid</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Price Threshold (ETH)"
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
                    minValue={1}
                    maxValue={100}
                    step={1}
                    className="mb-2"
                    aria-label="Desired fraction percentage for soft bid"
                  />
                  <p className="text-xs text-gray-500">
                    {Math.floor((auction.tokenIds.length * softBidFraction) / 100)} tokens
                  </p>
                </div>

                <div className="border border-white/30 bg-default-100 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Max Payment:</span>
                    <span className="font-semibold">
                      {softBidThreshold ? 
                        (parseFloat(softBidThreshold) * (auction.tokenIds.length * softBidFraction / 100)).toFixed(2) 
                        : '0'} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bond Required:</span>
                    <span className="font-semibold">{bondRequired} ETH</span>
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
        <Modal backdrop='blur' isOpen={isHardBidOpen} onClose={onHardBidClose}>
          <ModalContent>
            <ModalHeader>Place Hard Bid</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Current price: <strong>{auction.currentPrice} ETH per token</strong>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Desired Fraction: {hardBidFraction}%
                  </label>
                  <Slider
                    value={hardBidFraction}
                    onChange={(value) => setHardBidFraction(Array.isArray(value) ? value[0] : value)}
                    minValue={1}
                    maxValue={100}
                    step={1}
                    className="mb-2"
                    aria-label="Desired fraction percentage for hard bid"
                  />
                  <p className="text-xs text-gray-500">
                    {Math.floor((auction.tokenIds.length * hardBidFraction) / 100)} tokens
                  </p>
                </div>

                <div className="border border-white/30 bg-default-100 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-semibold text-lg">{hardBidCost} ETH</span>
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