
import { Dumbbell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const AppHeader = () => {
  return (
    <div className="text-center mb-8 pt-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center justify-center gap-3">
        <Dumbbell className="h-10 w-10 text-burnt-orange dark:text-burnt-orange" />
        Harmonized Strength Log
      </h1>
      <p className="text-lg bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 dark:from-orange-400 dark:via-red-400 dark:to-orange-500 bg-clip-text text-transparent font-medium">
        Professional Personal Training Client Management System
      </p>
    </div>
  );
};

export default AppHeader;
