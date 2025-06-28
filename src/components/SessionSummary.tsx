
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Trophy, Target } from 'lucide-react';

interface SessionSummaryProps {
  totalCompletedSets: number;
  totalPotentialPRs: number;
  onSaveSession: () => void;
  isLoading?: boolean;
}

const SessionSummary = ({ 
  totalCompletedSets, 
  totalPotentialPRs, 
  onSaveSession,
  isLoading = false 
}: SessionSummaryProps) => {
  return (
    <Card className="border-burnt-orange bg-burnt-orange/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-burnt-orange" />
              <Badge variant="secondary">
                {totalCompletedSets} sets completed
              </Badge>
            </div>
            {totalPotentialPRs > 0 && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-800">
                  {totalPotentialPRs} potential PR{totalPotentialPRs > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
          <Button 
            onClick={onSaveSession}
            disabled={totalCompletedSets === 0 || isLoading}
            className="bg-burnt-orange hover:bg-burnt-orange/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Session'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionSummary;
