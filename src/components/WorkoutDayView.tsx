
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { WorkoutDay, WorkoutExercise } from '@/types/workoutProgram';
import { ChevronDown, ChevronUp, Play, Clock, Target } from 'lucide-react';

interface WorkoutDayViewProps {
  day: WorkoutDay;
  onBack: () => void;
}

const WorkoutDayView = ({ day, onBack }: WorkoutDayViewProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['introduction']));

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const ExerciseCard = ({ exercise }: { exercise: WorkoutExercise }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{exercise.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
          </div>
          <div className="flex gap-2">
            {exercise.duration && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {exercise.duration}
              </Badge>
            )}
            {exercise.reps && (
              <Badge variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                {exercise.reps}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {exercise.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Technical Cues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {exercise.technicalCues.map((cue, index) => (
                  <li key={index}>{cue}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Somatic Cues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground italic">
                {exercise.somaticCues.map((cue, index) => (
                  <li key={index}>{cue}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Beginner Modification:</h4>
              <p className="text-sm text-green-700 dark:text-green-400">{exercise.beginnerModification}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Advanced Modification:</h4>
              <p className="text-sm text-orange-700 dark:text-orange-400">{exercise.advancedModification}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <h4 className="font-medium text-sm mb-1">Common Mistakes:</h4>
              <p className="text-xs text-red-600 dark:text-red-400">
                {exercise.commonMistakes.join(', ')}
              </p>
            </div>
            
            <Button size="sm" variant="outline">
              <Play className="h-3 w-3 mr-1" />
              Watch Video
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Programs
        </Button>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Day {day.dayNumber}
        </Badge>
      </div>

      {/* Day Title */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">{day.title}</CardTitle>
          <p className="text-lg text-muted-foreground">{day.theme}</p>
        </CardHeader>
      </Card>

      {/* Introduction */}
      <Collapsible 
        open={openSections.has('introduction')} 
        onOpenChange={() => toggleSection('introduction')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  📚 Introduction
                </CardTitle>
                {openSections.has('introduction') ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {day.introduction.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Mindset Moment */}
      <Collapsible 
        open={openSections.has('mindset')} 
        onOpenChange={() => toggleSection('mindset')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  🧘 Mindset Moment <Badge variant="outline" className="ml-2">5 minutes</Badge>
                </CardTitle>
                {openSections.has('mindset') ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Theme: {day.mindsetMoment.theme}</h4>
                  <p className="text-muted-foreground">{day.mindsetMoment.positioning}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Breathing Pattern:</h4>
                  <p className="text-muted-foreground">{day.mindsetMoment.breathingPattern}</p>
                </div>
                
                <div className="bg-muted p-4 rounded">
                  <h4 className="font-medium mb-2">Affirmation:</h4>
                  <p className="italic text-center">{day.mindsetMoment.affirmation}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Visualization:</h4>
                  <p className="text-muted-foreground">{day.mindsetMoment.visualization}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Closing Awareness:</h4>
                  <p className="text-muted-foreground">{day.mindsetMoment.closingAwareness}</p>
                </div>
                
                <div className="bg-burnt-orange/10 p-4 rounded border-l-4 border-burnt-orange">
                  <p className="italic font-medium">"{day.mindsetMoment.drUQuote}"</p>
                  <p className="text-sm text-muted-foreground mt-2">- Dr. U</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Movement Preparation */}
      <Collapsible 
        open={openSections.has('preparation')} 
        onOpenChange={() => toggleSection('preparation')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {day.movementPreparation.emoji} {day.movementPreparation.title}
                  <Badge variant="outline" className="ml-2">{day.movementPreparation.duration}</Badge>
                </CardTitle>
                {openSections.has('preparation') ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 space-y-4">
            {day.movementPreparation.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Workout */}
      <Collapsible 
        open={openSections.has('main')} 
        onOpenChange={() => toggleSection('main')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {day.mainWorkout.emoji} {day.mainWorkout.title}
                  <Badge variant="outline" className="ml-2">{day.mainWorkout.duration}</Badge>
                </CardTitle>
                {openSections.has('main') ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 space-y-4">
            {day.mainWorkout.instructions && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">Workout Structure:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {day.mainWorkout.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {day.mainWorkout.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cool Down */}
      <Collapsible 
        open={openSections.has('cooldown')} 
        onOpenChange={() => toggleSection('cooldown')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {day.coolDown.emoji} {day.coolDown.title}
                  <Badge variant="outline" className="ml-2">{day.coolDown.duration}</Badge>
                </CardTitle>
                {openSections.has('cooldown') ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 space-y-4">
            {day.coolDown.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Key Takeaways & CTA */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Today's Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 mb-6">
            {day.keyTakeaways.map((takeaway, index) => (
              <li key={index}>{takeaway}</li>
            ))}
          </ul>
          
          <div className="bg-muted p-4 rounded mb-4">
            <h4 className="font-medium mb-2">Tomorrow's Preview:</h4>
            <p className="text-muted-foreground">{day.tomorrowPreview}</p>
          </div>
          
          <div className="bg-burnt-orange/10 p-4 rounded border border-burnt-orange">
            <p className="mb-3">{day.cta.text}</p>
            <Button className="bg-burnt-orange hover:bg-burnt-orange/90">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutDayView;
