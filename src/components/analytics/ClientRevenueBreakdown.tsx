
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { SupabaseClient } from '@/types/client';

interface ClientRevenueBreakdownProps {
  activeClients: SupabaseClient[];
}

const ClientRevenueBreakdown = ({ activeClients }: ClientRevenueBreakdownProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Revenue by Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeClients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No clients found. Add your first client to see revenue analytics.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeClients.map((client) => {
              const weeklyRevenue = client.training_days_per_week * client.cost_per_session;
              const monthlyRevenue = weeklyRevenue * 4.33;
              
              return (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.training_days_per_week} sessions/week × ${client.cost_per_session}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${monthlyRevenue.toFixed(0)}/month</div>
                    <div className="text-sm text-muted-foreground">
                      ${weeklyRevenue}/week
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientRevenueBreakdown;
