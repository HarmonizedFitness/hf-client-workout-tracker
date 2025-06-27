import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { initialExercises } from '@/data/exerciseData';
import { Exercise } from '@/types/exercise';
import { Search, Filter, BookOpen, Plus, Star, Heart, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import ExerciseCard from '@/components/ExerciseCard';
import EditExerciseDialog from '@/components/EditExerciseDialog';
import DeleteExerciseDialog from '@/components/DeleteExerciseDialog';

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('all');
  const [forceTypeFilter, setForceTypeFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [deletingExercises, setDeletingExercises] = useState<Exercise[]>([]);
  
  // New exercise form state
  const [newExercise, setNewExercise] = useState<{
    name: string;
    muscleGroup: Exercise['muscleGroup'] | '';
    forceType: Exercise['forceType'] | '';
    notes: string;
  }>({
    name: '',
    muscleGroup: '',
    forceType: '',
    notes: ''
  });

  // Load exercises from localStorage or use initial data
  useEffect(() => {
    const savedExercises = localStorage.getItem('exerciseLibrary');
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    } else {
      const exercisesWithFavorites = initialExercises.map(ex => ({ ...ex, isFavorite: false }));
      setExercises(exercisesWithFavorites);
    }
  }, []);

  // Save exercises to localStorage whenever exercises change
  useEffect(() => {
    if (exercises.length > 0) {
      localStorage.setItem('exerciseLibrary', JSON.stringify(exercises));
    }
  }, [exercises]);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = muscleGroupFilter === 'all' || exercise.muscleGroup === muscleGroupFilter;
    const matchesForceType = forceTypeFilter === 'all' || exercise.forceType === forceTypeFilter;
    const matchesFavorites = !showFavoritesOnly || exercise.isFavorite;
    
    return matchesSearch && matchesMuscleGroup && matchesForceType && matchesFavorites;
  });

  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup))).sort();
  const forceTypes = Array.from(new Set(exercises.map(ex => ex.forceType))).sort();
  const favoriteCount = exercises.filter(ex => ex.isFavorite).length;

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
      muscleGroup: newExercise.muscleGroup as Exercise['muscleGroup'],
      forceType: newExercise.forceType as Exercise['forceType'],
      notes: newExercise.notes.trim() || undefined,
      isFavorite: false
    };

    setExercises([...exercises, exercise]);
    setNewExercise({ name: '', muscleGroup: '', forceType: '', notes: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Exercise Added",
      description: `${exercise.name} has been added to the exercise library.`,
    });
  };

  const handleSelectExercise = (exerciseId: string) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(exerciseId)) {
      newSelected.delete(exerciseId);
    } else {
      newSelected.add(exerciseId);
    }
    setSelectedExercises(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedExercises.size === filteredExercises.length) {
      setSelectedExercises(new Set());
    } else {
      setSelectedExercises(new Set(filteredExercises.map(ex => ex.id)));
    }
  };

  const handleToggleFavorite = (exerciseId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, isFavorite: !ex.isFavorite } : ex
    ));
  };

  const handleEditExercise = (updatedExercise: Exercise) => {
    setExercises(exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    ));
  };

  const handleDeleteExercises = (exerciseIds: string[]) => {
    setExercises(exercises.filter(ex => !exerciseIds.includes(ex.id)));
    setSelectedExercises(new Set());
  };

  const handleBulkEdit = () => {
    if (selectedExercises.size === 1) {
      const exercise = exercises.find(ex => selectedExercises.has(ex.id));
      if (exercise) {
        setEditingExercise(exercise);
      }
    }
  };

  const handleBulkDelete = () => {
    const exercisesToDelete = exercises.filter(ex => selectedExercises.has(ex.id));
    setDeletingExercises(exercisesToDelete);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <BookOpen className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
            <p className="text-muted-foreground">
              Browse and manage your exercise database
              {favoriteCount > 0 && (
                <span className="ml-2">
                  <Badge variant="secondary" className="text-xs">
                    <Heart className="h-3 w-3 mr-1 fill-current text-red-500" />
                    {favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}
                  </Badge>
                </span>
              )}
            </p>
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
                    onValueChange={(value) => setNewExercise({...newExercise, muscleGroup: value as Exercise['muscleGroup']})}
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
                    onValueChange={(value) => setNewExercise({...newExercise, forceType: value as Exercise['forceType']})}
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

        {/* Bulk Actions Bar */}
        {selectedExercises.size > 0 && (
          <Card className="border-burnt-orange bg-burnt-orange/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedExercises.size} selected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedExercises.size === filteredExercises.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="flex gap-2">
                  {selectedExercises.size === 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkEdit}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
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

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isSelected={selectedExercises.has(exercise.id)}
              onSelect={handleSelectExercise}
              onToggleFavorite={handleToggleFavorite}
              onEdit={setEditingExercise}
              onDelete={(ex) => setDeletingExercises([ex])}
            />
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
                setShowFavoritesOnly(false);
              }}
              className="mt-2"
            >
              Clear all filters
            </Button>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          Showing {filteredExercises.length} of {exercises.length} exercises
          {selectedExercises.size > 0 && (
            <span className="ml-2">({selectedExercises.size} selected)</span>
          )}
        </div>

        {/* Edit Exercise Dialog */}
        <EditExerciseDialog
          exercise={editingExercise}
          isOpen={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          onSave={handleEditExercise}
          muscleGroups={muscleGroups}
          forceTypes={forceTypes}
        />

        {/* Delete Exercise Dialog */}
        <DeleteExerciseDialog
          exercises={deletingExercises}
          isOpen={deletingExercises.length > 0}
          onClose={() => setDeletingExercises([])}
          onConfirm={handleDeleteExercises}
        />
      </div>
    </PageLayout>
  );
};

export default ExerciseLibrary;
