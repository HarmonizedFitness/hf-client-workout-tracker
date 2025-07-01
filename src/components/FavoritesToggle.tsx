
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';

interface FavoritesToggleProps {
  showFavoritesOnly: boolean;
  onToggle: (checked: boolean | "indeterminate") => void;
  favoritesCount: number;
}

const FavoritesToggle = ({ showFavoritesOnly, onToggle, favoritesCount }: FavoritesToggleProps) => {
  return (
    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
      <Checkbox
        id="favorites-toggle"
        checked={showFavoritesOnly}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
      />
      <Label htmlFor="favorites-toggle" className="flex items-center gap-2 cursor-pointer">
        <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
        Show Favorites Only
        {showFavoritesOnly && (
          <Badge variant="secondary" className="text-xs">
            {favoritesCount} favorites
          </Badge>
        )}
      </Label>
    </div>
  );
};

export default FavoritesToggle;
