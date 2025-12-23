import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CreditCard, BookOpen, Eye, EyeOff, Lock, Mail, Calendar, Clock, Camera, User, CheckCircle, Play, LogOut, Brain, MessageSquare, Trash2 } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  activated_at: string;
  expires_at: string;
  cancelled_at: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  lesson_number: number;
  purchased_at?: string;
  progress?: {
    progress_percent: number;
    completed: boolean;
  };
}

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

interface UserMemory {
  id: string;
  memory_type: string;
  content: string;
  importance: number;
  created_at: string;
}

interface SessionSummary {
  id: string;
  emotional_state: string | null;
  summary: string;
  key_themes: string[] | null;
  session_date: string;
  message_count: number;
  duration_minutes: number | null;
}

const passwordSchema = z.string().min(6, "Пароль должен быть минимум 6 символов");
const emailSchema = z.string().email("Введите корректный email");
const nameSchema = z.string().min(2, "Имя должно быть минимум 2 символа").max(50, "Имя слишком длинное");

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<Profile>({ display_name: null, avatar_url: null });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [userMemories, setUserMemories] = useState<UserMemory[]>([]);
  const [sessionSummaries, setSessionSummaries] = useState<SessionSummary[]>([]);
  const [ipAddress, setIpAddress] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Get IP for memory lookup
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch {
        setIpAddress("");
      }
    };
    getIP();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSubscriptions();
      fetchPurchasedCourses();
    }
  }, [user]);

  const fetchUserMemories = async () => {
    // Memory feature - will be implemented when user has data
  };

  const fetchSessionSummaries = async () => {
    // Session summaries feature - will be implemented when user has data
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user?.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
    }
  };

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubscriptions(data);
    }
  };

  const fetchPurchasedCourses = async () => {
    // Check if user has any course purchase (full course access)
    const { data: purchaseData, error: purchaseError } = await supabase
      .from("course_purchases")
      .select("purchased_at")
      .limit(1);

    if (!purchaseError && purchaseData && purchaseData.length > 0) {
      // User has purchased the course, fetch all courses with progress
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("id, title, description, duration_minutes, lesson_number")
        .order("lesson_number", { ascending: true });

      if (!coursesError && coursesData) {
        // Fetch progress for each course
        const { data: progressData } = await supabase
          .from("course_progress")
          .select("course_id, progress_percent, completed");

        const progressMap: Record<string, any> = {};
        if (progressData) {
          progressData.forEach((p: any) => {
            progressMap[p.course_id] = p;
          });
        }

        const courses = coursesData.map((course: any) => ({
          ...course,
          purchased_at: purchaseData[0].purchased_at,
          progress: progressMap[course.id] || { progress_percent: 0, completed: false }
        }));
        setPurchasedCourses(courses);
      }
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");

    try {
      nameSchema.parse(displayName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setNameError(err.errors[0].message);
        return;
      }
    }

    setIsUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user?.id);
    setIsUpdating(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } else {
      toast({
        title: "Успешно",
        description: "Имя обновлено",
      });
      setProfile(prev => ({ ...prev, display_name: displayName }));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Размер файла не должен превышать 2 МБ",
      });
      return;
    }

    setIsUploadingAvatar(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setIsUploadingAvatar(false);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: uploadError.message,
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    setIsUploadingAvatar(false);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: updateError.message,
      });
    } else {
      toast({
        title: "Успешно",
        description: "Аватар обновлен",
      });
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    try {
      passwordSchema.parse(newPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setPasswordError(err.errors[0].message);
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    setIsUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdating(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } else {
      toast({
        title: "Успешно",
        description: "Пароль обновлен",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    try {
      emailSchema.parse(newEmail);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setEmailError(err.errors[0].message);
        return;
      }
    }

    setIsUpdating(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setIsUpdating(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } else {
      toast({
        title: "Успешно",
        description: "На новый email отправлено письмо для подтверждения",
      });
      setNewEmail("");
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    const { error } = await supabase
      .from("subscriptions")
      .update({ 
        status: "cancelled",
        cancelled_at: new Date().toISOString()
      })
      .eq("id", subscriptionId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отменить подписку",
      });
    } else {
      toast({
        title: "Подписка отменена",
        description: "Вы сможете пользоваться сервисом до окончания оплаченного периода",
      });
      fetchSubscriptions();
    }
  };

  const getPlanName = (plan: string) => {
    return plan === "monthly" ? "Премиум" : "Годовой Премиум";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/20 text-primary">Активна</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Отменена</Badge>;
      case "expired":
        return <Badge variant="destructive">Истекла</Badge>;
      default:
        return null;
    }
  };

  const getInitials = () => {
    if (profile.display_name) {
      return profile.display_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || "Аватар"} />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold">
                {profile.display_name || "Пользователь"}
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>

          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Безопасность</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Подписки</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Мои курсы</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="security">
              <div className="grid gap-6">
                {/* Change Name */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Изменить имя</CardTitle>
                    <CardDescription>Это имя будет отображаться в вашем профиле</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateName} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="display-name">Ваше имя</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="display-name"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Как вас называть?"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Сохранение..." : "Сохранить имя"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Change Password */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Изменить пароль</CardTitle>
                    <CardDescription>Введите новый пароль для вашего аккаунта</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Новый пароль</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Минимум 6 символов"
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторите пароль"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Обновление..." : "Обновить пароль"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Change Email */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Изменить email</CardTitle>
                    <CardDescription>Текущий email: {user?.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateEmail} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Новый email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="new-email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="new@email.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Обновление..." : "Обновить email"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Мои подписки</CardTitle>
                  <CardDescription>Управление вашими подписками</CardDescription>
                </CardHeader>
                <CardContent>
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">У вас пока нет активных подписок</p>
                      <Button onClick={() => navigate("/pricing")}>Выбрать тариф</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map((sub) => (
                        <div 
                          key={sub.id} 
                          className="p-4 rounded-lg bg-secondary/30 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-serif text-lg font-medium">
                              {getPlanName(sub.plan)}
                            </h4>
                            {getStatusBadge(sub.status)}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Активирована: {format(new Date(sub.activated_at), "d MMMM yyyy", { locale: ru })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Истекает: {format(new Date(sub.expires_at), "d MMMM yyyy", { locale: ru })}</span>
                            </div>
                          </div>
                          {sub.status === "active" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => handleCancelSubscription(sub.id)}
                            >
                              Отменить подписку
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Мои курсы</CardTitle>
                  <CardDescription>Курсы, которые вы приобрели</CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasedCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">У вас пока нет приобретенных курсов</p>
                      <Button onClick={() => navigate("/courses")}>Перейти к курсам</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <CheckCircle className="h-5 w-5" />
                          Курс медитации приобретён
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Вам доступны все 10 уроков курса
                        </p>
                      </div>
                      
                      {purchasedCourses.map((course) => (
                        <div 
                          key={course.id} 
                          className={`p-4 rounded-lg border transition-colors ${
                            course.progress?.completed 
                              ? "bg-green-500/10 border-green-500/30" 
                              : "bg-secondary/30 border-border/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-serif text-lg font-medium">
                                  Урок {course.lesson_number}: {course.title}
                                </h4>
                                {course.progress?.completed && (
                                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Просмотрено
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{course.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {course.duration_minutes} мин
                                </span>
                              </div>
                              
                              {/* Progress bar */}
                              {course.progress && course.progress.progress_percent > 0 && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                    <span>Прогресс</span>
                                    <span className={course.progress.completed ? "text-green-500" : ""}>
                                      {course.progress.progress_percent}%
                                    </span>
                                  </div>
                                  <Progress 
                                    value={course.progress.progress_percent} 
                                    className={`h-2 ${course.progress.completed ? '[&>div]:bg-green-500' : ''}`}
                                  />
                                </div>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              variant={course.progress?.completed ? "outline" : "default"}
                              onClick={() => navigate(`/courses?lesson=${course.lesson_number}`)}
                            >
                              {course.progress?.completed ? (
                                <>Пересмотреть</>
                              ) : course.progress?.progress_percent && course.progress.progress_percent > 0 ? (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Продолжить
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Смотреть
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
