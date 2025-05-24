import { CreatorProfile } from '@/components/CreatorProfile';
import { CreatorStockChart } from '@/components/CreatorStockChart';
import { CreatorOptions } from '@/components/CreatorOptions';
import { CreatorNews } from '@/components/CreatorNews';
import { RelatedCreators } from '@/components/RelatedCreators';

interface CreatorPageProps {
  params: {
    symbol: string;
  };
}

export default function CreatorPage({ params }: CreatorPageProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreatorProfile symbol={params.symbol} />
          <CreatorStockChart symbol={params.symbol} />
          <CreatorOptions symbol={params.symbol} />
        </div>
        <div className="space-y-6">
          <CreatorNews symbol={params.symbol} />
          <RelatedCreators symbol={params.symbol} />
        </div>
      </div>
    </div>
  );
}