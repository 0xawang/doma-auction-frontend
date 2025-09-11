import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";
import { useSwitchChain } from "wagmi";
import { useRouter } from "next/router";

import { linkToBlockExplorer, shortenAddress } from "@/utils/token";
import { useWeb3 } from "@/hooks/useWeb3";
import { DOMA_CHAINID } from "@/config/web3";

interface AuctionCardProps {
  auction: any;
  index: number;
}

export function AuctionCard({ auction, index }: AuctionCardProps) {
  const { isConnected, chain } = useWeb3();
  const { switchChainAsync } = useSwitchChain();
  const router = useRouter();

  const handleViewAuction = async () => {
    if (chain?.id !== DOMA_CHAINID) {
      await switchChainAsync({ chainId: DOMA_CHAINID });
    }
    router.push(`/hybrid/${auction.id}`);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
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
                <h3 className="text-lg font-semibold">Auction #{auction.id}</h3>
                <p className="text-sm text-gray-500">
                  {auction.tokenIds.length} Domain
                  {auction.tokenIds.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {auction.royaltyIncrement != 0 && (
                <Chip color="secondary" size="sm" variant="flat">
                  Royalty+
                </Chip>
              )}
              {auction.rewardBudgetBps > 0 && (
                <Chip color="success" size="sm" variant="flat">
                  Rewards
                </Chip>
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          <div className="space-y-4">
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

            <div className="flex justify-between text-sm">
              <span>Seller:</span>
              <span className="font-mono">
                <Link
                  isExternal
                  showAnchorIcon
                  href={linkToBlockExplorer(auction.seller)}
                >
                  {shortenAddress(auction.seller)}
                </Link>
              </span>
            </div>

            {auction.rewardBudgetBps > 0 && (
              <div className="flex justify-between text-sm">
                <span>Reward Pool:</span>
                <span className="text-green-600">
                  {auction.rewardBudgetBps / 100}% of sale
                </span>
              </div>
            )}

            <Button
              className="w-full mt-4"
              color="primary"
              isDisabled={!isConnected}
              variant={isConnected ? "solid" : "bordered"}
              onPress={handleViewAuction}
            >
              {isConnected
                ? chain?.id == DOMA_CHAINID
                  ? "View & Bid"
                  : "Switch to Doma Network"
                : "Connect Wallet to Bid"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
