
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
      <CardContent className="p-3">
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(exercise.id)}
            className="data-[state=checked]:bg-burnt-orange data-[state=checked]:border-burnt-orange h-5 w-5"
          />
        </div>

        {/* Favorite Star */}
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-accent"
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

        <div className="space-y-2 mt-5">
          <h3 className="font-semibold text-base leading-tight pr-6">{exercise.name}</h3>
          
          <div className="flex flex-wrap gap-1">
            <Badge className={`${getMuscleGroupColor(exercise.muscleGroup)} text-xs px-2 py-0.5`}>
              {exercise.muscleGroup}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {exercise.forceType}
            </Badge>
            {exercise.isFavorite && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </Badge>
            )}
          </div>

          {exercise.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {exercise.notes}
            </p>
          )}

          {/* Action Buttons - Show on hover or when selected */}
          <div className={`flex gap-1 transition-opacity pt-1 ${
            isSelected || 'group-hover:opacity-100 opacity-0'
          }`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(exercise)}
              className="flex-1 h-8 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(exercise)}
              className="flex-1 h-8 text-xs text-destructive hover:text-destructive"
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
