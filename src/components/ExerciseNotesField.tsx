
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ExerciseNotesFieldProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const ExerciseNotesField = ({ notes, onNotesChange }: ExerciseNotesFieldProps) => {
  const [isOpen, setIsOpen] = useState(!!notes);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
          <StickyNote className="h-4 w-4 mr-1" />
          Notes
          {notes && <span className="ml-1 text-xs">({notes.length})</span>}
          {isOpen ? (
            <ChevronUp className="h-3 w-3 ml-1" />
          ) : (
            <ChevronDown className="h-3 w-3 ml-1" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <Textarea
          placeholder="Add notes for this exercise..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
          className="text-sm resize-none"
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExerciseNotesField;
