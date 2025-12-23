import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Страница не найдена"
        description="Запрашиваемая страница не существует. Вернитесь на главную или начните разговор с ИИ-ассистентом."
        noindex={true}
      />
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="font-serif text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
              Страница не найдена
            </h2>
            <p className="text-muted-foreground mb-8">
              К сожалению, запрашиваемая страница не существует или была перемещена. 
              Попробуйте вернуться на главную или начните разговор с нашим ассистентом.
            </p>
            
            <nav className="flex flex-col sm:flex-row items-center justify-center gap-4" aria-label="Навигация">
              <Button variant="hero" size="lg" asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  На главную
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/chat">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Начать чат
                </Link>
              </Button>
            </nav>
            
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Полезные ссылки:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/pricing" className="text-primary hover:underline">Тарифы</Link>
                <Link to="/courses" className="text-primary hover:underline">Курсы</Link>
                <Link to="/safety" className="text-primary hover:underline">Безопасность</Link>
                <Link to="/contacts" className="text-primary hover:underline">Контакты</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
