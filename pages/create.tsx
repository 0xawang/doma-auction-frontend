
import { Card, CardBody, CardHeader } from '@heroui/card'
import { 
  Input, 
  Switch, 
  Slider, 
  Chip, 
  Button, 
  Image
} from '@heroui/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import NextImage from "next/image";

import { title } from '@/components/primitives'
import DefaultLayout from '@/layouts/default'
import { useAuction } from '@/hooks/useAuction'
import { useWeb3 } from '@/hooks/useWeb3'
import { TokenMetadata, useOwnershipToken } from '@/hooks/useOwnershipToken'
import { useState, useEffect } from 'react'
import { linkToDomainOnBlockExplorer, shortenAddress } from '@/utils/token'
import { DOMA_CHAINID, CONTRACT_ADDRESSES } from '@/config/web3'
import { useSwitchChain, useWriteContract, useReadContract } from 'wagmi'
import { ERC721_ABI } from '@/contracts/abi';

const AUCTION_CONTACT_ADDRESS = CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`

export default function CreateAuctionPage() {
  const { isConnected, address, chain } = useWeb3()
  const { createAuction, isPending, isSuccess } = useAuction()
  const { balance, fetchOwnedTokens, ownedTokens, isLoading } = useOwnershipToken()
  const { switchChain } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const [formData, setFormData] = useState({
    tokenIds: '',
    startPrice: '',
    reservePrice: '',
    priceDecrement: '',
    duration: 300,
    rewardBudgetBps: 100,
    royaltyIncrement: 0,
    enableRewards: true,
    enableRoyalty: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedTokens, setSelectedTokens] = useState<Set<TokenMetadata>>(new Set())
  
  const { data: isApprovedForAll } = useReadContract({
    address: CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`,
    abi: ERC721_ABI,
    functionName: 'isApprovedForAll',
    args: [address as `0x${string}`, AUCTION_CONTACT_ADDRESS],
    query: { enabled: !!address }
  })

  const handleApprove = async () => {
    if (!address) return
    
    setIsApproving(true)
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`,
        abi: [{
          inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }],
          name: 'setApprovalForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }],
        functionName: 'setApprovalForAll',
        args: [AUCTION_CONTACT_ADDRESS, true]
      })
      setIsApproved(true)
      toast.success('Tokens approved successfully!')
    } catch (error) {
      toast.error('Failed to approve tokens')
    } finally {
      setIsApproving(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.tokenIds.trim()) {
      newErrors.tokenIds = 'Token IDs are required'
    } else {
      try {
        const ids = formData.tokenIds.split(',').map(id => parseInt(id.trim()))
        if (ids.some(id => isNaN(id) || id < 1)) {
          newErrors.tokenIds = 'All token IDs must be valid positive numbers'
        }
      } catch {
        newErrors.tokenIds = 'Invalid token ID format'
      }
    }

    if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) {
      newErrors.startPrice = 'Start price must be greater than 0'
    }

    if (!formData.reservePrice || parseFloat(formData.reservePrice) <= 0) {
      newErrors.reservePrice = 'Reserve price must be greater than 0'
    }

    if (parseFloat(formData.startPrice) <= parseFloat(formData.reservePrice)) {
      newErrors.reservePrice = 'Reserve price must be less than start price'
    }

    if (!formData.priceDecrement || parseFloat(formData.priceDecrement) <= 0) {
      newErrors.priceDecrement = 'Price decrement must be greater than 0'
    }

    if (formData.duration < 10 || formData.duration > 10000) {
      newErrors.duration = 'Duration must be between 10 and 10,000 blocks'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const tokenIds = Array.from(selectedTokens).map(token => BigInt(token.tokenId))
      
      try {      
        await createAuction({
          tokenIds,
          startPrice: formData.startPrice,
          reservePrice: formData.reservePrice,
          priceDecrement: formData.priceDecrement,
          duration: formData.duration,
          rewardBudgetBps: formData.enableRewards ? formData.rewardBudgetBps : 0,
          royaltyIncrement: formData.enableRoyalty ? formData.royaltyIncrement : 0
        })
      } catch (error) {
        console.error('Error creating auction:', error)
        return
      }

      toast.success('Auction created successfully!')
      
      // Reset form
      setFormData({
        tokenIds: '',
        startPrice: '',
        reservePrice: '',
        priceDecrement: '',
        duration: 300,
        rewardBudgetBps: 100,
        royaltyIncrement: 0,
        enableRewards: true,
        enableRoyalty: false
      })
    } catch (error) {
      toast.error('Failed to create auction')
    }
  }

  const tokenCount = formData.tokenIds ? 
    formData.tokenIds.split(',').filter(id => id.trim()).length : 0

  const estimatedEndPrice = formData.startPrice && formData.priceDecrement ? 
    Math.max(
      parseFloat(formData.startPrice) - (parseFloat(formData.priceDecrement) * formData.duration),
      parseFloat(formData.reservePrice) || 0
    ).toFixed(2) : '0'

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className={title({ class: "gradient-metal" })}>Create Auction</h1>
            <p className="text-gray-400 mt-2">
              Set up a new hybrid Dutch auction for your domain NFTs
            </p>
          </div>

          {!isConnected ? (
            <Card>
              <CardBody className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-6">
                  You need to connect your wallet to create auctions
                </p>
                <div className='mx-auto mb-4'>
                 <Image
                    alt="Wallet Image"
                    as={NextImage}
                    height={100}
                    src="/images/wallet.webp"
                    width={100}
                  />
                  </div>
                
                <Button color="primary" size="lg" className='w-1/2 mx-auto'>
                  Connect Wallet
                </Button>
              </CardBody>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card className='p-4'>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Select Your Tokens</label>
                      </div>
                      
                      <div className="min-h-[120px] p-2">
                        {ownedTokens.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            {isLoading ? 'Loading tokens...' : 'There are no owned tokens'}
                          </div>
                        ) : (
                          <div className="flex gap-4 overflow-x-auto p-4">
                            {ownedTokens.map((token, idx) => {
                              const isSelected = selectedTokens.has(token)
                              return (
                                <div
                                  key={idx}
                                  className={`flex-shrink-0 w-48 bg-gray-800 rounded-xl shadow-md cursor-pointer transition-all duration-200 ${
                                    isSelected ? 'ring-2 ring-primary bg-gradient-to-br from-blue-500 to-purple-600' : 'shadow-gray-500'
                                  }`}
                                  onClick={() => {
                                    const newSelected = new Set(selectedTokens)
                                    if (isSelected) {
                                      newSelected.delete(token)
                                    } else {
                                      newSelected.add(token)
                                    }
                                    setSelectedTokens(newSelected)
                                    setFormData({...formData, tokenIds: Array.from(newSelected).map(t => t.tokenId).join(', ')})
                                  }}
                                >
                                  <div className="p-4 flex flex-col items-center">
                                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden flex items-center justify-center">
                                      <Image 
                                        alt="Token Image" 
                                        src={token.image ?? '/images/domain.png'} 
                                        width={120} 
                                        height={120}
                                        className="object-cover rounded-lg"
                                      />
                                    </div>
                                    <div className="text-center">
                                      <div className="text-sm font-semibold text-white mb-1 truncate w-full">
                                        {token.name}
                                      </div>
                                      <div className="text-xs text-gray-200">
                                        #{shortenAddress(token.tokenId.toString())}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Click tokens to select them for auction. <Chip size="sm" color="primary" variant="flat">
                        {tokenCount} token{tokenCount > 1 ? 's' : ''} selected
                      </Chip>
                      </p>
                      <p className="text-xs text-gray-500">
                        {Array.from(selectedTokens).map((token, idx) => (
                          <Chip 
                          key={idx} 
                          size="sm" 
                          color="success" 
                          variant="flat" 
                          className="mr-2 cursor-pointer"
                          onClick={() => window.open(linkToDomainOnBlockExplorer(token.tokenId.toString()), '_blank')}
                          endContent={<span className="text-sm mr-1">↗</span>}
                        >
                          {token.name}
                        </Chip>
                        ))}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Start Price (ETH)"
                      placeholder="1"
                      description="Initial auction price per token"
                      value={formData.startPrice}
                      onChange={(e) => setFormData({...formData, startPrice: e.target.value})}
                      isInvalid={!!errors.startPrice}
                      errorMessage={errors.startPrice}
                    />

                    <Input
                      label="Reserve Price (ETH)"
                      placeholder="0.7"
                      description="Minimum price floor per token"
                      value={formData.reservePrice}
                      onChange={(e) => setFormData({...formData, reservePrice: e.target.value})}
                      isInvalid={!!errors.reservePrice}
                      errorMessage={errors.reservePrice}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Price Decrement (ETH)"
                      placeholder="0.01"
                      description="Price reduction per block per token"
                      value={formData.priceDecrement}
                      onChange={(e) => setFormData({...formData, priceDecrement: e.target.value})}
                      isInvalid={!!errors.priceDecrement}
                      errorMessage={errors.priceDecrement}
                    />

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Duration: {Math.floor(formData.duration / 60)}h {formData.duration % 60 ? `${formData.duration % 60}m` : ''}
                      </label>
                      <Slider
                        value={formData.duration}
                        onChange={(value) => setFormData({...formData, duration: Array.isArray(value) ? value[0] : value})}
                        minValue={10}
                        maxValue={1440}
                        step={10}
                        className="mb-2"
                        aria-label="Auction duration in blocks"
                      />
                      <p className="text-xs text-gray-500">
                        Approximately {formData.duration} minutes
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Advanced Features */}
              <Card className='p-4'>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Advanced Features</h3>
                </CardHeader>
                <CardBody className="space-y-6">
                  {/* Loyalty Rewards */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Loyalty Rewards</h4>
                      <p className="text-sm text-gray-600">
                        Incentivize early bidding with reward distribution
                      </p>
                    </div>
                    <Switch
                      isSelected={formData.enableRewards}
                      onValueChange={(value) => setFormData({...formData, enableRewards: value})}
                    />
                  </div>

                  {formData.enableRewards && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Reward Budget: {formData.rewardBudgetBps / 100}% of sale proceeds
                      </label>
                      <Slider
                        value={formData.rewardBudgetBps}
                        onChange={(value) => setFormData({...formData, rewardBudgetBps: Array.isArray(value) ? value[0] : value})}
                        minValue={0}
                        maxValue={500}
                        step={25}
                        className="mb-2"
                        aria-label="Reward budget percentage"
                      />
                      <p className="text-xs text-gray-500">
                        Maximum 5% of sale proceeds can be allocated to rewards
                      </p>
                    </div>
                  )}

                  {/* Reverse Royalty */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Reverse Royalty Engine</h4>
                      <p className="text-sm text-gray-600">
                        Dynamic royalties that increase over time to create urgency
                      </p>
                    </div>
                    <Switch
                      isSelected={formData.enableRoyalty}
                      onValueChange={(value) => setFormData({...formData, enableRoyalty: value})}
                    />
                  </div>

                  {formData.enableRoyalty && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Royalty Increment: {formData.royaltyIncrement / 100}% per block
                      </label>
                      <Slider
                        value={formData.royaltyIncrement}
                        onChange={(value) => setFormData({...formData, royaltyIncrement: Array.isArray(value) ? value[0] : value})}
                        minValue={0}
                        maxValue={50}
                        step={1}
                        className="mb-2"
                        aria-label="Royalty increment per block"
                      />
                      <p className="text-xs text-gray-500">
                        Royalty starts at 0% and increases by this amount each block
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Preview */}
              <Card className='p-4'>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Auction Preview</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Token Count:</span>
                        <span className="font-semibold">{tokenCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Start Price:</span>
                        <span className="font-semibold">{formData.startPrice || '0'} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reserve Price:</span>
                        <span className="font-semibold">{formData.reservePrice || '0'} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated End Price:</span>
                        <span className="font-semibold">{estimatedEndPrice} ETH</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">{formData.duration} mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Decrement:</span>
                        <span className="font-semibold">{formData.priceDecrement || '0'} ETH/block</span>
                      </div>
                      {formData.enableRewards && (
                        <div className="flex justify-between">
                          <span>Reward Budget:</span>
                          <span className="font-semibold text-green-600">
                            {formData.rewardBudgetBps / 100}%
                          </span>
                        </div>
                      )}
                      {formData.enableRoyalty && (
                        <div className="flex justify-between">
                          <span>Royalty Increment:</span>
                          <span className="font-semibold text-purple-600">
                            {formData.royaltyIncrement / 100}%/block
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {tokenCount > 0 && formData.startPrice && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Total Bundle Value:</strong> {(parseFloat(formData.startPrice) * tokenCount).toFixed(2)} ETH
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                {chain?.id === DOMA_CHAINID ? (
                  !isApprovedForAll && !isApproved ? (
                    <Button
                      type="button"
                      color="warning"
                      size="lg"
                      className="flex-1"
                      isLoading={isApproving}
                      isDisabled={selectedTokens.size === 0}
                      onPress={handleApprove}
                    >
                      Approve Tokens
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      className="flex-1"
                      isLoading={isPending}
                      isDisabled={selectedTokens.size === 0}
                    >
                      Create Auction
                    </Button>
                  )
                ) : (
                  <Button
                    type="button"
                    color="primary"
                    size="lg"
                    className="flex-1"
                    onPress={() => switchChain({ chainId: DOMA_CHAINID })}
                  >
                    Switch to Doma Testnet
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="bordered"
                  size="lg"
                  onPress={() => window.history.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  )
}