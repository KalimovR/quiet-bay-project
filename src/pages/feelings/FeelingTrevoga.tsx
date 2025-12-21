import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, Flame, ArrowLeft, Check } from "lucide-react";

const FeelingTrevoga = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Тревога и беспокойство"
        description="Тревога и беспокойство мешают жить? Узнайте, как ИИ психолог может помочь справиться с тревожностью. Анонимная поддержка онлайн 24/7."
        canonical="/feelings/trevoga"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Flame className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Эмоциональное состояние
                </span>
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                  Как справиться с тревогой и беспокойством
                </h1>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Тревога — это ощущение внутреннего беспокойства, которое не даёт покоя. 
                Вы можете чувствовать напряжение в теле, учащённое сердцебиение, 
                навязчивые мысли о будущем. Это изматывает и мешает жить полноценно.
              </p>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Признаки тревожности
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Постоянное беспокойство о будущем</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Сложности с концентрацией и засыпанием</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Физическое напряжение в теле</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Чувство, что что-то плохое вот-вот случится</span>
                </li>
              </ul>

              <h2 className="font-heading text-2xl font-semibold text-foreground mt-10 mb-4">
                Как помогает ИИ психолог при тревоге
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Quiet Bay предлагает безопасное пространство, где можно:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Выговориться и снять напряжение</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Освоить техники дыхания и заземления</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Разобраться в своих тревожных мыслях</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Получить поддержку в любое время</span>
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mt-8 mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Важно знать
                </h3>
                <p className="text-muted-foreground text-sm">
                  При панических атаках, сильной тревоге, которая не проходит, или мыслях о самоповреждении — 
                  обратитесь к специалисту. ИИ психолог — это поддержка, но не замена профессиональной помощи.
                </p>
              </div>
            </div>

            <div className="text-center mt-12 p-8 bg-gradient-to-br from-primary/5 to-seafoam/20 rounded-2xl border border-primary/10">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Чувствуете тревогу прямо сейчас?
              </h3>
              <p className="text-muted-foreground mb-6">
                Поговорите с ИИ психологом — это поможет снять напряжение
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

export default FeelingTrevoga;