import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

import { useWeb3 } from "@/hooks/useWeb3";

interface BiddingPanelProps {
  auction: any;
  onSoftBidOpen: () => void;
  onHardBidOpen: () => void;
}

export function BiddingPanel({
  auction,
  onSoftBidOpen,
  onHardBidOpen,
}: BiddingPanelProps) {
  const { isConnected } = useWeb3();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h3 className="text-xl font-semibold">Place Bid</h3>
        </div>
      </CardHeader>
      <CardBody>
        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Connect your wallet to participate
            </p>
            <Button className="w-full" color="primary">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              className="w-full"
              color="primary"
              isDisabled={!auction.active}
              variant="solid"
              onPress={onSoftBidOpen}
            >
              Place Soft Bid
            </Button>

            <Button
              className="w-full"
              color="secondary"
              isDisabled={!auction.active}
              variant="bordered"
              onPress={onHardBidOpen}
            >
              Place Hard Bid
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>
                • Soft Bid: Auto-converts when price drops to your threshold
              </p>
              <p>• Hard Bid: Immediate purchase at current price</p>
              <p>• Bond: 0.2% of intended spend (refundable)</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
