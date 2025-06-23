
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialExercises } from '@/data/exerciseData';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Search, Filter } from 'lucide-react';

const ExerciseLibrary = () => {
  const [exercises] = useState(initialExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('all');
  const [forceTypeFilter, setForceTypeFilter] = useState('all');

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = muscleGroupFilter === 'all' || exercise.muscleGroup === muscleGroupFilter;
    const matchesForceType = forceTypeFilter === 'all' || exercise.forceType === forceTypeFilter;
    
    return matchesSearch && matchesMuscleGroup && matchesForceType;
  });

  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup))).sort();
  const forceTypes = Array.from(new Set(exercises.map(ex => ex.forceType))).sort();

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={muscleGroupFilter} onValueChange={setMuscleGroupFilter}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by muscle group" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscle Groups</SelectItem>
            {muscleGroups.map(group => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={forceTypeFilter} onValueChange={setForceTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by force type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Force Types</SelectItem>
            {forceTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => (
          <Card key={exercise.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg leading-tight">{exercise.name}</h3>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={getMuscleGroupColor(exercise.muscleGroup)}>
                    {exercise.muscleGroup}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {exercise.forceType}
                  </Badge>
                </div>

                {exercise.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {exercise.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exercises found matching your criteria.</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchTerm('');
              setMuscleGroupFilter('all');
              setForceTypeFilter('all');
            }}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        Showing {filteredExercises.length} of {exercises.length} exercises
      </div>
    </div>
  );
};

export default ExerciseLibrary;
