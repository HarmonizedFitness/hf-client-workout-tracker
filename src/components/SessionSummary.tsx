
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Trophy, Save } from 'lucide-react';

interface SessionSummaryProps {
  totalCompletedSets: number;
  totalPotentialPRs: number;
  onSaveSession: () => void;
}

const SessionSummary = ({ totalCompletedSets, totalPotentialPRs, onSaveSession }: SessionSummaryProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Session
          </CardTitle>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {totalCompletedSets} sets completed
            </div>
            {totalPotentialPRs > 0 && (
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-600" />
                {totalPotentialPRs} potential PR{totalPotentialPRs > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
        <Button onClick={onSaveSession} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Session
        </Button>
      </CardHeader>
    </Card>
  );
};

export default SessionSummary;
