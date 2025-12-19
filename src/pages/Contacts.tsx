import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, User, FileText } from "lucide-react";

const Contacts = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Контакты";
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-8">
              Контакты и реквизиты
            </h1>
            
            <div className="bg-card rounded-2xl border border-border/50 p-8 mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Информация о продавце
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Продавец</p>
                    <p className="text-foreground font-medium">Родионов Максим Иванович</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Статус</p>
                    <p className="text-foreground font-medium">Самозанятый (налог на профессиональный доход, НПД)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ИНН</p>
                    <p className="text-foreground font-medium text-lg">662344394418</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email для связи</p>
                    <a 
                      href="mailto:maksimrodural@icloud.com" 
                      className="text-primary hover:underline font-medium"
                    >
                      maksimrodural@icloud.com
                    </a>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Страна: Российская Федерация
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-bay-fog/20 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                По всем вопросам, связанным с использованием сервиса, оплатой и возвратом средств, 
                вы можете связаться с нами по указанному email. Мы отвечаем в течение 24 часов.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contacts;
