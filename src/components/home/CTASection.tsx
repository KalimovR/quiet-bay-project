import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden gradient-dusk">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-seafoam/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-bay-light/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative icon */}
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary-foreground/10 flex items-center justify-center animate-float">
            <MessageCircle className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground mb-6 leading-tight">
            Готовы найти покой?
          </h2>
          
          <p className="text-primary-foreground/70 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Сделайте первый шаг. Начните разговор с тем, кто всегда готов выслушать.
          </p>

          <Link to="/chat">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-dusk hover:bg-primary-foreground/90 shadow-elevated hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
            >
              <MessageCircle className="mr-2" size={20} />
              Начать разговор
            </Button>
          </Link>

          <p className="text-primary-foreground/50 text-sm mt-6">
            Бесплатно для старта • Всегда конфиденциально
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
