import { MessageSquare, Heart, Sparkles } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Начните разговор",
    description: "Просто нажмите «Начать разговор» и поделитесь тем, что у вас на душе. Это легко и не требует усилий.",
  },
  {
    icon: Heart,
    title: "Будьте услышаны",
    description: "Ваш собеседник слушает с эмпатией и отвечает вдумчиво, помогая исследовать чувства без спешки и осуждения.",
  },
  {
    icon: Sparkles,
    title: "Найдите покой",
    description: "Через мягкое сопровождение и поддерживающий диалог откройте новые перспективы и практичные способы обрести спокойствие.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-seafoam/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bay-light/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
            Как это работает
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6">
            Простые шаги к улучшению самочувствия
          </h2>
          <p className="text-muted-foreground text-lg">
            Получение поддержки не должно быть сложным. Мы сделали это так просто, как обычный разговор.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connection line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-border via-bay-light to-border" />
              )}

              {/* Step card */}
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-soft hover:shadow-elevated transition-all duration-300 group-hover:-translate-y-1">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-seafoam/50 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
