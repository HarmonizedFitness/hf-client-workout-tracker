
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle } from 'lucide-react';

interface SetControlsProps {
  onAddSet: () => void;
  hasCompletedSets: boolean;
  onToggleCollapse?: () => void;
}

const SetControls = ({ onAddSet, hasCompletedSets, onToggleCollapse }: SetControlsProps) => {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        onClick={onAddSet}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Set
      </Button>

      {hasCompletedSets && onToggleCollapse && (
        <Button
          variant="outline"
          onClick={onToggleCollapse}
          className="w-full text-green-700 border-green-300 hover:bg-green-50 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/20"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Complete Exercise
        </Button>
      )}
    </div>
  );
};

export default SetControls;
