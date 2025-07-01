
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, Heart } from 'lucide-react';

interface ExerciseLibraryHeaderProps {
  totalExercises: number;
  favoritesCount: number;
  onAddExercise: () => void;
  isAddingExercise: boolean;
}

const ExerciseLibraryHeader = ({
  totalExercises,
  favoritesCount,
  onAddExercise,
  isAddingExercise
}: ExerciseLibraryHeaderProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Dumbbell className="h-7 w-7 text-burnt-orange" />
              Exercise Library
            </CardTitle>
            <CardDescription className="mt-2">
              Browse and manage your exercise collection
            </CardDescription>
          </div>
          <Button onClick={onAddExercise} disabled={isAddingExercise}>
            <Plus className="h-4 w-4 mr-2" />
            {isAddingExercise ? "Adding..." : "Add Exercise"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Dumbbell className="h-3 w-3" />
            {totalExercises} Total
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {favoritesCount} Favorites
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseLibraryHeader;
