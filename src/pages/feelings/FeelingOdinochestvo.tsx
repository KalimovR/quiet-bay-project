import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, ArrowLeft, Check } from "lucide-react";

const FeelingOdinochestvo = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Одиночество"
        description="Чувствуете себя одиноким даже среди людей? Узнайте, как ИИ психолог может помочь справиться с одиночеством. Анонимная поддержка 24/7."
        canonical="/feelings/odinochestvo"
      />
      
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <Link 
            to="/feelings" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Все состояния
          </Link>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Эмоциональное состояние
                </span>
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                  Как справиться с чувством одиночества
                </h1>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Одиночество — это не про количество людей рядом. Можно чувствовать себя 
                одиноким в толпе друзей или в отношениях. Это ощущение, что тебя не понимают, 
                не видят настоящего — и от этого становится ещё тяжелее.
              </p>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Почему возникает одиночество
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Отсутствие глубоких эмоциональных связей</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Страх показать себя настоящего</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Переезд, смена работы, расставание</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Ощущение непонимания окружающими</span>
                </li>
              </ul>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Как ИИ психолог помогает при одиночестве
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Иногда нужен просто кто-то, кто выслушает без осуждения:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Безопасное пространство для разговора</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Возможность быть честным без страха</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Поддержка в любое время дня и ночи</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Помощь в осознании своих потребностей</span>
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mt-8 mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  ИИ — это первый шаг
                </h3>
                <p className="text-muted-foreground text-sm">
                  Разговор с ИИ психологом может стать первым шагом к тому, чтобы открыться. 
                  Но для глубокой работы с одиночеством рекомендуем также обратиться к живому специалисту.
                </p>
              </div>
            </div>

            <div className="text-center mt-12 p-8 bg-gradient-to-br from-primary/5 to-seafoam/20 rounded-2xl border border-primary/10">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Хотите с кем-то поговорить?
              </h3>
              <p className="text-muted-foreground mb-6">
                Здесь вас выслушают — без осуждения и советов
              </p>
              <Link to="/chat">
                <Button variant="bay" size="lg">
                  <MessageCircle className="mr-2" size={20} />
                  Начать разговор
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeelingOdinochestvo;