
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ExerciseEntry } from '@/hooks/useSessionState';
import SortableExerciseItem from './SortableExerciseItem';
import CircuitContainer from './CircuitContainer';
import ExerciseSelectionBar from './ExerciseSelectionBar';
import { useCircuitOperations } from '@/hooks/useCircuitOperations';

interface ExerciseReorderContainerProps {
  exerciseEntries: ExerciseEntry[];
  setExerciseEntries: (entries: ExerciseEntry[]) => void;
  selectedExercises: Set<string>;
  setSelectedExercises: (selected: Set<string>) => void;
  onUpdateExerciseSets: (exerciseId: string, sets: any[]) => void;
  onToggleExerciseCollapse: (exerciseId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  getCurrentPR: (exerciseId: string) => number | undefined;
  getExercise: (exerciseId: string) => any;
}

const ExerciseReorderContainer = ({
  exerciseEntries,
  setExerciseEntries,
  selectedExercises,
  setSelectedExercises,
  onUpdateExerciseSets,
  onToggleExerciseCollapse,
  onRemoveExercise,
  getCurrentPR,
  getExercise,
}: ExerciseReorderContainerProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    createCircuit,
    removeFromCircuit,
    deleteCircuit,
    renameCircuit,
    getExerciseGroups,
  } = useCircuitOperations({
    exerciseEntries,
    setExerciseEntries,
    selectedExercises,
    setSelectedExercises,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = exerciseEntries.findIndex(item => item.exerciseId === active.id);
      const newIndex = exerciseEntries.findIndex(item => item.exerciseId === over.id);

      const reorderedEntries = arrayMove(exerciseEntries, oldIndex, newIndex);
      
      // Update positions
      const updatedEntries = reorderedEntries.map((entry, index) => ({
        ...entry,
        position: index + 1,
      }));

      setExerciseEntries(updatedEntries);
    }
  };

  const handleExerciseSelect = (exerciseId: string, selected: boolean) => {
    const newSelection = new Set(selectedExercises);
    if (selected) {
      newSelection.add(exerciseId);
    } else {
      newSelection.delete(exerciseId);
    }
    setSelectedExercises(newSelection);
  };

  const updateExerciseNotes = (exerciseId: string, notes: string) => {
    const updatedEntries = exerciseEntries.map(entry => {
      if (entry.exerciseId === exerciseId) {
        return { ...entry, exerciseNotes: notes };
      }
      return entry;
    });
    setExerciseEntries(updatedEntries);
  };

  const { circuits, standalone } = getExerciseGroups();

  return (
    <div className="space-y-4">
      <ExerciseSelectionBar
        selectedCount={selectedExercises.size}
        onCreateCircuit={createCircuit}
        onClearSelection={() => setSelectedExercises(new Set())}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={exerciseEntries.map(e => e.exerciseId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {/* Render circuits */}
            {Object.entries(circuits).map(([circuitId, circuitExercises]) => (
              <CircuitContainer
                key={circuitId}
                circuitId={circuitId}
                exercises={circuitExercises}
                selectedExercises={selectedExercises}
                onExerciseSelect={handleExerciseSelect}
                onUpdateExerciseSets={onUpdateExerciseSets}
                onToggleExerciseCollapse={onToggleExerciseCollapse}
                onRemoveExercise={onRemoveExercise}
                onRemoveFromCircuit={removeFromCircuit}
                onDeleteCircuit={deleteCircuit}
                onRenameCircuit={renameCircuit}
                onUpdateExerciseNotes={updateExerciseNotes}
                getCurrentPR={getCurrentPR}
                getExercise={getExercise}
              />
            ))}

            {/* Render standalone exercises */}
            {standalone.map((entry) => (
              <SortableExerciseItem
                key={entry.exerciseId}
                entry={entry}
                isSelected={selectedExercises.has(entry.exerciseId)}
                onSelect={handleExerciseSelect}
                onUpdateSets={onUpdateExerciseSets}
                onToggleCollapse={onToggleExerciseCollapse}
                onRemove={onRemoveExercise}
                onUpdateNotes={updateExerciseNotes}
                getCurrentPR={getCurrentPR}
                getExercise={getExercise}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ExerciseReorderContainer;
