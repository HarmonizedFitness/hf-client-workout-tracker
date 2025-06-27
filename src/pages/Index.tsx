
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, BookOpen, Plus, Users } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import TabContent from '@/components/TabContent';
import MainNavigation from '@/components/MainNavigation';
import { useClient } from '@/context/ClientContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const { selectedClient, setSelectedClient } = useClient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
      <div className="container mx-auto p-4 max-w-7xl">
        <AppHeader />
        <MainNavigation />

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
            <TabsTrigger value="clients" className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Exercise Library
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center gap-2 text-sm" disabled={!selectedClient?.is_active}>
              <Plus className="h-4 w-4" />
              Log Session
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2 text-sm" disabled={!selectedClient?.is_active}>
              <Trophy className="h-4 w-4" />
              Personal Records
            </TabsTrigger>
          </TabsList>

          <TabContent 
            selectedClient={selectedClient} 
            onClientSelect={setSelectedClient} 
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
