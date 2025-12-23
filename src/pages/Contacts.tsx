import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, FileText, MapPin } from "lucide-react";
import SEO, { breadcrumbSchema } from "@/components/SEO";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Контакты"
        description="Контактная информация и реквизиты Quiet Bay. Свяжитесь с нами по email или найдите юридическую информацию."
        canonical="/contacts"
        structuredData={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: "Контакты", url: "/contacts" }
        ])}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
              Контакты и реквизиты
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              Информация о продавце для связи и юридические реквизиты
            </p>

            {/* Seller Information Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  Информация о продавце
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-foreground">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">ФИО продавца</p>
                      <p className="font-medium">Родионов Максим Иванович</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Статус</p>
                      <p className="font-medium">Самозанятый (НПД)</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">ИНН</p>
                    </div>
                    <p className="font-mono text-xl font-bold text-primary">662344394418</p>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Email для связи</p>
                    </div>
                    <a 
                      href="mailto:maksimrodural@icloud.com" 
                      className="font-medium text-primary hover:underline"
                    >
                      maksimrodural@icloud.com
                    </a>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Страна</p>
                    </div>
                    <p className="font-medium">Российская Федерация</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Notice */}
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Правовой статус:</strong> Деятельность осуществляется 
                  в соответствии с Федеральным законом от 27.11.2018 № 422-ФЗ «О проведении эксперимента 
                  по установлению специального налогового режима "Налог на профессиональный доход"». 
                  Продавец зарегистрирован в качестве плательщика налога на профессиональный доход (самозанятый).
                </p>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/terms" className="p-4 bg-card/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors text-center">
                <p className="font-medium text-foreground">Публичная оферта</p>
                <p className="text-sm text-muted-foreground">Условия оказания услуг</p>
              </a>
              <a href="/delivery" className="p-4 bg-card/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors text-center">
                <p className="font-medium text-foreground">Получение услуги</p>
                <p className="text-sm text-muted-foreground">Порядок доступа</p>
              </a>
              <a href="/privacy" className="p-4 bg-card/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors text-center">
                <p className="font-medium text-foreground">Конфиденциальность</p>
                <p className="text-sm text-muted-foreground">Защита данных</p>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contacts;
