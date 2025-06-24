
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from '@/types/exercise';
import ExerciseLibrary from './ExerciseLibrary';
import SessionLogger from './SessionLogger';
import PersonalBests from './PersonalBests';
import ClientSelector from './ClientSelector';
import ClientOverview from './ClientOverview';
import ArchivedClientCard from './ArchivedClientCard';
import { BookOpen, Plus, Trophy, Users } from 'lucide-react';

interface TabContentProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
}

const TabContent = ({ selectedClient, onClientSelect }: TabContentProps) => {
  return (
    <>
      {/* Client Management Tab */}
      <TabsContent value="clients" className="space-y-6">
        <ClientSelector 
          selectedClient={selectedClient} 
          onClientSelect={onClientSelect} 
        />
        
        {selectedClient && selectedClient.isActive && (
          <ClientOverview client={selectedClient} />
        )}

        {selectedClient && !selectedClient.isActive && (
          <ArchivedClientCard client={selectedClient} />
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
    </>
  );
};

export default TabContent;
