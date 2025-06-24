
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trophy } from 'lucide-react';

interface IndividualSet {
  setNumber: number;
  reps: string;
  weight: string;
}

interface IndividualSetEntryProps {
  exerciseName: string;
  currentPR?: number;
  onSetsChange: (sets: IndividualSet[]) => void;
}

const IndividualSetEntry = ({ exerciseName, currentPR, onSetsChange }: IndividualSetEntryProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{exerciseName}</span>
          {currentPR && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Trophy className="h-3 w-3 mr-1" />
              Current PR: {currentPR} lbs
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 border rounded-lg ${isNewPR(set.weight) ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="w-16 text-sm font-medium text-gray-600">
                Set {set.setNumber}
              </div>
              
              <div className="flex-1">
                <Label htmlFor={`reps-${index}`} className="text-xs text-gray-500">Reps</Label>
                <Input
                  id={`reps-${index}`}
                  type="number"
                  placeholder="10"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', e.target.value)}
                  min="1"
                  className="h-9"
                />
              </div>
              
              <div className="flex-1">
                <Label htmlFor={`weight-${index}`} className="text-xs text-gray-500">Weight (lbs)</Label>
                <Input
                  id={`weight-${index}`}
                  type="number"
                  step="0.5"
                  placeholder="135"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', e.target.value)}
                  min="0"
                  className="h-9"
                />
              </div>

              {isNewPR(set.weight) && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                  NEW PR!
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSet(index)}
                disabled={sets.length === 1}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={addSet}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Set
        </Button>
      </CardContent>
    </Card>
  );
};

export default IndividualSetEntry;
