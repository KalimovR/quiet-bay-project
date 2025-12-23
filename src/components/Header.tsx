import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Crown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  // Get IP address for conversation lookup
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch {
        setIpAddress(`local-${Math.random().toString(36).substring(7)}`);
      }
    };
    getIP();
  }, []);

  // Navigate to existing or new conversation
  const handleStartConversation = useCallback(async () => {
    if (!ipAddress) {
      navigate('/chat');
      return;
    }

    // Check if user has existing conversation
    const { data } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('ip_address', ipAddress)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.id) {
      // Go to existing conversation
      navigate(`/chat?conversation=${data.id}`);
    } else {
      // No existing conversation, go to chat to create new
      navigate('/chat');
    }
  }, [ipAddress, navigate]);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/feelings", label: "Состояния" },
    { href: "/support", label: "Поддержка" },
    { href: "/courses", label: "Курсы" },
    { href: "/pricing", label: "Тарифы" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">Q</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Quiet Bay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`text-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <Crown className="h-4 w-4 mr-2 text-amber-500" />
                      Админ
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link to="/account">
                    <User className="h-4 w-4 mr-2" />
                    Личный кабинет
                  </Link>
                </Button>
                <Button variant="hero" size="sm" onClick={handleStartConversation}>
                  Начать разговор
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Войти</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/chat">Начать бесплатно</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Открыть меню"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-sm py-2 transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm py-2 text-amber-500 hover:text-amber-400 flex items-center gap-2"
                    >
                      <Crown className="h-4 w-4" />
                      Админ-панель
                    </Link>
                  )}
                  <Link
                    to="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm py-2 text-muted-foreground hover:text-foreground flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Личный кабинет
                  </Link>
                  <Button variant="hero" size="sm" className="w-full mt-2" onClick={() => { setIsMenuOpen(false); handleStartConversation(); }}>
                    Начать разговор
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm py-2 text-muted-foreground hover:text-foreground"
                  >
                    Войти
                  </Link>
                  <Button variant="hero" size="sm" asChild className="w-full mt-2">
                    <Link to="/chat" onClick={() => setIsMenuOpen(false)}>Начать бесплатно</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
