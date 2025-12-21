import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Пользовательское соглашение"
        description="Пользовательское соглашение Quiet Bay. Условия использования сервиса."
        canonical="/terms"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Пользовательское соглашение
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  1. Принятие условий
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Получая доступ или используя Quiet Bay, вы соглашаетесь соблюдать настоящие Условия использования. 
                  Если вы не согласны с этими условиями, пожалуйста, не используйте наш сервис.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  2. Описание сервиса
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Quiet Bay предоставляет эмоциональную поддержку и информационные рекомендации на базе ИИ. 
                  Наш сервис создан для обеспечения безопасного пространства для разговора и эмоциональной обработки.
                </p>
                <div className="bg-warm-glow/50 border border-amber-200/50 rounded-lg p-4 my-4">
                  <p className="text-foreground/80 text-sm">
                    <strong>Важно:</strong> Quiet Bay НЕ является медицинским сервисом. Наш ИИ не врач, 
                    не психиатр, не психолог и не лицензированный терапевт. Сервис не предоставляет медицинские 
                    диагнозы, планы лечения или кризисное вмешательство.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  3. Возрастные требования
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Для использования Quiet Bay вам должно быть не менее 18 лет. Используя наш сервис, 
                  вы подтверждаете, что соответствуете этому возрастному требованию.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  4. Обязанности пользователя
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Вы соглашаетесь:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Использовать сервис ответственно и добросовестно</li>
                  <li>Не использовать сервис в незаконных целях</li>
                  <li>Не пытаться навредить, злоупотреблять или манипулировать ИИ-системой</li>
                  <li>Обращаться за профессиональной помощью при серьёзных проблемах с психическим здоровьем</li>
                  <li>Связываться с экстренными службами, если вы в кризисе</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  5. Ограничение ответственности
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Quiet Bay предоставляется «как есть» без каких-либо гарантий. Мы не несём ответственности 
                  за любые решения, которые вы принимаете на основе разговоров с нашим ИИ, или за любой вред, 
                  который может возникнуть в результате использования или невозможности использования нашего сервиса.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  6. Подписка и платежи
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Премиальные функции требуют платной подписки. Платежи обрабатываются безопасно через 
                  сторонние платёжные процессоры. Подписки автоматически продлеваются, если не отменены 
                  до даты продления. Возвраты рассматриваются индивидуально.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  7. Изменения условий
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Мы можем время от времени обновлять настоящие Условия использования. Продолжение использования 
                  сервиса после публикации изменений означает принятие новых условий.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  8. Контакты
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Если у вас есть вопросы об этом Пользовательском соглашении, свяжитесь с нами: 
                  <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline ml-1">
                    maksimrodural@icloud.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
