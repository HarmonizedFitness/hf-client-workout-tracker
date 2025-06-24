
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExerciseLibrary from '@/components/ExerciseLibrary';
import SessionLogger from '@/components/SessionLogger';
import PersonalBests from '@/components/PersonalBests';
import ClientSelector from '@/components/ClientSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { Client } from '@/types/exercise';
import { Dumbbell, Trophy, BookOpen, Plus, Users, Calendar, DollarSign, Archive } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 pt-4 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center justify-center gap-3">
            <Dumbbell className="h-10 w-10 text-blue-600 dark:text-burnt-orange" />
            Harmonized Strength Log
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Professional Personal Training Client Management System</p>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
            <TabsTrigger value="clients" className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Exercise Library
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center gap-2 text-sm" disabled={!selectedClient?.isActive}>
              <Plus className="h-4 w-4" />
              Log Session
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2 text-sm" disabled={!selectedClient?.isActive}>
              <Trophy className="h-4 w-4" />
              Personal Records
            </TabsTrigger>
          </TabsList>

          {/* Client Management Tab */}
          <TabsContent value="clients" className="space-y-6">
            <ClientSelector 
              selectedClient={selectedClient} 
              onClientSelect={setSelectedClient} 
            />
            
            {selectedClient && selectedClient.isActive && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Overview: {selectedClient.name}</CardTitle>
                  <CardDescription>
                    Active member since {new Date(selectedClient.dateJoined).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedClient.personalRecords.length}
                      </div>
                      <p className="text-sm text-blue-800">Personal Records</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedClient.workoutHistory.length}
                      </div>
                      <p className="text-sm text-green-800">Workout Sessions</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedClient.personalRecords.reduce((max, pr) => Math.max(max, pr.weight), 0)}kg
                      </div>
                      <p className="text-sm text-purple-800">Heaviest Lift</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedClient.trainingDaysPerWeek}
                      </div>
                      <p className="text-sm text-orange-800">Days/Week</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-emerald-600">
                        ${selectedClient.costPerSession}
                      </div>
                      <p className="text-sm text-emerald-800">Per Session</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedClient && !selectedClient.isActive && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="text-center py-8">
                  <Archive className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">
                    {selectedClient.name} is Archived
                  </h3>
                  <p className="text-orange-600">
                    This client was archived on {selectedClient.dateArchived ? new Date(selectedClient.dateArchived).toLocaleDateString() : 'Unknown date'}. 
                    Their data is preserved and they can be restored anytime.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Exercise Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Exercise Library
                </CardTitle>
                <CardDescription>
                  Browse and manage the complete exercise database with muscle group filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExerciseLibrary />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Logger Tab */}
          <TabsContent value="session" className="space-y-6">
            {selectedClient && selectedClient.isActive ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Log Workout Session - {selectedClient.name}
                  </CardTitle>
                  <CardDescription>
                    Track sets, reps, and weights for {selectedClient.name}'s workout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionLogger client={selectedClient} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Please select an active client first to log a workout session.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Personal Records Tab */}
          <TabsContent value="records" className="space-y-6">
            {selectedClient && selectedClient.isActive ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Personal Records - {selectedClient.name}
                  </CardTitle>
                  <CardDescription>
                    View {selectedClient.name}'s strongest lifts and track progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalBests client={selectedClient} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Please select an active client first to view their personal records.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
