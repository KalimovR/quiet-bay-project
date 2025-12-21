import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AlenaSection from "@/components/home/AlenaSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TrustSection from "@/components/home/TrustSection";
import CTASection from "@/components/home/CTASection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — ИИ психолог онлайн | Главная"
        description="ИИ психолог онлайн для анонимной поддержки при тревоге, грусти, одиночестве и выгорании. Без осуждения и давления. Начните бесплатно."
        canonical="/"
      />
      
      {/* SEO-текст для поисковиков (скрыт визуально) */}
      <div className="sr-only">
        <p>
          Quiet Bay — это ИИ психолог онлайн для людей, которые испытывают тревогу, грусть, одиночество или выгорание.
          Сервис позволяет анонимно поговорить с ИИ психологом без осуждения и давления.
          Вы можете обратиться за эмоциональной поддержкой в любое время суток — 24/7.
          Это безопасное пространство, где вас выслушают и помогут разобраться в чувствах.
        </p>
      </div>
      
      <Header />
      <main>
        <HeroSection />
        <AlenaSection />
        <HowItWorksSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;