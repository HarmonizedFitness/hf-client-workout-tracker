
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getActiveClients } from '@/data/clientData';
import { DollarSign, TrendingUp, Calendar, Users, Shield, Eye } from 'lucide-react';
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';

const Analytics = () => {
  const [showFinancials, setShowFinancials] = useState(false);
  const activeClients = getActiveClients();

  // Financial calculations
  const totalWeeklyIncome = activeClients.reduce((sum, client) => 
    sum + (client.trainingDaysPerWeek * client.costPerSession), 0
  );
  const totalMonthlyIncome = totalWeeklyIncome * 4.33; // Average weeks per month
  const averageSessionCost = activeClients.length > 0 
    ? activeClients.reduce((sum, client) => sum + client.costPerSession, 0) / activeClients.length 
    : 0;
  const totalWeeklySessions = activeClients.reduce((sum, client) => sum + client.trainingDaysPerWeek, 0);

  const FinancialContent = () => (
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

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-burnt-orange" />
          Business Analytics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Private financial data and business projections
        </p>
      </div>

      {!showFinancials ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Private Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This section contains sensitive business and financial information. 
              Click below to reveal your revenue analytics and financial projections.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-burnt-orange hover:bg-burnt-orange/90">
                  <Eye className="h-4 w-4 mr-2" />
                  View Financial Analytics
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Access Financial Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    You're about to view sensitive business and financial information. 
                    Make sure you're in a private setting where client information cannot be viewed by others.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setShowFinancials(true)}>
                    I Understand, Show Analytics
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <Shield className="h-3 w-3 mr-1" />
              Private Financial Data
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFinancials(false)}
            >
              Hide Financials
            </Button>
          </div>

          <FinancialContent />

          {/* Client Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Revenue by Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeClients.map((client) => {
                  const weeklyRevenue = client.trainingDaysPerWeek * client.costPerSession;
                  const monthlyRevenue = weeklyRevenue * 4.33;
                  
                  return (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.trainingDaysPerWeek} sessions/week × ${client.costPerSession}
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
            </CardContent>
          </Card>
        </>
      )}
    </PageLayout>
  );
};

export default Analytics;
