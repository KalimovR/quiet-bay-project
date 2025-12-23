import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Check, MessageCircle, ArrowLeft } from "lucide-react";

const Trevoga = () => {
  const symptoms = [
    "Постоянное беспокойство и волнение",
    "Учащённое сердцебиение",
    "Трудности с засыпанием из-за мыслей",
    "Ощущение напряжения в теле",
    "Страх перед будущим",
    "Трудности с принятием решений"
  ];

  const tips = [
    {
      title: "Дышите глубоко",
      description: "Техника 4-7-8: вдох 4 сек, задержка 7 сек, выдох 8 сек. Повторите 4 раза."
    },
    {
      title: "Заземляйтесь",
      description: "Техника 5-4-3-2-1: назовите 5 вещей, которые видите, 4 — слышите, 3 — чувствуете."
    },
    {
      title: "Ограничьте кофеин",
      description: "Кофеин может усиливать тревогу. Попробуйте заменить кофе на травяной чай."
    },
    {
      title: "Запишите свои мысли",
      description: "Перенос тревожных мыслей на бумагу помогает снизить их интенсивность."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Тревога — как справиться с беспокойством | Quiet Bay" 
        description="Эффективные способы справиться с тревогой и беспокойством. Дыхательные техники, заземление и поддержка 24/7."
      />
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link 
            to="/feelings" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Все состояния
          </Link>

          {/* Hero Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                  Тревога
                </h1>
                <p className="text-muted-foreground">Когда сердце бьётся быстрее, а мысли не дают покоя</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Тревога — это естественная реакция организма на стресс. Она помогает нам 
              быть начеку в опасных ситуациях. Но когда тревога становится постоянной, 
              она начинает мешать жить. Хорошая новость — есть проверенные способы 
              справиться с ней.
            </p>
          </div>

          {/* Symptoms */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Признаки тревоги
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
                >
                  <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Техники для снижения тревоги
            </h2>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <Card key={index} className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border-amber-500/20">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Тревога не отпускает?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Поговорите с нашим ИИ-ассистентом. Он поможет разобраться 
                  в тревожных мыслях и предложит техники успокоения.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/chat">
                    Начать разговор
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Trevoga;
