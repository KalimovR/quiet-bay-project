import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MessageCircle, Shield, Heart, Clock, Sparkles, Lock, Smile } from "lucide-react";
import alenaAvatar from "@/assets/alena-avatar.jpg";

const Index = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Главная";
  }, []);
  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Эмпатичный диалог",
      description: "ИИ слушает без осуждения и помогает структурировать мысли",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Полная конфиденциальность",
      description: "Ваши разговоры защищены и остаются только между вами",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Доступно 24/7",
      description: "Поддержка в любое время, когда вам это нужно",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Без давления",
      description: "Работайте в своём темпе, без ожиданий и обязательств",
    },
  ];

  const alenaAdvantages = [
    {
      icon: Heart,
      title: "Эмпатия и понимание",
      description: "Алёна создаёт безопасное пространство для ваших мыслей и чувств",
    },
    {
      icon: Clock,
      title: "Доступна 24/7",
      description: "Готова выслушать в любое время дня и ночи",
    },
    {
      icon: Shield,
      title: "Полная конфиденциальность",
      description: "Ваши разговоры остаются только между вами",
    },
    {
      icon: Smile,
      title: "Без осуждения",
      description: "Принимает вас такими, какие вы есть",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Начните разговор",
      description: "Просто напишите, что вас беспокоит. Нет неправильных слов.",
    },
    {
      step: "02",
      title: "Получите поддержку",
      description: "ИИ-психолог выслушает, задаст уточняющие вопросы и поможет разобраться в чувствах.",
    },
    {
      step: "03",
      title: "Найдите баланс",
      description: "Получите простые упражнения и техники для заземления и успокоения.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-calm" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-bay-mist/20 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-breathe animation-delay-400" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bay-fog/50 border border-bay-mist/30 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Безопасное пространство для разговора</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-6 animate-fade-in animation-delay-200 leading-tight">
              Тихое место для разговора
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in animation-delay-400 leading-relaxed">
              Когда вам нужна поддержка — здесь и сейчас. Поговорите с ИИ-психологом 
              в спокойной, эмпатичной и неосуждающей атмосфере.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-600">
              <Link to="/chat">
                <Button variant="hero" size="xl">
                  Начать разговор
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="mist" size="lg">
                  Тарифы
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Алёна */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-bay-fog/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-bay-mist/30 shadow-soft">
                    <img 
                      src={alenaAvatar}
                      alt="Алёна - ваш психологический ассистент"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-soft">
                    <Heart className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                  Познакомьтесь с Алёной
                </h2>
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  Алёна — ваш персональный психологический ассистент, который всегда рядом. 
                  Она создаёт тёплое, безопасное пространство для разговора, помогает разобраться 
                  в эмоциях и найти внутреннее спокойствие.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {alenaAdvantages.map((advantage) => (
                    <div key={advantage.title} className="flex items-start gap-3 text-left">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <advantage.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{advantage.title}</h4>
                        <p className="text-xs text-muted-foreground">{advantage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground/70 italic">
                  * Алёна — это ИИ-ассистент, созданный для эмоциональной поддержки. 
                  Она не заменяет профессионального психолога или врача.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-bay-fog/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Почему Quiet Bay
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Мы создали пространство, где вы можете быть собой без страха осуждения
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-bay-mist/50 transition-all duration-500 hover:shadow-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-bay-fog flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Как это работает
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Три простых шага к внутреннему спокойствию
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                    <span className="font-display text-2xl font-semibold">{item.step}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-32 bg-bay-fog/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm mb-6">
                  <Lock className="w-4 h-4" />
                  Безопасность и доверие
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
                  Ваша конфиденциальность — наш приоритет
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Мы понимаем, как важно чувствовать себя в безопасности, когда делишься 
                  личными переживаниями. Все ваши разговоры защищены и не передаются 
                  третьим лицам.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    Шифрование данных
                  </li>
                  <li className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    Анонимность использования
                  </li>
                  <li className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    Контроль над своими данными
                  </li>
                </ul>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-bay-fog to-bay-cream p-8 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-breathe" />
                    <Shield className="w-32 h-32 text-primary relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Готовы начать?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Первый шаг — самый важный. Мы здесь, чтобы выслушать вас.
            </p>
            <Link to="/chat">
              <Button variant="hero" size="xl">
                Начать разговор
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-bay-warm py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">
            ⚠️ <strong>Важно:</strong> Quiet Bay не является медицинским сервисом. 
            ИИ оказывает информационную и эмоциональную поддержку, но не заменяет 
            профессиональную психологическую или медицинскую помощь. Возрастное ограничение: 18+
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
