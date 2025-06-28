
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Plus, Search, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useExercises } from '@/hooks/useExercises';
import AddExerciseDialog from './AddExerciseDialog';

interface ExerciseSelectorProps {
  onExerciseAdd: (exerciseId: string) => void;
  existingExerciseIds: string[];
}

const ExerciseSelector = ({ onExerciseAdd, existingExerciseIds }: ExerciseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { allExercises, isLoading, addExercise, isAddingExercise } = useExercises();

  const handleAddExercise = (exerciseId: string) => {
    if (existingExerciseIds.includes(exerciseId)) {
      toast({
        title: "Exercise Already Added",
        description: "This exercise is already in your current session.",
        variant: "destructive",
      });
      return;
    }

    onExerciseAdd(exerciseId);
    setOpen(false);
    setSearchValue('');

    const exercise = allExercises.find(ex => ex.id === exerciseId);
    toast({
      title: "Exercise Added",
      description: `${exercise?.name} has been added to your session.`,
    });
  };

  const handleAddNewExercise = (exercise: {
    name: string;
    forceType: string;
    muscleGroup: string;
    notes?: string;
  }) => {
    addExercise(exercise);
    setShowAddDialog(false);
    
    // After successful creation, the exercise will be available in allExercises
    // We'll need to find it and add it to the session
    setTimeout(() => {
      const newExercise = allExercises.find(ex => ex.name === exercise.name);
      if (newExercise) {
        handleAddExercise(newExercise.id);
      }
    }, 100);
  };

  const filteredExercises = allExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    exercise.muscleGroup.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading exercises...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Exercise to Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select or Search Exercise</Label>
            <div className="flex gap-2 mt-2">
              <Popover open={open} onOpenChange={setOpen}>
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
                        {searchValue ? `Search: "${searchValue}"` : "Search exercises..."}
                      </span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search exercises..." 
                      value={searchValue}
                      onValueChange={setSearchValue}
                      className="h-12"
                    />
                    <CommandList className="max-h-[300px]">
                      <CommandEmpty>
                        <div className="py-6 text-center">
                          <p className="text-sm text-muted-foreground mb-2">No exercises found</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setOpen(false);
                              setShowAddDialog(true);
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
                            onSelect={() => handleAddExercise(exercise.id)}
                            className="py-4 cursor-pointer"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{exercise.name}</span>
                                <Badge className={`${getMuscleGroupColor(exercise.muscleGroup)} text-xs`}>
                                  {exercise.muscleGroup}
                                </Badge>
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
              
              <Button
                onClick={() => setShowAddDialog(true)}
                variant="outline"
                className="h-12 px-4"
                title="Add New Exercise"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchValue('')}
                className="mt-2 h-8"
              >
                <X className="h-3 w-3 mr-1" />
                Clear search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AddExerciseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddExercise={handleAddNewExercise}
        isLoading={isAddingExercise}
      />
    </>
  );
};

export default ExerciseSelector;
