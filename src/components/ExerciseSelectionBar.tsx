
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, X } from 'lucide-react';

interface ExerciseSelectionBarProps {
  selectedCount: number;
  onCreateCircuit: () => void;
  onClearSelection: () => void;
}

const ExerciseSelectionBar = ({
  selectedCount,
  onCreateCircuit,
  onClearSelection,
}: ExerciseSelectionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {selectedCount} selected
          </Badge>
          <span className="text-sm text-muted-foreground">
            Select multiple exercises to group them into a circuit
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onCreateCircuit}
            disabled={selectedCount < 2}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Users className="h-4 w-4 mr-1" />
            Create Circuit
          </Button>
          <Button
            onClick={onClearSelection}
            variant="ghost"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExerciseSelectionBar;
