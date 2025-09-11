import { Card, CardHeader, CardBody, Switch, Slider } from "@heroui/react";

interface AdvancedFeaturesProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function AdvancedFeatures({
  formData,
  setFormData,
}: AdvancedFeaturesProps) {
  return (
    <Card className="p-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Advanced Features</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="space-y-6">
          {/* Loyalty Rewards */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Loyalty Rewards</h4>
              <p className="text-sm text-gray-600">
                Incentivize early bidding with reward distribution
              </p>
            </div>
            <Switch
              isSelected={formData.enableRewards}
              onValueChange={(value) =>
                setFormData({ ...formData, enableRewards: value })
              }
            />
          </div>

          {formData.enableRewards && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reward Budget: {formData.rewardBudgetBps / 100}% of sale
                proceeds
              </label>
              <Slider
                aria-label="Reward budget percentage"
                className="mb-2"
                maxValue={500}
                minValue={0}
                step={25}
                value={formData.rewardBudgetBps}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    rewardBudgetBps: Array.isArray(value) ? value[0] : value,
                  })
                }
              />
              <p className="text-xs text-gray-500">
                Maximum 5% of sale proceeds can be allocated to rewards
              </p>
            </div>
          )}

          {/* Reverse Royalty */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Reverse Royalty Engine</h4>
              <p className="text-sm text-gray-600">
                Dynamic royalties that increase over time to create urgency
              </p>
            </div>
            <Switch
              isSelected={formData.enableRoyalty}
              onValueChange={(value) =>
                setFormData({ ...formData, enableRoyalty: value })
              }
            />
          </div>

          {formData.enableRoyalty && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Royalty Increment: {formData.royaltyIncrement / 100}% per block
              </label>
              <Slider
                aria-label="Royalty increment per block"
                className="mb-2"
                maxValue={50}
                minValue={0}
                step={1}
                value={formData.royaltyIncrement}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    royaltyIncrement: Array.isArray(value) ? value[0] : value,
                  })
                }
              />
              <p className="text-xs text-gray-500">
                Royalty starts at 0% and increases by this amount each block
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
