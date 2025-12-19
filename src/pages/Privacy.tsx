import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Политика конфиденциальности";
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Политика конфиденциальности
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  1. Введение
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Quiet Bay серьёзно относится к защите вашей конфиденциальности. Настоящая 
                  Политика описывает, какие данные мы собираем, как их используем и защищаем.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  2. Какие данные мы собираем
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Мы можем собирать следующие типы данных:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Адрес электронной почты (при регистрации)</li>
                  <li>Содержание разговоров с ИИ-психологом</li>
                  <li>Техническая информация (IP-адрес, тип браузера, устройство)</li>
                  <li>Данные об использовании сервиса</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  3. Как мы используем данные
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Мы используем собранные данные для:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Предоставления и улучшения наших услуг</li>
                  <li>Персонализации вашего опыта</li>
                  <li>Обработки платежей</li>
                  <li>Связи с вами по важным вопросам</li>
                  <li>Обеспечения безопасности сервиса</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  4. Защита данных
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы применяем современные технические и организационные меры для защиты ваших 
                  данных, включая шифрование при передаче и хранении, контроль доступа и 
                  регулярные проверки безопасности.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  5. Передача данных третьим лицам
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы не продаём ваши персональные данные. Мы можем передавать данные только 
                  нашим доверенным партнёрам (например, платёжным системам) и только в объёме, 
                  необходимом для оказания услуг.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  6. Ваши права
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Вы имеете право:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Запросить доступ к своим данным</li>
                  <li>Исправить неточные данные</li>
                  <li>Удалить свои данные и аккаунт</li>
                  <li>Экспортировать свои данные</li>
                  <li>Отозвать согласие на обработку</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  7. Хранение данных
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы храним ваши данные до тех пор, пока у вас есть активный аккаунт или пока 
                  это необходимо для предоставления услуг. Вы можете удалить историю разговоров 
                  или полностью удалить аккаунт в любое время.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  8. Файлы cookie
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Мы используем файлы cookie для обеспечения работы сервиса, аналитики и 
                  улучшения пользовательского опыта. Вы можете управлять настройками cookie 
                  в вашем браузере.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  9. Контакты
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  По вопросам, связанным с конфиденциальностью, обращайтесь: privacy@quietbay.app
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

export default Privacy;
