
import { useState } from 'react';
import { workoutPrograms } from '@/data/workoutPrograms';
import { WorkoutProgram, WorkoutDay } from '@/types/workoutProgram';
import WorkoutProgramCard from '@/components/WorkoutProgramCard';
import WorkoutDayView from '@/components/WorkoutDayView';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';

type ViewState = 
  | { type: 'programs' }
  | { type: 'program-overview'; program: WorkoutProgram }
  | { type: 'day-view'; program: WorkoutProgram; day: WorkoutDay };

const Programs = () => {
  const [viewState, setViewState] = useState<ViewState>({ type: 'programs' });

  const handleSelectProgram = (program: WorkoutProgram) => {
    setViewState({ type: 'program-overview', program });
  };

  const handleSelectDay = (program: WorkoutProgram, day: WorkoutDay) => {
    setViewState({ type: 'day-view', program, day });
  };

  const handleBackToPrograms = () => {
    setViewState({ type: 'programs' });
  };

  const handleBackToOverview = () => {
    if (viewState.type === 'day-view') {
      setViewState({ type: 'program-overview', program: viewState.program });
    }
  };

  // Programs overview
  if (viewState.type === 'programs') {
    return (
      <PageLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-burnt-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Workout Programs</h1>
            <p className="text-muted-foreground">
              Professional 7-day workout programs designed for complete transformation
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {workoutPrograms.map((program) => (
              <WorkoutProgramCard 
                key={program.id} 
                program={program} 
                onSelect={handleSelectProgram}
              />
            ))}
          </div>

          {/* Info Section */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>About Our Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-burnt-orange mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">7-Day Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    Each program follows a progressive 7-day format with carefully planned daily themes
                  </p>
                </div>
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-burnt-orange mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Professional Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Created by Dr. U with detailed instructions, modifications, and video guidance
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="h-8 w-8 text-burnt-orange mx-auto mb-2 flex items-center justify-center">
                    3
                  </Badge>
                  <h3 className="font-semibold mb-2">Three Pillars</h3>
                  <p className="text-sm text-muted-foreground">
                    Mind-body integration following our signature Three Pillars philosophy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Program overview with day selection
  if (viewState.type === 'program-overview') {
    const { program } = viewState;
    
    return (
      <PageLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleBackToPrograms}>
              ← Back to Programs
            </Button>
            <Badge className={`px-4 py-2 text-sm ${
              program.type === 'bodyweight' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              program.type === 'trx' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            }`}>
              {program.type.toUpperCase()}
            </Badge>
          </div>

          {/* Program Info */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">{program.name}</CardTitle>
              <p className="text-muted-foreground">{program.description}</p>
              <div className="flex justify-center gap-4 mt-4">
                <Badge variant="outline">{program.level}</Badge>
                <Badge variant="outline">{program.duration}</Badge>
                <Badge variant="outline">{program.equipment.join(', ')}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Dr. U's Message */}
          <Card>
            <CardContent className="pt-6">
              <div className="bg-burnt-orange/10 p-6 rounded-lg border-l-4 border-burnt-orange">
                <h3 className="font-semibold mb-3">Message from Dr. U</h3>
                <p className="italic mb-4">
                  "Welcome to your transformation journey. Remember, 'Master the small, master it all.' 
                  Each day of this program is designed to build upon the last, creating a foundation 
                  of strength, flexibility, and mindful movement that will serve you for life."
                </p>
                <p className="text-sm font-medium">
                  "The foundation of a purposeful and passionate life, marked by healing and progression, 
                  is the mastery of its smallest, intentional actions."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Days List */}
          <Card>
            <CardHeader>
              <CardTitle>Program Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {program.days.map((day) => (
                  <div 
                    key={day.dayNumber}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleSelectDay(program, day)}
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="w-12 h-8 flex items-center justify-center">
                        Day {day.dayNumber}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{day.title}</h3>
                        <p className="text-sm text-muted-foreground">{day.theme}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Day view
  if (viewState.type === 'day-view') {
    return (
      <PageLayout>
        <WorkoutDayView 
          day={viewState.day} 
          onBack={handleBackToOverview}
        />
      </PageLayout>
    );
  }

  return null;
};

export default Programs;
