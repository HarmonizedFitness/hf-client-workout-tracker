
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SupabaseClient } from '@/hooks/useSupabaseClients';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { Users, Calendar, Trophy, Target, Plus, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useClient } from '@/context/ClientContext';

const Home = () => {
  const [localSelectedClient, setLocalSelectedClient] = useState<SupabaseClient | null>(null);
  const { setSelectedClient } = useClient();
  const { activeClients } = useSupabaseClients();

  const handleClientSelect = (client: SupabaseClient) => {
    setLocalSelectedClient(client);
    setSelectedClient(client); // Update global context
  };

  // Calculate non-financial statistics
  const totalActiveClients = activeClients.length;
  const totalSessionsThisMonth = 0; // This would need to be calculated from workout sessions
  const totalLivesImpacted = activeClients.length;
  const weeklySessionsPlanned = activeClients.reduce((sum, client) => 
    sum + client.training_days_per_week, 0
  );

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Trainer Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome back! Here's your training overview.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveClients}</div>
            <p className="text-xs text-muted-foreground">
              Currently training
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Completed training sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lives Impacted</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLivesImpacted}</div>
            <p className="text-xs text-muted-foreground">
              People transformed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Sessions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklySessionsPlanned}</div>
            <p className="text-xs text-muted-foreground">
              Planned per week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Selection and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Client Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Updated client selector to use SupabaseClient directly */}
            <div className="space-y-4">
              {localSelectedClient && localSelectedClient.is_active && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Selected: {localSelectedClient.name}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-green-600">
                    <p>{localSelectedClient.training_days_per_week} days/week</p>
                    <p>${localSelectedClient.cost_per_session}/session</p>
                  </div>
                </div>
              )}

              <select 
                value={localSelectedClient?.id || ''} 
                onChange={(e) => {
                  const client = activeClients.find(c => c.id === e.target.value);
                  if (client) handleClientSelect(client);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose a client...</option>
                {activeClients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.training_days_per_week}x/week)
                  </option>
                ))}
              </select>
            </div>
            
            {localSelectedClient && localSelectedClient.is_active && (
              <div className="mt-4 flex gap-2">
                <Link to="/session">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Log Session
                  </Button>
                </Link>
                <Link to="/records">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    View Records
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Business Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Access detailed business analytics and financial projections
            </p>
            
            <div className="flex flex-col gap-2">
              <Link to="/clients">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage All Clients
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Business Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {localSelectedClient && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity - {localSelectedClient.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Training Days per Week</span>
                <Badge variant="secondary">{localSelectedClient.training_days_per_week} days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cost per Session</span>
                <Badge variant="secondary">${localSelectedClient.cost_per_session}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Date Joined</span>
                <span className="text-sm text-muted-foreground">{localSelectedClient.date_joined}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Home;
