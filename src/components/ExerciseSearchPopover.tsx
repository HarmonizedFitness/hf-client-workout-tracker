
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Plus, Search, Star } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  isFavorite: boolean;
}

interface ExerciseSearchPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showFavoritesOnly: boolean;
  filteredExercises: Exercise[];
  existingExerciseIds: string[];
  onExerciseAdd: (exerciseId: string) => void;
  onShowAddDialog: () => void;
}

const ExerciseSearchPopover = ({
  open,
  onOpenChange,
  searchValue,
  onSearchChange,
  showFavoritesOnly,
  filteredExercises,
  existingExerciseIds,
  onExerciseAdd,
  onShowAddDialog
}: ExerciseSearchPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex-1 justify-between h-12 text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="truncate">
              {searchValue ? `Search: "${searchValue}"` : 
               showFavoritesOnly ? "Search favorites..." : "Search exercises..."}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={showFavoritesOnly ? "Search favorites..." : "Search exercises..."} 
            value={searchValue}
            onValueChange={onSearchChange}
            className="h-12"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {showFavoritesOnly ? 
                    "No favorite exercises found" : 
                    "No exercises found"
                  }
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onShowAddDialog();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Exercise
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredExercises.map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  onSelect={() => onExerciseAdd(exercise.id)}
                  className="py-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{exercise.name}</span>
                      <Badge className={`${getMuscleGroupColor(exercise.muscleGroup)} text-xs`}>
                        {exercise.muscleGroup}
                      </Badge>
                      {exercise.isFavorite && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    {existingExerciseIds.includes(exercise.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Added
                      </Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ExerciseSearchPopover;
