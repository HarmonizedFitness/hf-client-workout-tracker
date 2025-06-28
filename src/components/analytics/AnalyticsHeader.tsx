
import { DollarSign } from 'lucide-react';

const AnalyticsHeader = () => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
        <DollarSign className="h-8 w-8 text-burnt-orange" />
        Business Analytics
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Private financial data and business projections
      </p>
    </div>
  );
};

export default AnalyticsHeader;
