import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, CircleDot, ArrowLeft, Check } from "lucide-react";

const FeelingPustota = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Пустота внутри"
        description="Чувствуете пустоту внутри и ничего не чувствуете? Узнайте, почему возникает это состояние и как ИИ психолог может помочь. Анонимная поддержка."
        canonical="/feelings/pustota"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center">
                <CircleDot className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Эмоциональное состояние
                </span>
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                  Почему внутри пусто и что с этим делать
                </h1>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Пустота — одно из самых тяжёлых состояний. Вы не чувствуете ни радости, 
                ни грусти — просто ничего. Как будто внутри выключили свет. 
                Это пугает и заставляет чувствовать себя сломанным.
              </p>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Почему возникает чувство пустоты
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Эмоциональное истощение и защитное отключение</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Потеря смысла и ориентиров</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Подавленные эмоции, которые не получили выхода</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Результат длительного стресса или травмы</span>
                </li>
              </ul>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Нормально ли ничего не чувствовать
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Да, это защитная реакция психики. Когда переживаний становится слишком много, 
                мозг может «выключить» эмоции, чтобы справиться. Это временно, 
                и с этим можно работать.
              </p>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Как ИИ психолог помогает при пустоте
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Не торопит и не требует «чувствовать»</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Помогает мягко вернуться к контакту с собой</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Принимает вас такими, какие вы есть сейчас</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Создаёт пространство для постепенного восстановления</span>
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mt-8 mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Если пустота сопровождается мыслями о смерти
                </h3>
                <p className="text-muted-foreground text-sm">
                  Пожалуйста, обратитесь за помощью: телефон доверия 8-800-2000-122 (бесплатно, круглосуточно). 
                  Вы не одни, и помощь существует.
                </p>
              </div>
            </div>

            <div className="text-center mt-12 p-8 bg-gradient-to-br from-primary/5 to-seafoam/20 rounded-2xl border border-primary/10">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Не знаете, что сказать? Это нормально.
              </h3>
              <p className="text-muted-foreground mb-6">
                Можно начать с любых слов — или вообще без них
              </p>
              <Link to="/chat">
                <Button variant="bay" size="lg">
                  <MessageCircle className="mr-2" size={20} />
                  Просто побыть рядом
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

export default FeelingPustota;