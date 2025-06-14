
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Colleges from "./pages/Colleges";
import Exams from "./pages/Exams";
import Courses from "./pages/Courses";
import Articles from "./pages/Articles";
import CollegeDetail from "./pages/CollegeDetail";
import TNEAPredictor from "./pages/TNEAPredictor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/tnea-predictor" element={<TNEAPredictor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
