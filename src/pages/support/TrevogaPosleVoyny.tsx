import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { faqSchema } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, AlertTriangle, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Почему тревога не проходит даже в безопасности?",
    answer: "Нервная система адаптировалась к опасности и продолжает работать в режиме готовности. Это нормальная реакция, которая со временем может измениться."
  },
  {
    question: "Нормально ли вздрагивать от резких звуков?",
    answer: "Да. Повышенная реакция на звуки — частое явление после стрессовых ситуаций. Тело помнит, что нужно было реагировать быстро."
  },
  {
    question: "Можно ли избавиться от этого?",
    answer: "Многие замечают улучшения со временем. Важно дать себе время и не ругать себя за то, что происходит."
  },
  {
    question: "Нужно ли обращаться к врачу?",
    answer: "Если тревога сильно мешает жить, консультация специалиста может помочь. Но для начала можно просто поговорить — понять, что происходит."
  }
];

const symptoms = [
  "Постоянное напряжение в теле",
  "Сложно расслабиться даже дома",
  "Всё время как будто настороже",
  "Резкая реакция на звуки или движения",
  "Ощущение, что что-то должно случиться"
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Постоянная тревога после тяжёлого опыта",
  "description": "Если не отпускает напряжение и тревога после сложных событий — можно поговорить анонимно, без давления.",
  "audience": {
    "@type": "Audience",
    "audienceType": "Adults"
  }
};

const TrevogaPosleVoyny = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Постоянная тревога после войны — разговор без давления" 
        description="Если после тяжёлого опыта не отпускает напряжение и тревога — можно поговорить анонимно. Без оценок и диагнозов."
        canonical="/support/trevoga-posle-voyny"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Постоянная тревога
                </h1>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-4">
              Когда тело не может расслабиться. Когда всё время ждёшь чего-то плохого. 
              Когда даже в безопасности не чувствуешь себя в безопасности.
            </p>
            <p className="text-muted-foreground">
              После тяжёлого опыта нервная система остаётся в режиме повышенной готовности. 
              Это не слабость — это способ, которым тело пытается тебя защитить.
            </p>
          </div>

          {/* Symptoms */}
          <div className="max-w-3xl mx-auto mb-12">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                  Знакомо?
                </h2>
                <ul className="space-y-4">
                  {symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-foreground">{symptom}</span>
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
                Почему так происходит
              </h2>
              <p className="text-muted-foreground mb-4">
                В сложных ситуациях постоянная готовность к опасности была необходима. 
                Проблема в том, что нервная система не всегда понимает, когда можно «выключить» этот режим.
              </p>
              <p className="text-muted-foreground mb-6">
                Со временем, в безопасной обстановке, тело может научиться расслабляться снова. 
                Но это требует времени и терпения к себе.
              </p>
              
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Что может помочь
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Понимание того, что происходит — без страшных ярлыков</li>
                <li>• Простые техники заземления и расслабления</li>
                <li>• Разговор о том, что чувствуешь — когда готов</li>
                <li>• Принятие того, что это процесс, а не мгновенное решение</li>
              </ul>
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
                  Если откликается
                </h2>
                <p className="text-muted-foreground mb-6">
                  Можно просто поговорить. Анонимно, в своём темпе, без обязательств.
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

export default TrevogaPosleVoyny;
