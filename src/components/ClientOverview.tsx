
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from '@/types/exercise';
import { Calendar, DollarSign } from 'lucide-react';

interface ClientOverviewProps {
  client: Client;
}

const ClientOverview = ({ client }: ClientOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Overview: {client.name}</CardTitle>
        <CardDescription>
          Active member since {new Date(client.dateJoined).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {client.personalRecords.length}
            </div>
            <p className="text-sm text-blue-800">Personal Records</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {client.workoutHistory.length}
            </div>
            <p className="text-sm text-green-800">Workout Sessions</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {client.personalRecords.reduce((max, pr) => Math.max(max, pr.weight), 0)}kg
            </div>
            <p className="text-sm text-purple-800">Heaviest Lift</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-orange-600">
              {client.trainingDaysPerWeek}
            </div>
            <p className="text-sm text-orange-800">Days/Week</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-600">
              ${client.costPerSession}
            </div>
            <p className="text-sm text-emerald-800">Per Session</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientOverview;
