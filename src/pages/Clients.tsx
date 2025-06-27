
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getActiveClients, getArchivedClients } from '@/data/clientData';
import { Users, Eye, EyeOff, Mail, Phone, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Clients = () => {
  const [showCosts, setShowCosts] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  const activeClients = getActiveClients().sort((a, b) => a.name.localeCompare(b.name));
  const archivedClients = getArchivedClients().sort((a, b) => a.name.localeCompare(b.name));
  const displayClients = showArchived ? archivedClients : activeClients;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Client Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your client roster and training schedules
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Roster ({displayClients.length} {showArchived ? 'archived' : 'active'})
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArchived(!showArchived)}
                  className="flex items-center gap-2"
                >
                  {showArchived ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide Archived
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      View Archived ({archivedClients.length})
                    </>
                  )}
                </Button>
                {!showArchived && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCosts(!showCosts)}
                    className="flex items-center gap-2"
                  >
                    {showCosts ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide Costs
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Show Costs
                      </>
                    )}
                  </Button>
                )}
                <Link to="/analytics">
                  <Button size="sm" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Business Analytics
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Training Schedule</TableHead>
                  <TableHead>Date Joined</TableHead>
                  {showCosts && <TableHead>Cost/Session</TableHead>}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {client.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Calendar className="h-3 w-3" />
                        {client.trainingDaysPerWeek} days/week
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {client.dateJoined}
                    </TableCell>
                    {showCosts && (
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          ${client.costPerSession}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge 
                        variant={client.isActive ? "default" : "secondary"}
                        className={client.isActive ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                      >
                        {client.isActive ? "Active" : "Archived"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeClients.length}</div>
              <p className="text-sm text-muted-foreground">Currently training</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Weekly Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {activeClients.reduce((sum, client) => sum + client.trainingDaysPerWeek, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Scheduled per week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {activeClients.reduce((sum, client) => sum + client.personalRecords.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total PRs achieved</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Clients;
