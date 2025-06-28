
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from 'lucide-react';
import { formatWeight } from '@/utils/weightConversions';
import SetRow from './SetRow';
import CollapsedExerciseView from './CollapsedExerciseView';
import SetControls from './SetControls';

interface IndividualSet {
  setNumber: number;
  reps: string;
  weight: string;
}

interface IndividualSetEntryProps {
  exerciseName: string;
  currentPR?: number;
  onSetsChange: (sets: IndividualSet[]) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const IndividualSetEntry = ({ 
  exerciseName, 
  currentPR, 
  onSetsChange, 
  isCollapsed = false, 
  onToggleCollapse 
}: IndividualSetEntryProps) => {
  const [sets, setSets] = useState<IndividualSet[]>([
    { setNumber: 1, reps: '', weight: '' },
    { setNumber: 2, reps: '', weight: '' },
    { setNumber: 3, reps: '', weight: '' }
  ]);

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    const updatedSets = sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
    onSetsChange(updatedSets);
  };

  const addSet = () => {
    const newSet = { setNumber: sets.length + 1, reps: '', weight: '' };
    const updatedSets = [...sets, newSet];
    setSets(updatedSets);
    onSetsChange(updatedSets);
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      const updatedSets = sets.filter((_, i) => i !== index)
        .map((set, i) => ({ ...set, setNumber: i + 1 }));
      setSets(updatedSets);
      onSetsChange(updatedSets);
    }
  };

  const isNewPR = (weight: string) => {
    const weightNum = parseFloat(weight);
    return currentPR && weightNum > currentPR;
  };

  const getCompletedSetsCount = () => {
    return sets.filter(set => set.reps && set.weight).length;
  };

  const hasAnyCompletedSets = () => {
    return getCompletedSetsCount() > 0;
  };

  // Collapsed view
  if (isCollapsed) {
    return (
      <CollapsedExerciseView
        exerciseName={exerciseName}
        currentPR={currentPR}
        completedSetsCount={getCompletedSetsCount()}
        onToggleCollapse={onToggleCollapse!}
      />
    );
  }

  // Expanded view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{exerciseName}</span>
          {currentPR && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Trophy className="h-3 w-3 mr-1" />
              Current PR: {formatWeight(currentPR)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {sets.map((set, index) => (
            <SetRow
              key={index}
              set={set}
              index={index}
              isNewPR={isNewPR(set.weight)}
              canRemove={sets.length > 1}
              onUpdateSet={updateSet}
              onRemoveSet={removeSet}
            />
          ))}
        </div>
        
        <SetControls
          onAddSet={addSet}
          hasCompletedSets={hasAnyCompletedSets()}
          onToggleCollapse={onToggleCollapse}
        />
      </CardContent>
    </Card>
  );
};

export default IndividualSetEntry;
