
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star } from 'lucide-react';

interface ExerciseFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedMuscleGroups: string[];
  onMuscleGroupsChange: (groups: string[]) => void;
  selectedForceTypes: string[];
  onForceTypesChange: (types: string[]) => void;
  showFavorites: boolean;
  onShowFavoritesChange: (show: boolean) => void;
  totalExercises: number;
  filteredCount: number;
}

const muscleGroups = ['Back', 'Chest', 'Quads', 'Hamstrings', 'Glutes', 'Shoulders', 'Arms (Biceps)', 'Arms (Triceps)', 'Calves', 'Core', 'Abdominals', 'Hip Abductors', 'Hips'];
const forceTypes = ['Pull', 'Push', 'Squat', 'Raise', 'Static', 'Squeeze', 'Rotate', 'Twist', 'Stretch', 'Hold'];

const ExerciseFilters = ({
  searchTerm,
  onSearchChange,
  selectedMuscleGroups,
  onMuscleGroupsChange,
  selectedForceTypes,
  onForceTypesChange,
  showFavorites,
  onShowFavoritesChange,
  totalExercises,
  filteredCount
}: ExerciseFiltersProps) => {
  const handleMuscleGroupChange = (value: string) => {
    if (value === 'all') {
      onMuscleGroupsChange([]);
    } else {
      const isSelected = selectedMuscleGroups.includes(value);
      if (isSelected) {
        onMuscleGroupsChange(selectedMuscleGroups.filter(g => g !== value));
      } else {
        onMuscleGroupsChange([...selectedMuscleGroups, value]);
      }
    }
  };

  const handleForceTypeChange = (value: string) => {
    if (value === 'all') {
      onForceTypesChange([]);
    } else {
      const isSelected = selectedForceTypes.includes(value);
      if (isSelected) {
        onForceTypesChange(selectedForceTypes.filter(t => t !== value));
      } else {
        onForceTypesChange([...selectedForceTypes, value]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalExercises} exercises
        </div>
        <div className="flex gap-2">
          {showFavorites && (
            <Badge variant="default" className="text-xs bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Favorites
            </Badge>
          )}
          {selectedMuscleGroups.map(group => (
            <Badge key={group} variant="secondary" className="text-xs">
              {group}
            </Badge>
          ))}
          {selectedForceTypes.map(type => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          onClick={() => onShowFavoritesChange(!showFavorites)}
          variant={showFavorites ? "default" : "outline"}
          className={`flex items-center gap-2 ${showFavorites ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
        >
          <Star className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
          Favorites
        </Button>
        
        <Select value={selectedMuscleGroups.length === 1 ? selectedMuscleGroups[0] : 'all'} onValueChange={handleMuscleGroupChange}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>
                {selectedMuscleGroups.length === 0 ? 'All Muscle Groups' : 
                 selectedMuscleGroups.length === 1 ? selectedMuscleGroups[0] :
                 `${selectedMuscleGroups.length} selected`}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscle Groups</SelectItem>
            {muscleGroups.map(group => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedForceTypes.length === 1 ? selectedForceTypes[0] : 'all'} onValueChange={handleForceTypeChange}>
          <SelectTrigger>
            <span>
              {selectedForceTypes.length === 0 ? 'All Force Types' : 
               selectedForceTypes.length === 1 ? selectedForceTypes[0] :
               `${selectedForceTypes.length} selected`}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Force Types</SelectItem>
            {forceTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ExerciseFilters;
