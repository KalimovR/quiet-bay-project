import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import GiftNotification from "@/components/GiftNotification";
import ReviewForm from "@/components/ReviewForm";
import AdminReviews from "@/components/AdminReviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User, Play, Clock, LogOut, BookOpen, Camera, Pencil, Check, X, CreditCard, Calendar, Shield, Mail, Lock, Phone, Eye, EyeOff, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LessonProgress {
  lesson_id: string;
  progress_percent: number;
  completed: boolean;
  last_position: number;
}

const lessons = [
  { id: "lesson-1", title: "Основы осознанного дыхания", duration: "7 мин", description: "Научитесь базовым техникам дыхания для снятия тревоги", videoUrl: "/videos/osnovy-1.mp4" },
  { id: "lesson-2", title: "Сканирование тела", duration: "7 мин", description: "Практика осознанности для расслабления всего тела", videoUrl: "/videos/urok-2.mp4" },
  { id: "lesson-3", title: "Медитация на отпускание", duration: "8 мин", description: "Освобождение от негативных мыслей и эмоций", videoUrl: "/videos/urok-3.mp4" },
  { id: "lesson-4", title: "Визуализация безопасного места", duration: "8 мин", description: "Создание внутреннего убежища для моментов стресса", videoUrl: "/videos/urok-4.mp4" },
  { id: "lesson-5", title: "Медитация благодарности", duration: "8 мин", description: "Развитие позитивного мышления через практику благодарности", videoUrl: "/videos/urok-5.mp4" },
  { id: "lesson-6", title: "Глубокая релаксация", duration: "8 мин", description: "Полное расслабление для восстановления сил", videoUrl: "/videos/urok-6.mp4" },
  { id: "lesson-7", title: "Медитация перед сном", duration: "9 мин", description: "Мягкое погружение в спокойный сон", videoUrl: "/videos/urok-7.mp4" },
  { id: "lesson-8", title: "Утренняя практика", duration: "9 мин", description: "Энергичное начало дня с осознанностью", videoUrl: "/videos/urok-8.mp4" },
  { id: "lesson-9", title: "Медитация осознанности", duration: "8 мин", description: "Глубокая практика присутствия в моменте", videoUrl: "/videos/urok-9.mp4" },
  { id: "lesson-10", title: "Заключение", duration: "3 мин", description: "Подведение итогов и достижения вашей практики", videoUrl: "/videos/urok-10.mp4" },
];

const tierNames: Record<string, string> = { free: "Бесплатный", premium: "Премиум", annual: "Годовой" };
const tierPrices: Record<string, string> = { free: "0 ₽", premium: "399 ₽/мес", annual: "4 990 ₽/год" };

