
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ClientProvider } from '@/context/ClientContext';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import Session from "./pages/Session";
import Workouts from "./pages/Workouts";
import Programs from "./pages/Programs";
import Records from "./pages/Records";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ClientProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/session" element={<Session />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/records" element={<Records />} />
              <Route path="/library" element={<ExerciseLibrary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ClientProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
