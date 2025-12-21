import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Политика конфиденциальности"
        description="Политика конфиденциальности Quiet Bay. Узнайте, как мы защищаем ваши данные."
        canonical="/privacy"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Политика конфиденциальности
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Наше обязательство по защите конфиденциальности
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  В Quiet Bay мы понимаем, что разговоры, которые вы ведёте с нами, глубоко личные. 
                  Ваша конфиденциальность — наш главный приоритет. Эта политика объясняет, как мы собираем, 
                  используем и защищаем вашу информацию.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Информация, которую мы собираем
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Мы минимизируем сбор данных для защиты вашей конфиденциальности:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li><strong>Данные разговоров:</strong> Сообщения, которыми обмениваются во время сессий (зашифрованы)</li>
                  <li><strong>Данные использования:</strong> Анонимная аналитика о том, как используется сервис</li>
                  <li><strong>Платёжная информация:</strong> Обрабатывается безопасно через Stripe (мы не храним данные карт)</li>
                  <li><strong>Данные аккаунта:</strong> Email-адрес, если вы создаёте аккаунт (опционально)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Как мы защищаем ваши данные
                </h2>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Все разговоры зашифрованы при передаче и хранении</li>
                  <li>Мы используем стандартные отраслевые меры безопасности</li>
                  <li>Мы не продаём и не передаём ваши личные данные третьим лицам</li>
                  <li>Разговоры не используются для обучения ИИ-моделей</li>
                  <li>Вы можете запросить удаление ваших данных в любое время</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Анонимное использование
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Вы можете использовать Quiet Bay без создания аккаунта или предоставления какой-либо личной информации. 
                  В этом случае ваши разговоры связаны только с временным идентификатором сессии, 
                  который не может быть привязан к вашей личности.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Хранение данных
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Для бесплатных пользователей данные разговоров автоматически удаляются через 24 часа. 
                  Премиум-подписчики могут выбрать сохранение истории разговоров для непрерывности, 
                  но могут удалить её в любое время.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Ваши права
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Вы имеете право:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Получить доступ к вашим личным данным</li>
                  <li>Запросить исправление ваших данных</li>
                  <li>Запросить удаление ваших данных</li>
                  <li>Экспортировать ваши данные</li>
                  <li>Отказаться от любых маркетинговых сообщений</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Файлы cookie
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Мы используем только необходимые cookies для работы сервиса. Мы не используем 
                  отслеживающие cookies или сторонние рекламные cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Свяжитесь с нами
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Если у вас есть вопросы о настоящей Политике конфиденциальности или вы хотите реализовать свои права, 
                  свяжитесь с нами: 
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

export default Privacy;
