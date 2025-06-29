
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SessionNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const SessionNotes = ({ notes, onNotesChange }: SessionNotesProps) => {
  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous HTML tags and script content
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  };

  const handleNotesChange = (value: string) => {
    // Limit length and sanitize input
    const sanitized = sanitizeInput(value);
    const truncated = sanitized.substring(0, 2000); // Limit to 2000 characters
    onNotesChange(truncated);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div>
          <Label htmlFor="session-notes">
            Session Notes (Optional)
            <span className="text-sm text-muted-foreground ml-2">
              {notes.length}/2000 characters
            </span>
          </Label>
          <Textarea
            id="session-notes"
            placeholder="Add any notes about this workout session..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={3}
            maxLength={2000}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionNotes;
