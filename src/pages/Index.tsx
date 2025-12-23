import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Shield, Clock, Heart, Users, Lock, Sparkles } from "lucide-react";
import heroBay from "@/assets/hero-bay.jpg";
import alenaPortrait from "@/assets/alena-portrait.jpg";
import SEO, { organizationSchema, websiteSchema } from "@/components/SEO";
import DialogCarousel from "@/components/DialogCarousel";
const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Главная"
        description="Quiet Bay — ваша тихая гавань для эмоциональной поддержки. ИИ-психолог Алёна доступна 24/7 для разговора без осуждения. Бесплатный старт."
        canonical="/"
        structuredData={structuredData}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBay})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>
        
        {/* Animated Fog Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
              Тихая гавань{" "}
              <span className="text-gradient">для вашего спокойствия</span>
            </h1>
            <p className="text-lg md:text-xl text-bay-fog mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
              Quiet Bay — ваша тихая гавань для эмоциональной поддержки. Поговорите с эмпатичным 
              собеседником, когда вам нужен кто-то, кто выслушает — без осуждения, без давления.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Button variant="hero" size="xl" asChild>
                <Link to="/chat">Начать путешествие</Link>
              </Button>
              <Button variant="mist" size="xl" asChild>
                <Link to="/safety">Узнать больше</Link>
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-sm">Приватно и безопасно</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Доступно 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm">Бесплатный старт</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-primary rounded-full animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* Meet Alena Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Photo */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
                  <img 
                    src={alenaPortrait} 
                    alt="Алёна — ваш ИИ-психолог" 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                </div>
                {/* AI Badge */}
                <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">ИИ-ассистент</span>
                </div>
              </div>

              {/* Text */}
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Познакомьтесь с{" "}
                  <span className="text-gradient">Алёной</span>
                </h2>
                <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
                  Алёна — ваш персональный психологический ассистент, который всегда рядом. 
                  Она создаёт тёплое, безопасное пространство для разговора, помогает разобраться 
                  в эмоциях и найти внутреннее спокойствие.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Эмпатичный подход, основанный на принципах психологии</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Доступна в любое время дня и ночи</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Полная конфиденциальность ваших разговоров</span>
                  </li>
                </ul>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/chat">Начать разговор с Алёной</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  * Алёна — виртуальный ИИ-ассистент и не заменяет консультацию лицензированного специалиста
                </p>
              </div>
            </div>

            {/* Dialog Examples Carousel - Full Width */}
            <DialogCarousel />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Как работает Quiet Bay
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Просто, поддерживающе и всегда рядом, когда вам это нужно
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: MessageCircle,
                title: "Поделитесь мыслями",
                description: "Напишите или расскажите о том, что вас беспокоит. Нет темы слишком маленькой или слишком тяжёлой.",
              },
              {
                icon: Heart,
                title: "Получите поддержку",
                description: "Наш ассистент отвечает с эмпатией, помогая вам исследовать свои чувства и найти ясность.",
              },
              {
                icon: Users,
                title: "Развивайтесь в своём темпе",
                description: "Отслеживайте свой путь, возвращайтесь к разговорам и формируйте здоровые модели мышления.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="group relative bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ваша безопасность — наш приоритет
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Мы создали Тихую Бухту с заботой о вашем благополучии и конфиденциальности
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Lock,
                title: "Полная конфиденциальность",
                description: "Ваши разговоры зашифрованы и никогда не передаются третьим лицам. Всё остаётся между вами и ассистентом.",
              },
              {
                icon: Shield,
                title: "Распознавание кризиса",
                description: "Наш ассистент может распознать, когда вам может понадобиться профессиональная помощь, и направит к нужным ресурсам.",
              },
              {
                icon: Clock,
                title: "Всегда доступен",
                description: "Будь то 3 часа ночи или напряжённый день — Тихая Бухта здесь, чтобы выслушать, когда вам нужна поддержка.",
              },
              {
                icon: Heart,
                title: "Научный подход",
                description: "Наш ассистент основан на принципах когнитивно-поведенческой терапии и техниках осознанности.",
              },
              {
                icon: Users,
                title: "Не замена терапии",
                description: "Мы дополняем профессиональную помощь, а не заменяем её. Мы всегда рекомендуем терапию, когда это уместно.",
              },
              {
                icon: MessageCircle,
                title: "Зона без осуждения",
                description: "Выражайте себя свободно. Наш ассистент отвечает с пониманием, без критики и стыда.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Готовы обрести спокойствие?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Сделайте первый шаг к ясности ума. Начните разговор с Тихой Бухтой сегодня — это бесплатно.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/chat">Начать бесплатно</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/pricing">Посмотреть тарифы</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
