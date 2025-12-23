import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import SEO, { breadcrumbSchema } from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Публичная оферта"
        description="Публичная оферта и условия использования сервиса Quiet Bay. Договор на оказание информационных услуг."
        canonical="/terms"
        structuredData={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: "Публичная оферта", url: "/terms" }
        ])}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
              Публичная оферта
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Договор на оказание информационных услуг
            </p>
            
            <Card className="bg-primary/5 border-primary/20 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm text-muted-foreground">
                    Настоящий документ является публичной офертой в соответствии со статьёй 435 и 
                    частью 2 статьи 437 Гражданского кодекса Российской Федерации.
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="text-muted-foreground mb-8">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">1. Общие положения</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    1.1. Настоящая Публичная оферта (далее — «Оферта») является официальным предложением 
                    Исполнителя, адресованным неопределённому кругу лиц, заключить договор на оказание 
                    информационных услуг на условиях, изложенных в настоящей Оферте.
                  </p>
                  <p>
                    1.2. Акцептом настоящей Оферты является оплата услуг Исполнителя. Оплата означает 
                    полное и безоговорочное принятие условий настоящей Оферты.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">2. Сведения об Исполнителе</h2>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-foreground">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">ФИО:</span>
                        <span className="font-medium">Родионов Максим Иванович</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Статус:</span>
                        <span className="font-medium">Самозанятый (НПД)</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">ИНН:</span>
                        <span className="font-mono font-bold text-primary">662344394418</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Email:</span>
                        <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline">
                          maksimrodural@icloud.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">3. Предмет договора</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    3.1. Исполнитель обязуется оказать Заказчику информационные услуги и предоставить 
                    доступ к онлайн-курсам и образовательным материалам, размещённым на сайте 
                    quietbay.ru (далее — «Услуги»), а Заказчик обязуется оплатить эти Услуги.
                  </p>
                  <p>
                    3.2. Перечень, стоимость и описание Услуг указаны на страницах сайта в разделах 
                    «Курсы» и «Тарифы».
                  </p>
                  <p>
                    3.3. Все продукты являются цифровыми. Доставка в физическом виде не осуществляется.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">4. Порядок оплаты</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    4.1. Оплата Услуг производится в рублях Российской Федерации (₽) через платёжную 
                    систему ЮKassa любым доступным способом оплаты.
                  </p>
                  <p>
                    4.2. Моментом оплаты считается поступление денежных средств на счёт Исполнителя.
                  </p>
                  <p>
                    4.3. Цены на Услуги указаны на сайте и могут быть изменены Исполнителем в 
                    одностороннем порядке. Изменение цен не распространяется на уже оплаченные Услуги.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">5. Порядок предоставления доступа</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    5.1. Доступ к приобретённым материалам предоставляется автоматически в течение 
                    24 часов после подтверждения оплаты.
                  </p>
                  <p>
                    5.2. Доступ предоставляется в личном кабинете Заказчика на сайте.
                  </p>
                  <p>
                    5.3. Для получения доступа Заказчик должен быть зарегистрирован на сайте.
                  </p>
                  <p className="font-medium text-foreground">
                    5.4. Услуга считается оказанной с момента предоставления доступа к цифровому материалу.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">6. Условия возврата</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    6.1. В соответствии со статьёй 26.1 Закона РФ «О защите прав потребителей» и 
                    Постановлением Правительства РФ от 31.12.2020 № 2463, цифровые товары и услуги 
                    надлежащего качества не подлежат возврату или обмену.
                  </p>
                  <p>
                    6.2. Возврат денежных средств возможен только в случае, если Исполнитель не 
                    предоставил доступ к оплаченным материалам в установленный срок (24 часа).
                  </p>
                  <p>
                    6.3. Для оформления возврата Заказчик должен направить письменное заявление на 
                    email Исполнителя с указанием причины возврата и реквизитов платежа.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">7. Права и обязанности сторон</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">7.1. Исполнитель обязуется:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Предоставить доступ к оплаченным материалам в установленный срок</li>
                    <li>Обеспечить техническую возможность использования материалов</li>
                    <li>Отвечать на обращения Заказчика в течение 3 рабочих дней</li>
                  </ul>
                  <p><strong className="text-foreground">7.2. Заказчик обязуется:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Своевременно оплатить выбранные Услуги</li>
                    <li>Предоставить достоверные данные при регистрации</li>
                    <li>Не передавать доступ к материалам третьим лицам</li>
                    <li>Не копировать и не распространять материалы</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">8. Ограничение ответственности</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    8.1. Материалы сайта носят исключительно информационный и образовательный характер.
                  </p>
                  <p>
                    8.2. Исполнитель не несёт ответственности за результаты применения полученной 
                    информации Заказчиком.
                  </p>
                  <p>
                    8.3. Сервис не является медицинской услугой и не заменяет профессиональную 
                    помощь специалистов.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">9. Заключительные положения</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    9.1. Настоящая Оферта вступает в силу с момента её размещения на сайте и действует 
                    до момента её отзыва Исполнителем.
                  </p>
                  <p>
                    9.2. Исполнитель вправе вносить изменения в условия Оферты. Изменения вступают в 
                    силу с момента их публикации.
                  </p>
                  <p>
                    9.3. Все споры решаются путём переговоров, а при недостижении согласия — в 
                    соответствии с законодательством Российской Федерации.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">10. Контактная информация</h2>
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">
                      По всем вопросам, связанным с исполнением настоящей Оферты, обращайтесь:
                    </p>
                    <div className="space-y-2">
                      <p className="text-foreground">
                        <strong>Исполнитель:</strong> Родионов Максим Иванович
                      </p>
                      <p className="text-foreground">
                        <strong>ИНН:</strong> <span className="font-mono text-primary">662344394418</span>
                      </p>
                      <p className="text-foreground">
                        <strong>Email:</strong>{" "}
                        <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline">
                          maksimrodural@icloud.com
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
