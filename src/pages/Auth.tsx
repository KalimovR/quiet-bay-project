import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailExistsDialogOpen, setEmailExistsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Вы успешно вошли!");
        navigate("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;
        
        // Check if user already exists (Supabase returns user with identities = [] for existing email)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setEmailExistsDialogOpen(true);
          setIsLoading(false);
          return;
        }
        
        // Update username in profile
        if (data.user && username) {
          await supabase
            .from("profiles")
            .update({ username })
            .eq("id", data.user.id);
        }
        
        toast.success("Регистрация успешна! Добро пожаловать!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle specific error messages
      const errorMsg = error.message?.toLowerCase() || "";
      
      if (errorMsg.includes("invalid login credentials")) {
        toast.error("Неверный email или пароль");
      } else if (errorMsg.includes("user already registered") || errorMsg.includes("already been registered")) {
        setEmailExistsDialogOpen(true);
      } else if (errorMsg.includes("email rate limit")) {
        toast.error("Слишком много попыток. Попробуйте позже.");
      } else if (errorMsg.includes("password")) {
        toast.error("Пароль должен содержать минимум 6 символов");
      } else {
        toast.error(error.message || "Произошла ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    setEmailExistsDialogOpen(false);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Назад на главную</span>
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bay-surface to-bay-deep flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-seafoam animate-pulse-soft" />
          </div>
          <span className="font-heading text-2xl font-semibold text-foreground">
            Quiet Bay
          </span>
        </div>

        {/* Form card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
          <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">
            {isLogin ? "Вход в аккаунт" : "Регистрация"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {isLogin 
              ? "Войдите, чтобы получить доступ к личному кабинету" 
              : "Создайте аккаунт для доступа ко всем функциям"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ваше имя"
                  className="mt-1"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1"
              />
            </div>

            <Button 
              type="submit" 
              variant="bay" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Вход..." : "Регистрация..."}
                </>
              ) : (
                isLogin ? "Войти" : "Зарегистрироваться"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin 
                ? "Нет аккаунта? Зарегистрируйтесь" 
                : "Уже есть аккаунт? Войдите"}
            </button>
          </div>
        </div>
      </div>

      {/* Email already exists dialog */}
      <AlertDialog open={emailExistsDialogOpen} onOpenChange={setEmailExistsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle>Email уже используется</AlertDialogTitle>
            <AlertDialogDescription>
              Пользователь с email <strong>{email}</strong> уже зарегистрирован в системе. 
              Попробуйте войти в существующий аккаунт или используйте другой email для регистрации.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEmailExistsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Использовать другой email
            </Button>
            <AlertDialogAction onClick={handleSwitchToLogin} className="w-full sm:w-auto">
              Войти в аккаунт
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Auth;
