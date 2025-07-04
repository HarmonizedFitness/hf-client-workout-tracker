
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from 'lucide-react';
import { ExerciseEntry } from '@/hooks/useSessionState';
import IndividualSetEntry from './IndividualSetEntry';
import ExerciseNotesField from './ExerciseNotesField';

interface SortableExerciseItemProps {
  entry: ExerciseEntry;
  isSelected: boolean;
  onSelect: (exerciseId: string, selected: boolean) => void;
  onUpdateSets: (exerciseId: string, sets: any[]) => void;
  onToggleCollapse: (exerciseId: string) => void;
  onRemove: (exerciseId: string) => void;
  onUpdateNotes: (exerciseId: string, notes: string) => void;
  getCurrentPR: (exerciseId: string) => number | undefined;
  getExercise: (exerciseId: string) => any;
}

const SortableExerciseItem = ({
  entry,
  isSelected,
  onSelect,
  onUpdateSets,
  onToggleCollapse,
  onRemove,
  onUpdateNotes,
  getCurrentPR,
  getExercise,
}: SortableExerciseItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.exerciseId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const exercise = getExercise(entry.exerciseId);
  const currentPR = getCurrentPR(entry.exerciseId);

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            className="flex flex-col items-center gap-2 pt-2"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
          </div>

          {/* Selection Checkbox */}
          <div className="pt-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(entry.exerciseId, checked === true)}
            />
          </div>

          {/* Exercise Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-lg">{exercise?.name || 'Unknown Exercise'}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(entry.exerciseId)}
                className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ExerciseNotesField
              notes={entry.exerciseNotes || ''}
              onNotesChange={(notes) => onUpdateNotes(entry.exerciseId, notes)}
            />

            <IndividualSetEntry
              exerciseName={exercise?.name || 'Unknown Exercise'}
              currentPR={currentPR}
              onSetsChange={(sets) => onUpdateSets(entry.exerciseId, sets)}
              isCollapsed={entry.collapsed}
              onToggleCollapse={() => onToggleCollapse(entry.exerciseId)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SortableExerciseItem;
