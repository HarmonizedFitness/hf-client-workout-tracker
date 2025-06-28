
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import FinancialMetricsCards from '@/components/analytics/FinancialMetricsCards';
import ClientRevenueBreakdown from '@/components/analytics/ClientRevenueBreakdown';
import PrivacyGuard from '@/components/analytics/PrivacyGuard';

const Analytics = () => {
  const [showFinancials, setShowFinancials] = useState(false);
  const { activeClients, isLoading } = useSupabaseClients();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <AnalyticsHeader />
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <AnalyticsHeader />

          <PrivacyGuard 
            showFinancials={showFinancials} 
            onShowFinancials={setShowFinancials}
          >
            <FinancialMetricsCards activeClients={activeClients} />
            <ClientRevenueBreakdown activeClients={activeClients} />
          </PrivacyGuard>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analytics;
