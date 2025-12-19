import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Auth from "./pages/Auth";
import Training from "./pages/Training";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Delivery from "./pages/Delivery";
import Offer from "./pages/Offer";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
   <BrowserRouter>
  <ScrollToTop />   {/* ← ВОТ ЗДЕСЬ */}
  
  <TooltipProvider>
    <Toaster />
    <Sonner />

    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/training" element={<Training />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/offer" element={<Offer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

  </TooltipProvider>
</BrowserRouter>

  </QueryClientProvider>
);

export default App;
