
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface ExerciseClearFiltersProps {
  searchValue: string;
  showFavoritesOnly: boolean;
  onClearSearch: () => void;
  onClearFavorites: () => void;
}

const ExerciseClearFilters = ({
  searchValue,
  showFavoritesOnly,
  onClearSearch,
  onClearFavorites
}: ExerciseClearFiltersProps) => {
  if (!searchValue && !showFavoritesOnly) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSearch}
          className="h-8"
        >
          <X className="h-3 w-3 mr-1" />
          Clear search
        </Button>
      )}
      {showFavoritesOnly && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFavorites}
          className="h-8"
        >
          <X className="h-3 w-3 mr-1" />
          Show all exercises
        </Button>
      )}
    </div>
  );
};

export default ExerciseClearFilters;
