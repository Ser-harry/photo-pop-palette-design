import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteValidator from "@/components/routing/RouteValidator";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Lazy load pages
const Colleges = lazy(() => import("./pages/Colleges"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail"));
const TNEAPredictor = lazy(() => import("./pages/TNEAPredictor"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Articles = lazy(() => import("./pages/Articles"));
const Exams = lazy(() => import("./pages/Exams"));
const Courses = lazy(() => import("./pages/Courses"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUnauthorized = lazy(() => import("./pages/AdminUnauthorized"));
const ChatPageWrapper = lazy(() => import("./pages/Chat"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <RouteValidator>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/colleges" element={<Colleges />} />
                <Route path="/college/:slug" element={<CollegeDetail />} />
                <Route path="/tnea-predictor" element={<TNEAPredictor />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="/chat" element={<Suspense fallback={<div>Loading...</div>}><ChatPageWrapper /></Suspense>} />
                
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RouteValidator>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
