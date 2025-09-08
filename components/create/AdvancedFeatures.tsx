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
        <h3 className="text-xl font-semibold">Advanced Features</h3>
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
