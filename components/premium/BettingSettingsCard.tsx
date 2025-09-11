import { Card, CardBody, CardHeader } from "@heroui/react";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";

interface BettingSettingsCardProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export function BettingSettingsCard({
  formData,
  setFormData,
  errors,
}: BettingSettingsCardProps) {
  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Betting Configuration</h3>
        </div>
        <Switch
          isSelected={formData.enableBetting}
          onValueChange={(enabled) => setFormData(prev => ({ ...prev, enableBetting: enabled }))}
        >
          Enable 4-Tier Betting
        </Switch>
      </CardHeader>
      {formData.enableBetting && (
        <CardBody className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="High Price Threshold (ETH)"
              placeholder="0.8"
              description="Above this price = Category 3"
              value={formData.highPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, highPrice: e.target.value }))}
              errorMessage={errors.highPrice}
              isInvalid={!!errors.highPrice}
            />
            <Input
              label="Low Price Threshold (ETH)"
              placeholder="0.6"
              description="Below this price = Category 1"
              value={formData.lowPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, lowPrice: e.target.value }))}
              errorMessage={errors.lowPrice}
              isInvalid={!!errors.lowPrice}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Commit Duration (hours)"
              placeholder="1800"
              description="Time to place hidden bets"
              value={formData.commitDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, commitDuration: e.target.value }))}
            />
            <Input
              label="Reveal Duration (hours)"
              placeholder="900"
              description="Time to reveal bets after auction"
              value={formData.revealDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, revealDuration: e.target.value }))}
            />
          </div>

          <div className="p-4 bg-[#fff]/10 rounded-lg px-6">
            <h4 className="font-semibold mb-2">Betting Categories:</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Category 3:</strong> Final price &gt; High Price</li>
              <li>• <strong>Category 2:</strong> Low Price ≤ Final price ≤ High Price</li>
              <li>• <strong>Category 1:</strong> Final price &lt; Low Price</li>
              <li>• <strong>Category 0:</strong> Auction fails to clear</li>
            </ul>
          </div>
        </CardBody>
      )}
    </Card>
  );
}