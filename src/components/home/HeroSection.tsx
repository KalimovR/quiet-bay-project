import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Clock } from "lucide-react";
import heroBay from "@/assets/hero-bay.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBay})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Decorative fog layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-seafoam/20 rounded-full blur-3xl animate-fog" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-bay-light/30 rounded-full blur-3xl animate-fog" style={{ animationDelay: '3s' }} />
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg 
          viewBox="0 0 1440 120" 
          className="absolute bottom-0 w-full h-auto animate-wave"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" 
            className="fill-bay-light/30"
          />
        </svg>
        <svg 
          viewBox="0 0 1440 120" 
          className="absolute bottom-0 w-full h-auto animate-wave"
          style={{ animationDelay: '2s' }}
          preserveAspectRatio="none"
        >
          <path 
            d="M0,80 C360,40 720,100 1080,60 C1260,30 1380,50 1440,40 L1440,120 L0,120 Z" 
            className="fill-background"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-40 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div 
            className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-2 h-2 rounded-full bg-seafoam animate-pulse-soft" />
            <span className="text-sm text-muted-foreground">
              Анонимно • Конфиденциально • Всегда доступно
            </span>
          </div>

          {/* Main heading */}
          <h1 
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold text-foreground mb-6 leading-tight animate-fade-in opacity-0"
            style={{ animationDelay: '0.4s' }}
          >
            Тихая гавань
            <span className="block text-primary mt-2">для вашего спокойствия</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in opacity-0"
            style={{ animationDelay: '0.6s' }}
          >
            Quiet Bay — ваша тихая гавань для эмоциональной поддержки. Поговорите с эмпатичным собеседником, 
            когда вам нужен кто-то, кто выслушает — без осуждения, без давления.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in opacity-0"
            style={{ animationDelay: '0.8s' }}
          >
            <Link to="/chat">
              <Button variant="bay" size="lg" className="w-full sm:w-auto">
                <MessageCircle className="mr-2" size={20} />
                Начать разговор
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="calm" size="lg" className="w-full sm:w-auto">
                Узнать больше
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in opacity-0"
            style={{ animationDelay: '1s' }}
          >
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Shield size={18} className="text-primary" />
              <span className="text-sm">100% Приватно</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Clock size={18} className="text-primary" />
              <span className="text-sm">Доступно 24/7</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <MessageCircle size={18} className="text-primary" />
              <span className="text-sm">Без осуждения</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
