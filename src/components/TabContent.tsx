
import { TabsContent } from "@/components/ui/tabs";
import ClientSelector from './ClientSelector';
import ExerciseLibrary from './ExerciseLibrary';
import EnhancedSessionLogger from './EnhancedSessionLogger';
import PersonalBests from './PersonalBests';
import { Client } from '@/types/exercise';

interface TabContentProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const TabContent = ({ selectedClient, onClientSelect }: TabContentProps) => {
  return (
    <>
      <TabsContent value="clients">
        <ClientSelector selectedClient={selectedClient} onClientSelect={onClientSelect} />
      </TabsContent>

      <TabsContent value="library">
        <ExerciseLibrary />
      </TabsContent>

      <TabsContent value="session">
        <EnhancedSessionLogger />
      </TabsContent>

      <TabsContent value="records">
        {selectedClient ? (
          <PersonalBests client={selectedClient} />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Please select a client first to view their personal records.
          </div>
        )}
      </TabsContent>
    </>
  );
};

export default TabContent;
