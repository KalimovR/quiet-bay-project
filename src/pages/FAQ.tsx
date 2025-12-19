import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ChevronDown, Phone, ExternalLink } from "lucide-react";

const FAQ = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Вопросы и ответы";
  }, []);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Кто такой ИИ-психолог?",
      answer: "ИИ-психолог — это искусственный интеллект, обученный вести эмпатичный и поддерживающий диалог. Он не является врачом, психиатром или клиническим психологом. ИИ создан для информационной и эмоциональной поддержки в повседневных ситуациях стресса, тревожности или эмоционального напряжения."
    },
    {
      question: "Чем ИИ может мне помочь?",
      answer: "ИИ-психолог может: выслушать вас без осуждения, помочь структурировать мысли и разобраться в чувствах, предложить простые техники заземления и успокоения, задать уточняющие вопросы для лучшего понимания ситуации, быть рядом когда вам нужна поддержка — в любое время суток."
    },
    {
      question: "Чего ИИ НЕ может делать?",
      answer: "ИИ-психолог НЕ имеет права: ставить медицинские диагнозы, назначать лекарства или лечение, заменять профессиональную психологическую или психиатрическую помощь, давать категоричные советы о том, как поступить в вашей ситуации. При серьёзных проблемах необходимо обратиться к квалифицированному специалисту."
    },
    {
      question: "Безопасны ли мои данные?",
      answer: "Мы серьёзно относимся к конфиденциальности. Все разговоры шифруются, и мы не передаём ваши данные третьим лицам. Вы можете использовать сервис анонимно. У вас есть полный контроль над своими данными — вы можете удалить историю разговоров в любой момент."
    },
    {
      question: "Что делать в кризисной ситуации?",
      answer: "Если вы или кто-то из ваших близких находится в кризисной ситуации, испытывает мысли о самоповреждении или суициде — пожалуйста, немедленно обратитесь за профессиональной помощью. ИИ не предназначен для помощи в кризисных ситуациях. Обратитесь на телефон доверия: 8-800-2000-122 (бесплатно по России, круглосуточно)."
    },
    {
      question: "Для кого подходит этот сервис?",
      answer: "Quiet Bay подходит людям 18+ лет, которые: испытывают повседневный стресс или тревожность, хотят получить поддержку анонимно и в удобное время, не готовы или не могут обратиться к живому психологу, нуждаются в пространстве для проговаривания мыслей, ищут простые техники самопомощи."
    },
    {
      question: "Как работает подписка?",
      answer: "У нас есть бесплатный план с ограниченным количеством сообщений для знакомства с сервисом. Платные планы дают безлимитный доступ к общению, расширенные сценарии поддержки и приоритетное время ответа. Вы можете отменить подписку в любой момент, а в течение первых 14 дней действует гарантия возврата средств."
    },
    {
      question: "Могу ли я отменить подписку?",
      answer: "Да, вы можете отменить подписку в любой момент. Если вы отмените подписку, доступ к премиум-функциям сохранится до конца оплаченного периода. В течение первых 14 дней после оплаты действует полная гарантия возврата средств."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 bg-calm" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Часто задаваемые вопросы
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ответы на основные вопросы о Quiet Bay и ИИ-психологе
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-bay-fog/30 transition-colors"
                  >
                    <span className="font-display font-medium text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      openIndex === index ? "pb-5 max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Support */}
      <section className="py-16 md:py-24 bg-bay-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Экстренная помощь
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Если вы находитесь в кризисной ситуации, испытываете мысли о самоповреждении 
              или суициде — пожалуйста, немедленно обратитесь за профессиональной помощью.
            </p>
            
            <div className="space-y-4">
              <a
                href="tel:88002000122"
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors group"
              >
                <Phone className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Телефон доверия</p>
                  <p className="text-sm text-muted-foreground">8-800-2000-122 (бесплатно, 24/7)</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
              </a>
              
              <a
                href="tel:112"
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors group"
              >
                <Phone className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Экстренные службы</p>
                  <p className="text-sm text-muted-foreground">112 (единый номер)</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-border/50 bg-bay-fog/30 p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                Важная информация
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Quiet Bay не является медицинским сервисом.</strong> ИИ-психолог 
                  оказывает информационную и эмоциональную поддержку, но не заменяет профессиональную 
                  психологическую или медицинскую помощь.
                </p>
                <p>
                  При наличии серьёзных психологических проблем, депрессии, тревожных расстройств или 
                  других ментальных состояний необходимо обратиться к квалифицированному специалисту.
                </p>
                <p>
                  <strong className="text-foreground">Возрастное ограничение: 18+</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
