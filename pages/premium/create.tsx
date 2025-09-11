import { useEffect, useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { useSwitchChain, useWriteContract, useReadContract } from "wagmi";
import { type ZonedDateTime } from "@internationalized/date";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { parseEther } from "viem";

import { title } from "@/components/primitives";
import { useWeb3 } from "@/hooks/useWeb3";
import { ERC721_ABI } from "@/contracts/abi";
import { DOMA_CHAINID, CONTRACT_ADDRESSES } from "@/config/web3";
import { useOwnershipToken } from "@/hooks/useOwnershipToken";
import { useBetting } from "@/hooks/useBetting";
import DefaultLayout from "@/layouts/default";
import { NotConnected } from "@/components/hybrid/create/NotConnected";
import { useWalletModal } from "@/contexts/WalletContext";
import { DomainSelectionCard } from "@/components/premium/DomainSelectionCard";
import { AuctionSettingsCard } from "@/components/premium/AuctionSettingsCard";
import { BettingSettingsCard } from "@/components/premium/BettingSettingsCard";
import { ReviewModal } from "@/components/premium/ReviewModal";

const PREMIUM_AUCTION_ADDRESS =
  CONTRACT_ADDRESSES.AUCTION_BETTING as `0x${string}`;

const defaultParam = {
  tokenId: "",
  startPrice: "",
  reservePrice: "",
  priceDecrement: "",
  startedAt: null as ZonedDateTime | null,
  duration: "3",
  highPrice: "",
  lowPrice: "",
  enableBetting: true,
  commitDuration: "2",
  revealDuration: "2",
};

export default function CreatePremiumAuctionPage() {
  const { isConnected, address, chain } = useWeb3();
  const { ownedTokens, isLoading } = useOwnershipToken();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { openConnectModal } = useWalletModal();
  const { createAuctionBetting, isConfirming, isSuccess } = useBetting();

  const [isApproving, setIsApproving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [formData, setFormData] = useState(defaultParam);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: isApprovedForAll } = useReadContract({
    address: CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "isApprovedForAll",
    args: [address as `0x${string}`, PREMIUM_AUCTION_ADDRESS],
    query: { enabled: !!address },
  });

  const { data: isTokenApproved } = useReadContract({
    address: CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`,
    abi: ERC721_ABI,
    functionName: "getApproved",
    args: [BigInt(formData.tokenId || 0)],
    query: { enabled: !!formData.tokenId },
  });

  const isNFTApproved =
    isApprovedForAll ||
    isTokenApproved === PREMIUM_AUCTION_ADDRESS ||
    isApproved;

  const handleApprove = async () => {
    if (!address || !formData.tokenId) return;

    setIsApproving(true);
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.OWNERSHIP_TOKEN as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "approve",
        args: [PREMIUM_AUCTION_ADDRESS, BigInt(formData.tokenId)],
      });
      setIsApproved(true);
      toast.success("Domain NFT approved successfully!");
    } catch (error) {
      toast.error("Failed to approve domain NFT");
    } finally {
      setIsApproving(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tokenId) {
      newErrors.tokenId = "Token ID is required";
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

    if (formData.enableBetting) {
      if (!formData.highPrice || parseFloat(formData.highPrice) <= 0) {
        newErrors.highPrice = "High price threshold is required for betting";
      }

      if (!formData.lowPrice || parseFloat(formData.lowPrice) <= 0) {
        newErrors.lowPrice = "Low price threshold is required for betting";
      }

      if (parseFloat(formData.highPrice) <= parseFloat(formData.lowPrice)) {
        newErrors.lowPrice = "Low price must be less than high price";
      }
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
    setIsCreating(true);
    try {
      await createAuctionBetting(
        BigInt(formData.tokenId),
        parseEther(formData.startPrice),
        parseEther(formData.reservePrice),
        parseEther(formData.priceDecrement),
        parseInt(formData.duration) * 3600,
        parseEther(formData.highPrice),
        parseEther(formData.lowPrice),
        parseInt(formData.commitDuration) * 3600,
        parseInt(formData.revealDuration) * 3600,
      );

      toast.success("Premium auction created successfully!");

      // Reset form
      setFormData(defaultParam);
      onOpenChange();
    } catch (error) {
      toast.error("Failed to create premium auction");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (isConfirming) {
      toast.success("Confirming premium auction transaction!");
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Created premium auction successfully!");
    }
  }, [isSuccess]);

  const selectedToken = ownedTokens.find(
    (token) => token.tokenId.toString() === formData.tokenId.toString(),
  );

  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className={title({ class: "gradient-metal" })}>
              Create Premium Auction
            </h1>
            <p className="text-gray-400 mt-2">
              Set up a single domain auction with optional 4-tier betting system
            </p>
          </div>

          {!isConnected ? (
            <NotConnected onConnectClick={() => openConnectModal?.()} />
          ) : (
            <form className="space-y-8" onSubmit={handleReview}>
              <DomainSelectionCard
                errors={errors}
                formData={formData}
                isLoading={isLoading}
                ownedTokens={ownedTokens}
                setFormData={setFormData}
              />

              <AuctionSettingsCard
                errors={errors}
                formData={formData}
                setFormData={setFormData}
              />

              <BettingSettingsCard
                errors={errors}
                formData={formData}
                setFormData={setFormData}
              />

              {/* Submit */}
              <div className="flex gap-4">
                {chain?.id === DOMA_CHAINID ? (
                  !isNFTApproved ? (
                    <Button
                      className="flex-1"
                      color="warning"
                      isDisabled={!formData.tokenId}
                      isLoading={isApproving}
                      size="lg"
                      type="button"
                      onPress={handleApprove}
                    >
                      Approve Domain NFT
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      color="primary"
                      isDisabled={!formData.tokenId}
                      size="lg"
                      type="submit"
                    >
                      Review Premium Auction
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
        formData={formData}
        isCreating={isCreating}
        isOpen={isOpen}
        selectedToken={selectedToken}
        onCreateAuction={handleCreateAuction}
        onOpenChange={onOpenChange}
      />
    </DefaultLayout>
  );
}
