import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

// Custom social icons as Lucide doesn't have VK and Rutube
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const VKIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.712-1.033-1.033-1.49-1.173-1.744-1.173-.356 0-.458.102-.458.593v1.562c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.169-3.048-2.763-5.331-2.763-5.8 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
  </svg>
);

const RutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 12.894l-7.447 4.894c-.447.295-.894.074-.894-.447V6.66c0-.521.447-.742.894-.447l7.447 4.894c.447.295.447.742 0 1.037v-.25z"/>
  </svg>
);

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">Q</span>
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">Quiet Bay</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Информационные услуги и образовательные материалы для вашего благополучия.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">Продукт</h4>
            <ul className="space-y-2">
              <li><Link to="/courses" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Курсы и цены</Link></li>
              <li><Link to="/pricing" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Тарифы</Link></li>
              <li><Link to="/delivery" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Получение услуги</Link></li>
              <li><Link to="/chat" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Чат с ассистентом</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">Документы</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Публичная оферта</Link></li>
              <li><Link to="/privacy" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Политика конфиденциальности</Link></li>
              <li><Link to="/disclaimer" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Медицинский отказ</Link></li>
              <li><Link to="/contacts" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Контакты и реквизиты</Link></li>
              <li><Link to="/safety" onClick={scrollToTop} className="text-muted-foreground hover:text-primary text-sm transition-colors">Безопасность и FAQ</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-4">Социальные сети</h4>
            <div className="flex items-center gap-4 mb-4">
              <a 
                href="https://t.me/QuietBayUR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Telegram"
              >
                <TelegramIcon className="w-6 h-6" />
              </a>
              <Link 
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-6 h-6" />
              </Link>
              <Link 
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="VK"
              >
                <VKIcon className="w-6 h-6" />
              </Link>
              <Link 
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Rutube"
              >
                <RutubeIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>

        </div>


        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Quiet Bay. Все права защищены.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Создано с <Heart className="w-4 h-4 text-primary" /> для вашего благополучия
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Важно:</strong> Тихая Бухта предоставляет информационные и образовательные услуги. 
            Сервис не является медицинской услугой и не заменяет профессиональную помощь специалистов.
            Все продукты являются цифровыми. Доставка в физическом виде не осуществляется.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
