import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { faqSchema } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  AlertTriangle, 
  Frown, 
  Circle,
  Shield,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const supportPages = [
  {
    slug: "posle-svo",
    title: "После тяжёлого опыта",
    description: "Когда прошлое не отпускает и сложно вернуться к обычной жизни",
    icon: Shield,
    color: "from-slate-500/20 to-gray-600/20",
    iconColor: "text-slate-400"
  },
  {
    slug: "ne-mogu-spat",
    title: "Не могу уснуть",
    description: "Когда ночи стали испытанием, а сон не приходит",
    icon: Moon,
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400"
  },
  {
    slug: "trevoga-posle-voyny",
    title: "Постоянная тревога",
    description: "Когда напряжение не отпускает и всё время настороже",
    icon: AlertTriangle,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400"
  },
  {
    slug: "razdrazhitelnost",
    title: "Раздражительность",
    description: "Когда всё бесит и сложно контролировать реакции",
    icon: Frown,
    color: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-400"
  },
  {
    slug: "emotsionalnaya-pustota",
    title: "Эмоциональная пустота",
    description: "Когда внутри ничего не чувствуешь и всё стало безразлично",
    icon: Circle,
    color: "from-gray-500/20 to-slate-500/20",
    iconColor: "text-gray-400"
  }
];

const faqs = [
  {
    question: "Обязательно ли рассказывать, что было?",
    answer: "Нет. Ты не обязан ничего объяснять или рассказывать. Можно говорить о том, что чувствуешь сейчас, не касаясь прошлого. Ты сам решаешь, о чём говорить."
  },
  {
    question: "Можно ли просто поговорить, без советов?",
    answer: "Да, конечно. Иногда нужно просто выговориться или побыть с кем-то рядом. Мы не будем давать советы, если ты этого не хочешь."
  },
  {
    question: "Это анонимно?",
    answer: "Да. Не нужно называть своё имя или регистрироваться. Разговор остаётся между тобой и ассистентом."
  },
  {
    question: "Нормально ли, что после тяжёлого опыта трудно спать?",
    answer: "Да, это естественная реакция. Многие сталкиваются с нарушениями сна после сложных событий. Это не значит, что с тобой что-то не так."
  },
  {
    question: "А если я не знаю, что сказать?",
    answer: "Можно начать с чего угодно. Или просто написать «привет» — мы сами поможем начать разговор в комфортном темпе."
  }
];

const supportPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Поддержка после тяжёлого опыта",
  "description": "Анонимный разговор без давления и оценок. Если после тяжёлого опыта стало трудно — здесь можно быть осторожно.",
  "audience": {
    "@type": "Audience",
    "audienceType": "Adults"
  }
};

const SupportIndex = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Поддержка после тяжёлого опыта" 
        description="Анонимный разговор без давления. Если после сложных событий стало трудно — здесь можно поговорить в своём темпе."
        canonical="/support"
        structuredData={{
          ...supportPageSchema,
          ...faqSchema(faqs)
        }}
      />
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Если сейчас тяжело — можно поговорить
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Без давления. Без оценок. Без необходимости объяснять, что случилось.
            </p>
            <p className="text-muted-foreground">
              Здесь можно быть осторожно. Ты сам решаешь, о чём говорить и когда остановиться.
            </p>
          </div>

          {/* Support Pages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {supportPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link 
                  key={page.slug} 
                  to={`/support/${page.slug}`}
                  className="group"
                >
                  <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${page.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-7 h-7 ${page.iconColor}`} />
                      </div>
                      <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                        {page.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {page.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-primary font-medium">
                        Подробнее
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
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
                  Готов поговорить?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Можно начать в любой момент. Анонимно, в своём темпе, без обязательств.
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

export default SupportIndex;
