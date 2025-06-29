
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useWorkoutTemplates, WorkoutTemplate } from '@/hooks/useWorkoutTemplates';
import { useExercises } from '@/hooks/useExercises';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useClient } from '@/context/ClientContext';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Play, Copy, Dumbbell } from 'lucide-react';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import PageLayout from '@/components/PageLayout';
import { toast } from '@/hooks/use-toast';

const Workouts = () => {
  const { workoutTemplates, isLoading, deleteTemplate } = useWorkoutTemplates();
  const { allExercises } = useExercises();
  const { activeClients } = useSupabaseClients();
  const { setSelectedClient } = useClient();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState('all');

  const getExerciseNames = (exerciseIds: string[]) => {
    return exerciseIds
      .map(id => allExercises.find(ex => ex.id === id)?.name)
      .filter(Boolean);
  };

  const muscleGroups = [...new Set(workoutTemplates.map(template => template.muscle_group).filter(Boolean))];

  const filteredAndSortedTemplates = workoutTemplates
    .filter(template => 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterMuscleGroup === 'all' || template.muscle_group === filterMuscleGroup)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'muscle_group':
          return (a.muscle_group || '').localeCompare(b.muscle_group || '');
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleStartSession = (template: WorkoutTemplate, clientId?: string) => {
    if (clientId && clientId !== 'none') {
      const client = activeClients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client);
      }
    }
    navigate(`/session?exercises=${template.exercise_ids.join(',')}`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
  };

  const handleDuplicateTemplate = (template: WorkoutTemplate) => {
    // For now, just navigate to exercise library with the exercises selected
    navigate(`/library?exercises=${template.exercise_ids.join(',')}`);
    toast({
      title: "Template Ready",
      description: "Exercises have been selected in the Exercise Library. You can now create a new workout.",
    });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Dumbbell className="h-8 w-8 animate-pulse mx-auto mb-4 text-burnt-orange" />
            <p>Loading your workouts...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Workout Templates</h1>
          <p className="text-muted-foreground">Manage and organize your workout templates</p>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Workouts</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by workout name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="muscle_group">Muscle Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter">Filter by Muscle Group</Label>
                <Select value={filterMuscleGroup} onValueChange={setFilterMuscleGroup}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All muscle groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All muscle groups</SelectItem>
                    {muscleGroups.map(group => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create New Workout Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/library')}
            className="bg-burnt-orange hover:bg-burnt-orange/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Workout
          </Button>
        </div>

        {/* Workout Templates Grid */}
        {filteredAndSortedTemplates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Workouts Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterMuscleGroup !== 'all'
                  ? "No workouts match your search criteria." 
                  : "You haven't created any workout templates yet."}
              </p>
              <Button
                onClick={() => navigate('/library')}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        {template.muscle_group && (
                          <Badge className={`${getMuscleGroupColor(template.muscle_group)} text-xs`}>
                            {template.muscle_group}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {template.exercise_ids.length} exercises
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {template.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(template.created_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Exercises:</p>
                    <div className="text-xs text-muted-foreground">
                      {getExerciseNames(template.exercise_ids).slice(0, 3).join(', ')}
                      {template.exercise_ids.length > 3 && ` and ${template.exercise_ids.length - 3} more...`}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" className="flex-1">
                          <Play className="h-3 w-3 mr-1" />
                          Start Session
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleStartSession(template, 'none')}>
                          No client selected
                        </DropdownMenuItem>
                        {activeClients.map(client => (
                          <DropdownMenuItem 
                            key={client.id} 
                            onClick={() => handleStartSession(template, client.id)}
                          >
                            {client.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Workout Template</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{template.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Workouts;
