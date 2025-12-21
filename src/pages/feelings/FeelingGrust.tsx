import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, Moon, ArrowLeft, Check } from "lucide-react";

const FeelingGrust = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Что делать если грустно"
        description="Грусть без причины — частое состояние. Узнайте, почему возникает грусть и как ИИ психолог может помочь справиться с этим чувством. Анонимная поддержка."
        canonical="/feelings/grust"
      />
      
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link 
            to="/feelings" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Все состояния
          </Link>

          {/* Header */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                <Moon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Эмоциональное состояние
                </span>
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                  Что делать, если грустно и не понятно почему
                </h1>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Грусть без причины — это частый запрос, с которым сталкиваются многие люди. 
                Иногда вы просыпаетесь с тяжестью на душе, но не можете понять, что именно вызвало это чувство. 
                Это нормально и не означает, что с вами что-то не так.
              </p>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Почему возникает грусть без причины
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Грусть может появляться по разным причинам, которые не всегда очевидны:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Накопленная усталость и эмоциональное истощение</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Неосознанные переживания, которые не получили выхода</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Сезонные изменения и нехватка солнечного света</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Отсутствие глубоких эмоциональных связей</span>
                </li>
              </ul>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Нормально ли чувствовать грусть
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Да, грусть — это естественная человеческая эмоция. Она помогает нам замедлиться, 
                переосмыслить происходящее и восстановить силы. Проблема возникает, когда грусть 
                становится постоянной или мешает жить.
              </p>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Как может помочь ИИ психолог
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ИИ психолог Quiet Bay создан для того, чтобы быть рядом в моменты, когда нужна поддержка:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Выслушает без осуждения и давления</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Поможет назвать и осознать свои чувства</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Предложит мягкие техники для облегчения состояния</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Доступен 24/7, когда вам это нужно</span>
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mt-8 mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Когда стоит обратиться к специалисту
                </h3>
                <p className="text-muted-foreground text-sm">
                  Если грусть длится более двух недель, сопровождается потерей интереса к жизни, 
                  нарушениями сна или аппетита — рекомендуем обратиться к живому психологу или психотерапевту. 
                  ИИ психолог не заменяет профессиональную медицинскую помощь.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12 p-8 bg-gradient-to-br from-primary/5 to-seafoam/20 rounded-2xl border border-primary/10">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Хотите поговорить о своих чувствах?
              </h3>
              <p className="text-muted-foreground mb-6">
                Начните бесплатный разговор с ИИ психологом прямо сейчас
              </p>
              <Link to="/chat">
                <Button variant="bay" size="lg">
                  <MessageCircle className="mr-2" size={20} />
                  Поговорить с ИИ психологом
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

export default FeelingGrust;