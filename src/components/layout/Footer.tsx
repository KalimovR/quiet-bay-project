import { Link } from "react-router-dom";
import { Youtube } from "lucide-react";

// Custom VK icon
const VKIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.597v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.847 2.49 2.27 4.675 2.853 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.491-.085.745-.576.745z"/>
  </svg>
);

// Custom Telegram icon
const TelegramIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// Custom Rutube icon
const RutubeIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 12.894l-7.447 4.447c-.447.268-.947-.067-.947-.553V7.212c0-.486.5-.821.947-.553l7.447 4.447c.447.268.447.894 0 1.162z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-dusk text-primary-foreground/80 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bay-surface to-bay-light flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-seafoam" />
              </div>
              <span className="font-heading text-2xl font-semibold text-primary-foreground">
                Quiet Bay
              </span>
            </div>
            <p className="text-primary-foreground/60 max-w-sm leading-relaxed">
              Тихое место для разговора. Когда вам это нужно больше всего. 
              Безопасно, анонимно и всегда рядом.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-primary-foreground">
              Навигация
            </h4>
            <nav className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Главная
              </Link>
              <Link 
                to="/pricing" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Цены
              </Link>
              <Link 
                to="/faq" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Вопросы и безопасность
              </Link>
              <Link 
                to="/chat" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Начать разговор
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-primary-foreground">
              Документы
            </h4>
            <nav className="flex flex-col gap-3">
              <Link 
                to="/terms" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Пользовательское соглашение
              </Link>
              <Link 
                to="/privacy" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Политика конфиденциальности
              </Link>
              <Link 
                to="/payment-terms" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Условия оплаты и возврата
              </Link>
              <Link 
                to="/disclaimer" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Медицинский отказ
              </Link>
              <Link 
                to="/contacts" 
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
              >
                Контакты
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-primary-foreground">
              Социальные сети
            </h4>
            <div className="flex items-center gap-4">
              <a 
                href="https://t.me/QuietBayUR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all"
                aria-label="Telegram"
              >
                <TelegramIcon size={20} />
              </a>
              <Link 
                to="/"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </Link>
              <Link 
                to="/"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all"
                aria-label="VK"
              >
                <VKIcon size={20} />
              </Link>
              <Link 
                to="/"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all"
                aria-label="Rutube"
              >
                <RutubeIcon size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-primary-foreground/10 pt-8 mb-8">
          <div className="bg-primary-foreground/5 rounded-lg p-4 border border-primary-foreground/10">
            <p className="text-xs text-primary-foreground/50 leading-relaxed">
              <strong className="text-primary-foreground/70">Важно:</strong> Quiet Bay не является медицинским сервисом. 
              Наш ИИ предоставляет только информационную и эмоциональную поддержку. Он не врач, не психиатр 
              и не лицензированный терапевт. Он не может ставить диагнозы и назначать лечение. 
              В экстренных ситуациях или при кризисных состояниях немедленно обратитесь в службу экстренной помощи или на линию доверия.
              Возрастное ограничение: 18+
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/40">
          <p>© {new Date().getFullYear()} Quiet Bay. Все права защищены.</p>
          <p>Создано с заботой о вашем благополучии.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
