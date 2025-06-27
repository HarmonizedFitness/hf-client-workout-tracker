
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialExercises } from '@/data/exerciseData';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Exercise } from '@/types/exercise';
import { Search, Filter, BookOpen, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('all');
  const [forceTypeFilter, setForceTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New exercise form state
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroup: '',
    forceType: '',
    notes: ''
  });

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = muscleGroupFilter === 'all' || exercise.muscleGroup === muscleGroupFilter;
    const matchesForceType = forceTypeFilter === 'all' || exercise.forceType === forceTypeFilter;
    
    return matchesSearch && matchesMuscleGroup && matchesForceType;
  });

  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup))).sort();
  const forceTypes = Array.from(new Set(exercises.map(ex => ex.forceType))).sort();

  const handleAddExercise = () => {
    if (!newExercise.name.trim() || !newExercise.muscleGroup || !newExercise.forceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in exercise name, muscle group, and force type.",
        variant: "destructive",
      });
      return;
    }

    const exercise: Exercise = {
      id: (Date.now()).toString(),
      name: newExercise.name.trim(),
      muscleGroup: newExercise.muscleGroup,
      forceType: newExercise.forceType,
      notes: newExercise.notes.trim() || undefined
    };

    setExercises([...exercises, exercise]);
    setNewExercise({ name: '', muscleGroup: '', forceType: '', notes: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Exercise Added",
      description: `${exercise.name} has been added to the exercise library.`,
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <BookOpen className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
            <p className="text-muted-foreground">Browse and manage your exercise database</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-burnt-orange hover:bg-burnt-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exercise-name">Exercise Name *</Label>
                  <Input
                    id="exercise-name"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                    placeholder="Enter exercise name..."
                  />
                </div>

                <div>
                  <Label htmlFor="muscle-group">Muscle Group *</Label>
                  <Select 
                    value={newExercise.muscleGroup} 
                    onValueChange={(value) => setNewExercise({...newExercise, muscleGroup: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select muscle group..." />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="force-type">Force Type *</Label>
                  <Select 
                    value={newExercise.forceType} 
                    onValueChange={(value) => setNewExercise({...newExercise, forceType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select force type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {forceTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exercise-notes">Notes (Optional)</Label>
                  <Textarea
                    id="exercise-notes"
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})}
                    placeholder="Add any notes about this exercise..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddExercise} className="flex-1">
                    Add Exercise
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
    </PageLayout>
  );
};

export default ExerciseLibrary;
