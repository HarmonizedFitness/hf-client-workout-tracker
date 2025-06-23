
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExerciseLibrary from '@/components/ExerciseLibrary';
import SessionLogger from '@/components/SessionLogger';
import PersonalBests from '@/components/PersonalBests';
import { Dumbbell, Trophy, BookOpen, Plus } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
            <Dumbbell className="h-10 w-10 text-blue-600" />
            Harmonized Strength Log
          </h1>
          <p className="text-slate-600 text-lg">Professional Exercise Tracking & Personal Best Management</p>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
            <TabsTrigger value="library" className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Exercise Library
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Log Session
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4" />
              Personal Bests
            </TabsTrigger>
          </TabsList>

          {/* Exercise Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Exercise Library
                </CardTitle>
                <CardDescription>
                  Browse and manage the complete exercise database with muscle group filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExerciseLibrary />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Logger Tab */}
          <TabsContent value="session" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Log Workout Session
                </CardTitle>
                <CardDescription>
                  Track your sets, reps, and weights for today's workout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionLogger />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Bests Tab */}
          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Personal Best Records
                </CardTitle>
                <CardDescription>
                  View your strongest lifts and track your progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalBests />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
