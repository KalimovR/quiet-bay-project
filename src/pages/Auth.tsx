import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, Phone } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Неверный формат email");
const phoneSchema = z.string().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX");
const passwordSchema = z.string()
  .min(10, "Минимум 10 символов")
  .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, "Только латинские буквы, цифры и спецсимволы")
  .regex(/[A-Z]/, "Требуется хотя бы одна заглавная буква")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Требуется хотя бы один спецсимвол (!@#$%^&* и др.)");

const Auth = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Вход";
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  
  // Email auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Phone auth
  const [phone, setPhone] = useState("+7");
  const [phonePassword, setPhonePassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast.error(emailResult.error.errors[0].message);
      return;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast.error(passwordResult.error.errors[0].message);
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === "Invalid login credentials") {
            toast.error("Неверный email или пароль");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Добро пожаловать!");
          navigate("/");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: name,
            },
          },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("Этот email уже зарегистрирован");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Регистрация успешна! Добро пожаловать!");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Phone login with password (no OTP needed)
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      toast.error(phoneResult.error.errors[0].message);
      return;
    }
    
    const passwordResult = passwordSchema.safeParse(phonePassword);
    if (!passwordResult.success) {
      toast.error(passwordResult.error.errors[0].message);
      return;
    }
    
    setLoading(true);

    try {
      // Convert phone to fake email for login
      const fakeEmail = `${phone.replace('+', '')}@phone.local`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: phonePassword,
      });
      
      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("Неверный номер телефона или пароль");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Добро пожаловать!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Phone signup - send OTP first
  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      toast.error(phoneResult.error.errors[0].message);
      return;
    }
    
    const passwordResult = passwordSchema.safeParse(phonePassword);
    if (!passwordResult.success) {
      toast.error(passwordResult.error.errors[0].message);
      return;
    }
    
    setLoading(true);

    try {
      const response = await supabase.functions.invoke('send-sms-otp', {
        body: { 
          phone, 
          action: 'signup' 
        }
      });
      
      if (response.error) {
        toast.error(response.error.message || "Ошибка отправки SMS");
      } else if (response.data?.error) {
        toast.error(response.data.error);
      } else {
        setOtpSent(true);
        toast.success("Код отправлен на ваш телефон");
      }
    } catch (error) {
      toast.error("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast.error("Введите 6-значный код");
      return;
    }
    
    setLoading(true);

    try {
      const response = await supabase.functions.invoke('verify-sms-otp', {
        body: { 
          phone, 
          code: otpCode,
          action: 'signup',
          password: phonePassword,
          name: name || undefined
        }
      });
      
      if (response.error) {
        toast.error(response.error.message || "Ошибка проверки кода");
        return;
      }
      
      if (response.data?.error) {
        toast.error(response.data.error);
        return;
      }
      
      if (response.data?.needsLogin) {
        toast.info("Этот номер уже зарегистрирован. Войдите в аккаунт.");
        setIsLogin(true);
        resetPhoneAuth();
        return;
      }
      
      if (response.data?.success && response.data?.email) {
        // Sign in with the credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: response.data.email,
          password: phonePassword
        });
        
        if (signInError) {
          console.error('Sign in error:', signInError);
          toast.error("Ошибка входа. Попробуйте снова.");
          return;
        }
        
        toast.success("Регистрация успешна!");
        navigate("/");
      }
    } catch (error) {
      console.error('Phone verify error:', error);
      toast.error("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const resetPhoneAuth = () => {
    setOtpSent(false);
    setOtpCode("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                {isLogin ? "Вход в аккаунт" : "Создать аккаунт"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Войдите, чтобы продолжить общение" 
                  : "Присоединяйтесь к Quiet Bay"
                }
              </p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-card">
              <Tabs value={authMethod} onValueChange={(v) => { setAuthMethod(v as "email" | "phone"); resetPhoneAuth(); }}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Телефон
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form onSubmit={handleEmailSubmit} className="space-y-5">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Имя</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ваше имя"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@mail.ru"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">Пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Минимум 10 символов"
                          required
                          minLength={10}
                          className="pl-10"
                        />
                      </div>
                      {!isLogin && (
                        <p className="text-xs text-muted-foreground">
                          Мин. 10 символов, латинские буквы (обязательно заглавная) и спецсимвол (!@#$%^&*)
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Загрузка..." : (isLogin ? "Войти" : "Зарегистрироваться")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="phone">
                  {isLogin ? (
                    // LOGIN: phone + password only (no OTP)
                    <form onSubmit={handlePhoneLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="phoneLogin" className="text-foreground">Номер телефона</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phoneLogin"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (!val.startsWith("+7")) val = "+7";
                              if (val.length <= 12) setPhone(val);
                            }}
                            placeholder="+7XXXXXXXXXX"
                            required
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phonePasswordLogin" className="text-foreground">Пароль</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phonePasswordLogin"
                            type="password"
                            value={phonePassword}
                            onChange={(e) => setPhonePassword(e.target.value)}
                            placeholder="Ваш пароль"
                            required
                            minLength={10}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        variant="hero" 
                        size="lg" 
                        className="w-full"
                        disabled={loading || phone.length !== 12 || phonePassword.length < 10}
                      >
                        {loading ? "Вход..." : "Войти"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  ) : !otpSent ? (
                    // SIGNUP step 1: enter phone, name, password, then send OTP
                    <form onSubmit={handlePhoneSendOtp} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="phoneName" className="text-foreground">Имя</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phoneName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ваше имя"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneSignup" className="text-foreground">Номер телефона</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phoneSignup"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (!val.startsWith("+7")) val = "+7";
                              if (val.length <= 12) setPhone(val);
                            }}
                            placeholder="+7XXXXXXXXXX"
                            required
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          На этот номер будет отправлен код подтверждения
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phonePasswordSignup" className="text-foreground">Придумайте пароль</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phonePasswordSignup"
                            type="password"
                            value={phonePassword}
                            onChange={(e) => {
                              // Allow latin letters, numbers and special characters
                              const val = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "");
                              setPhonePassword(val);
                            }}
                            placeholder="Минимум 10 символов"
                            required
                            minLength={10}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Мин. 10 символов, латинские буквы (обязательно заглавная) и спецсимвол (!@#$%^&*)
                        </p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        variant="hero" 
                        size="lg" 
                        className="w-full"
                        disabled={loading || phone.length !== 12 || phonePassword.length < 10}
                      >
                        {loading ? "Отправка..." : "Получить код подтверждения"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  ) : (
                    // SIGNUP step 2: verify OTP
                    <form onSubmit={handlePhoneVerifyOtp} className="space-y-5">
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">
                          Код отправлен на номер
                        </p>
                        <p className="font-medium text-foreground">{phone}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-foreground">Код подтверждения</Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otpCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 6) setOtpCode(val);
                          }}
                          placeholder="000000"
                          required
                          maxLength={6}
                          className="text-center text-2xl tracking-widest"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        variant="hero" 
                        size="lg" 
                        className="w-full"
                        disabled={loading || otpCode.length !== 6}
                      >
                        {loading ? "Проверка..." : "Подтвердить и зарегистрироваться"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      
                      <button
                        type="button"
                        onClick={resetPhoneAuth}
                        className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Изменить данные
                      </button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
              
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); resetPhoneAuth(); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin 
                    ? "Нет аккаунта? Зарегистрироваться" 
                    : "Уже есть аккаунт? Войти"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Auth;
