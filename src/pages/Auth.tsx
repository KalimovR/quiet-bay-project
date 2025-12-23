import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Введите корректный email");
const passwordSchema = z.string().min(6, "Пароль должен быть минимум 6 символов");
const nameSchema = z.string().min(2, "Имя должно быть минимум 2 символа").max(50, "Имя слишком длинное");

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; age?: string }>({});
  const [emailExistsDialogOpen, setEmailExistsDialogOpen] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateSignInForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUpForm = () => {
    const newErrors: { email?: string; password?: string; name?: string; age?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    try {
      nameSchema.parse(displayName);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.name = e.errors[0].message;
      }
    }

    if (!isAdult) {
      newErrors.age = "Необходимо подтвердить, что вам есть 18 лет";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignInForm()) return;
    
    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: error.message === "Invalid login credentials" 
          ? "Неверный email или пароль" 
          : error.message,
      });
    } else {
      // Migrate any guest conversations to user account
      const { data: { user: loggedInUser } } = await supabase.auth.getUser();
      if (loggedInUser) {
        await migrateConversationsToUser(loggedInUser.id);
      }
      setIsLoading(false);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в систему",
      });
      navigate("/");
    }
  };

  const migrateConversationsToUser = async (userId: string) => {
    try {
      // Get user's IP address
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip;

      // Migrate conversations from IP to user_id
      const { data, error } = await supabase.rpc('migrate_ip_conversations_to_user', {
        _user_id: userId,
        _ip_address: ipAddress
      });

      if (error) {
        console.error("Error migrating conversations:", error);
      } else if (data && data > 0) {
        console.log(`Migrated ${data} conversations to user account`);
      }
    } catch (err) {
      console.error("Failed to migrate conversations:", err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUpForm()) return;
    
    setIsLoading(true);
    const { error } = await signUp(email, password);
    
    if (error) {
      setIsLoading(false);
      
      // Check if user already exists
      if (error.message.includes("already registered") || 
          error.message.includes("User already registered") ||
          error.message.includes("already been registered")) {
        setEmailExistsDialogOpen(true);
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: error.message,
      });
    } else {
      // Update profile with display name
      const { data: { user: newUser } } = await supabase.auth.getUser();
      if (newUser) {
        await supabase
          .from("profiles")
          .update({ display_name: displayName })
          .eq("id", newUser.id);
        
        // Migrate chat conversations from IP to user account
        await migrateConversationsToUser(newUser.id);
      }
      setIsLoading(false);
      toast({
        title: "Регистрация успешна!",
        description: `Добро пожаловать, ${displayName}!`,
      });
      navigate("/");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(resetEmail);
    } catch {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите корректный email",
      });
      return;
    }
    
    setIsResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setIsResetting(false);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } else {
      toast({
        title: "Письмо отправлено",
        description: "Проверьте вашу почту для восстановления пароля",
      });
      setShowResetPassword(false);
      setResetEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-serif font-bold text-xl">Q</span>
            </div>
            <CardTitle className="font-serif text-2xl">Личный кабинет</CardTitle>
            <CardDescription>Войдите или создайте аккаунт</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                {showResetPassword ? (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-foreground">Восстановление пароля</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Введите email, на который зарегистрирован аккаунт
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isResetting}>
                      {isResetting ? "Отправка..." : "Отправить ссылку"}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setShowResetPassword(false)}
                    >
                      Вернуться ко входу
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Вход..." : "Войти"}
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Забыли пароль?
                    </button>
                  </form>
                )}
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Ваше имя</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Как вас называть?"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Минимум 6 символов"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="age-confirmation"
                        checked={isAdult}
                        onCheckedChange={(checked) => setIsAdult(checked === true)}
                        className="mt-0.5"
                      />
                      <Label 
                        htmlFor="age-confirmation" 
                        className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                      >
                        Мне исполнилось 18 лет
                      </Label>
                    </div>
                    {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      {/* Email Already Exists Dialog */}
      <Dialog open={emailExistsDialogOpen} onOpenChange={setEmailExistsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <DialogTitle>Email уже занят</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Пользователь с email <strong className="text-foreground">{email}</strong> уже зарегистрирован в системе.
              <br /><br />
              Если это ваш аккаунт, попробуйте войти, используя вкладку «Вход».
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setEmailExistsDialogOpen(false)}
            >
              Понятно
            </Button>
            <Button 
              onClick={() => {
                setEmailExistsDialogOpen(false);
                // Switch to sign in tab programmatically
                const signinTab = document.querySelector('[value="signin"]') as HTMLButtonElement;
                signinTab?.click();
              }}
            >
              Перейти ко входу
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Auth;
