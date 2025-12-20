import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Clock, Shield, Heart, Sparkles, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: "Начните разговор",
      description: "Просто напишите, что вас беспокоит. Не нужно подбирать слова или формулировать «правильно» — пишите как получается."
    },
    {
      icon: Heart,
      title: "Получите поддержку",
      description: "ИИ-психолог внимательно выслушает вас, задаст уточняющие вопросы и поможет разобраться в ваших чувствах и мыслях."
    },
    {
      icon: Sparkles,
      title: "Найдите ясность",
      description: "Вместе мы исследуем ситуацию, найдём новые перспективы и определим возможные пути решения."
    },
    {
      icon: CheckCircle,
      title: "Двигайтесь вперёд",
      description: "Получите практические рекомендации и техники, которые можно применить в повседневной жизни."
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "Доступен 24/7",
      description: "Поддержка в любое время дня и ночи, когда вам это нужно"
    },
    {
      icon: Shield,
      title: "Полная конфиденциальность",
      description: "Ваши разговоры защищены и никогда не передаются третьим лицам"
    },
    {
      icon: Heart,
      title: "Без осуждения",
      description: "Безопасное пространство для честного разговора о чём угодно"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Как работает Quiet Bay — AI-психолог онлайн 24/7</title>
        <meta name="description" content="Узнайте, как работает Quiet Bay — ваш персональный AI-психолог. Доступная поддержка 24/7, полная конфиденциальность, простой формат общения." />
        <meta name="keywords" content="как работает AI психолог, онлайн психолог 24/7, чат с психологом, психологическая поддержка" />
        <link rel="canonical" href="https://quietbay.app/how-it-works" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-4 mb-20">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Как работает Quiet Bay
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Простой и понятный путь к эмоциональной поддержке. 
                Без записи, без ожидания, без неловкости.
              </p>
            </div>
          </section>

          {/* Steps Section */}
          <section className="container mx-auto px-4 mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-8">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex gap-6 p-6 rounded-2xl bg-bay-fog/30 border border-border/50 hover:bg-bay-fog/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-primary">Шаг {index + 1}</span>
                      </div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 mb-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
                Почему это удобно
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-2xl bg-bay-warm/50 border border-bay-mist/30 text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="container mx-auto px-4 mb-20">
            <div className="max-w-3xl mx-auto">
              <div className="p-8 rounded-2xl bg-bay-fog/30 border border-border/50">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Технология в основе
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Quiet Bay использует современные языковые модели искусственного интеллекта, 
                    обученные на принципах когнитивно-поведенческой терапии, эмпатического слушания 
                    и техник эмоциональной регуляции.
                  </p>
                  <p>
                    ИИ понимает контекст вашего разговора, улавливает эмоциональные нюансы 
                    и адаптирует свои ответы под ваши индивидуальные потребности.
                  </p>
                  <p>
                    При этом важно помнить: ИИ — это инструмент поддержки, а не замена 
                    профессиональной психологической или медицинской помощи.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Готовы попробовать?
              </h2>
              <p className="text-muted-foreground mb-8">
                Начните бесплатно прямо сейчас. Никакой регистрации для первого разговора.
              </p>
              <Link to="/chat">
                <Button variant="hero" size="xl">
                  Начать разговор
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HowItWorks;