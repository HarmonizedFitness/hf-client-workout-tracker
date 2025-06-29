
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { ClientProvider } from "@/context/ClientContext";
import SecurityHeaders from "@/components/SecurityHeaders";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import Session from "./pages/Session";
import Workouts from "./pages/Workouts";
import Records from "./pages/Records";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient();

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  console.error('App Error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={resetErrorBoundary}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  console.log('AppRoutes component rendering');
  const { user, loading } = useAuth();
  
  console.log('Auth state:', { user: user?.id, loading });

  if (loading) {
    console.log('App is in loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, showing Auth page');
    return <Auth />;
  }

  console.log('User authenticated, showing main app');
  return (
    <ClientProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/session" element={<Session />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/records" element={<Records />} />
          <Route path="/library" element={<ExerciseLibrary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ClientProvider>
  );
};

const App = () => {
  console.log('App component rendering');
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SecurityHeaders />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
