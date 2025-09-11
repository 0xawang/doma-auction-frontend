import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { TokenMetadata } from "@/hooks/useOwnershipToken";
import { shortenAddress } from "@/utils/token";

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  formData: any;
  selectedToken?: TokenMetadata;
  isCreating: boolean;
  onCreateAuction: () => void;
}

export function ReviewModal({
  isOpen,
  onOpenChange,
  formData,
  selectedToken,
  isCreating,
  onCreateAuction,
}: ReviewModalProps) {
  return (
    <Modal
      className="p-4"
      isOpen={isOpen}
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Review Hybrid Auction</h3>
                <p className="text-sm text-gray-500">
                  Please review your auction details before creating
                </p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Domain Info */}
                <div className="p-4 border border-grey-20/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Selected Domain</h4>
                  <p className="text-sm">
                    {selectedToken?.name} (#
                    {shortenAddress(formData.tokenId.toString())})
                  </p>
                </div>

                {/* Auction Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Auction Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Start Price:</span>
                        <span className="font-medium">
                          {formData.startPrice} ETH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reserve Price:</span>
                        <span className="font-medium">
                          {formData.reservePrice} ETH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Decrement:</span>
                        <span className="font-medium">
                          {formData.priceDecrement} ETH/min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">
                          {formData.duration} hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {formData.enableBetting && (
                    <div>
                      <h4 className="font-semibold mb-2">
                        Betting Configuration
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>High Threshold:</span>
                          <span className="font-medium">
                            {formData.highPrice} ETH
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Low Threshold:</span>
                          <span className="font-medium">
                            {formData.lowPrice} ETH
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Commit Duration:</span>
                          <span className="font-medium">
                            {formData.commitDuration} hours
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reveal Duration:</span>
                          <span className="font-medium">
                            {formData.revealDuration} hours
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {formData.enableBetting && (
                  <div className="p-4 bg-[#fff]/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Betting Categories</h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>Category 3:</strong> Final price &gt;{" "}
                        {formData.highPrice} ETH
                      </li>
                      <li>
                        • <strong>Category 2:</strong> {formData.lowPrice} ETH ≤
                        Final price ≤ {formData.highPrice} ETH
                      </li>
                      <li>
                        • <strong>Category 1:</strong> Final price &lt;{" "}
                        {formData.lowPrice} ETH
                      </li>
                      <li>
                        • <strong>Category 0:</strong> Auction fails to clear
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isCreating}
                onPress={onCreateAuction}
              >
                Create Premium Auction
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