const emailSchema = z.string().email("Неверный формат email");
const phoneSchema = z.string().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX");
const passwordSchema = z.string()
  .min(10, "Минимум 10 символов")
  .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/, "Только латинские буквы, цифры и спецсимволы")
  .regex(/[A-Z]/, "Требуется хотя бы одна заглавная буква")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Требуется хотя бы один спецсимвол (!@#$%^&* и др.)");

const Dashboard = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Личный кабинет";
  }, []);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasCourse, setHasCourse] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [lessonsProgress, setLessonsProgress] = useState<Record<string, LessonProgress>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Profile state
  const [profile, setProfile] = useState<{ name: string | null; avatar_url: string | null }>({ name: null, avatar_url: null });
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Subscription state
  const [subscription, setSubscription] = useState<{ tier: string; starts_at: string; expires_at: string | null } | null>(null);
  
  // Security state
  const [securityTab, setSecurityTab] = useState("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("+7");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  
  // Collapsible sections state
  const [subscriptionOpen, setSubscriptionOpen] = useState(true);
  const [securityOpen, setSecurityOpen] = useState(true);
  const [lessonsOpen, setLessonsOpen] = useState(true);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        checkPurchases(session.user.id);
        fetchProfile(session.user.id);
        fetchSubscription(session.user.id);
        fetchLessonsProgress(session.user.id);
        checkAdminRole(session.user.id);
      }
      setLoading(false);
    });

    return () => authSub.unsubscribe();
  }, [navigate]);

  const fetchLessonsProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId);

    if (!error && data) {
      const progressMap: Record<string, LessonProgress> = {};
      data.forEach((item: any) => {
        progressMap[item.lesson_id] = {
          lesson_id: item.lesson_id,
          progress_percent: item.progress_percent,
          completed: item.completed,
          last_position: item.last_position,
        };
      });
      setLessonsProgress(progressMap);
    }
  };

  const saveProgress = async (lessonId: string, progress: number, position: number, completed: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from("lesson_progress")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        progress_percent: Math.round(progress),
        last_position: position,
        completed: completed,
      }, {
        onConflict: 'user_id,lesson_id'
      });

    if (!error) {
      setLessonsProgress(prev => ({
        ...prev,
        [lessonId]: {
          lesson_id: lessonId,
          progress_percent: Math.round(progress),
          completed: completed,
          last_position: position,
        }
      }));
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("name, avatar_url").eq("id", userId).single();
    if (!error && data) {
      setProfile(data);
      setEditName(data.name || "");
    } else if (error?.code === "PGRST116") {
      const { error: insertError } = await supabase.from("profiles").insert({ id: userId, name: user?.user_metadata?.name || null });
      if (!insertError) {
        setProfile({ name: user?.user_metadata?.name || null, avatar_url: null });
        setEditName(user?.user_metadata?.name || "");
      }
    }
  };

  const fetchSubscription = async (userId: string) => {
    const { data, error } = await supabase.from("user_subscriptions").select("tier, starts_at, expires_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!error && data) setSubscription(data);
  };

  const checkPurchases = async (userId: string) => {
    const { data, error } = await supabase.from("course_purchases").select("*").eq("user_id", userId).eq("course_id", "meditation-course");
    if (!error && data && data.length > 0) setHasCourse(true);
  };

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    if (!error && data) {
      setIsAdmin(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Вы вышли из аккаунта");
    navigate("/");
  };

  const handlePlayVideo = (videoUrl: string, lessonId: string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentLessonId(lessonId);
    setVideoOpen(true);
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || !currentLessonId) return;
    
    const video = videoRef.current;
    const progress = (video.currentTime / video.duration) * 100;
    const completed = progress >= 90;
    
    if (Math.floor(video.currentTime) % 5 === 0 || completed) {
      saveProgress(currentLessonId, progress, video.currentTime, completed);
    }
  };

  const handleVideoEnded = () => {
    if (!videoRef.current || !currentLessonId) return;
    saveProgress(currentLessonId, 100, videoRef.current.duration, true);
  };

  const handleVideoLoaded = () => {
    if (!videoRef.current || !currentLessonId) return;
    
    const progress = lessonsProgress[currentLessonId];
    if (progress && progress.last_position > 0 && !progress.completed) {
      videoRef.current.currentTime = progress.last_position;
    }
  };

  const handleVideoClose = () => {
    if (videoRef.current && currentLessonId) {
      const video = videoRef.current;
      const progress = (video.currentTime / video.duration) * 100;
      const completed = progress >= 90;
      saveProgress(currentLessonId, progress, video.currentTime, completed);
    }
    setVideoOpen(false);
    setCurrentVideoUrl(null);
    setCurrentLessonId(null);
  };

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return lessonsProgress[lessonId];
  };

  const handleSaveName = async () => {
    if (!user) return;
    const trimmedName = editName.trim();
    if (trimmedName.length > 100) {
      toast.error("Имя не должно превышать 100 символов");
      return;
    }
    const { error } = await supabase.from("profiles").update({ name: trimmedName || null }).eq("id", user.id);
    if (error) {
      toast.error("Не удалось сохранить имя");
    } else {
      setProfile(prev => ({ ...prev, name: trimmedName || null }));
      setIsEditingName(false);
      toast.success("Имя обновлено");
    }
  };

  const handleCancelEdit = () => {
    setEditName(profile.name || "");
    setIsEditingName(false);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) { toast.error("Пожалуйста, выберите изображение"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Размер файла не должен превышать 5 МБ"); return; }
    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split("/").slice(-2).join("/");
        await supabase.storage.from("avatars").remove([oldPath]);
      }
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      if (updateError) throw updateError;
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Фото профиля обновлено");
    } catch (error) {
      toast.error("Не удалось загрузить фото");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCancelSubscription = async () => {
    toast.success("Запрос на отмену подписки отправлен. С вами свяжется наша поддержка.");
    setCancelDialogOpen(false);
  };

  const formatDate = (dateString: string) => format(new Date(dateString), "d MMMM yyyy", { locale: ru });

  const getNextPaymentDate = () => {
    if (!subscription) return null;
    if (subscription.expires_at) return formatDate(subscription.expires_at);
    const startDate = new Date(subscription.starts_at);
    if (subscription.tier === "premium") startDate.setMonth(startDate.getMonth() + 1);
    else if (subscription.tier === "annual") startDate.setFullYear(startDate.getFullYear() + 1);
    return formatDate(startDate.toISOString());
  };

  // Security handlers
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPasswordResult = passwordSchema.safeParse(newPassword);
    if (!newPasswordResult.success) {
      toast.error(newPasswordResult.error.errors[0].message);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    
    setSecurityLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Пароль успешно изменён");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error("Ошибка при смене пароля");
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(newEmail);
    if (!emailResult.success) {
      toast.error(emailResult.error.errors[0].message);
      return;
    }
    
    setSecurityLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        email: newEmail 
      }, {
        emailRedirectTo: `${window.location.origin}/dashboard`
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("На новый email отправлено письмо для подтверждения");
        setNewEmail("");
      }
    } catch {
      toast.error("Ошибка при смене email");
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneResult = phoneSchema.safeParse(newPhone);
    if (!phoneResult.success) {
      toast.error(phoneResult.error.errors[0].message);
      return;
    }
    
    setSecurityLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ phone: newPhone });
      if (error) {
        toast.error(error.message);
      } else {
        setPhoneOtpSent(true);
        toast.success("Код подтверждения отправлен на новый номер");
      }
    } catch {
      toast.error("Ошибка при отправке кода");
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneOtp.length !== 6) {
      toast.error("Введите 6-значный код");
      return;
    }
    
    setSecurityLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: newPhone,
        token: phoneOtp,
        type: "phone_change",
      });
      if (error) {
        toast.error("Неверный код");
      } else {
        toast.success("Номер телефона успешно изменён");
        setNewPhone("+7");
        setPhoneOtp("");
        setPhoneOtpSent(false);
      }
    } catch {
      toast.error("Ошибка при подтверждении");
    } finally {
      setSecurityLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Gift Notification */}
      {user && <GiftNotification userId={user.id} />}

      <Dialog open={videoOpen} onOpenChange={(open) => !open && handleVideoClose()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center gap-2">
              Просмотр урока
              {currentLessonId && lessonsProgress[currentLessonId]?.completed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Просмотрено
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full bg-black">
            {currentVideoUrl && (
              <video
                ref={videoRef}
                src={currentVideoUrl}
                className="w-full h-full"
                controls
                autoPlay
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={handleVideoEnded}
                onLoadedMetadata={handleVideoLoaded}
              />
            )}
          </div>
          {currentLessonId && lessonsProgress[currentLessonId] && !lessonsProgress[currentLessonId].completed && (
            <div className="p-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Прогресс просмотра:</span>
                <Progress value={lessonsProgress[currentLessonId].progress_percent} className="flex-1 h-2" />
                <span>{lessonsProgress[currentLessonId].progress_percent}%</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить подписку?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить подписку? После отмены вы потеряете доступ к премиум-функциям по окончании текущего периода.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Отменить подписку
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* User Info */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleAvatarClick}>
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <button onClick={handleAvatarClick} disabled={uploadingAvatar} className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                      {uploadingAvatar ? <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Camera className="w-3 h-3" />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-40" placeholder="Ваше имя" maxLength={100} />
                        <button onClick={handleSaveName} className="p-1 text-green-600 hover:text-green-700"><Check className="w-5 h-5" /></button>
                        <button onClick={handleCancelEdit} className="p-1 text-red-500 hover:text-red-600"><X className="w-5 h-5" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="font-display text-xl font-semibold text-foreground">{profile.name || "Пользователь"}</h1>
                        <button onClick={() => setIsEditingName(true)} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>

            {/* Admin Panel - only visible for admins */}
            {isAdmin && <AdminPanel />}

            {/* Subscription Section */}
            <Collapsible open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
              <div className="bg-card rounded-2xl border border-border/50 shadow-card mb-8 overflow-hidden">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="font-display text-xl font-semibold text-foreground">Моя подписка</h2>
                  </div>
                  {subscriptionOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6">
                    {subscription && subscription.tier !== "free" ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-foreground">{tierNames[subscription.tier] || subscription.tier}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">Активна</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{tierPrices[subscription.tier] || ""}</p>
                          </div>
                          <div className="text-2xl font-display font-semibold text-primary">∞</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-border/50 bg-background/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-xs">Активна с</span>
                            </div>
                            <p className="font-medium text-foreground">{formatDate(subscription.starts_at)}</p>
                          </div>
                          <div className="p-4 rounded-xl border border-border/50 bg-background/50">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-xs">{subscription.expires_at ? "Действует до" : "Следующая оплата"}</span>
                            </div>
                            <p className="font-medium text-foreground">{subscription.expires_at ? formatDate(subscription.expires_at) : getNextPaymentDate()}</p>
                          </div>
                        </div>
                        <div className="pt-2">
                          <button onClick={() => setCancelDialogOpen(true)} className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2">
                            Отменить подписку
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Бесплатный тариф</h3>
                        <p className="text-sm text-muted-foreground mb-6">Вы используете бесплатный тариф с ограниченным количеством сообщений в чате</p>
                        <Button variant="hero" onClick={() => navigate("/pricing")}>Перейти на премиум</Button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Security Section */}
            <Collapsible open={securityOpen} onOpenChange={setSecurityOpen}>
              <div className="bg-card rounded-2xl border border-border/50 shadow-card mb-8 overflow-hidden">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="font-display text-xl font-semibold text-foreground">Безопасность</h2>
                  </div>
                  {securityOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6">
                    <Tabs value={securityTab} onValueChange={setSecurityTab}>
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="password" className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span className="hidden sm:inline">Пароль</span>
                        </TabsTrigger>
                        <TabsTrigger value="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="hidden sm:inline">Email</span>
                        </TabsTrigger>
                        <TabsTrigger value="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="hidden sm:inline">Телефон</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="password">
                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Новый пароль</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Мин. 10 символов, заглавная буква и спецсимвол"
                                className="pl-10 pr-10"
                                required
                              />
                              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Повторите пароль"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <Button type="submit" disabled={securityLoading || !newPassword || !confirmPassword}>
                            {securityLoading ? "Сохранение..." : "Изменить пароль"}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="email">
                        <form onSubmit={handleChangeEmail} className="space-y-4 max-w-md">
                          <div className="p-4 rounded-xl bg-muted/50 border border-border/50 mb-4">
                            <p className="text-sm text-muted-foreground">
                              Текущий email: <span className="font-medium text-foreground">{user?.email || "Не указан"}</span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newEmail">Новый email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="newEmail"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="newemail@example.com"
                                className="pl-10"
                                required
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">На новый email будет отправлено письмо для подтверждения</p>
                          </div>
                          <Button type="submit" disabled={securityLoading || !newEmail}>
                            {securityLoading ? "Отправка..." : "Изменить email"}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="phone">
                        <div className="max-w-md">
                          <div className="p-4 rounded-xl bg-muted/50 border border-border/50 mb-4">
                            <p className="text-sm text-muted-foreground">
                              Текущий телефон: <span className="font-medium text-foreground">{user?.phone || "Не указан"}</span>
                            </p>
                          </div>
                          
                          {!phoneOtpSent ? (
                            <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="newPhone">Новый номер телефона</Label>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                  <Input
                                    id="newPhone"
                                    type="tel"
                                    value={newPhone}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (!val.startsWith("+7")) val = "+7";
                                      if (val.length <= 12) setNewPhone(val);
                                    }}
                                    placeholder="+7XXXXXXXXXX"
                                    className="pl-10"
                                    required
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">Формат: +7XXXXXXXXXX</p>
                              </div>
                              <Button type="submit" disabled={securityLoading || newPhone.length !== 12}>
                                {securityLoading ? "Отправка..." : "Получить код"}
                              </Button>
                            </form>
                          ) : (
                            <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                              <div className="text-center mb-4">
                                <p className="text-sm text-muted-foreground">Код отправлен на номер</p>
                                <p className="font-medium text-foreground">{newPhone}</p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phoneOtp">Код подтверждения</Label>
                                <Input
                                  id="phoneOtp"
                                  type="text"
                                  value={phoneOtp}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    if (val.length <= 6) setPhoneOtp(val);
                                  }}
                                  placeholder="000000"
                                  maxLength={6}
                                  className="text-center text-2xl tracking-widest"
                                  required
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" disabled={securityLoading || phoneOtp.length !== 6}>
                                  {securityLoading ? "Проверка..." : "Подтвердить"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setPhoneOtpSent(false); setPhoneOtp(""); }}>
                                  Изменить номер
                                </Button>
                              </div>
                            </form>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>


            {/* Leave Review Section (for regular users) */}
            {user && !isAdmin && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Оставить отзыв</h2>
                </div>
                <ReviewForm userId={user.id} />
              </div>
            )}

            {/* Admin Reviews Section */}
            {isAdmin && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Отзывы пользователей</h2>
                </div>
                <AdminReviews />
              </div>
            )}

            {/* My Lessons Section */}
            <Collapsible open={lessonsOpen} onOpenChange={setLessonsOpen}>
              <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h2 className="font-display text-xl font-semibold text-foreground">Мои уроки</h2>
                  </div>
                  {lessonsOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6">
                    {hasCourse ? (
                      <>
                        {/* Course Title */}
                        <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-primary" />
                            <div>
                              <h3 className="font-semibold text-foreground">Путь к внутреннему спокойствию</h3>
                              <p className="text-sm text-muted-foreground">Курс медитации • 10 уроков</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lessons.map((lesson, index) => {
                            const progress = getLessonProgress(lesson.id);
                            const isCompleted = progress?.completed;
                            const hasProgress = progress && progress.progress_percent > 0 && !isCompleted;
                            
                            return (
                              <div 
                                key={lesson.id} 
                                className={`p-4 rounded-xl border transition-all ${
                                  isCompleted
                                    ? "bg-green-500/5 border-green-500/30"
                                    : "border-border/50 bg-background/50 hover:border-primary/30"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  <button 
                                    onClick={() => handlePlayVideo(lesson.videoUrl, lesson.id)} 
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                                      isCompleted
                                        ? "bg-green-500/20 text-green-600"
                                        : "bg-primary/20 text-primary hover:bg-primary/30"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : hasProgress ? (
                                      <RotateCcw className="w-5 h-5" />
                                    ) : (
                                      <Play className="w-5 h-5" />
                                    )}
                                  </button>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <span className="text-xs text-muted-foreground">Урок {index + 1}</span>
                                      {isCompleted && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" />
                                          Пройден
                                        </span>
                                      )}
                                      {hasProgress && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600">
                                          {progress.progress_percent}% просмотрено
                                        </span>
                                      )}
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">{lesson.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                                    
                                    {hasProgress && (
                                      <div className="mb-2">
                                        <Progress value={progress.progress_percent} className="h-1.5" />
                                      </div>
                                    )}
                                    
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {lesson.duration}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">У вас пока нет купленных уроков</h3>
                        <p className="text-sm text-muted-foreground mb-6">Приобретите курс медитации, чтобы получить доступ ко всем урокам</p>
                        <Button variant="hero" onClick={() => navigate("/training")}>Перейти к курсу</Button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;