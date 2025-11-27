import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { DashboardAuthProvider } from "@/contexts/DashboardAuthContext";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import Index from "./pages/Index";
import TourDetail from "./pages/TourDetail";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import DashboardLogin from "./pages/DashboardLogin";
import { ProtectedRoute } from "./components/Dashboard/ProtectedRoute";
import SecretAccess from "./components/Dashboard/SecretAccess";
import { initReferralCode } from "./lib/referral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Refrescar cuando la ventana recupera el foco
      refetchOnReconnect: true, // Refrescar cuando se reconecta
      staleTime: 1000 * 30, // Considerar datos obsoletos después de 30 segundos
    },
  },
});

// Inicializar detección de código de referido
if (typeof window !== 'undefined') {
  initReferralCode();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <DashboardAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SecretAccess />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Index />
                  <WhatsAppFloat />
                </>
              } />
              <Route path="/tour/:id" element={
                <>
                  <Navbar />
                  <TourDetail />
                  <WhatsAppFloat />
                </>
              } />
              <Route path="/carrito" element={
                <>
                  <Navbar />
                  <Cart />
                  <WhatsAppFloat />
                </>
              } />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard/login" element={<DashboardLogin />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <NotFound />
                </>
              } />
            </Routes>
          </BrowserRouter>
        </DashboardAuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
