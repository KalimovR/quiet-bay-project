import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Offer = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Публичная оферта";
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Публичная оферта
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
              </p>

              <div className="bg-accent/10 rounded-lg p-4 mb-8">
                <p className="text-foreground font-medium">
                  Настоящий документ является официальной публичной офертой в соответствии со статьёй 437 
                  Гражданского кодекса Российской Федерации.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  1. Общие положения
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Продавец:</strong> Родионов Максим Иванович
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Статус:</strong> Самозанятый (налог на профессиональный доход, НПД)
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">ИНН:</strong> 662344394418
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Настоящая оферта определяет условия приобретения информационных услуг и цифровых 
                  продуктов, размещённых на сайте quietbay.app (далее — «Сайт»).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  2. Предмет договора
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Продавец обязуется оказать Покупателю информационные услуги и предоставить доступ 
                  к онлайн-курсам в соответствии с выбранным тарифом, а Покупатель обязуется 
                  оплатить эти услуги.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Предметом настоящего договора является оказание информационных услуг и 
                  предоставление доступа к онлайн-курсам по медитации и осознанности.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  3. Описание услуг
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Услуги включают:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Доступ к видеоурокам онлайн-курса по медитации</li>
                  <li>Образовательные материалы в электронном виде</li>
                  <li>Доступ к платформе для общения с ИИ-ассистентом</li>
                </ul>
                <div className="bg-bay-fog/30 rounded-lg p-4">
                  <p className="text-foreground font-medium">
                    Продукт является цифровым. Доставка в физическом виде не осуществляется.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  4. Порядок оплаты
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Оплата производится в российских рублях (₽) одним из следующих способов:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Банковская карта (Visa, MasterCard, МИР)</li>
                  <li>Система быстрых платежей (СБП)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Оплата осуществляется через платёжный сервис ЮKassa. Все платежи защищены 
                  и соответствуют стандартам безопасности.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  5. Порядок предоставления доступа
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  После успешной оплаты доступ к материалам предоставляется автоматически 
                  в течение 24 часов. В большинстве случаев доступ открывается мгновенно.
                </p>
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="text-foreground font-medium">
                    Услуга считается оказанной с момента предоставления доступа к цифровому материалу.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  6. Условия возврата
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  В течение 14 дней после оплаты вы можете запросить полный возврат средств 
                  без объяснения причин, при условии, что вы не получили доступ к более чем 
                  30% материалов курса.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Для оформления возврата свяжитесь с нами по email:{" "}
                  <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline">
                    maksimrodural@icloud.com
                  </a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  7. Ограничение ответственности
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Услуги носят исключительно информационный и образовательный характер. 
                  Продавец не несёт ответственности за результаты применения полученных знаний.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Услуги не являются медицинскими, психотерапевтическими или лечебными. 
                  При наличии проблем со здоровьем рекомендуется обратиться к специалисту.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  8. Акцепт оферты
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Оплата услуг является полным и безоговорочным акцептом настоящей оферты. 
                  С момента оплаты договор считается заключённым.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  9. Контактная информация
                </h2>
                <div className="bg-card rounded-lg border border-border/50 p-6">
                  <p className="text-muted-foreground mb-2">
                    <strong className="text-foreground">Продавец:</strong> Родионов Максим Иванович
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong className="text-foreground">Статус:</strong> Самозанятый (НПД)
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong className="text-foreground">ИНН:</strong> 662344394418
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline">
                      maksimrodural@icloud.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Offer;
