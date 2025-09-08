import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Link } from "@heroui/link";
import { Image } from "@heroui/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAuctionCounter, useAuctionsData } from "@/hooks/useAuctions";
import { useWeb3 } from "@/hooks/useWeb3";
import { AuctionCard } from "@/components/auctions/AuctionCard";

export default function AuctionsPage() {
  const { isConnected } = useWeb3();
  const { auctionCounter } = useAuctionCounter();
  const { auctions } = useAuctionsData(auctionCounter);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("timeLeft");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAuctions = auctions.filter((auction) => {
    if (filter === "active" && !auction.active) return false;
    if (filter === "ending" && auction.timeLeft > "1h") return false;
    if (
      searchTerm &&
      !auction.seller.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className={title({ class: "gradient-metal" })}>
              Active Auctions
            </h1>
            <p className="text-gray-600 mt-2">
              {auctionCounter > 0
                ? `${auctionCounter} total auctions created`
                : "Browse live hybrid Dutch auctions"}
            </p>
          </div>

          {!isConnected && (
            <div className="mt-4 md:mt-0">
              <Chip color="warning" variant="flat">
                Connect wallet to participate
              </Chip>
            </div>
          )}
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
            <SelectItem key="ending">Ending Soon</SelectItem>
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
            <SelectItem key="filled">Fill Percentage</SelectItem>
          </Select>
        </div>

        {/* Auctions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction, index) => (
            <AuctionCard key={auction.id} auction={auction} index={index} />
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
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
              Try adjusting your filters or check back later for new auctions.
            </p>
            <Button as={Link} color="primary" href="/create">
              Create First Auction
            </Button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
