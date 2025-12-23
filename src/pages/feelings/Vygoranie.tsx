import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery, ArrowRight, Check, MessageCircle, ArrowLeft } from "lucide-react";

const Vygoranie = () => {
  const symptoms = [
    "Постоянная усталость, которая не проходит после отдыха",
    "Цинизм и отстранённость от работы или обязанностей",
    "Снижение эффективности и продуктивности",
    "Ощущение бессмысленности своей деятельности",
    "Раздражительность и эмоциональное истощение",
    "Физические симптомы: головные боли, бессонница"
  ];

  const tips = [
    {
      title: "Установите границы",
      description: "Научитесь говорить «нет». Ваше время и энергия ограничены — берегите их."
    },
    {
      title: "Делайте регулярные перерывы",
      description: "Техника Помодоро: 25 минут работы, 5 минут отдыха. Каждые 4 цикла — длинный перерыв."
    },
    {
      title: "Отключайтесь от работы",
      description: "Создайте ритуал завершения дня. После него — никаких рабочих писем и мыслей."
    },
    {
      title: "Займитесь чем-то для себя",
      description: "Найдите хобби, не связанное с работой. То, что приносит радость без «пользы»."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Выгорание — как восстановить силы | Quiet Bay" 
        description="Признаки профессионального выгорания и способы восстановления. Как вернуть энергию и радость от жизни."
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Battery className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                  Выгорание
                </h1>
                <p className="text-muted-foreground">Когда силы на исходе, а дел ещё много</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Выгорание — это состояние хронического стресса, которое приводит к 
              физическому и эмоциональному истощению. Оно не появляется внезапно, 
              а накапливается со временем. Восстановление возможно, но требует 
              осознанных изменений.
            </p>
          </div>

          {/* Symptoms */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Признаки выгорания
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.map((symptom, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
                >
                  <Check className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Путь к восстановлению
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
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Чувствуете себя на пределе?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Поговорите о своём состоянии. Наш ИИ-ассистент поможет 
                  разобраться в причинах и найти первые шаги к восстановлению.
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

export default Vygoranie;
