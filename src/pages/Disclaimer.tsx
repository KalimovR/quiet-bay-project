import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { AlertTriangle, Phone } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Медицинский отказ"
        description="Медицинский отказ от ответственности. Quiet Bay — это сервис эмоциональной поддержки, а не медицинская услуга."
        canonical="/disclaimer"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Медицинский отказ от ответственности
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Пожалуйста, внимательно прочитайте этот отказ от ответственности перед использованием Quiet Bay.
              </p>

              {/* Critical Alert */}
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                      Quiet Bay НЕ является медицинским сервисом
                    </h3>
                    <p className="text-foreground/80 text-sm">
                      Это инструмент эмоциональной поддержки на базе ИИ. Он не предоставляет медицинские советы, 
                      диагнозы или лечение.
                    </p>
                  </div>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Что такое Quiet Bay
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Quiet Bay — это разговорный инструмент на базе ИИ, созданный для предоставления:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Эмоциональной поддержки и присутствия слушателя</li>
                  <li>Общей информации об эмоциональном благополучии</li>
                  <li>Успокаивающих упражнений и техник дыхания</li>
                  <li>Безопасного пространства для выражения ваших мыслей и чувств</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Чем Quiet Bay НЕ является
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Quiet Bay НЕ является и никогда не должен рассматриваться как:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li><strong>Врач или терапевт</strong></li>
                  <li><strong>Психиатр</strong></li>
                  <li><strong>Лицензированный психолог или психотерапевт</strong></li>
                  <li><strong>Консультант или специалист по психическому здоровью</strong></li>
                  <li><strong>Экстренная или кризисная служба</strong></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Quiet Bay не может
                </h2>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Диагностировать любые медицинские или психические расстройства</li>
                  <li>Назначать лекарства или лечение</li>
                  <li>Предоставлять психотерапию или клиническое лечение</li>
                  <li>Заменить профессиональную помощь в области психического здоровья</li>
                  <li>Предоставлять кризисное вмешательство</li>
                  <li>Гарантировать какие-либо конкретные результаты</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Когда обращаться за профессиональной помощью
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Пожалуйста, обратитесь к квалифицированному специалисту по психическому здоровью, если вы испытываете:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Постоянные чувства депрессии или безнадёжности</li>
                  <li>Сильную тревогу, мешающую повседневной жизни</li>
                  <li>Мысли о самоповреждении или суициде</li>
                  <li>Проблемы со злоупотреблением веществами</li>
                  <li>Симптомы травмы или ПТСР</li>
                  <li>Расстройства пищевого поведения</li>
                  <li>Любые другие серьёзные проблемы с психическим здоровьем</li>
                </ul>
              </section>

              {/* Crisis Resources */}
              <div className="bg-secondary rounded-xl p-6 mb-8">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Кризисные ресурсы
                </h3>
                <p className="text-foreground/80 text-sm mb-4">
                  Если вы в кризисе или думаете о самоповреждении, пожалуйста, свяжитесь:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-primary" />
                    <span className="text-foreground/80">
                      <strong>Экстренные службы:</strong> 112 или местный номер экстренной помощи
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-primary" />
                    <span className="text-foreground/80">
                      <strong>Телефон доверия:</strong> 8-800-2000-122 (бесплатно по России)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-primary" />
                    <span className="text-foreground/80">
                      <strong>Центр экстренной психологической помощи МЧС:</strong> 8-499-216-50-50
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-primary" />
                    <span className="text-foreground/80">
                      <strong>Линия помощи детям и подросткам:</strong> 8-800-2000-122
                    </span>
                  </div>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Ваша ответственность
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Используя Quiet Bay, вы подтверждаете, что:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-4">
                  <li>Вам не менее 18 лет</li>
                  <li>Вы понимаете, что это не медицинский сервис</li>
                  <li>Вы обратитесь за профессиональной помощью при серьёзных проблемах</li>
                  <li>Вы свяжетесь с экстренными службами, если находитесь в кризисе</li>
                  <li>Вы берёте на себя полную ответственность за свои решения и действия</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Ограничение ответственности
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Quiet Bay, его создатели и партнёры не несут ответственности за любой вред, травмы или 
                  ущерб, которые могут возникнуть в результате использования или невозможности использования 
                  этого сервиса. Сервис предоставляется «как есть» без каких-либо гарантий. 
                  Вы используете Quiet Bay на свой страх и риск.
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

export default Disclaimer;
