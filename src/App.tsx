import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Pricing from "./pages/Pricing";
import Safety from "./pages/Safety";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Contacts from "./pages/Contacts";
import Delivery from "./pages/Delivery";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Courses from "./pages/Courses";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import FeelingsIndex from "./pages/feelings/Index";
import Grust from "./pages/feelings/Grust";
import Trevoga from "./pages/feelings/Trevoga";
import Odinochestvo from "./pages/feelings/Odinochestvo";
import Vygoranie from "./pages/feelings/Vygoranie";
import Pustota from "./pages/feelings/Pustota";
import SupportIndex from "./pages/support/Index";
import PosleSvo from "./pages/support/PosleSvo";
import NeMoguSpat from "./pages/support/NeMoguSpat";
import TrevogaPosleVoyny from "./pages/support/TrevogaPosleVoyny";
import Razdrazhitelnost from "./pages/support/Razdrazhitelnost";
import EmotsonalnayaPustota from "./pages/support/EmotsonalnayaPustota";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/feelings" element={<FeelingsIndex />} />
            <Route path="/feelings/grust" element={<Grust />} />
            <Route path="/feelings/trevoga" element={<Trevoga />} />
            <Route path="/feelings/odinochestvo" element={<Odinochestvo />} />
            <Route path="/feelings/vygoranie" element={<Vygoranie />} />
            <Route path="/feelings/pustota" element={<Pustota />} />
            <Route path="/support" element={<SupportIndex />} />
            <Route path="/support/posle-svo" element={<PosleSvo />} />
            <Route path="/support/ne-mogu-spat" element={<NeMoguSpat />} />
            <Route path="/support/trevoga-posle-voyny" element={<TrevogaPosleVoyny />} />
            <Route path="/support/razdrazhitelnost" element={<Razdrazhitelnost />} />
            <Route path="/support/emotsionalnaya-pustota" element={<EmotsonalnayaPustota />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
