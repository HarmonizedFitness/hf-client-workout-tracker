
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Calendar, Weight, Activity } from 'lucide-react';
import { SupabaseClient } from '@/hooks/useSupabaseClients';
import { usePersonalRecords } from '@/hooks/usePersonalRecords';
import { formatWeight } from '@/utils/weightConversions';

interface PersonalBestsProps {
  client: SupabaseClient;
}

const PersonalBests = ({ client }: PersonalBestsProps) => {
  const { personalRecords, isLoading } = usePersonalRecords(client.id);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Personal Records - {client.name}
          </CardTitle>
          <CardDescription>Loading personal records...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!personalRecords || personalRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Personal Records - {client.name}
          </CardTitle>
          <CardDescription>
            Track your client's personal bests and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No personal records recorded yet. Start logging workouts to track progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Separate PRs by type
  const singleWeightPRs = personalRecords
    .filter(pr => pr.pr_type === 'single_weight')
    .sort((a, b) => b.weight - a.weight);
    
  const volumePRs = personalRecords
    .filter(pr => pr.pr_type === 'volume')
    .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Personal Records - {client.name}
        </CardTitle>
        <CardDescription>
          {personalRecords.length} personal records achieved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single-weight" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single-weight" className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Max Weight PRs
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Volume PRs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="single-weight" className="mt-4">
            <div className="grid gap-4">
              {singleWeightPRs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No single weight PRs recorded yet.
                </div>
              ) : (
                singleWeightPRs.map((pr, index) => (
                  <div key={`${pr.id}-single`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{pr.exercise_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(pr.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-yellow-50 text-yellow-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {formatWeight(pr.weight)} × {pr.reps}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Set {pr.set_number}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="volume" className="mt-4">
            <div className="grid gap-4">
              {volumePRs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No volume PRs recorded yet.
                </div>
              ) : (
                volumePRs.map((pr, index) => (
                  <div key={`${pr.id}-volume`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{pr.exercise_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(pr.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-800">
                          <Activity className="h-3 w-3 mr-1" />
                          {formatWeight(pr.total_volume || 0)} total
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatWeight(pr.weight)} × {pr.reps} reps
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalBests;
