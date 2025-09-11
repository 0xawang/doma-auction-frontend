import { useState } from "react";
import { useSwitchChain, useWriteContract, useReadContract } from "wagmi";
import { Button, Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { title } from "@/components/primitives";
import { useWeb3 } from "@/hooks/useWeb3";
import { useAuction } from "@/hooks/useAuction";
import { ERC721_ABI } from "@/contracts/abi";
import { useWalletModal } from "@/contexts/WalletContext";
import { DOMA_CHAINID, CONTRACT_ADDRESSES } from "@/config/web3";
import { TokenMetadata, useOwnershipToken } from "@/hooks/useOwnershipToken";
import DefaultLayout from "@/layouts/default";
import { TokenSelector } from "@/components/hybrid/create/TokenSelector";
import { PriceSettings } from "@/components/hybrid/create/PriceSettings";
import { AdvancedFeatures } from "@/components/hybrid/create/AdvancedFeatures";
import { AuctionPreview } from "@/components/hybrid/create/AuctionPreview";
import { NotConnected } from "@/components/hybrid/create/NotConnected";
import { ReviewModal } from "@/components/hybrid/create/ReviewModal";

const defaultParam = {
  tokenIds: "",
  startPrice: "",
  reservePrice: "",
  priceDecrement: "",
  startedAt: null,
  duration: 300,
  rewardBudgetBps: 100,
  royaltyIncrement: 0,
  enableRewards: true,
  enableRoyalty: false,
}

const AUCTION_CONTACT_ADDRESS =
  CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`;

export default function CreateAuctionPage() {
  const { isConnected, address, chain } = useWeb3();
  const { createAuction, isPending, isSuccess } = useAuction();
  const { ownedTokens, isLoading } = useOwnershipToken();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { openConnectModal } = useWalletModal();
  const [formData, setFormData] = useState(defaultParam);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTokens, setSelectedTokens] = useState<Set<TokenMetadata>>(
    new Set(),
  );

  const { data: isApprovedForAll } = useReadContract({
    address: CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "isApprovedForAll",
    args: [address as `0x${string}`, AUCTION_CONTACT_ADDRESS],
    query: { enabled: !!address },
  });

  const handleApprove = async () => {
    if (!address) return;

    setIsApproving(true);
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "setApprovalForAll",
        args: [AUCTION_CONTACT_ADDRESS, true],
      });
      setIsApproved(true);
      toast.success("Tokens approved successfully!");
    } catch (error) {
      toast.error("Failed to approve tokens");
    } finally {
      setIsApproving(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tokenIds.trim()) {
      newErrors.tokenIds = "Token IDs are required";
    } else {
      try {
        const ids = formData.tokenIds
          .split(",")
          .map((id) => parseInt(id.trim()));

        if (ids.some((id) => isNaN(id) || id < 1)) {
          newErrors.tokenIds = "All token IDs must be valid positive numbers";
        }
      } catch {
        newErrors.tokenIds = "Invalid token ID format";
      }
    }

    if (!formData.startPrice || parseFloat(formData.startPrice) <= 0) {
      newErrors.startPrice = "Start price must be greater than 0";
    }

    if (!formData.reservePrice || parseFloat(formData.reservePrice) <= 0) {
      newErrors.reservePrice = "Reserve price must be greater than 0";
    }

    if (parseFloat(formData.startPrice) <= parseFloat(formData.reservePrice)) {
      newErrors.reservePrice = "Reserve price must be less than start price";
    }

    if (!formData.priceDecrement || parseFloat(formData.priceDecrement) <= 0) {
      newErrors.priceDecrement = "Price decrement must be greater than 0";
    }

    if (formData.duration < 10 || formData.duration > 10000) {
      newErrors.duration = "Duration must be between 10 and 10,000 blocks";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onOpen();
  };

  const handleCreateAuction = async () => {
    try {
      const tokenIds = Array.from(selectedTokens).map((token) =>
        BigInt(token.tokenId),
      );

      await createAuction({
        tokenIds,
        startPrice: formData.startPrice,
        reservePrice: formData.reservePrice,
        priceDecrement: formData.priceDecrement,
        duration: formData.duration,
        rewardBudgetBps: formData.enableRewards
          ? formData.rewardBudgetBps
          : 0,
        royaltyIncrement: formData.enableRoyalty
          ? formData.royaltyIncrement
          : 0
      });

      toast.success("Auction created successfully!");
      setFormData(defaultParam);
      setSelectedTokens(new Set());
      onOpenChange();
    } catch (error) {
      console.error("Error creating auction:", error);
      toast.error("Failed to create auction");
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className={title({ class: "gradient-metal" })}>
              Create Auction
            </h1>
            <p className="text-gray-400 mt-2">
              Set up a new hybrid Dutch auction for your domain NFTs
            </p>
          </div>

          {!isConnected ? (
            <NotConnected onConnectClick={() => openConnectModal?.()} />
          ) : (
            <form className="space-y-8" onSubmit={handleReview}>
              {/* Basic Information */}
              <Card className="p-4">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Basic Information</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  <TokenSelector
                    formData={formData}
                    isLoading={isLoading}
                    ownedTokens={ownedTokens}
                    selectedTokens={selectedTokens}
                    setFormData={setFormData}
                    setSelectedTokens={setSelectedTokens}
                  />

                  <PriceSettings
                    errors={errors}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </CardBody>
              </Card>

              {/* Advanced Features */}
              <AdvancedFeatures formData={formData} setFormData={setFormData} />

              {/* Preview */}
              <AuctionPreview
                formData={formData}
                selectedTokens={selectedTokens}
              />

              {/* Submit */}
              <div className="flex gap-4">
                {chain?.id === DOMA_CHAINID ? (
                  !isApprovedForAll && !isApproved ? (
                    <Button
                      className="flex-1"
                      color="warning"
                      isDisabled={selectedTokens.size === 0}
                      isLoading={isApproving}
                      size="lg"
                      type="button"
                      onPress={handleApprove}
                    >
                      Approve Tokens
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      color="primary"
                      isDisabled={selectedTokens.size === 0}
                      size="lg"
                      type="submit"
                    >
                      Review Hybrid Auction
                    </Button>
                  )
                ) : (
                  <Button
                    className="flex-1"
                    color="primary"
                    size="lg"
                    type="button"
                    onPress={() => switchChain({ chainId: DOMA_CHAINID })}
                  >
                    Switch to Doma Testnet
                  </Button>
                )}

                <Button
                  size="lg"
                  type="button"
                  variant="bordered"
                  onPress={() => window.history.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      <ReviewModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        formData={formData}
        selectedTokens={selectedTokens}
        isPending={isPending}
        onCreateAuction={handleCreateAuction}
      />
    </DefaultLayout>
  );
}
