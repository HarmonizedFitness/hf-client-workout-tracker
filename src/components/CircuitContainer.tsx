
import { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  GripVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExerciseEntry } from '@/hooks/useSessionState';
import IndividualSetEntry from './IndividualSetEntry';
import ExerciseNotesField from './ExerciseNotesField';

interface CircuitContainerProps {
  circuitId: string;
  exercises: ExerciseEntry[];
  selectedExercises: Set<string>;
  onExerciseSelect: (exerciseId: string, selected: boolean) => void;
  onUpdateExerciseSets: (exerciseId: string, sets: any[]) => void;
  onToggleExerciseCollapse: (exerciseId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onRemoveFromCircuit: (exerciseId: string) => void;
  onDeleteCircuit: (circuitId: string) => void;
  onRenameCircuit: (oldId: string, newId: string) => void;
  onUpdateExerciseNotes: (exerciseId: string, notes: string) => void;
  getCurrentPR: (exerciseId: string) => number | undefined;
  getExercise: (exerciseId: string) => any;
}

const CircuitContainer = ({
  circuitId,
  exercises,
  selectedExercises,
  onExerciseSelect,
  onUpdateExerciseSets,
  onToggleExerciseCollapse,
  onRemoveExercise,
  onRemoveFromCircuit,
  onDeleteCircuit,
  onRenameCircuit,
  onUpdateExerciseNotes,
  getCurrentPR,
  getExercise,
}: CircuitContainerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(circuitId);

  const handleSaveRename = () => {
    if (editName.trim() && editName !== circuitId) {
      onRenameCircuit(circuitId, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(circuitId);
    setIsEditing(false);
  };

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 text-sm font-medium"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleSaveRename}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {circuitId}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({exercises.length} exercises)
                </span>
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename Circuit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteCircuit(circuitId)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Circuit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {exercises.map((entry, index) => {
          const exercise = getExercise(entry.exerciseId);
          const currentPR = getCurrentPR(entry.exerciseId);

          return (
            <Card key={entry.exerciseId} className="border border-muted">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="pt-2">
                    <Checkbox
                      checked={selectedExercises.has(entry.exerciseId)}
                      onCheckedChange={(checked) => 
                        onExerciseSelect(entry.exerciseId, checked === true)
                      }
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {index + 1}. {exercise?.name || 'Unknown Exercise'}
                        </h4>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFromCircuit(entry.exerciseId)}
                          className="text-orange-600 hover:text-orange-700 h-8 px-2"
                          title="Remove from circuit"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveExercise(entry.exerciseId)}
                          className="text-red-600 hover:text-red-700 h-8 px-2"
                          title="Remove exercise completely"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <ExerciseNotesField
                      notes={entry.exerciseNotes || ''}
                      onNotesChange={(notes) => onUpdateExerciseNotes(entry.exerciseId, notes)}
                    />

                    <IndividualSetEntry
                      exerciseName={exercise?.name || 'Unknown Exercise'}
                      currentPR={currentPR}
                      onSetsChange={(sets) => onUpdateExerciseSets(entry.exerciseId, sets)}
                      isCollapsed={entry.collapsed}
                      onToggleCollapse={() => onToggleExerciseCollapse(entry.exerciseId)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CircuitContainer;
