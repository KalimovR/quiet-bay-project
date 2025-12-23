import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { faqSchema } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, Shield, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Обязательно ли рассказывать, что было?",
    answer: "Нет. Ты не обязан ничего объяснять. Можно говорить о том, что чувствуешь сейчас, не касаясь прошлого."
  },
  {
    question: "Нормально ли чувствовать пустоту после возвращения?",
    answer: "Да. Многие сталкиваются с этим. Это не слабость — это реакция на сложный опыт."
  },
  {
    question: "А если я не знаю, что со мной?",
    answer: "Это нормально. Не нужно ставить себе диагнозы. Можно просто поговорить о том, что есть сейчас."
  },
  {
    question: "Можно ли просто помолчать?",
    answer: "Да. Иногда нужно просто побыть рядом с кем-то. Мы не будем торопить или давить."
  }
];

const points = [
  "Без расспросов о прошлом",
  "Без оценок и диагнозов",
  "Без давления рассказывать",
  "Ты контролируешь разговор",
  "Можно остановиться в любой момент"
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Поддержка после тяжёлого опыта",
  "description": "Если после возвращения стало трудно — здесь можно поговорить анонимно и в своём темпе.",
  "audience": {
    "@type": "Audience",
    "audienceType": "Adults"
  }
};

const PosleSvo = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="После тяжёлого опыта — спокойный разговор" 
        description="Если после возвращения стало трудно — можно поговорить анонимно и в своём темпе. Без давления, без оценок."
        canonical="/support/posle-svo"
        structuredData={{
          ...pageSchema,
          ...faqSchema(faqs)
        }}
      />
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link 
            to="/support" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к разделу поддержки
          </Link>

          {/* Hero Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500/20 to-gray-600/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Если после тяжёлого опыта стало трудно
                </h1>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-4">
              Иногда после сложных событий возвращение к обычной жизни даётся непросто. 
              Всё вокруг кажется другим. Или ты сам чувствуешь себя другим.
            </p>
            <p className="text-muted-foreground">
              Здесь можно поговорить — без необходимости объяснять, что случилось. 
              Ты сам решаешь, о чём говорить и когда остановиться.
            </p>
          </div>

          {/* What We Offer */}
          <div className="max-w-3xl mx-auto mb-12">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                  Как это работает
                </h2>
                <ul className="space-y-4">
                  {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="prose prose-invert max-w-none">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Что бывает после
              </h2>
              <p className="text-muted-foreground mb-4">
                После тяжёлого опыта многие замечают изменения в себе:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>• Сложно расслабиться, постоянное напряжение</li>
                <li>• Проблемы со сном, кошмары</li>
                <li>• Раздражительность, резкие реакции</li>
                <li>• Ощущение пустоты или отстранённости</li>
                <li>• Трудности в общении с близкими</li>
              </ul>
              <p className="text-muted-foreground">
                Это не значит, что с тобой что-то не так. Это реакция на то, через что ты прошёл. 
                И с этим можно работать — в своём темпе, без давления.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              Частые вопросы
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`}
                  className="bg-card/50 border border-border/50 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Если откликается — можно поговорить
                </h2>
                <p className="text-muted-foreground mb-6">
                  Анонимно. В своём темпе. Без обязательств.
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

export default PosleSvo;
