import { Card, CardBody, Image, Button } from "@heroui/react";
import NextImage from "next/image";

interface NotConnectedProps {
  onConnectClick: () => void;
}

export function NotConnected({ onConnectClick }: NotConnectedProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-[#333]/60 backdrop-blur-sm">
      <CardBody className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-4">Connect Your Wallet</h3>
        <p className="text-gray-300 mb-6">
          You need to connect your wallet to create auctions
        </p>
        <div className="mx-auto mb-4">
          <Image
            alt="Wallet Image"
            as={NextImage}
            height={100}
            src="/images/wallet.webp"
            width={100}
          />
        </div>

        <Button
          className="w-1/2 mx-auto"
          color="primary"
          size="lg"
          onPress={onConnectClick}
        >
          Connect Wallet
        </Button>
      </CardBody>
    </Card>
  );
}
