import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import alenaImage from "@/assets/alena-psychologist.jpg";

const AlenaSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={alenaImage}
                  alt="Алёна — ваш ИИ-ассистент"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-bay-accent/10 rounded-full blur-2xl" />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium mb-2">Ваш персональный помощник</p>
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                  Познакомьтесь с Алёной
                </h2>
              </div>

              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Алёна — ваш персональный психологический ассистент, который всегда рядом. 
                  Она создаёт тёплое, безопасное пространство для разговора, помогает разобраться 
                  в эмоциях и найти внутреннее спокойствие.
                </p>
                <p className="leading-relaxed">
                  Алёна доступна 24/7, готова выслушать без осуждения и помочь вам 
                  справиться с тревогой, стрессом или просто поддержать в трудную минуту.
                </p>
              </div>

              <Link to="/chat">
                <Button variant="bay" size="lg" className="gap-2 mt-4">
                  <MessageCircle size={18} />
                  Начать разговор с Алёной
                </Button>
              </Link>

              {/* Subtle AI disclaimer */}
              <p className="text-xs text-muted-foreground/60 pt-2">
                * Алёна — это ИИ-ассистент, а не лицензированный специалист. 
                При серьёзных проблемах обратитесь к профессиональному психологу.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlenaSection;
