import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Условия использования";
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Условия использования
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  1. Общие положения
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Добро пожаловать в Quiet Bay. Используя наш сервис, вы соглашаетесь с настоящими 
                  Условиями использования. Пожалуйста, внимательно прочитайте их перед началом 
                  использования.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Quiet Bay — это цифровая платформа, предоставляющая информационные услуги 
                  и доступ к образовательным материалам по медитации и осознанности.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  2. Информация о продавце
                </h2>
                <div className="bg-card rounded-lg border border-border/50 p-6 mb-4">
                  <p className="text-muted-foreground mb-2">
                    <strong className="text-foreground">Продавец:</strong> Родионов Максим Иванович
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong className="text-foreground">Статус:</strong> Самозанятый (налог на профессиональный доход, НПД)
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

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  3. Возрастные ограничения
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Сервис предназначен для лиц старше 18 лет. Используя Quiet Bay, вы подтверждаете, 
                  что вам исполнилось 18 лет.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  4. Характер услуг
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Quiet Bay предоставляет исключительно информационные услуги и образовательные материалы.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Quiet Bay НЕ является:</strong>
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Медицинским учреждением</li>
                  <li>Поставщиком услуг здравоохранения</li>
                  <li>Заменой профессиональной помощи</li>
                  <li>Службой экстренной помощи</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Платформа оказывает исключительно информационную поддержку и предоставляет 
                  образовательные материалы.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  5. Правила использования
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  При использовании сервиса вы обязуетесь:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Предоставлять достоверную информацию при регистрации</li>
                  <li>Не использовать сервис в противоправных целях</li>
                  <li>Не пытаться обойти технические ограничения платформы</li>
                  <li>Уважительно относиться к сервису и другим пользователям</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  6. Платные услуги и цифровые продукты
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Некоторые функции сервиса и онлайн-курсы доступны за отдельную плату.
                </p>
                <div className="bg-accent/10 rounded-lg p-4 mb-4">
                  <p className="text-foreground font-medium">
                    Продукт является цифровым. Доставка в физическом виде не осуществляется.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Доступ к материалам предоставляется автоматически в течение 24 часов после оплаты. 
                  Услуга считается оказанной с момента предоставления доступа к цифровому материалу.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  7. Условия возврата
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  В течение 14 дней после оплаты вы можете запросить полный возврат средств 
                  без объяснения причин, при условии, что вы не получили доступ к более чем 
                  30% материалов курса.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  8. Ограничение ответственности
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Quiet Bay не несёт ответственности за решения, принятые вами на основе информации, 
                  полученной на платформе. Сервис предоставляется «как есть» без каких-либо гарантий.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  9. Изменение условий
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы оставляем за собой право изменять настоящие Условия. О существенных изменениях 
                  мы уведомим вас по электронной почте или через уведомление в сервисе.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  10. Контакты
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  По всем вопросам, связанным с использованием сервиса, вы можете обратиться 
                  по адресу:{" "}
                  <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline">
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
