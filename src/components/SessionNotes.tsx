
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SessionNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const SessionNotes = ({ notes, onNotesChange }: SessionNotesProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div>
          <Label htmlFor="session-notes">Session Notes (Optional)</Label>
          <Textarea
            id="session-notes"
            placeholder="Add any notes about this workout session..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionNotes;
