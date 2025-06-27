
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getActiveClients } from '@/data/clientData';
import { DollarSign, TrendingUp, Calculator, PieChart } from 'lucide-react';

const Analytics = () => {
  const activeClients = getActiveClients();

  // Calculate financial metrics
  const clientAnalytics = activeClients.map(client => {
    const weeklyRevenue = client.trainingDaysPerWeek * client.costPerSession;
    const monthlyRevenue = weeklyRevenue * 4.33; // Average weeks per month
    return {
      ...client,
      weeklyRevenue,
      monthlyRevenue
    };
  });

  const totalMonthlyRevenue = clientAnalytics.reduce((sum, client) => sum + client.monthlyRevenue, 0);
  const totalWeeklyRevenue = clientAnalytics.reduce((sum, client) => sum + client.weeklyRevenue, 0);
  const averageSessionCost = activeClients.reduce((sum, client) => sum + client.costPerSession, 0) / activeClients.length;
  const totalWeeklySessions = activeClients.reduce((sum, client) => sum + client.trainingDaysPerWeek, 0);
  const averageHourlyRate = totalWeeklyRevenue / totalWeeklySessions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Business Analytics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Financial projections and business insights
          </p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMonthlyRevenue.toFixed(0)}</div>
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
              <div className="text-2xl font-bold">${totalWeeklyRevenue.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Total weekly income
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Cost</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageSessionCost.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Average per session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageHourlyRate.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Average per hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Client Revenue Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Client Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Sessions/Week</TableHead>
                  <TableHead>Cost/Session</TableHead>
                  <TableHead>Weekly Revenue</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientAnalytics
                  .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                  .map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{client.trainingDaysPerWeek}</Badge>
                      </TableCell>
                      <TableCell>${client.costPerSession}</TableCell>
                      <TableCell className="font-medium">${client.weeklyRevenue}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        ${client.monthlyRevenue.toFixed(0)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Weekly Sessions:</span>
                <span className="font-bold">{totalWeeklySessions}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Weekly Revenue:</span>
                <span className="font-bold text-green-600">${totalWeeklyRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Monthly Revenue:</span>
                <span className="font-bold text-green-600">${totalMonthlyRevenue.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Projection:</span>
                <span className="font-bold text-green-600">${(totalMonthlyRevenue * 12).toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Business Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Active Clients:</span>
                <span className="font-bold">{activeClients.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Session Cost:</span>
                <span className="font-bold">${averageSessionCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Hourly Rate:</span>
                <span className="font-bold">${averageHourlyRate.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue per Client:</span>
                <span className="font-bold">${(totalMonthlyRevenue / activeClients.length).toFixed(0)}/month</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
