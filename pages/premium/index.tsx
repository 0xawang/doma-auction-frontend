import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Link } from "@heroui/link";
import { Image } from "@heroui/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { usePremiumAuctions } from "@/hooks/usePremiumAuctions";
import { useWeb3 } from "@/hooks/useWeb3";
import { PremiumAuctionCard } from "@/components/premium/PremiumAuctionCard";

export default function PremiumAuctionsPage() {
  const { isConnected } = useWeb3();
  const { auctionCounter, auctions, domainInfos, isLoading } =
    usePremiumAuctions();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("timeLeft");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className={title({ class: "gradient-metal" })}>
              Premium Domain Auctions
            </h1>
            <p className="text-gray-600 mt-2">
              {auctionCounter > 0
                ? `${auctionCounter} premium auctions created`
                : "Browse single domain auctions with 4-tier betting system"}
            </p>
          </div>

          <div className="flex gap-4 items-center mt-4 md:mt-0">
            {!isConnected && (
              <Chip color="warning" variant="flat">
                Connect wallet to participate
              </Chip>
            )}
            <Button as={Link} color="primary" href="/premium/create" size="lg">
              Create Premium Auction
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            className="md:w-80"
            placeholder="Search by seller address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            aria-label="Filter auctions by status"
            className="md:w-48"
            placeholder="Filter auctions"
            selectedKeys={[filter]}
            onSelectionChange={(keys) =>
              setFilter(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="all">All Auctions</SelectItem>
            <SelectItem key="active">Active Only</SelectItem>
            <SelectItem key="cleared">Cleared</SelectItem>
          </Select>

          <Select
            aria-label="Sort auctions by criteria"
            className="md:w-48"
            placeholder="Sort by"
            selectedKeys={[sortBy]}
            onSelectionChange={(keys) =>
              setSortBy(Array.from(keys)[0] as string)
            }
          >
            <SelectItem key="timeLeft">Time Left</SelectItem>
            <SelectItem key="price">Current Price</SelectItem>
            <SelectItem key="betting">Betting Pool</SelectItem>
          </Select>
        </div>

        {/* Auctions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full text-center py-8">
              <p>Loading auctions...</p>
            </div>
          )}
          {auctions
            .filter((auction) => !!auction)
            .map((auction, index) => (
              <PremiumAuctionCard
                key={index}
                auction={auction}
                domainInfo={domainInfos?.find(
                  (d) => d.id === auction.tokenId.toString(),
                )}
                index={index}
              />
            ))}
        </div>

        {auctionCounter === 0 && !isLoading && (
          <div className="text-center py-12 hover:shadow-lg transition-shadow bg-[#ffffff]/20 backdrop-blur-sm rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
            <div className="flex justify-center mb-4">
              <Image
                alt="No auctions"
                height={150}
                src="/images/auction.png"
                width={200}
              />
            </div>
            <p className="text-gray-600 mb-4">
              Be the first to create a premium domain auction with betting.
            </p>
            <Button as={Link} color="primary" href="/premium/create">
              Create First Premium Auction
            </Button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
