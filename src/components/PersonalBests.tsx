
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import { SupabaseClient } from '@/hooks/useSupabaseClients';
import { adaptSupabaseClientToLegacyClient } from './ClientAdapter';

interface PersonalBestsProps {
  client: SupabaseClient;
}

const PersonalBests = ({ client }: PersonalBestsProps) => {
  // Convert to legacy format for now - this will be replaced with actual PR data from Supabase later
  const legacyClient = adaptSupabaseClientToLegacyClient(client);
  
  if (!legacyClient.personalRecords || legacyClient.personalRecords.length === 0) {
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

  // Sort PRs by weight descending
  const sortedPRs = [...legacyClient.personalRecords].sort((a, b) => b.weight - a.weight);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Personal Records - {client.name}
        </CardTitle>
        <CardDescription>
          {legacyClient.personalRecords.length} personal records achieved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {sortedPRs.map((pr, index) => (
            <div key={`${pr.exerciseId}-${pr.date}`} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{pr.exerciseName}</h3>
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
                    {pr.weight}kg × {pr.reps}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Set {pr.setNumber}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalBests;
