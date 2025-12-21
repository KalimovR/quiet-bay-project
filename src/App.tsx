import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Chat from "./pages/Chat";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import PaymentTerms from "./pages/PaymentTerms";
import Contacts from "./pages/Contacts";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Admin from "./pages/Admin";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import FeelingsIndex from "./pages/feelings/FeelingsIndex";
import FeelingGrust from "./pages/feelings/FeelingGrust";
import FeelingTrevoga from "./pages/feelings/FeelingTrevoga";
import FeelingOdinochestvo from "./pages/feelings/FeelingOdinochestvo";
import FeelingVygoranie from "./pages/feelings/FeelingVygoranie";
import FeelingPustota from "./pages/feelings/FeelingPustota";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/payment-terms" element={<PaymentTerms />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/feelings" element={<FeelingsIndex />} />
            <Route path="/feelings/grust" element={<FeelingGrust />} />
            <Route path="/feelings/trevoga" element={<FeelingTrevoga />} />
            <Route path="/feelings/odinochestvo" element={<FeelingOdinochestvo />} />
            <Route path="/feelings/vygoranie" element={<FeelingVygoranie />} />
            <Route path="/feelings/pustota" element={<FeelingPustota />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
