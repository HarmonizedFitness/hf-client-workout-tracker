
import { Card, CardContent } from "@/components/ui/card";
import { Client } from '@/types/exercise';
import { Archive } from 'lucide-react';

interface ArchivedClientCardProps {
  client: Client;
}

const ArchivedClientCard = ({ client }: ArchivedClientCardProps) => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="text-center py-8">
        <Archive className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          {client.name} is Archived
        </h3>
        <p className="text-orange-600">
          This client was archived on {client.dateArchived ? new Date(client.dateArchived).toLocaleDateString() : 'Unknown date'}. 
          Their data is preserved and they can be restored anytime.
        </p>
      </CardContent>
    </Card>
  );
};

export default ArchivedClientCard;
