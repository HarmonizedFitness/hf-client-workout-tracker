
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Users, BarChart3, Plus, Trophy, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const MainNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/session', label: 'Log Session', icon: Plus },
    { path: '/records', label: 'Records', icon: Trophy },
    { path: '/library', label: 'Exercise Library', icon: BookOpen },
  ];

  return (
    <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3">
          <div className="flex gap-2 flex-wrap justify-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      isActive && "bg-burnt-orange hover:bg-burnt-orange/90 text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
