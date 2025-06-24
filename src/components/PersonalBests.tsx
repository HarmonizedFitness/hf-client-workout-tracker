
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialExercises } from '@/data/exerciseData';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Client } from '@/types/exercise';
import { Trophy, TrendingUp, Calendar, Target } from 'lucide-react';

interface PersonalBestsProps {
  client: Client;
}

const PersonalBests = ({ client }: PersonalBestsProps) => {
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('all');

  const getExercise = (exerciseId: string) => {
    return initialExercises.find(ex => ex.id === exerciseId);
  };

  const filteredPBs = client.personalRecords.filter(pb => {
    const exercise = getExercise(pb.exerciseId);
    return muscleGroupFilter === 'all' || exercise?.muscleGroup === muscleGroupFilter;
  });

  const muscleGroups = Array.from(new Set(initialExercises.map(ex => ex.muscleGroup))).sort();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTopPR = () => {
    return client.personalRecords.length > 0 
      ? client.personalRecords.reduce((max, pr) => pr.weight > max.weight ? pr : max, client.personalRecords[0])
      : { weight: 0, exerciseName: 'None' };
  };

  const topPR = getTopPR();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{client.personalRecords.length}</div>
            <p className="text-sm text-muted-foreground">Total PRs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{topPR.weight} lbs</div>
            <p className="text-sm text-muted-foreground">Heaviest Lift</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">
              {client.personalRecords.filter(pr => {
                const prDate = new Date(pr.date);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return prDate >= thirtyDaysAgo;
              }).length}
            </div>
            <p className="text-sm text-muted-foreground">PRs This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={muscleGroupFilter} onValueChange={setMuscleGroupFilter}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by muscle group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscle Groups</SelectItem>
            {muscleGroups.map(group => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Personal Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPBs.map((pb, index) => {
          const exercise = getExercise(pb.exerciseId);
          return (
            <Card key={`${pb.exerciseId}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{pb.exerciseName}</CardTitle>
                    <Badge className={`${getMuscleGroupColor(exercise?.muscleGroup || '')} text-xs`}>
                      {exercise?.muscleGroup}
                    </Badge>
                  </div>
                  <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{pb.weight} lbs</div>
                  <p className="text-sm text-muted-foreground">Personal Best</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Set:</span>
                    <span className="font-medium">{pb.setNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Reps:</span>
                    <span className="font-medium">{pb.reps}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm border-t pt-3">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Achieved:</span>
                  <span className="font-medium">{formatDate(pb.date)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPBs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              {client.personalRecords.length === 0 
                ? `${client.name} hasn't set any personal records yet.`
                : 'No personal records found for this filter.'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {client.personalRecords.length === 0 
                ? 'Start logging workouts to track progress!'
                : 'Try adjusting the muscle group filter.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        Showing {filteredPBs.length} of {client.personalRecords.length} personal records for {client.name}
      </div>
    </div>
  );
};

export default PersonalBests;
