import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Mail, User, FileText, ShieldCheck, Globe } from "lucide-react";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Контакты"
        description="Контактная информация Quiet Bay. Свяжитесь с нами по email."
        canonical="/contacts"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Контакты
            </h1>
            <p className="text-muted-foreground text-lg mb-12">
              Информация о продавце и способы связи
            </p>

            {/* Seller Info Card */}
            <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bay-surface to-bay-light" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">Quiet Bay</h2>
                  <p className="text-muted-foreground text-sm">Онлайн-сервис психологической поддержки</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Продавец</p>
                    <p className="text-foreground font-medium">Родионов Максим Иванович</p>
                    <p className="text-muted-foreground text-sm">Самозанятый (НПД)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ИНН</p>
                    <p className="text-foreground font-medium font-mono">662344394418</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-foreground/70" />
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

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Globe size={20} className="text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Тип услуг</p>
                    <p className="text-foreground font-medium">Цифровые продукты</p>
                    <p className="text-muted-foreground text-sm">Доступ после оплаты, без физической доставки</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Важная информация</h3>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    Quiet Bay — это онлайн-сервис эмоциональной поддержки с использованием ИИ. 
                    Сервис <strong>не является медицинской услугой</strong>. ИИ-ассистент не ставит диагнозы, 
                    не назначает лечение и не заменяет консультацию врача или психолога.
                  </p>
                  <p className="text-foreground/80 text-sm leading-relaxed mt-2">
                    В кризисных ситуациях рекомендуем обращаться за профессиональной помощью.
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-secondary/50 rounded-xl p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                Время ответа
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Мы стараемся отвечать на все обращения в течение 24 часов в рабочие дни. 
                По вопросам оплаты и возврата — в течение 48 часов.
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