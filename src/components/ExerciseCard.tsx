
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Exercise } from '@/types/exercise';
import { getMuscleGroupColor } from '@/utils/muscleGroupColors';
import { Star, Edit, Trash2 } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  isSelected: boolean;
  onSelect: (exerciseId: string) => void;
  onToggleFavorite: (exerciseId: string) => void;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}

const ExerciseCard = ({ 
  exercise, 
  isSelected, 
  onSelect, 
  onToggleFavorite, 
  onEdit, 
  onDelete 
}: ExerciseCardProps) => {
  return (
    <Card className={`hover:shadow-md transition-all duration-200 relative group ${
      isSelected ? 'ring-2 ring-burnt-orange bg-accent/10' : ''
    }`}>
      <CardContent className="p-4">
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(exercise.id)}
            className="data-[state=checked]:bg-burnt-orange data-[state=checked]:border-burnt-orange"
          />
        </div>

        {/* Favorite Star */}
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-accent"
            onClick={() => onToggleFavorite(exercise.id)}
          >
            <Star 
              className={`h-4 w-4 ${
                exercise.isFavorite 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-muted-foreground hover:text-yellow-400'
              }`}
            />
          </Button>
        </div>

        <div className="space-y-3 mt-6">
          <h3 className="font-semibold text-lg leading-tight pr-8">{exercise.name}</h3>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getMuscleGroupColor(exercise.muscleGroup)}>
              {exercise.muscleGroup}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {exercise.forceType}
            </Badge>
            {exercise.isFavorite && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </Badge>
            )}
          </div>

          {exercise.notes && (
            <p className="text-sm text-muted-foreground">
              {exercise.notes}
            </p>
          )}

          {/* Action Buttons - Show on hover or when selected */}
          <div className={`flex gap-2 transition-opacity ${
            isSelected || 'group-hover:opacity-100 opacity-0'
          }`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(exercise)}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(exercise)}
              className="flex-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
