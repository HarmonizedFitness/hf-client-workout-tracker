
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkoutProgram } from '@/types/workoutProgram';
import { Clock, Users, Dumbbell } from 'lucide-react';

interface WorkoutProgramCardProps {
  program: WorkoutProgram;
  onSelect: (program: WorkoutProgram) => void;
}

const WorkoutProgramCard = ({ program, onSelect }: WorkoutProgramCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bodyweight':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'trx':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'stretching':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{program.name}</CardTitle>
            <p className="text-muted-foreground text-sm mb-3">{program.description}</p>
          </div>
          <Badge className={getTypeColor(program.type)}>
            {program.type.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{program.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            <span>{program.equipment.join(', ')}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Program Highlights:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {program.days.length} complete workout days</li>
            <li>• Progressive difficulty structure</li>
            <li>• Mindfulness integration</li>
            <li>• Professional video guidance</li>
          </ul>
        </div>
        
        <Button 
          onClick={() => onSelect(program)}
          className="w-full bg-burnt-orange hover:bg-burnt-orange/90"
        >
          Start Program
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkoutProgramCard;
