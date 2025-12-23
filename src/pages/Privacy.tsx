import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { breadcrumbSchema } from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Политика конфиденциальности"
        description="Политика конфиденциальности Quiet Bay. Узнайте, как мы защищаем ваши данные и обеспечиваем приватность."
        canonical="/privacy"
        structuredData={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: "Политика конфиденциальности", url: "/privacy" }
        ])}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8">
              Политика конфиденциальности
            </h1>
            
            <p className="text-muted-foreground mb-8">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Наше обязательство по защите конфиденциальности</h2>
              <p className="text-muted-foreground leading-relaxed">
                В Quiet Bay ваша конфиденциальность — основа всего, что мы делаем. Мы понимаем деликатный характер разговоров о психическом здоровье и построили нашу платформу с принципом «конфиденциальность прежде всего».
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Информация, которую мы собираем</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>Информация об аккаунте (email, имя пользователя)</li>
                <li>Данные разговоров (зашифрованы и хранятся безопасно)</li>
                <li>Аналитика использования (анонимизированная)</li>
                <li>Платёжная информация (обрабатывается безопасно нашим платёжным провайдером)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Как мы защищаем ваши данные</h2>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>Сквозное шифрование для всех разговоров</li>
                <li>Регулярные аудиты безопасности и обновления</li>
                <li>Строгий контроль доступа для нашей команды</li>
                <li>Соответствие GDPR и другим правилам конфиденциальности</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Ваши права</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Вы имеете право:</p>
              <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                <li>Получить доступ к своим персональным данным</li>
                <li>Удалить свой аккаунт и все связанные данные</li>
                <li>Экспортировать историю разговоров</li>
                <li>Отказаться от необязательных сообщений</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Передача данных</h2>
              <p className="text-muted-foreground leading-relaxed">
                Мы никогда не продаём ваши персональные данные третьим лицам. Мы можем делиться анонимизированными, агрегированными данными в исследовательских целях, но отдельные разговоры никогда не передаются.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Свяжитесь с нами</h2>
              <p className="text-muted-foreground leading-relaxed">
                По вопросам конфиденциальности или запросам обращайтесь к нашему специалисту по защите данных: privacyquietbay@gmail.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
