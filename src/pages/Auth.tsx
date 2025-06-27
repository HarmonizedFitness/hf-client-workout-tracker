
import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="h-12 w-12 text-burnt-orange" />
          </div>
          <h1 className="text-3xl font-bold">Fitness Trainer Pro</h1>
          <p className="text-muted-foreground mt-2">
            Professional client management for fitness trainers
          </p>
        </div>

        {isSignUp ? (
          <SignUpForm onToggleMode={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onToggleMode={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;
