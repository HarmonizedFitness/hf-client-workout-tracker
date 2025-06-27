
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Exercise } from '@/types/exercise';
import { BookOpen, Plus, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExerciseLibraryHeaderProps {
  favoriteCount: number;
  muscleGroups: string[];
  forceTypes: string[];
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  newExercise: {
    name: string;
    muscleGroup: Exercise['muscleGroup'] | '';
    forceType: Exercise['forceType'] | '';
    notes: string;
  };
  setNewExercise: (exercise: any) => void;
  onAddExercise: () => void;
}

const ExerciseLibraryHeader = ({
  favoriteCount,
  muscleGroups,
  forceTypes,
  isAddDialogOpen,
  setIsAddDialogOpen,
  newExercise,
  setNewExercise,
  onAddExercise
}: ExerciseLibraryHeaderProps) => {
  return (
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
              <Button onClick={onAddExercise} className="flex-1">
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
  );
};

export default ExerciseLibraryHeader;
