import { Card, CardBody, CardHeader } from '@heroui/card'
import { Progress } from '@heroui/progress'

interface PriceCardProps {
  auction: any
}

export function PriceCard({ auction }: PriceCardProps) {
  return (
    <Card className='p-4'>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <h3 className="text-xl font-semibold">Price Information</h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-blue-600">
              {auction.currentPrice} DOMA
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Started At</p>
            <p className="text-xl font-semibold">
              {auction.startPrice} DOMA
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Reserve Price</p>
            <p className="text-xl font-semibold">
              {auction.reservePrice} DOMA
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Price Decay</span>
            <span>{auction.priceDecrement} DOMA per block</span>
          </div>
          <Progress 
            value={((parseFloat(auction.startPrice) - parseFloat(auction.currentPrice!)) / 
                    (parseFloat(auction.startPrice) - parseFloat(auction.reservePrice))) * 100}
            color="warning"
            aria-label="Price decay progress"
          />
        </div>
      </CardBody>
    </Card>
  )
}