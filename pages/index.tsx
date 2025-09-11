import { useRouter } from "next/router";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import { Tab, Tabs } from "@heroui/react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const router = useRouter();

  const navigateToPage = (link: string) => {
    router.push(link);
  };

  return (
      <DefaultLayout>
        {/* Hero Section */}
        <section className="relative z-10 flex flex-col bg-black/2 items-center justify-center gap-4 py-12 md:py-24">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="inline-block max-w-4xl text-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={title({ size: "lg", class: "gradient-metal" })}>
              Dual Auction Protocol for&nbsp;
            </h1>
            <h1 className={title({ color: "blue", size: "lg" })}>
              Domain NFTs
            </h1>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-24 mt-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              className="bg-gradient-to-b from-[#474a4f] to-white-900 text-white hover:scale-105 transition-transform duration-300 cursor-pointer p-12"
              onPress={() => navigateToPage("/hybrid")}
            >
              <CardHeader className="pb-4">
                <h3 className="text-3xl text-success-800 font-bold">
                  🎯 Hybrid Batch Auctions
                </h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 text-lg mb-8">
                  <li>• Auction multiple domains as portfolios</li>
                  <li>• Fractional ownership support</li>
                  <li>• Gamified bidding with loyalty rewards</li>
                  <li>• Soft & hard bid mechanisms</li>
                </ul>
                <Button
                  as={Link}
                  className="font-semibold"
                  color="success"
                  href="/hybrid"
                  variant="flat"
                >
                  Browse Hybrid Auctions
                </Button>
              </CardBody>
            </Card>

            <Card
              className="bg-gradient-to-b from-[#474a4f] to-white-900 text-white hover:scale-105 transition-transform duration-300 cursor-pointer p-12"
              onPress={() => navigateToPage("/premium")}
            >
              <CardHeader className="pb-4">
                <h3 className="text-3xl text-primary-800 font-bold">
                  🏆 Premium Domain Auctions
                </h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 text-lg mb-8">
                  <li>• Single premium domain auctions</li>
                  <li>• 4-tier price betting system</li>
                  <li>• Commit-reveal betting mechanism</li>
                  <li>• First bid wins instantly</li>
                </ul>
                <Button
                  as={Link}
                  className="w-full font-semibold"
                  color="success"
                  href="/premium"
                  variant="flat"
                >
                  Browse Premium Auctions
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24 mt-12">
          <div className="mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className={title({ size: "lg", class: "gradient-metal" })}>
                🎯 Hybrid Batch Auctions
              </h2>
              <p className={subtitle({ class: "mt-4 text-gray-300" })}>
                Batch Dutch auctions with gamified bidding and loyalty rewards
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm p-4">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 7L12 3L4 7L12 11L20 7Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M4 12L12 16L20 12"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M4 17L12 21L20 17"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Batch Dutch Auctions
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Auction multiple domain NFTs as portfolios</li>
                      <li>• Fractional ownership support</li>
                      <li>• Linear price decay over time</li>
                      <li>• Reserve price protection</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm p-4">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            height="14"
                            rx="2"
                            stroke="white"
                            strokeWidth="2"
                            width="20"
                            x="2"
                            y="3"
                          />
                          <circle
                            cx="8"
                            cy="14"
                            r="2"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 10L18 8L20 10"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 8V12"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M6 9H6.01"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M10 9H10.01"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Gamified Bidding
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>
                        • <strong>Soft Bids:</strong> Intent-based
                        auto-conversion
                      </li>
                      <li>
                        • <strong>Bonds:</strong> 0.2% refundable deposit
                      </li>
                      <li>
                        • <strong>Loyalty Rewards:</strong> Time-weighted points
                      </li>
                      <li>
                        • <strong>Sale-Gated:</strong> Rewards only on success
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm p-4">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M8 18L10 16"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 6L14 8"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Reverse Royalty Engine
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Dynamic royalties starting at 0%</li>
                      <li>• Increases per block to create urgency</li>
                      <li>• Optional for secondary sales</li>
                      <li>• Automatic distribution to creators</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Premium Auctions Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className={title({ size: "lg", class: "gradient-metal" })}>
                🏆 Premium Auctions with Betting
              </h2>
              <p className={subtitle({ class: "mt-4 text-gray-300" })}>
                Single domain auctions with 4-tier price betting mechanism
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm p-4">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M2 17L12 22L22 17"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M2 12L12 17L22 12"
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
                      <h3 className="text-2xl font-bold text-white mt-4">
                        Single Domain Auctions
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Premium single domain NFTs</li>
                      <li>• First bid wins and ends auction</li>
                      <li>• Timestamp-based duration</li>
                      <li>• Configurable price thresholds</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm p-4">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            height="4"
                            rx="1"
                            stroke="white"
                            strokeWidth="2"
                            width="18"
                            x="3"
                            y="3"
                          />
                          <rect
                            height="4"
                            rx="1"
                            stroke="white"
                            strokeWidth="2"
                            width="18"
                            x="3"
                            y="8"
                          />
                          <rect
                            height="4"
                            rx="1"
                            stroke="white"
                            strokeWidth="2"
                            width="18"
                            x="3"
                            y="13"
                          />
                          <rect
                            height="3"
                            rx="1"
                            stroke="white"
                            strokeWidth="2"
                            width="18"
                            x="3"
                            y="18"
                          />
                          <path
                            d="M7 5H7.01"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M7 10H7.01"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M7 15H7.01"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M7 19.5H7.01"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4">
                        4-Tier Price Betting
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Above High Price (Category 3)</li>
                      <li>• High~Low Range (Category 2)</li>
                      <li>• Below Low Price (Category 1)</li>
                      <li>• Auction Uncleared (Category 0)</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm p-4">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 1V3"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 21V23"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M4.22 4.22L5.64 5.64"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M18.36 18.36L19.78 19.78"
                            stroke="white"
                            strokeLinecap="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4">
                        Commit-Reveal Betting
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Hidden bets prevent manipulation</li>
                      <li>• Configurable reward distribution</li>
                      <li>• Anti-sniping protection</li>
                      <li>• Penalty for unrevealed bets</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className={title({ size: "lg", class: "gradient-metal" })}>
                How It Works
              </h2>
              <p className={subtitle({ class: "mt-4" })}>
                Simple steps to participate in hybrid Dutch auctions
              </p>
            </motion.div>

            <div className="text-center">
              <Tabs>
                <Tab key="hybrid" title="Hybrid Auctions">
                  <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                    >
                      <div className="space-y-6 text-start">
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            1
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Connect Your Wallet
                            </h3>
                            <p className="text-gray-400">
                              Connect your Web3 wallet to the Doma testnet to
                              start bidding.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            2
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Create / Browse Hybrid Batch Auctions
                            </h3>
                            <p className="text-gray-400">
                              Create auctions with your domain portfolios or
                              Explore active batch auctions with real-time price
                              updates.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            3
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Place Smart Bids
                            </h3>
                            <p className="text-gray-400">
                              Use soft bids for auto-conversion or hard bids for
                              immediate purchase.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            4
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">Earn Rewards</h3>
                            <p className="text-gray-400">
                              Get loyalty points and rewards for early
                              participation in successful auctions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-12 text-white"
                      initial={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                    >
                      <h3 className="text-3xl font-bold mb-4">
                        Hybrid Auction
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Bundle:</span>
                          <span>100 Domain NFTs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Price:</span>
                          <span>100 USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Price:</span>
                          <span className="text-yellow-300">85 USDC ↓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reserve:</span>
                          <span>70 USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Filled:</span>
                          <span>65% (65/100)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reward Pool:</span>
                          <span>1% of sale</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </Tab>
                <Tab key="premium" title="Premium Auctions">
                  <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                    >
                      <div className="space-y-6 text-start">
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            1
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Connect Your Wallet
                            </h3>
                            <p className="text-gray-400">
                              Connect your Web3 wallet to the Doma testnet to
                              start bidding.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            2
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Create / Browse Premium Auctions with Betting
                            </h3>
                            <p className="text-gray-400">
                              Create auctions with your premium domain with
                              betting feature or Explore active premium auctions
                              with real-time betting states.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            3
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">
                              Place Bids / Commit Bet
                            </h3>
                            <p className="text-gray-400">
                              Use bid for immediate purchase or place a bet for
                              winning.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Chip color="primary" variant="solid">
                            4
                          </Chip>
                          <div>
                            <h3 className="font-semibold mb-2">Earn Rewards</h3>
                            <p className="text-gray-400">
                              Get rewards for successful betting in auction.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-12 text-white"
                      initial={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                    >
                      <h3 className="text-3xl font-bold mb-4">
                        Premium Auction
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Domain:</span>
                          <span>premium.doma</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Price:</span>
                          <span>1,000 USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Price:</span>
                          <span className="text-yellow-300">850 USDC ↓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reserve:</span>
                          <span>700 USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Betting Pool:</span>
                          <span>9200 USDC (20 wallets)</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-[#ffffff]/10 rounded-xl backdrop-blur-sm my-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={title({ size: "lg", class: "gradient-metal" })}>
              Ready to Start?
            </h2>
            <p className={subtitle({ class: "mt-4 mb-8" })}>
              Join the future of domain NFT trading with Hybrid Dutch auctions
            </p>
            <div className="flex gap-8 justify-center">
              <Button
                as={Link}
                className="font-semibold"
                color="success"
                href="/hybrid"
                size="lg"
                variant="flat"
              >
                Browse Hybrid Aucions
              </Button>
              <Button
                as={Link}
                className="font-semibold"
                color="primary"
                href="/premium"
                size="lg"
                variant="flat"
              >
                Browse Premium Aucions
              </Button>
            </div>
          </motion.div>
        </section>
      </DefaultLayout>
  );
}
