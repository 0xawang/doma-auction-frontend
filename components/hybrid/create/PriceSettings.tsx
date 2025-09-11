import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/react";
import { Slider } from "@heroui/slider";
import { getLocalTimeZone, now } from "@internationalized/date";

interface PriceSettingsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
}

export function PriceSettings({
  formData,
  setFormData,
  errors,
}: PriceSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Input
          description="Initial auction price per token"
          errorMessage={errors.startPrice}
          isInvalid={!!errors.startPrice}
          label="Start Price (ETH)"
          placeholder="1"
          value={formData.startPrice}
          onChange={(e) =>
            setFormData({ ...formData, startPrice: e.target.value })
          }
        />

        <Input
          description="Minimum price floor per token"
          errorMessage={errors.reservePrice}
          isInvalid={!!errors.reservePrice}
          label="Reserve Price (ETH)"
          placeholder="0.7"
          value={formData.reservePrice}
          onChange={(e) =>
            setFormData({ ...formData, reservePrice: e.target.value })
          }
        />

        <Input
          description="Price reduction per minute per token"
          errorMessage={errors.priceDecrement}
          isInvalid={!!errors.priceDecrement}
          label="Price Decrement (ETH)"
          placeholder="0.01"
          value={formData.priceDecrement}
          onChange={(e) =>
            setFormData({ ...formData, priceDecrement: e.target.value })
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <DatePicker
          hideTimeZone
          showMonthAndYearPickers
          defaultValue={now(getLocalTimeZone())}
          label="Started Time"
          value={formData.startedAt}
          onChange={(value) => setFormData({ ...formData, startedAt: value })}
        />
        <div>
          <label className="text-sm font-medium mb-2 block">
            Duration: {Math.floor(formData.duration / 60)}h{" "}
            {formData.duration % 60 ? `${formData.duration % 60}m` : ""}
          </label>
          <Slider
            aria-label="Auction duration in blocks"
            className="mb-2"
            maxValue={1440}
            minValue={10}
            step={10}
            value={formData.duration}
            onChange={(value) =>
              setFormData({
                ...formData,
                duration: Array.isArray(value) ? value[0] : value,
              })
            }
          />
          <p className="text-xs text-gray-500">
            Approximately {formData.duration} minutes
          </p>
        </div>
      </div>
    </div>
  );
}
