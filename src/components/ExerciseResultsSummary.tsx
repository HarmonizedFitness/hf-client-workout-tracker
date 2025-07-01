
interface ExerciseResultsSummaryProps {
  filteredCount: number;
  totalCount: number;
  showFavoritesOnly: boolean;
}

const ExerciseResultsSummary = ({ filteredCount, totalCount, showFavoritesOnly }: ExerciseResultsSummaryProps) => {
  return (
    <div className="text-xs text-muted-foreground mt-2">
      Showing {filteredCount} of {totalCount} exercises
      {showFavoritesOnly && ` (favorites only)`}
    </div>
  );
};

export default ExerciseResultsSummary;
