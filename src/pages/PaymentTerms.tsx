import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const PaymentTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Условия оплаты"
        description="Условия оплаты и возврата средств в Quiet Bay. Способы оплаты, тарифы, отмена подписки."
        canonical="/payment-terms"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Условия оплаты и возврата
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Что вы получаете
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  При оформлении подписки Quiet Bay вы получаете доступ к:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Диалогам с ИИ-ассистентом для эмоциональной поддержки и саморефлексии</li>
                  <li>Расширенной истории чатов (до 7 для Премиум, безлимит для Годового)</li>
                  <li>Безлимитным сообщениям без ограничений по времени</li>
                  <li>Продвинутым успокаивающим упражнениям</li>
                  <li>Приоритетному времени ответа</li>
                </ul>
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-4">
                  <p className="text-foreground/80 text-sm">
                    <strong>Важно:</strong> Quiet Bay — это онлайн-сервис эмоциональной поддержки. 
                    Это НЕ медицинская услуга. ИИ не ставит диагнозы и не заменяет консультацию специалиста.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Способы оплаты
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Оплата принимается через платёжный сервис ЮKassa. Поддерживаются:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Банковские карты (Visa, MasterCard, МИР)</li>
                  <li>СБП (Система быстрых платежей)</li>
                  <li>ЮMoney</li>
                </ul>
                <p className="text-foreground/80 leading-relaxed">
                  Все платежи защищены и обрабатываются в соответствии со стандартами безопасности PCI DSS.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Тарифы и сроки
                </h2>
                <div className="space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">Премиум — 399₽/месяц</h3>
                    <p className="text-foreground/70 text-sm">
                      Ежемесячная подписка. Доступ активируется сразу после оплаты на 30 дней.
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">Годовой Премиум — 3899₽/год</h3>
                    <p className="text-foreground/70 text-sm">
                      Годовая подписка со скидкой более 30%. Доступ на 365 дней.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Отмена подписки
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Вы можете отменить подписку в любое время в личном кабинете. После отмены:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Доступ сохраняется до конца оплаченного периода</li>
                  <li>Автоматическое продление не происходит</li>
                  <li>Вы можете возобновить подписку в любое время</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Возврат средств
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Поскольку Quiet Bay предоставляет цифровые услуги с мгновенным доступом:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Возврат возможен в течение 3 дней с момента оплаты, если услугой не пользовались</li>
                  <li>При технических проблемах с доступом — полный возврат в течение 14 дней</li>
                  <li>Для оформления возврата свяжитесь с нами: maksimrodural@icloud.com</li>
                </ul>
                <p className="text-foreground/80 leading-relaxed">
                  Каждый запрос на возврат рассматривается индивидуально. Мы стремимся найти справедливое решение.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Контакты для вопросов
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  По вопросам оплаты и возврата: <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline">maksimrodural@icloud.com</a>
                </p>
                <p className="text-foreground/80 leading-relaxed mt-2">
                  <Link to="/contacts" className="text-primary hover:underline">Подробная информация о продавце →</Link>
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

export default PaymentTerms;