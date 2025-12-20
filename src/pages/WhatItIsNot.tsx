import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { XCircle, AlertTriangle, Phone, ArrowRight, Shield, Heart } from "lucide-react";

const WhatItIsNot = () => {
  const notItems = [
    {
      title: "Это НЕ медицинская помощь",
      description: "Quiet Bay не ставит диагнозы, не назначает лечение и не заменяет психиатра или психотерапевта. Если вам нужна медицинская помощь — обратитесь к врачу."
    },
    {
      title: "Это НЕ кризисная помощь",
      description: "Если вы находитесь в кризисной ситуации, испытываете мысли о самоповреждении или суициде — пожалуйста, позвоните на горячую линию или обратитесь в скорую помощь."
    },
    {
      title: "Это НЕ замена живому психологу",
      description: "ИИ может быть отличным дополнением к терапии или первым шагом, но полноценная работа с психологом имеет свои уникальные преимущества."
    },
    {
      title: "Это НЕ гарантия решения проблем",
      description: "Quiet Bay — это инструмент поддержки и рефлексии. Мы помогаем разобраться в мыслях и чувствах, но волшебной таблетки не существует."
    }
  ];

  const crisisResources = [
    {
      title: "Телефон доверия",
      phone: "8-800-2000-122",
      description: "Бесплатно по России, круглосуточно"
    },
    {
      title: "Скорая помощь",
      phone: "103",
      description: "При угрозе жизни и здоровью"
    }
  ];

  const isItems = [
    {
      icon: Heart,
      title: "Это пространство для рефлексии",
      description: "Место, где можно выговориться, разобраться в своих мыслях и получить эмпатичную обратную связь."
    },
    {
      icon: Shield,
      title: "Это первый шаг",
      description: "Для многих общение с ИИ — безопасный способ начать говорить о своих проблемах перед обращением к специалисту."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Чем НЕ является Quiet Bay — важные ограничения сервиса</title>
        <meta name="description" content="Честно о том, чем Quiet Bay не является: это не медицинская помощь, не кризисная служба и не замена живому психологу. Узнайте об ограничениях AI-поддержки." />
        <meta name="keywords" content="ограничения AI психолога, отказ от ответственности, когда нужен настоящий психолог, кризисная помощь" />
        <link rel="canonical" href="https://quietbay.app/what-it-is-not" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-4 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Чем это НЕ является
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Мы верим в честность и прозрачность. Вот что важно понимать 
                о Quiet Bay и его ограничениях.
              </p>
            </div>
          </section>

          {/* Not Items */}
          <section className="container mx-auto px-4 mb-16">
            <div className="max-w-3xl mx-auto space-y-6">
              {notItems.map((item, index) => (
                <article 
                  key={index}
                  className="p-6 rounded-2xl bg-bay-fog/30 border border-border/50"
                >
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Crisis Resources */}
          <section className="container mx-auto px-4 mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                      Если вы в кризисе
                    </h2>
                    <p className="text-muted-foreground">
                      Пожалуйста, обратитесь за профессиональной помощью немедленно.
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {crisisResources.map((resource, index) => (
                    <a
                      key={index}
                      href={`tel:${resource.phone.replace(/-/g, '')}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-colors"
                    >
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{resource.title}</p>
                        <p className="text-lg font-bold text-primary">{resource.phone}</p>
                        <p className="text-xs text-muted-foreground">{resource.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* What it IS */}
          <section className="container mx-auto px-4 mb-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
                Но вот чем это является
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {isItems.map((item, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-2xl bg-bay-warm/50 border border-bay-mist/30"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* When to seek professional help */}
          <section className="container mx-auto px-4 mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="p-8 rounded-2xl bg-bay-fog/30 border border-border/50">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Когда обратиться к специалисту
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Если симптомы мешают повседневной жизни (работа, сон, отношения)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Если вы испытываете мысли о самоповреждении</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Если тревога или депрессия длятся более двух недель</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Если вы злоупотребляете алкоголем или другими веществами</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <span>Если вам нужны лекарственные препараты</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Понимая ограничения, попробуйте
              </h2>
              <p className="text-muted-foreground mb-8">
                Если формат вам подходит — Quiet Bay всегда рядом для поддержки.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat">
                  <Button variant="hero" size="xl">
                    Начать разговор
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="mist" size="xl">
                    Как это работает
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WhatItIsNot;