
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, Star } from 'lucide-react';

interface ExerciseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  muscleGroupFilter: string;
  setMuscleGroupFilter: (filter: string) => void;
  forceTypeFilter: string;
  setForceTypeFilter: (filter: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  muscleGroups: string[];
  forceTypes: string[];
}

const ExerciseFilters = ({
  searchTerm,
  setSearchTerm,
  muscleGroupFilter,
  setMuscleGroupFilter,
  forceTypeFilter,
  setForceTypeFilter,
  showFavoritesOnly,
  setShowFavoritesOnly,
  muscleGroups,
  forceTypes
}: ExerciseFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="favorites-filter"
          checked={showFavoritesOnly}
          onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
          className="data-[state=checked]:bg-burnt-orange data-[state=checked]:border-burnt-orange"
        />
        <Label htmlFor="favorites-filter" className="text-sm font-medium flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          Favorites Only
        </Label>
      </div>
    </div>
  );
};

export default ExerciseFilters;
