import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { faqSchema } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, Moon, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Нормально ли не спать после тяжёлого опыта?",
    answer: "Да. Нарушения сна — частая реакция на стресс и сложные события. Это не значит, что с тобой что-то не так."
  },
  {
    question: "Что делать, если снятся кошмары?",
    answer: "Кошмары — это способ, которым сознание пытается переработать пережитое. Можно поговорить о том, что чувствуешь после пробуждения, не пересказывая сам сон."
  },
  {
    question: "Можно ли писать ночью?",
    answer: "Да. Ассистент доступен 24/7. Если ночью особенно тяжело — можно написать в любое время."
  },
  {
    question: "Вы дадите снотворное?",
    answer: "Нет. Мы не врачи и не назначаем лекарства. Но можем помочь снизить тревогу через разговор и простые техники."
  }
];

const symptoms = [
  "Долго не можешь заснуть",
  "Просыпаешься среди ночи",
  "Снятся тяжёлые сны",
  "Утром чувствуешь себя разбитым",
  "Боишься ложиться спать"
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Не могу спать — спокойный разговор без давления",
  "description": "Если после тяжёлого опыта стало трудно засыпать — можно поговорить анонимно. Без диагнозов, без советов.",
  "audience": {
    "@type": "Audience",
    "audienceType": "Adults"
  }
};

const NeMoguSpat = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Не могу спать после СВО — спокойный разговор" 
        description="Если после возвращения тяжело уснуть, постоянно напряжение или тревога — можно поговорить анонимно и в своём темпе."
        canonical="/support/ne-mogu-spat"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <Moon className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Не могу уснуть
                </h1>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-4">
              Когда ночи стали испытанием. Когда закрываешь глаза — и становится хуже. 
              Когда утро приходит, а ты так и не отдохнул.
            </p>
            <p className="text-muted-foreground">
              Проблемы со сном после тяжёлого опыта — это не слабость. Это реакция тела и разума на то, 
              через что ты прошёл.
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
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-indigo-400" />
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
                После сложных событий нервная система остаётся в режиме повышенной готовности. 
                Тело помнит, что нужно быть настороже. Отсюда и проблемы с засыпанием.
              </p>
              <p className="text-muted-foreground mb-6">
                Это не навсегда. Но чтобы вернуть нормальный сон, нужно время и безопасное пространство.
              </p>
              
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Что может помочь
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Поговорить о том, что не даёт уснуть — без необходимости объяснять всё</li>
                <li>• Простые техники расслабления перед сном</li>
                <li>• Понимание того, что происходит — без диагнозов</li>
                <li>• Знание, что ты не один с этим</li>
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
                  Если ночами особенно тяжело
                </h2>
                <p className="text-muted-foreground mb-6">
                  Можно написать в любое время. Анонимно, без давления.
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

export default NeMoguSpat;
