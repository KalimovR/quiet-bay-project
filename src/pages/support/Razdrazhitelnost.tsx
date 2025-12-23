import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { faqSchema } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, Frown, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Почему я стал таким раздражительным?",
    answer: "После стрессового опыта нервная система остаётся в напряжении. Раздражительность — это способ, которым тело реагирует на перегрузку."
  },
  {
    question: "Нормально ли срываться на близких?",
    answer: "Это случается. Важно не винить себя, но и не игнорировать. Понимание причин помогает постепенно менять реакции."
  },
  {
    question: "Как не срываться?",
    answer: "Есть простые техники, которые помогают заметить нарастающее напряжение до того, как оно выплеснется. Об этом можно поговорить."
  },
  {
    question: "Это пройдёт?",
    answer: "Многие замечают улучшения со временем, особенно когда начинают понимать, что происходит и почему."
  }
];

const symptoms = [
  "Всё бесит, даже мелочи",
  "Резкие вспышки злости",
  "Сложно контролировать реакции",
  "Срываешься на близких",
  "Потом чувствуешь вину"
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Раздражительность после тяжёлого опыта",
  "description": "Если стало сложно контролировать реакции и всё бесит — можно поговорить без осуждения. Анонимно и в своём темпе.",
  "audience": {
    "@type": "Audience",
    "audienceType": "Adults"
  }
};

const Razdrazhitelnost = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Раздражительность после фронта — разговор без осуждения" 
        description="Вернулся с СВО и всё бесит? Если стало сложно контролировать реакции — можно поговорить анонимно, без давления."
        canonical="/support/razdrazhitelnost"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                <Frown className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Когда всё бесит
                </h1>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-4">
              Мелочи выводят из себя. Близкие раздражают. Сложно сдержаться — 
              а потом приходит вина за то, как себя повёл.
            </p>
            <p className="text-muted-foreground">
              После тяжёлого опыта раздражительность — это не плохой характер. 
              Это реакция нервной системы, которая всё ещё находится в напряжении.
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
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-red-400" />
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
                В экстремальных ситуациях быстрая, резкая реакция могла спасти жизнь. 
                Проблема в том, что в мирной жизни эта же реакция мешает.
              </p>
              <p className="text-muted-foreground mb-6">
                Раздражительность — это сигнал о том, что нервная система перегружена. 
                Не признак слабости, а признак того, что нужна передышка.
              </p>
              
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Что может помочь
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Понимание того, откуда берётся раздражение</li>
                <li>• Техники, которые помогают заметить напряжение до вспышки</li>
                <li>• Разговор без осуждения — когда готов</li>
                <li>• Принятие того, что изменения требуют времени</li>
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
                  Можно поговорить. Без осуждения, без советов, если не хочешь.
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

export default Razdrazhitelnost;
