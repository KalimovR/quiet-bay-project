import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, MessageSquare, Globe } from "lucide-react";
import SEO, { faqSchema, breadcrumbSchema } from "@/components/SEO";

const faqs = [
  {
    question: "Заменяет ли Тихая Бухта терапию?",
    answer: "Нет. Тихая Бухта создана, чтобы дополнять профессиональную психологическую помощь, а не заменять её. Наш ИИ обеспечивает поддерживающее общение и может помочь вам исследовать свои мысли и чувства, но это не лицензированный терапевт. Мы рекомендуем обращаться за профессиональной помощью при серьёзных проблемах с психическим здоровьем.",
  },
  {
    question: "Как работает ИИ?",
    answer: "Наш ИИ использует передовые языковые модели, обученные вести эмпатичные, поддерживающие разговоры. Он опирается на научно обоснованные подходы, такие как когнитивно-поведенческая терапия и техники осознанности. Однако он не ставит диагнозы и не назначает лечение — он просто предоставляет безопасное пространство для самовыражения.",
  },
  {
    question: "Мои данные приватны и в безопасности?",
    answer: "Абсолютно. Мы используем сквозное шифрование для всех разговоров. Ваши данные никогда не продаются третьим лицам, и мы соблюдаем GDPR и другие правила конфиденциальности. Вы можете удалить историю разговоров в любое время в настройках аккаунта.",
  },
  {
    question: "Что происходит, если ИИ обнаруживает кризисную ситуацию?",
    answer: "Наш ИИ создан для распознавания признаков кризиса или сильного стресса. При обнаружении он предоставит вам немедленные кризисные ресурсы, такие как телефон доверия. Мы очень серьёзно относимся к безопасности пользователей и имеем протоколы для таких ситуаций.",
  },
  {
    question: "Могу ли я использовать Тихую Бухту, если я уже хожу к терапевту?",
    answer: "Да! Многие наши пользователи находят Тихую Бухту полезной как дополнение к регулярным сеансам терапии. Она может обеспечить поддержку между приёмами и помочь вам обработать мысли перед обсуждением их с терапевтом.",
  },
  {
    question: "Как отменить подписку?",
    answer: "Вы можете отменить подписку в любое время в настройках аккаунта. Никаких штрафов за отмену нет, и вы будете иметь доступ к премиум-функциям до конца оплаченного периода.",
  },
];

const crisisResources = [
  {
    icon: Phone,
    region: "Россия",
    name: "Телефон доверия",
    contact: "8-800-2000-122",
    available: "Круглосуточно, бесплатно",
  },
  {
    icon: MessageSquare,
    region: "Россия",
    name: "Центр экстренной психологической помощи МЧС",
    contact: "8-499-216-50-50",
    available: "Круглосуточно",
  },
];

const Safety = () => {
  const faqData = faqs.map(f => ({ question: f.question, answer: f.answer }));
  
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Безопасность и FAQ"
        description="Ваше благополучие — наш приоритет. Ответы на частые вопросы о Quiet Bay и кризисные ресурсы для немедленной помощи."
        canonical="/safety"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            faqSchema(faqData),
            breadcrumbSchema([
              { name: "Главная", url: "/" },
              { name: "Безопасность", url: "/safety" }
            ])
          ]
        }}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Безопасность и поддержка
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ваше благополучие — наш главный приоритет. Найдите ответы на частые вопросы и кризисные ресурсы.
            </p>
          </div>

          {/* Crisis Resources */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  В кризисе? Получите помощь прямо сейчас
                </h2>
                <p className="text-muted-foreground mb-6">
                  Если вы переживаете кризис психического здоровья, пожалуйста, немедленно обратитесь к одному из этих ресурсов. Вы не одиноки.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {crisisResources.map((resource) => (
                    <div
                      key={resource.name}
                      className="bg-card rounded-xl p-4 border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <resource.icon className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{resource.region}</p>
                          <h3 className="font-medium text-foreground">{resource.name}</h3>
                          <p className="text-primary font-semibold">{resource.contact}</p>
                          <p className="text-xs text-muted-foreground">{resource.available}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">
              Часто задаваемые вопросы
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                >
                  <AccordionTrigger className="text-lg md:text-xl font-semibold leading-relaxed text-foreground hover:text-primary transition-colors py-5 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-foreground/80 pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Safety;
