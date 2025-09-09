import { Card, CardBody, CardHeader } from "@heroui/card";

interface AuctionPreviewProps {
  formData: any;
  selectedTokens: Set<any>;
}

export function AuctionPreview({
  formData,
  selectedTokens,
}: AuctionPreviewProps) {
  const tokenCount = selectedTokens.size;
  const estimatedEndPrice =
    formData.startPrice && formData.priceDecrement
      ? Math.max(
          parseFloat(formData.startPrice) -
            parseFloat(formData.priceDecrement) * formData.duration,
          parseFloat(formData.reservePrice) || 0,
        ).toFixed(2)
      : "0";

  return (
    <Card className="p-4">
      <CardHeader>
        <h3 className="text-xl font-semibold">Auction Preview</h3>
      </CardHeader>
      <CardBody>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Token Count:</span>
              <span className="font-semibold">{tokenCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Start Price:</span>
              <span className="font-semibold">
                {formData.startPrice || "0"} ETH
              </span>
            </div>
            <div className="flex justify-between">
              <span>Reserve Price:</span>
              <span className="font-semibold">
                {formData.reservePrice || "0"} ETH
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated End Price:</span>
              <span className="font-semibold">{estimatedEndPrice} ETH</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-semibold">{formData.duration} mins</span>
            </div>
            <div className="flex justify-between">
              <span>Price Decrement:</span>
              <span className="font-semibold">
                {formData.priceDecrement || "0"} ETH/min
              </span>
            </div>
            {formData.enableRewards && (
              <div className="flex justify-between">
                <span>Reward Budget:</span>
                <span className="font-semibold text-green-600">
                  {formData.rewardBudgetBps / 100}%
                </span>
              </div>
            )}
            {formData.enableRoyalty && (
              <div className="flex justify-between">
                <span>Royalty Increment:</span>
                <span className="font-semibold text-purple-600">
                  {formData.royaltyIncrement / 100}%/block
                </span>
              </div>
            )}
          </div>
        </div>

        {tokenCount > 0 && formData.startPrice && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Total Bundle Value:</strong>{" "}
              {(parseFloat(formData.startPrice) * tokenCount).toFixed(2)} ETH
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
