
import AppHeader from './AppHeader';
import MainNavigation from './MainNavigation';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const PageLayout = ({ children, showNavigation = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-gray-900">
      <div className="container mx-auto p-4 max-w-7xl">
        <AppHeader />
        {showNavigation && <MainNavigation />}
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
