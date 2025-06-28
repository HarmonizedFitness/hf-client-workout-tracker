
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus } from 'lucide-react';

interface IndividualSet {
  setNumber: number;
  reps: string;
  weight: string;
}

interface SetRowProps {
  set: IndividualSet;
  index: number;
  isNewPR: boolean;
  canRemove: boolean;
  onUpdateSet: (index: number, field: 'reps' | 'weight', value: string) => void;
  onRemoveSet: (index: number) => void;
}

const SetRow = ({ set, index, isNewPR, canRemove, onUpdateSet, onRemoveSet }: SetRowProps) => {
  return (
    <div className={`flex items-center gap-3 p-3 border rounded-lg ${isNewPR ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
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
          onChange={(e) => onUpdateSet(index, 'reps', e.target.value)}
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
          onChange={(e) => onUpdateSet(index, 'weight', e.target.value)}
          min="0"
          className="h-9"
        />
      </div>

      {isNewPR && (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
          NEW PR!
        </Badge>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemoveSet(index)}
        disabled={!canRemove}
        className="text-red-600 hover:text-red-700 p-1"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SetRow;
