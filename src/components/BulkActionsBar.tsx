
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onCreateWorkout: () => void;
}

const BulkActionsBar = ({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onCreateWorkout
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <Card className="border-burnt-orange bg-burnt-orange/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedCount} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              Clear Selection
            </Button>
          </div>
          <Button
            onClick={onCreateWorkout}
            className="bg-burnt-orange hover:bg-burnt-orange/90"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkActionsBar;
