import { Card, CardBody, CardHeader, DatePicker } from "@heroui/react";
import { Input } from "@heroui/input";
import { now, getLocalTimeZone } from "@internationalized/date";

interface AuctionSettingsCardProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export function AuctionSettingsCard({
  formData,
  setFormData,
  errors,
}: AuctionSettingsCardProps) {
  return (
    <Card className="p-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Auction Settings</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Start Price (ETH)"
            placeholder="1.0"
            value={formData.startPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, startPrice: e.target.value }))}
            errorMessage={errors.startPrice}
            isInvalid={!!errors.startPrice}
          />
          <Input
            label="Reserve Price (ETH)"
            placeholder="0.5"
            value={formData.reservePrice}
            onChange={(e) => setFormData(prev => ({ ...prev, reservePrice: e.target.value }))}
            errorMessage={errors.reservePrice}
            isInvalid={!!errors.reservePrice}
          />
          <Input
            label="Price Decrement (ETH per minute)"
            placeholder="0.001"
            value={formData.priceDecrement}
            onChange={(e) => setFormData(prev => ({ ...prev, priceDecrement: e.target.value }))}
            errorMessage={errors.priceDecrement}
            isInvalid={!!errors.priceDecrement}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <DatePicker 
            hideTimeZone
            showMonthAndYearPickers
            defaultValue={now(getLocalTimeZone())}
            value={formData.startedAt}
            label="Started Time" 
            onChange={(value) => setFormData(prev => ({ ...prev, startedAt: value }))}
          />
          <Input
            label="Duration (hours)"
            placeholder="24"
            inputMode="numeric"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          />
        </div>
      </CardBody>
    </Card>
  );
}