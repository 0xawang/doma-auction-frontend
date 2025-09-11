import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Chip } from "@heroui/chip";
import { TokenMetadata } from "@/hooks/useOwnershipToken";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  formData: any;
  selectedTokens: Set<TokenMetadata>;
  isPending: boolean;
  onCreateAuction: () => void;
}

export function ReviewModal({
  isOpen,
  onOpenChange,
  formData,
  selectedTokens,
  isPending,
  onCreateAuction,
}: ReviewModalProps) {
  const openLinkToDomainExplorer = (tokenId: string) => {
    console.log(`Opening domain explorer for token ${tokenId}`);
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" className="p-4">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Review Hybrid Auction</h3>
                <p className="text-sm text-gray-500">Please review your auction details before creating</p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <div className="p-4 border border-grey-20/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Selected Domains ({selectedTokens.size})</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedTokens).map((token) => (
                      <Chip 
                        key={token.tokenId} 
                        className="mr-2 cursor-pointer"
                        color="success"
                        endContent={<span className="text-xs">↗</span>}
                        size="sm"
                        variant="flat"
                        onClick={() => openLinkToDomainExplorer(token.tokenId.toString())}
                      >
                        {token.name} 
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Auction Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Start Price:</span>
                        <span className="font-medium">{formData.startPrice} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reserve Price:</span>
                        <span className="font-medium">{formData.reservePrice} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Decrement:</span>
                        <span className="font-medium">{formData.priceDecrement} ETH/minute</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{formData.duration} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Advanced Features</h4>
                    <div className="space-y-2 text-sm">
                      {formData.enableRewards && (
                        <div className="flex justify-between">
                          <span>Reward Budget:</span>
                          <span className="font-medium text-green-600">{formData.rewardBudgetBps / 100}%</span>
                        </div>
                      )}
                      {formData.enableRoyalty && (
                        <div className="flex justify-between">
                          <span>Royalty Increment:</span>
                          <span className="font-medium text-purple-600">{formData.royaltyIncrement / 100}%/block</span>
                        </div>
                      )}
                      {!formData.enableRewards && !formData.enableRoyalty && (
                        <p className="text-gray-500 italic">No advanced features enabled</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#fff]/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Bundle Summary</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Total Domains:</strong> {selectedTokens.size}</p>
                    <p><strong>Bundle Start Value:</strong> {(parseFloat(formData.startPrice || "0") * selectedTokens.size).toFixed(4)} ETH</p>
                    <p><strong>Bundle Reserve Value:</strong> {(parseFloat(formData.reservePrice || "0") * selectedTokens.size).toFixed(4)} ETH</p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                isLoading={isPending}
                onPress={onCreateAuction}
              >
                Create Hybrid Auction
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}