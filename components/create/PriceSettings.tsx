import { Input } from '@heroui/input'
import { Slider } from '@heroui/slider'

interface PriceSettingsProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
}

export function PriceSettings({ formData, setFormData, errors }: PriceSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Start Price (ETH)"
          placeholder="1"
          description="Initial auction price per token"
          value={formData.startPrice}
          onChange={(e) => setFormData({...formData, startPrice: e.target.value})}
          isInvalid={!!errors.startPrice}
          errorMessage={errors.startPrice}
        />

        <Input
          label="Reserve Price (ETH)"
          placeholder="0.7"
          description="Minimum price floor per token"
          value={formData.reservePrice}
          onChange={(e) => setFormData({...formData, reservePrice: e.target.value})}
          isInvalid={!!errors.reservePrice}
          errorMessage={errors.reservePrice}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Price Decrement (ETH)"
          placeholder="0.01"
          description="Price reduction per block per token"
          value={formData.priceDecrement}
          onChange={(e) => setFormData({...formData, priceDecrement: e.target.value})}
          isInvalid={!!errors.priceDecrement}
          errorMessage={errors.priceDecrement}
        />

        <div>
          <label className="text-sm font-medium mb-2 block">
            Duration: {Math.floor(formData.duration / 60)}h {formData.duration % 60 ? `${formData.duration % 60}m` : ''}
          </label>
          <Slider
            value={formData.duration}
            onChange={(value) => setFormData({...formData, duration: Array.isArray(value) ? value[0] : value})}
            minValue={10}
            maxValue={1440}
            step={10}
            className="mb-2"
            aria-label="Auction duration in blocks"
          />
          <p className="text-xs text-gray-500">
            Approximately {formData.duration} minutes
          </p>
        </div>
      </div>
    </div>
  )
}