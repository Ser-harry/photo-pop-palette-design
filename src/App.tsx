
import { Suspense, lazy } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteValidator from "@/components/routing/RouteValidator";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import { useClerkConfig } from "@/hooks/useClerkConfig";
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
const Auth = lazy(() => import("./pages/Auth"));

function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <RouteValidator>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
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
                
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            
            {/* Global Floating Chat Widget */}
            <FloatingChatWidget />
          </RouteValidator>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  const { publishableKey, loading, error } = useClerkConfig();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (error || !publishableKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">Authentication configuration error</p>
          <p className="text-gray-600 text-sm">{error || 'Missing configuration'}</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AppContent />
    </ClerkProvider>
  );
}

export default App;
