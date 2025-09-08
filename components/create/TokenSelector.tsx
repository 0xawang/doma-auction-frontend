import { Image } from '@heroui/react'
import { Chip } from '@heroui/chip'
import { TokenMetadata } from '@/hooks/useOwnershipToken'
import { shortenAddress } from '@/utils/token'
import { CONTRACT_ADDRESSES } from '@/config/web3'
import { useDomainMetadata } from '@/hooks/useAuctions'

interface TokenSelectorProps {
  ownedTokens: TokenMetadata[]
  selectedTokens: Set<TokenMetadata>
  setSelectedTokens: (tokens: Set<TokenMetadata>) => void
  setFormData: (data: any) => void
  formData: any
  isLoading: boolean
}

export function TokenSelector({ 
  ownedTokens, 
  selectedTokens, 
  setSelectedTokens, 
  setFormData, 
  formData,
  isLoading 
}: TokenSelectorProps) {

  const {domainInfos} = useDomainMetadata(ownedTokens?.map(token => token.tokenId.toString()))

  return (
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
                        src={domainInfos ? domainInfos[idx]?.image || '/images/domain.png' : '/images/domain.png'} 
                        width={120} 
                        height={120}
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white mb-1 truncate w-full">
                        {domainInfos ? domainInfos[idx]?.name : ''}
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
        {selectedTokens.size} token{selectedTokens.size > 1 ? 's' : ''} selected
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
            onClick={() => window.open(`https://explorer-testnet.doma.xyz/token/${CONTRACT_ADDRESSES.OWNERSHIP_TOKEN}/instance/${token.tokenId}`, '_blank')}
            endContent={<span className="text-xs">↗</span>}
          >
            {token.name}
          </Chip>
        ))}
      </p>
    </div>
  )
}