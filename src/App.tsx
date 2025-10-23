import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import RegistrationConfirmation from "./pages/RegistrationConfirmation";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import EliteMasterDashboard from "./pages/admin/elite/EliteMasterDashboard";
import EliteEvents from "./pages/admin/elite/EliteEvents";
import EliteRegistrations from "./pages/admin/elite/EliteRegistrations";
import EliteChapterAdmins from "./pages/admin/elite/EliteChapterAdmins";
import EliteSuperAdmins from "./pages/admin/elite/EliteSuperAdmins";
import EliteRoles from "./pages/admin/elite/EliteRoles";
import EliteAuditLogs from "./pages/admin/elite/EliteAuditLogs";
import EliteReports from "./pages/admin/elite/EliteReports";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import ChapterAdminDashboard from "./pages/admin/ChapterAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/register/confirmation" element={<RegistrationConfirmation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Elite Master Routes */}
              <Route path="/admin/elite" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteMasterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/elite/events" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteEvents />
                </ProtectedRoute>
              } />
              <Route path="/admin/elite/registrations" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteRegistrations />
                </ProtectedRoute>
              } />
              <Route path="/admin/elite/chapter-admins" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteChapterAdmins />
                </ProtectedRoute>
              } />
              <Route path="/admin/elite/super-admins" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteSuperAdmins />
                </ProtectedRoute>
              } />
              <Route path="/admin/elite/roles" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteRoles />
                </ProtectedRoute>
              } />
              <Route path="/admin/elite/audit" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteAuditLogs />
                </ProtectedRoute>
              } />
              <Route path="/admin/elite/reports" element={
                <ProtectedRoute allowedRoles={['elite_master']}>
                  <EliteReports />
                </ProtectedRoute>
              } />
              
              {/* Super Admin Routes */}
              <Route path="/admin/super" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Chapter Admin Routes */}
              <Route path="/admin/chapter/*" element={
                <ProtectedRoute allowedRoles={['event_admin']}>
                  <ChapterAdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
