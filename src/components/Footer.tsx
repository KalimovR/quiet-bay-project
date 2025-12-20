import { Link } from "react-router-dom";
import { Send } from "lucide-react";


const Footer = () => {
  return (
    <footer className="bg-bay-fog/30 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-primary" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Quiet Bay
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Тихое место для разговора. Когда вам это нужно больше всего. 
              Информационная поддержка и образовательные материалы по медитации.
            </p>
          </div>
        
          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Навигация
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Курсы
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Получение услуги
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Начать разговор
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Правовая информация
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/offer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Отказ от ответственности
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Контакты и реквизиты
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom footer bar */}
<div className="mt-10 pt-6 border-t border-border/50 flex items-center justify-between">
  <span className="text-sm text-muted-foreground">
    © Quiet Bay, {new Date().getFullYear()}
  </span>

  <a
    href="https://t.me/QuietBayUR"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Telegram Quiet Bay"
    className="inline-flex items-center justify-center rounded-full
               text-muted-foreground transition-all
               hover:text-blue-500 hover:scale-110"
  >
    <Send className="h-5 w-5" />
  </a>
</div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            ⚠️ Quiet Bay предоставляет информационные услуги и образовательные материалы. 
            Платформа не является медицинским сервисом и не заменяет профессиональную помощь. 
            При наличии проблем со здоровьем обратитесь к специалисту. Возрастное ограничение: 18+
          </p>
          <p className="text-xs text-muted-foreground text-center mt-4">
            © {new Date().getFullYear()} Quiet Bay. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
