import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Check, MessageCircle, ArrowLeft } from "lucide-react";

const Odinochestvo = () => {
  const symptoms = [
    "Ощущение изоляции даже среди людей",
    "Чувство, что никто не понимает",
    "Трудности в установлении близких связей",
    "Желание общаться, но страх отвержения",
    "Ощущение, что вы другой или не такой как все",
    "Избегание социальных ситуаций"
  ];

  const tips = [
    {
      title: "Начните с малого",
      description: "Не нужно сразу искать близких друзей. Начните с простого: улыбнитесь соседу, напишите знакомому."
    },
    {
      title: "Найдите сообщество по интересам",
      description: "Людей объединяют общие увлечения. Присоединитесь к клубу, курсу или онлайн-сообществу."
    },
    {
      title: "Будьте добры к себе",
      description: "Одиночество — не ваша вина. Это состояние, которое можно изменить постепенно."
    },
    {
      title: "Практикуйте самосострадание",
      description: "Относитесь к себе так же тепло, как отнеслись бы к близкому другу в трудной ситуации."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Одиночество — как справиться с изоляцией | Quiet Bay" 
        description="Чувствуете себя одиноко? Узнайте, как справиться с одиночеством. Практические советы и поддержка круглосуточно."
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                  Одиночество
                </h1>
                <p className="text-muted-foreground">Когда рядом никого нет, кто бы понял</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Одиночество — это не столько отсутствие людей рядом, сколько ощущение 
              непонятости и разобщённости. Можно чувствовать себя одиноким даже в толпе. 
              Это болезненное, но поправимое состояние.
            </p>
          </div>

          {/* Symptoms */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Признаки одиночества
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
                >
                  <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Шаги к связи с другими
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
            <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Вы не одиноки
                </h2>
                <p className="text-muted-foreground mb-6">
                  Наш ИИ-ассистент всегда рядом — 24/7, без осуждения. 
                  Просто поговорите, когда вам нужно.
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

export default Odinochestvo;
