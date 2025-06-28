
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { SupabaseClient } from '@/types/client';

interface FinancialMetricsCardsProps {
  activeClients: SupabaseClient[];
}

const FinancialMetricsCards = ({ activeClients }: FinancialMetricsCardsProps) => {
  // Financial calculations
  const totalWeeklyIncome = activeClients.reduce((sum, client) => 
    sum + (client.training_days_per_week * client.cost_per_session), 0
  );
  const totalMonthlyIncome = totalWeeklyIncome * 4.33; // Average weeks per month
  const averageSessionCost = activeClients.length > 0 
    ? activeClients.reduce((sum, client) => sum + client.cost_per_session, 0) / activeClients.length 
    : 0;
  const totalWeeklySessions = activeClients.reduce((sum, client) => sum + client.training_days_per_week, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalMonthlyIncome.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">
            Projected monthly income
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalWeeklyIncome.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">
            Total weekly income
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Session Rate</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageSessionCost.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">
            Per session average
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWeeklySessions}</div>
          <p className="text-xs text-muted-foreground">
            Total sessions per week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetricsCards;
