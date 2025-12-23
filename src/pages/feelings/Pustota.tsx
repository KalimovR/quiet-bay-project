import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, ArrowRight, Check, MessageCircle, ArrowLeft } from "lucide-react";

const Pustota = () => {
  const symptoms = [
    "Отсутствие эмоций — ни радости, ни грусти",
    "Ощущение оторванности от себя и окружающих",
    "Потеря смысла в повседневных делах",
    "Механическое выполнение обязанностей",
    "Трудности с ощущением «живости»",
    "Апатия и безразличие к происходящему"
  ];

  const tips = [
    {
      title: "Обратитесь к телу",
      description: "Когда эмоции недоступны, начните с ощущений: примите контрастный душ, прогуляйтесь босиком."
    },
    {
      title: "Делайте что-то руками",
      description: "Творчество, готовка, садоводство — физическая активность помогает вернуться в тело."
    },
    {
      title: "Не заставляйте себя чувствовать",
      description: "Пустота — тоже состояние. Принятие того, что есть, может стать первым шагом."
    },
    {
      title: "Ищите микро-моменты",
      description: "Замечайте мелочи: вкус еды, тепло чашки в руках, красивый закат. Это якоря в реальность."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Пустота — как вернуть чувства | Quiet Bay" 
        description="Не чувствуете ничего? Узнайте, как справиться с эмоциональной пустотой и вернуть ощущение жизни."
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center">
                <Circle className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                  Пустота
                </h1>
                <p className="text-muted-foreground">Когда внутри ничего не чувствуешь</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Эмоциональная пустота — это состояние, когда привычные чувства 
              становятся недоступны. Это может быть защитной реакцией психики 
              на перегрузку или признаком более глубоких процессов. В любом случае, 
              это сигнал, заслуживающий внимания.
            </p>
          </div>

          {/* Symptoms */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Как проявляется пустота
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
                >
                  <Check className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Как вернуться к себе
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
            <Card className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 border-gray-500/20">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Пустота — не приговор
                </h2>
                <p className="text-muted-foreground mb-6">
                  Иногда нужно просто начать говорить, даже если кажется, 
                  что говорить не о чем. Наш ИИ-ассистент будет рядом.
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

export default Pustota;
