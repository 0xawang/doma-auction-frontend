import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Image,
  Link,
} from "@heroui/react";
import { motion } from "framer-motion";
import { formatEther } from "viem";

import { DomainInfo, PremiumAuction } from "@/types/auction";
import {
  linkToBlockExplorer,
  openLinkToDomainExplorer,
  shortenAddress,
} from "@/utils/token";

interface PremiumAuctionCardProps {
  auction: PremiumAuction;
  index: number;
  domainInfo?: DomainInfo;
}

export function PremiumAuctionCard({
  auction,
  index,
  domainInfo,
}: PremiumAuctionCardProps) {
  const now = Date.now() / 1000;
  const endTime = auction.endedAt;
  const isActive = !auction.cleared && now < endTime;
  const timeLeft = Math.max(0, endTime - now);

  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return "Ended";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) return `${hours}h ${minutes}m`;

    return `${minutes}m`;
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card
        className={`h-full hover:shadow-lg transition-shadow p-6 ${true ? "bg-blue-500/20 backdrop-blur-sm" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start w-full">
            <div>
              <h3 className="text-lg font-semibold">Premium Domain Auction</h3>
              <div className="flex items-center justify-center gap-2 my-4">
                <Image
                  alt="Token Image"
                  className="object-cover rounded-lg"
                  height={72}
                  src={domainInfo?.image || "/images/domain.png"}
                  width={72}
                />

                <div>
                  <h4 className="text-lg font-semibold">
                    {domainInfo?.name || "Domain Name"}
                  </h4>
                  <Chip
                    className="mr-2 cursor-pointer"
                    color="success"
                    endContent={<span className="text-xs">↗</span>}
                    size="sm"
                    variant="flat"
                    onClick={() =>
                      openLinkToDomainExplorer(auction.tokenId.toString())
                    }
                  >
                    {domainInfo?.name}
                  </Chip>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Chip
                color={
                  auction.cleared ? "success" : isActive ? "primary" : "default"
                }
                size="sm"
                variant="flat"
              >
                {auction.cleared ? "Sold" : isActive ? "Active" : "Ended"}
              </Chip>
              {isActive && (
                <Chip color="warning" size="sm" variant="flat">
                  {formatTimeLeft(timeLeft)}
                </Chip>
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Token ID:</span>
              <p className="font-medium text-success">
                {shortenAddress(auction.tokenId.toString())}
              </p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Seller:</span>
              <Link
                isExternal
                showAnchorIcon
                className="text-md"
                color="success"
                href={linkToBlockExplorer(auction.seller)}
              >
                {shortenAddress(auction.seller)}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Start Time:</span>
              <p className="font-medium text-warning">
                {new Date(auction.startedAt * 1000).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">End Time:</span>
              <p className="font-medium text-warning">
                {new Date(auction.endedAt * 1000).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Start Price:</span>
              <p className="font-medium text-warning">
                {formatEther(auction.startPrice)} ETH
              </p>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Reserve:</span>
              <p className="font-medium text-warning">
                {formatEther(auction.reservePrice)} ETH
              </p>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">High Bet:</span>
              <p className="font-medium text-warning">
                {formatEther(auction.highPrice)} ETH
              </p>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Low Bet:</span>
              <p className="font-medium text-warning">
                {formatEther(auction.lowPrice)} ETH
              </p>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Betting Pool:</span>
              <p className="font-medium text-success">2.35 ETH</p>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300">Bettors:</span>
              <p className="font-medium text-success">62 participants</p>
            </div>

            {auction.cleared && (
              <div className="bg-green-50 p-2 rounded">
                <span className="text-sm text-green-600">
                  Sold for {formatEther(auction.finalPrice)} ETH
                </span>
              </div>
            )}

            <Button
              as={Link}
              className="w-full mt-4"
              color={isActive ? "primary" : "default"}
              href={`/premium/${auction.id}`}
              variant={isActive ? "solid" : "bordered"}
            >
              {isActive ? "Place Bid & Bet" : "View Details"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
