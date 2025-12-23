import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Heart, Phone, ShieldAlert, UserCheck, Scale, HelpCircle, XCircle } from "lucide-react";
import SEO, { breadcrumbSchema } from "@/components/SEO";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Отказ от ответственности"
        description="Медицинский отказ от ответственности Quiet Bay. ИИ-ассистент не заменяет профессиональную психологическую помощь."
        canonical="/disclaimer"
        structuredData={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: "Отказ от ответственности", url: "/disclaimer" }
        ])}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
                <ShieldAlert className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                Медицинский отказ от ответственности
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Пожалуйста, внимательно прочитайте этот отказ от ответственности перед использованием Quiet Bay.
              </p>
            </div>

            {/* Main Warning */}
            <Card className="bg-destructive/5 border-destructive/20 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                      Quiet Bay НЕ является медицинским сервисом
                    </h2>
                    <p className="text-muted-foreground">
                      Это инструмент эмоциональной поддержки на базе ИИ. Он не предоставляет медицинские советы, диагнозы или лечение.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Quiet Bay Is */}
            <Card className="bg-primary/5 border-primary/20 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                      Что такое Quiet Bay
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Quiet Bay — это разговорный инструмент на базе ИИ, созданный для предоставления:
                    </p>
                    <ul className="space-y-2 text-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Эмоциональной поддержки и присутствия слушателя
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Общей информации об эмоциональном благополучии
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Успокаивающих упражнений и техник дыхания
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Безопасного пространства для выражения ваших мыслей и чувств
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Quiet Bay Is NOT */}
            <Card className="bg-card border-border mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                      Чем Quiet Bay НЕ является
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Quiet Bay НЕ является и никогда не должен рассматриваться как:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Врач или терапевт",
                        "Психиатр",
                        "Лицензированный психолог или психотерапевт",
                        "Консультант или специалист по психическому здоровью",
                        "Экстренная или кризисная служба"
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                          <span className="text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Quiet Bay Cannot Do */}
            <Card className="bg-card border-border mb-8">
              <CardContent className="pt-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Quiet Bay не может
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Диагностировать любые медицинские или психические расстройства",
                    "Назначать лекарства или лечение",
                    "Предоставлять психотерапию или клиническое лечение",
                    "Заменить профессиональную помощь в области психического здоровья",
                    "Предоставлять кризисное вмешательство",
                    "Гарантировать какие-либо конкретные результаты"
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                      <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* When to Seek Help */}
            <Card className="bg-accent/5 border-accent/20 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                      Когда обращаться за профессиональной помощью
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Пожалуйста, обратитесь к квалифицированному специалисту по психическому здоровью, если вы испытываете:
                    </p>
                    <ul className="space-y-2 text-foreground">
                      {[
                        "Постоянные чувства депрессии или безнадёжности",
                        "Сильную тревогу, мешающую повседневной жизни",
                        "Мысли о самоповреждении или суициде",
                        "Проблемы со злоупотреблением веществами",
                        "Симптомы травмы или ПТСР",
                        "Расстройства пищевого поведения",
                        "Любые другие серьёзные проблемы с психическим здоровьем"
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crisis Resources */}
            <Card className="bg-destructive/5 border-destructive/20 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="w-full">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                      Кризисные ресурсы
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Если вы в кризисе или думаете о самоповреждении, пожалуйста, свяжитесь:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background rounded-lg border border-destructive/20">
                        <p className="text-sm text-muted-foreground mb-1">Экстренные службы</p>
                        <p className="font-mono text-xl font-bold text-destructive">112</p>
                        <p className="text-xs text-muted-foreground">или местный номер экстренной помощи</p>
                      </div>
                      <div className="p-4 bg-background rounded-lg border border-destructive/20">
                        <p className="text-sm text-muted-foreground mb-1">Телефон доверия</p>
                        <p className="font-mono text-xl font-bold text-destructive">8-800-2000-122</p>
                        <p className="text-xs text-muted-foreground">бесплатно по России</p>
                      </div>
                      <div className="p-4 bg-background rounded-lg border border-destructive/20">
                        <p className="text-sm text-muted-foreground mb-1">Центр экстренной психологической помощи МЧС</p>
                        <p className="font-mono text-xl font-bold text-destructive">8-499-216-50-50</p>
                      </div>
                      <div className="p-4 bg-background rounded-lg border border-destructive/20">
                        <p className="text-sm text-muted-foreground mb-1">Линия помощи детям и подросткам</p>
                        <p className="font-mono text-xl font-bold text-destructive">8-800-2000-122</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Responsibility */}
            <Card className="bg-card border-border mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                      Ваша ответственность
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Используя Quiet Bay, вы подтверждаете, что:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Вам не менее 18 лет",
                        "Вы понимаете, что это не медицинский сервис",
                        "Вы обратитесь за профессиональной помощью при серьёзных проблемах",
                        "Вы свяжетесь с экстренными службами, если находитесь в кризисе",
                        "Вы берёте на себя полную ответственность за свои решения и действия"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="bg-muted/30 border-border">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                      Ограничение ответственности
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Quiet Bay, его создатели и партнёры не несут ответственности за любой вред, травмы или ущерб, 
                      которые могут возникнуть в результате использования или невозможности использования этого сервиса. 
                      Сервис предоставляется «как есть» без каких-либо гарантий. Вы используете Quiet Bay на свой страх и риск.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimer;
