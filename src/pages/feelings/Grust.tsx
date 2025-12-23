import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, ArrowRight, Check, MessageCircle, ArrowLeft } from "lucide-react";

const Grust = () => {
  const symptoms = [
    "Постоянное чувство печали или подавленности",
    "Потеря интереса к занятиям, которые раньше радовали",
    "Усталость и упадок сил",
    "Трудности с концентрацией внимания",
    "Изменения в аппетите или режиме сна",
    "Желание побыть в одиночестве"
  ];

  const tips = [
    {
      title: "Разрешите себе грустить",
      description: "Грусть — это нормальная эмоция. Не подавляйте её, а позвольте себе прожить."
    },
    {
      title: "Поговорите о своих чувствах",
      description: "Иногда достаточно просто выговориться, чтобы стало легче."
    },
    {
      title: "Двигайтесь",
      description: "Даже короткая прогулка может улучшить настроение благодаря эндорфинам."
    },
    {
      title: "Практикуйте благодарность",
      description: "Попробуйте записать 3 вещи, за которые вы благодарны сегодня."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Грусть — как справиться с печалью | Quiet Bay" 
        description="Узнайте, как справиться с грустью и печалью. Симптомы, причины и эффективные способы улучшить настроение. Поддержка 24/7."
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-slate-500/20 flex items-center justify-center">
                <Cloud className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                  Грусть
                </h1>
                <p className="text-muted-foreground">Когда всё кажется серым и безрадостным</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Грусть — это естественная человеческая эмоция, которую испытывает каждый. 
              Она может быть вызвана потерей, разочарованием или просто серым днём. 
              Важно помнить, что грусть временна, и есть способы помочь себе пережить её.
            </p>
          </div>

          {/* Symptoms */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Как проявляется грусть
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
                >
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Что может помочь
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
            <Card className="bg-gradient-to-br from-blue-500/10 to-slate-500/10 border-blue-500/20">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Хотите поговорить о своей грусти?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Иногда просто выговориться — уже половина решения. 
                  Наш ИИ-ассистент выслушает вас без осуждения.
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

export default Grust;
