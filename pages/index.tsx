import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-screen">
        <img 
          src="/images/domain-auction.jpg" 
          alt="Domain Auction Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <DefaultLayout>
        {/* Hero Section */}
        <section className="relative z-10 flex flex-col bg-black/2 items-center justify-center gap-4 py-8 md:py-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block max-w-4xl text-center justify-center"
          >
            <h1 className={title({ size: "lg", class: "gradient-metal" })}>
              Hybrid Dutch Auction Protocol for&nbsp;
            </h1>
            <h1 className={title({ color: "blue", size: "lg" })}>Domain NFTs</h1>
            <h2 className={subtitle({ class: "mt-4 max-w-2xl mx-auto text-gray-300" })}>
              Next-generation auction system featuring batch auctions, gamified bidding, 
              and dynamic royalties for domain trading.
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3 mt-6"
          >
            <Button
              as={Link}
              href="/auctions"
              color="primary"
              size="lg"
              radius="full"
              className="font-semibold"
            >
              Browse Auctions
            </Button>
            <Button
              as={Link}
              href="/create"
              color="success"
              size="lg"
              radius="full"
              className="font-semibold"
            >
              Create Auction
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className={title({size: "lg", class: "gradient-metal"})}>Revolutionary Features</h2>
              <p className={subtitle({ class: "mt-4 text-gray-300" })}>
                Three innovations combined into one powerful auction protocol
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <CardHeader className="pb-0 pt-6 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-black/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Batch Dutch Auctions</h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Auction multiple domain NFTs as portfolios</li>
                      <li>• Fractional ownership support (10%, 25%, etc.)</li>
                      <li>• Linear price decay over time</li>
                      <li>• Reserve price protection</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full bg-gradient-to-br from-purple-500 to-orange-600 text-white">
                  <CardHeader className="pb-0 pt-6 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-black/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Gamified Bidding</h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• <strong>Soft Bids:</strong> Intent-based auto-conversion</li>
                      <li>• <strong>Bonds:</strong> 0.2% refundable deposit</li>
                      <li>• <strong>Loyalty Rewards:</strong> Time-weighted points</li>
                      <li>• <strong>Sale-Gated:</strong> Rewards only on success</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full bg-gradient-to-br from-purple-400 to-pink-600 text-white">
                  <CardHeader className="pb-0 pt-6 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-black/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Reverse Royalty Engine</h3>
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

        {/* How It Works Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className={title({size: "lg", class: "gradient-metal"})}>How It Works</h2>
              <p className={subtitle({ class: "mt-4" })}>
                Simple steps to participate in hybrid Dutch auctions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Chip color="primary" variant="solid">1</Chip>
                    <div>
                      <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
                      <p className="text-gray-500">Connect your Web3 wallet to the Doma testnet to start bidding.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Chip color="primary" variant="solid">2</Chip>
                    <div>
                      <h3 className="font-semibold mb-2">Browse Auctions</h3>
                      <p className="text-gray-500">Explore active batch auctions with real-time price updates.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Chip color="primary" variant="solid">3</Chip>
                    <div>
                      <h3 className="font-semibold mb-2">Place Smart Bids</h3>
                      <p className="text-gray-500">Use soft bids for auto-conversion or hard bids for immediate purchase.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Chip color="primary" variant="solid">4</Chip>
                    <div>
                      <h3 className="font-semibold mb-2">Earn Rewards</h3>
                      <p className="text-gray-500">Get loyalty points and rewards for early participation in successful auctions.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
              >
                <h3 className="text-2xl font-bold mb-4">Example Auction</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Bundle:</span>
                    <span>100 Domain NFTs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Price:</span>
                    <span>1,000 DOMA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Price:</span>
                    <span className="text-yellow-300">850 DOMA ↓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reserve:</span>
                    <span>700 DOMA</span>
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className={title({size: "lg", class: "gradient-metal"})}>Ready to Start?</h2>
            <p className={subtitle({ class: "mt-4 mb-8" })}>
              Join the future of domain NFT trading with hybrid Dutch auctions
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                as={Link}
                href="/auctions"
                color="primary"
                size="lg"
                radius="full"
                className="font-semibold"
              >
                Start Bidding
              </Button>
              <Button
                as={Link}
                href="/create"
                variant="bordered"
                size="lg"
                radius="full"
                className="font-semibold"
              >
                Create Your First Auction
              </Button>
            </div>
          </motion.div>
        </section>
      </DefaultLayout>
    </div>
  );
}