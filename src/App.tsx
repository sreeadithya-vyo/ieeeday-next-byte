import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Registration from "./pages/Registration";
import Coordinators from "./pages/Coordinators";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import EliteDashboard from "./pages/dashboard/EliteDashboard";
import SuperDashboard from "./pages/dashboard/SuperDashboard";
import ChapterDashboard from "./pages/dashboard/ChapterDashboard";

const queryClient = new QueryClient();

const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated && user) {
    const routes: Record<string, string> = {
      elite_master: '/dashboard/elite',
      super_admin: '/dashboard/super',
      aps_admin: '/dashboard/aps',
      cs_admin: '/dashboard/cs',
      pes_admin: '/dashboard/pes',
      procomm_admin: '/dashboard/procomm',
      sps_admin: '/dashboard/sps',
    };
    return <Navigate to={routes[user.role] || '/'} replace />;
  }
  
  return <Home />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Public Website Routes */}
            <Route element={<Layout><Routes><Route path="*" element={null} /></Routes></Layout>}>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/coordinators" element={<Coordinators />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="elite" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteDashboard />
                </ProtectedRoute>
              } />
              <Route path="super" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperDashboard />
                </ProtectedRoute>
              } />
              <Route path="aps" element={
                <ProtectedRoute allowedRoles={['aps_admin']}>
                  <ChapterDashboard />
                </ProtectedRoute>
              } />
              <Route path="cs" element={
                <ProtectedRoute allowedRoles={['cs_admin']}>
                  <ChapterDashboard />
                </ProtectedRoute>
              } />
              <Route path="pes" element={
                <ProtectedRoute allowedRoles={['pes_admin']}>
                  <ChapterDashboard />
                </ProtectedRoute>
              } />
              <Route path="procomm" element={
                <ProtectedRoute allowedRoles={['procomm_admin']}>
                  <ChapterDashboard />
                </ProtectedRoute>
              } />
              <Route path="sps" element={
                <ProtectedRoute allowedRoles={['sps_admin']}>
                  <ChapterDashboard />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
