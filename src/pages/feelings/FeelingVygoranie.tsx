import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, ArrowLeft, Check } from "lucide-react";

const FeelingVygoranie = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Выгорание"
        description="Устали от всего и нет сил продолжать? Узнайте, как распознать выгорание и как ИИ психолог может помочь восстановиться. Анонимная поддержка."
        canonical="/feelings/vygoranie"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Эмоциональное состояние
                </span>
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                  Эмоциональное выгорание — что делать
                </h1>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Выгорание — это состояние эмоционального, физического и ментального истощения. 
                Вы чувствуете, что силы закончились, мотивация пропала, а то, что раньше 
                приносило радость, теперь вызывает только усталость.
              </p>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Признаки эмоционального выгорания
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Постоянная усталость, которая не проходит после отдыха</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Цинизм и отстранённость от работы и людей</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Снижение продуктивности и удовлетворения</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Чувство бессмысленности происходящего</span>
                </li>
              </ul>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Как ИИ психолог помогает при выгорании
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Пространство, чтобы выговориться без ожиданий</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Помощь в осознании своих границ и потребностей</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Мягкие техники для восстановления ресурса</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Поддержка на пути к балансу</span>
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mt-8 mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Выгорание требует времени
                </h3>
                <p className="text-muted-foreground text-sm">
                  Восстановление после выгорания — это процесс. ИИ психолог может быть 
                  частью этого пути, но для глубокой работы рекомендуем обратиться к специалисту.
                </p>
              </div>
            </div>

            <div className="text-center mt-12 p-8 bg-gradient-to-br from-primary/5 to-seafoam/20 rounded-2xl border border-primary/10">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Чувствуете, что силы на исходе?
              </h3>
              <p className="text-muted-foreground mb-6">
                Поговорите с кем-то, кто выслушает без требований
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

export default FeelingVygoranie;