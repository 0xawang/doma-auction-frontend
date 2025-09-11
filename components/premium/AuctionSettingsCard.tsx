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
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <polyline
                points="12,6 12,12 16,14"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Auction Settings</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            errorMessage={errors.startPrice}
            isInvalid={!!errors.startPrice}
            label="Start Price (ETH)"
            placeholder="1.0"
            value={formData.startPrice}
            onChange={(e) =>
              setFormData({ ...formData, startPrice: e.target.value })
            }
          />
          <Input
            errorMessage={errors.reservePrice}
            isInvalid={!!errors.reservePrice}
            label="Reserve Price (ETH)"
            placeholder="0.5"
            value={formData.reservePrice}
            onChange={(e) =>
              setFormData({ ...formData, reservePrice: e.target.value })
            }
          />
          <Input
            errorMessage={errors.priceDecrement}
            isInvalid={!!errors.priceDecrement}
            label="Price Decrement (ETH per minute)"
            placeholder="0.001"
            value={formData.priceDecrement}
            onChange={(e) =>
              setFormData({
                ...formData,
                priceDecrement: e.target.value,
              })
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            defaultValue={now(getLocalTimeZone())}
            label="Started Time"
            value={formData.startedAt}
            onChange={(value) => setFormData({ ...formData, startedAt: value })}
          />
          <Input
            inputMode="numeric"
            label="Duration (hours)"
            placeholder="24"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
