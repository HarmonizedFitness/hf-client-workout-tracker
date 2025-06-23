
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialExercises } from '@/data/exerciseData';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';

// Mock data for personal bests - in a real app this would come from a database
const mockPersonalBests = [
  { exerciseId: '22', exerciseName: 'Barbell Squat', weight: 120, date: '2024-01-15', sets: 3, reps: 5 },
  { exerciseId: '11', exerciseName: 'Barbell Bench Press ( Flat )', weight: 100, date: '2024-01-10', sets: 3, reps: 5 },
  { exerciseId: '30', exerciseName: 'Romanian Deadlift', weight: 140, date: '2024-01-20', sets: 3, reps: 5 },
  { exerciseId: '9', exerciseName: 'Machine Lat Pulldown', weight: 80, date: '2024-01-12', sets: 3, reps: 8 },
  { exerciseId: '37', exerciseName: 'Dumbbell External Isolation', weight: 15, date: '2024-01-08', sets: 3, reps: 12 },
];

const PersonalBests = () => {
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('all');

  const getExercise = (exerciseId: string) => {
    return initialExercises.find(ex => ex.id === exerciseId);
  };

  const filteredPBs = mockPersonalBests.filter(pb => {
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

  return (
    <div className="space-y-6">
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

      {/* Personal Bests Grid */}
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
                  <div className="text-3xl font-bold text-primary">{pb.weight}kg</div>
                  <p className="text-sm text-muted-foreground">Personal Best</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Sets:</span>
                    <span className="font-medium">{pb.sets}</span>
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
            <p className="text-muted-foreground mb-2">No personal bests found for this filter.</p>
            <p className="text-sm text-muted-foreground">Start logging workouts to track your progress!</p>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        Showing {filteredPBs.length} personal best records
      </div>
    </div>
  );
};

export default PersonalBests;
