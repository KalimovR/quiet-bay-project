import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { faqSchema } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, Circle, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Нормально ли ничего не чувствовать?",
    answer: "Да. Эмоциональное онемение — это защитный механизм. Когда переживаний слишком много, психика может «отключить» чувства, чтобы справиться."
  },
  {
    question: "Это навсегда?",
    answer: "Нет. Способность чувствовать может вернуться. Это требует времени и безопасности."
  },
  {
    question: "Почему я не радуюсь, хотя всё хорошо?",
    answer: "После тяжёлого опыта может пройти время, прежде чем эмоции «разморозятся». Это нормальный процесс адаптации."
  },
  {
    question: "Что делать, если не чувствую связи с близкими?",
    answer: "Это одно из проявлений эмоциональной усталости. Можно начать с малого — просто быть рядом, без ожиданий от себя."
  }
];

const symptoms = [
  "Ничего не чувствуешь — ни радости, ни грусти",
  "Всё стало безразлично",
  "Как будто смотришь на жизнь со стороны",
  "Не чувствуешь связи с близкими",
  "Механически делаешь то, что нужно"
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Эмоциональная пустота после тяжёлого опыта",
  "description": "Если внутри ничего не чувствуешь после сложных событий — можно поговорить. Без давления, без ожиданий.",
  "audience": {
    "@type": "Audience",
    "audienceType": "Adults"
  }
};

const EmotsonalnayaPustota = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Пустота после возвращения — разговор без ожиданий" 
        description="Не понимаю что со мной после СВО. Если внутри пустота и ничего не чувствуешь — можно поговорить анонимно."
        canonical="/support/emotsionalnaya-pustota"
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 flex items-center justify-center">
                <Circle className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Когда внутри пусто
                </h1>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-4">
              Ничего не чувствуешь. Ни радости, ни грусти. Как будто эмоции выключили. 
              Жизнь идёт, но как будто не с тобой.
            </p>
            <p className="text-muted-foreground">
              Эмоциональная пустота после тяжёлого опыта — это не холодность и не равнодушие. 
              Это способ, которым психика защищается от перегрузки.
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
                      <div className="w-6 h-6 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-gray-400" />
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
                Когда переживаний становится слишком много, психика может временно «заморозить» эмоции. 
                Это защитный механизм, который помогает пережить сложный период.
              </p>
              <p className="text-muted-foreground mb-6">
                Проблема в том, что вместе с болью «замораживаются» и положительные эмоции. 
                Но это временное состояние — способность чувствовать может вернуться.
              </p>
              
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Что может помочь
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Понимание того, что это защита, а не поломка</li>
                <li>• Маленькие шаги — без давления на себя</li>
                <li>• Разговор, когда готов — или просто присутствие рядом</li>
                <li>• Время и безопасность</li>
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
                  Можно просто написать. Без ожиданий, без давления, в своём темпе.
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

export default EmotsonalnayaPustota;
