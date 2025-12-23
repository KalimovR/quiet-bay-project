import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Mail, Monitor, User, Zap } from "lucide-react";
import SEO, { breadcrumbSchema } from "@/components/SEO";

const Delivery = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Доставка"
        description="Информация о получении цифровых продуктов Quiet Bay. Мгновенный доступ после оплаты, без физической доставки."
        canonical="/delivery"
        structuredData={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: "Доставка", url: "/delivery" }
        ])}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
              Информация о получении услуги
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              Порядок предоставления доступа к цифровым продуктам
            </p>

            {/* Important Notice */}
            <Card className="bg-primary/5 border-primary/20 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Цифровой продукт</h3>
                    <p className="text-muted-foreground">
                      Все продукты и услуги предоставляются в электронном виде. 
                      <strong className="text-foreground"> Доставка в физическом виде не осуществляется.</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Methods */}
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Способы получения доступа
            </h2>
            
            <div className="grid gap-4 mb-8">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Личный кабинет</h3>
                      <p className="text-muted-foreground text-sm">
                        После оплаты доступ к курсам и материалам автоматически появляется 
                        в вашем личном кабинете на сайте. Вы можете просматривать материалы 
                        в любое удобное время.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Email-уведомление</h3>
                      <p className="text-muted-foreground text-sm">
                        На указанный при регистрации email будет отправлено подтверждение 
                        оплаты и инструкция по доступу к приобретённым материалам.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Мгновенная активация</h3>
                      <p className="text-muted-foreground text-sm">
                        Подписки на сервис активируются автоматически сразу после 
                        подтверждения оплаты. Вы можете сразу начать пользоваться 
                        всеми возможностями.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card className="bg-card/50 border-border/50 mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-xl flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  Сроки предоставления доступа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-foreground">
                      <strong>Автоматически</strong> — в течение нескольких минут после подтверждения оплаты
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-foreground">
                      <strong>Максимальный срок</strong> — не более 24 часов с момента оплаты
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Гарантия:</strong> Доступ к материалам предоставляется 
                      автоматически в течение 24 часов после оплаты. В случае возникновения технических 
                      проблем, свяжитесь с нами по email: <a href="mailto:maksimrodural@icloud.com" className="text-primary hover:underline">maksimrodural@icloud.com</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You Get */}
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Что вы получаете
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-3">Онлайн-курсы</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Видео и аудио материалы
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Бессрочный доступ после покупки
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Просмотр с любого устройства
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-3">Подписки</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Доступ к сервису на период подписки
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Автоматическое продление (опционально)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Возможность отмены в любое время
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact */}
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-2">
                  Возникли вопросы по получению доступа?
                </p>
                <a 
                  href="mailto:maksimrodural@icloud.com" 
                  className="text-primary hover:underline font-medium"
                >
                  maksimrodural@icloud.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Delivery;
