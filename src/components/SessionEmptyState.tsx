
import { Card, CardContent } from "@/components/ui/card";

interface SessionEmptyStateProps {
  clientName: string;
}

const SessionEmptyState = ({ clientName }: SessionEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <p className="text-muted-foreground mb-4">No exercises added to this session yet.</p>
        <p className="text-sm text-muted-foreground">
          Select an exercise above to start tracking {clientName}'s workout!
        </p>
      </CardContent>
    </Card>
  );
};

export default SessionEmptyState;
