import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

const Disclaimer = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Отказ от ответственности";
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
                Отказ от ответственности
              </h1>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
              </p>

              <div className="p-6 rounded-xl bg-bay-warm border border-destructive/20 mb-8">
                <p className="text-foreground font-medium mb-4">
                  ⚠️ ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Quiet Bay не является медицинским сервисом. ИИ-психолог оказывает исключительно 
                  информационную и эмоциональную поддержку и не заменяет профессиональную 
                  психологическую или медицинскую помощь.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Характер услуг
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ИИ-психолог Quiet Bay:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>НЕ является врачом, психиатром или клиническим психологом</li>
                  <li>НЕ имеет права ставить медицинские диагнозы</li>
                  <li>НЕ имеет права назначать лекарства или лечение</li>
                  <li>НЕ заменяет профессиональную помощь</li>
                  <li>НЕ является службой экстренной помощи</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Сервис предназначен исключительно для информационной и эмоциональной поддержки 
                  в повседневных ситуациях стресса, тревожности и эмоционального напряжения.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Когда обратиться к специалисту
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Вам следует обратиться к квалифицированному специалисту, если вы:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Испытываете серьёзные психологические проблемы</li>
                  <li>Страдаете от депрессии или тревожных расстройств</li>
                  <li>Имеете мысли о самоповреждении или суициде</li>
                  <li>Нуждаетесь в медикаментозном лечении</li>
                  <li>Переживаете острую психологическую травму</li>
                  <li>Находитесь в кризисной ситуации</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Кризисные ситуации
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Если вы или кто-то из ваших близких находится в кризисной ситуации, 
                  испытывает мысли о самоповреждении или суициде:
                </p>
                <div className="p-4 rounded-lg bg-bay-fog mb-4">
                  <p className="text-foreground font-medium mb-2">
                    Телефон доверия: 8-800-2000-122
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Бесплатно по России, круглосуточно
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-bay-fog">
                  <p className="text-foreground font-medium mb-2">
                    Экстренные службы: 112
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Единый номер вызова экстренных служб
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Ограничение ответственности
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Quiet Bay и его создатели:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Не несут ответственности за решения, принятые на основе информации от ИИ</li>
                  <li>Не гарантируют точность или полноту предоставляемой информации</li>
                  <li>Не несут ответственности за любой ущерб, связанный с использованием сервиса</li>
                  <li>Не несут ответственности за последствия отказа от профессиональной помощи</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Возрастное ограничение
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Сервис Quiet Bay предназначен для лиц старше 18 лет. Используя сервис, 
                  вы подтверждаете достижение совершеннолетия.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Согласие
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Используя Quiet Bay, вы подтверждаете, что прочитали и поняли настоящий 
                  Отказ от ответственности и соглашаетесь с его условиями.
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
