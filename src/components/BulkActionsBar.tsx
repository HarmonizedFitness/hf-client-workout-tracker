
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  filteredCount: number;
  onSelectAll: () => void;
  onBulkEdit: () => void;
  onBulkDelete: () => void;
}

const BulkActionsBar = ({
  selectedCount,
  filteredCount,
  onSelectAll,
  onBulkEdit,
  onBulkDelete
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <Card className="border-burnt-orange bg-burnt-orange/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedCount} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
            >
              {selectedCount === filteredCount ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="flex gap-2">
            {selectedCount === 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkEdit}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkActionsBar;
