import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Eligibility from "./pages/Eligibility";
import Category from "./pages/Category";
import ServiceDetail from "./pages/ServiceDetail";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import { OnboardingProvider } from "@/components/Onboarding/OnboardingProvider";
import LanguageModal from "@/components/Onboarding/LanguageModal";
import WalkthroughOverlay from "@/components/Onboarding/WalkthroughOverlay";

// ... existing imports

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OnboardingProvider>
          <Toaster />
          <Sonner />
          <LanguageModal />
          <WalkthroughOverlay />

          {/* Intro Loader */}
          {isLoading && <IntroLoader onComplete={() => setIsLoading(false)} />}

          <BrowserRouter>
            {/* ... routes ... */}
            <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/services" element={<Services />} />
                <Route path="/eligibility" element={<Eligibility />} />
                <Route path="/category/:categoryId" element={<Category />} />
                <Route path="/service/:serviceId" element={<ServiceDetail />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/:id" element={<ApplicationDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Chatbot />
            </div>
          </BrowserRouter>
        </OnboardingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
