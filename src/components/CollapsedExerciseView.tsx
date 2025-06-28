
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Trophy } from 'lucide-react';
import { kgToLbs } from '@/utils/weightConversions';

interface CollapsedExerciseViewProps {
  exerciseName: string;
  currentPR?: number;
  completedSetsCount: number;
  onToggleCollapse: () => void;
}

const CollapsedExerciseView = ({ 
  exerciseName, 
  currentPR, 
  completedSetsCount, 
  onToggleCollapse 
}: CollapsedExerciseViewProps) => {
  const getCompletedSetsDisplay = () => {
    if (completedSetsCount === 0) return "No sets completed";
    return `${completedSetsCount} set${completedSetsCount > 1 ? 's' : ''} completed`;
  };

  return (
    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200">{exerciseName}</h3>
              <p className="text-sm text-green-600 dark:text-green-300">{getCompletedSetsDisplay()}</p>
            </div>
            {currentPR && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 ml-2">
                <Trophy className="h-3 w-3 mr-1" />
                PR: {kgToLbs(currentPR)} lbs
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleCollapse}
            className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/40"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollapsedExerciseView;
