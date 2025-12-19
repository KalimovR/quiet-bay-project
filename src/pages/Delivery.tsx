import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Clock, Mail, User, CheckCircle } from "lucide-react";

const Delivery = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Получение услуги";
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Информация о получении услуги
            </h1>
            
            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Формат предоставления услуг
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Все услуги и продукты на платформе Quiet Bay предоставляются исключительно 
                  в электронном виде. Доставка в физическом виде не осуществляется.
                </p>
                <div className="bg-accent/10 rounded-lg p-4 mb-4">
                  <p className="text-foreground font-medium">
                    Продукт является цифровым. Доставка в физическом виде не осуществляется.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Способы получения доступа
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Доступ в личном кабинете</h3>
                      <p className="text-sm text-muted-foreground">
                        После оплаты все материалы курса становятся доступны в вашем личном кабинете 
                        на сайте. Вы можете просматривать их в любое удобное время.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Уведомление по email</h3>
                      <p className="text-sm text-muted-foreground">
                        После успешной оплаты вы получите подтверждение на указанный при регистрации 
                        email с инструкциями по доступу к материалам.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Сроки предоставления доступа
                </h2>
                
                <div className="flex items-start gap-4 p-6 bg-accent/10 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Автоматическое предоставление доступа</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Доступ к материалам предоставляется автоматически в течение 24 часов после оплаты. 
                      В большинстве случаев доступ открывается мгновенно после подтверждения платежа.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Что входит в услугу
                </h2>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Доступ к видеоурокам онлайн-курса</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Образовательные материалы по медитации и осознанности</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Бессрочный доступ к приобретённым материалам</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Возможность просмотра на любом устройстве</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  Техническая поддержка
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Если у вас возникли проблемы с доступом к материалам после оплаты, 
                  пожалуйста, свяжитесь с нами по email:{" "}
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

export default Delivery;
