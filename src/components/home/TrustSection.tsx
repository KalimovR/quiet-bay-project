import { Lock, Eye, Heart, AlertCircle } from "lucide-react";

const trustPoints = [
  {
    icon: Lock,
    title: "Полная приватность",
    description: "Ваши разговоры зашифрованы и никогда не передаются третьим лицам. Мы не храним личные данные, которые могут вас идентифицировать.",
  },
  {
    icon: Eye,
    title: "Полная анонимность",
    description: "Регистрация не требуется. Говорите свободно, не беспокоясь о том, что кто-то узнает, кто вы.",
  },
  {
    icon: Heart,
    title: "Эмпатичные ответы",
    description: "Ответы наполнены теплотой и пониманием — без осуждения и критики, только поддержка.",
  },
  {
    icon: AlertCircle,
    title: "Кризисная поддержка",
    description: "Если вы в кризисе, мы немедленно направим вас к профессиональным службам экстренной помощи.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
            Ваша безопасность важна
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6">
            Безопасная гавань для ваших мыслей
          </h2>
          <p className="text-muted-foreground text-lg">
            Мы создали Quiet Bay с вашей безопасностью и приватностью в основе всего, что мы делаем.
          </p>
        </div>

        {/* Trust points grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trustPoints.map((point, index) => (
            <div 
              key={index}
              className="flex gap-5 p-6 rounded-xl bg-card border border-border hover:border-bay-light transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer callout */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-warm-glow/50 border border-amber-200/50 rounded-xl p-6 text-center">
            <p className="text-sm text-foreground/80">
              <strong>Обратите внимание:</strong> Quiet Bay предоставляет эмоциональную поддержку и не является заменой 
              профессионального лечения психического здоровья. Это не замена лицензированному терапевту, врачу или психиатру. 
              При серьёзных проблемах с психическим здоровьем, пожалуйста, обратитесь к квалифицированному специалисту.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
