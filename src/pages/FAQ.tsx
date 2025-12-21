import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, Phone } from "lucide-react";

const generalFaqs = [
  {
    question: "Что такое Quiet Bay?",
    answer: "Quiet Bay — это ИИ-компаньон для эмоциональной поддержки. Он предоставляет безопасное, анонимное пространство, где вы можете делиться своими мыслями и чувствами, получать эмпатичные ответы и изучать техники успокоения. Он доступен 24/7, когда вам нужен кто-то, с кем можно поговорить."
  },
  {
    question: "Это терапия или медицинское лечение?",
    answer: "Нет. Quiet Bay НЕ является медицинским сервисом, терапией или лечением. Наш ИИ не врач, не психиатр и не лицензированный терапевт. Он предоставляет только информационную и эмоциональную поддержку. Он не может ставить диагнозы или назначать лечение. При проблемах с психическим здоровьем, пожалуйста, обратитесь к квалифицированному специалисту."
  },
  {
    question: "Как работает ИИ?",
    answer: "Наш ИИ обучен отвечать с эмпатией и пониманием. Он слушает то, чем вы делитесь, задаёт вдумчивые вопросы, помогающие исследовать ваши чувства, и предлагает мягкие рекомендации и успокаивающие упражнения. Он никогда не осуждает, не морализирует и не использует сложную психологическую терминологию."
  },
  {
    question: "Моя информация приватна?",
    answer: "Да. Ваши разговоры зашифрованы, и мы не собираем личную идентифицирующую информацию. Вы можете использовать Quiet Bay полностью анонимно. Мы никогда не делимся вашими разговорами с третьими лицами."
  },
  {
    question: "С чем может помочь Quiet Bay?",
    answer: "Quiet Bay может помочь с повседневным стрессом, тревожностью, сложными эмоциями, одиночеством или когда вам просто нужен кто-то, кто выслушает. Он может провести вас через дыхательные упражнения и помочь упорядочить мысли. Однако он не подходит для серьёзных психических расстройств или кризисных ситуаций."
  },
  {
    question: "Есть возрастные ограничения?",
    answer: "Да, Quiet Bay предназначен для пользователей от 18 лет и старше. Если вам меньше 18 лет и вам нужна поддержка, пожалуйста, обратитесь к доверенному взрослому, школьному психологу или молодёжной линии помощи в вашем регионе."
  },
];

const paymentFaqs = [
  {
    question: "Что включено в бесплатный план?",
    answer: "Бесплатный план включает 5 сообщений в день, базовые разговоры для эмоциональной поддержки, доступ к дыхательным упражнениям и кризисные ресурсы. Это отличный способ попробовать Quiet Bay и понять, подходит ли он вам."
  },
  {
    question: "Могу ли я отменить подписку в любое время?",
    answer: "Да, абсолютно. Вы можете отменить Премиум или Годовую подписку в любое время. Вы продолжите иметь доступ до конца оплаченного периода, и нет никаких штрафов за отмену."
  },
  {
    question: "Какие способы оплаты вы принимаете?",
    answer: "Мы принимаем все основные кредитные карты (Visa, MasterCard, American Express) и дебетовые карты через наш защищённый платёжный процессор Stripe."
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Вопросы и ответы"
        description="Частые вопросы о Quiet Bay: как работает ИИ психолог, конфиденциальность, оплата и безопасность."
        canonical="/faq"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Вопросы и безопасность
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Вопросы и безопасность
            </h1>
            <p className="text-muted-foreground text-lg">
              Всё, что вам нужно знать о Quiet Bay и вашей безопасности.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Crisis Alert */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    Если вы в кризисе или думаете о самоповреждении
                  </h3>
                  <p className="text-foreground/80 text-sm mb-4">
                    Пожалуйста, обратитесь за немедленной помощью. Quiet Bay не предназначен для 
                    работы с кризисными ситуациями. Вы не одиноки, и профессиональная поддержка доступна.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-destructive" />
                      <span className="text-foreground/80">
                        <strong>Экстренная помощь:</strong> 112 или местный номер экстренных служб
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-destructive" />
                      <span className="text-foreground/80">
                        <strong>Телефон доверия:</strong> 8-800-2000-122 (бесплатно по России)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-destructive" />
                      <span className="text-foreground/80">
                        <strong>Центр экстренной психологической помощи МЧС:</strong> 8-499-216-50-50
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* General FAQs */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                Общие вопросы
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {generalFaqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`general-${index}`}
                    className="border border-border rounded-lg px-6 data-[state=open]:bg-secondary/30"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Payment FAQs */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                Оплата и подписки
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {paymentFaqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`payment-${index}`}
                    className="border border-border rounded-lg px-6 data-[state=open]:bg-secondary/30"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Important Notice */}
            <div className="bg-warm-glow/50 border border-amber-200/50 rounded-xl p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                Важное уведомление
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Quiet Bay — это инструмент эмоциональной поддержки на базе ИИ, созданный для утешения и 
                присутствия слушателя. Он <strong>не является</strong> заменой профессиональной помощи 
                в области психического здоровья. Если вы испытываете сильную тревогу, депрессию или другие 
                проблемы с психическим здоровьем, пожалуйста, проконсультируйтесь с лицензированным специалистом. 
                Наш ИИ не может предоставлять диагнозы, медицинские советы или кризисное вмешательство.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
