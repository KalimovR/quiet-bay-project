import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Shield, CreditCard, BookOpen, Loader2, Camera, UserIcon, CheckCircle, Play } from "lucide-react";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  activated_at: string;
  expires_at: string | null;
}

interface UserCourse {
  id: string;
  purchased_at: string;
  course: {
    id: string;
    title: string;
    description: string;
    lesson_number: number;
    duration_minutes: number;
  };
}

interface CourseProgressItem {
  course_id: string;
  progress_percent: number;
  completed: boolean;
}

const ADMIN_EMAIL = "admin@gmail.com";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgressItem>>({});
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [hasFullCourse, setHasFullCourse] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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
        fetchUserData(session.user.id);
        // Check if admin
        if (session.user.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    
    if (profileData) {
      setProfile(profileData);
      setNewUsername(profileData.username || "");
    }

    // Fetch subscriptions
    const { data: subsData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId);
    
    if (subsData) {
      setSubscriptions(subsData);
    }

    // Fetch user courses
    const { data: coursesData } = await supabase
      .from("user_courses")
      .select("course_id")
      .eq("user_id", userId);
    
    if (coursesData && coursesData.length > 0) {
      setHasFullCourse(true);
      
      // Fetch all courses for display
      const { data: allCoursesData } = await supabase
        .from("courses")
        .select("*")
        .order("lesson_number");
      
      if (allCoursesData) {
        setAllCourses(allCoursesData);
      }
    }

    // Fetch course progress
    const { data: progressData } = await supabase
      .from("course_progress")
      .select("course_id, progress_percent, completed")
      .eq("user_id", userId);
    
    if (progressData) {
      const progressMap: Record<string, CourseProgressItem> = {};
      progressData.forEach(p => {
        progressMap[p.course_id] = p;
      });
      setCourseProgress(progressMap);
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", user.id);
      
      if (error) throw error;
      setProfile(prev => prev ? { ...prev, username: newUsername } : null);
      toast.success("Имя обновлено");
    } catch (error: any) {
      toast.error(error.message || "Ошибка обновления имени");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success("Аватар обновлён");
    } catch (error: any) {
      toast.error(error.message || "Ошибка загрузки аватара");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success("На новый email отправлено письмо для подтверждения");
      setNewEmail("");
    } catch (error: any) {
      toast.error(error.message || "Ошибка обновления email");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Пароль должен содержать минимум 6 символов");
      return;
    }
    
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Пароль успешно обновлён");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.message || "Ошибка обновления пароля");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", subscriptionId);
      
      if (error) throw error;
      toast.success("Подписка отменена");
      if (user) fetchUserData(user.id);
    } catch (error: any) {
      toast.error(error.message || "Ошибка отмены подписки");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with Avatar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10">
                      <UserIcon className="h-8 w-8 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Личный кабинет</p>
                  <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                    {profile?.username || user?.email}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Button variant="bay" onClick={() => navigate("/admin")}>
                    <Shield className="h-4 w-4 mr-2" />
                    Админ-панель
                  </Button>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield size={16} />
                  <span className="hidden sm:inline">Безопасность</span>
                </TabsTrigger>
                <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span className="hidden sm:inline">Мои подписки</span>
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span className="hidden sm:inline">Мои курсы</span>
                </TabsTrigger>
              </TabsList>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-8">
                  {/* Change Username */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Изменить имя
                    </h3>
                    <form onSubmit={handleUpdateUsername} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input
                          id="username"
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="Ваше имя"
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit" disabled={isUpdating || !newUsername}>
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Обновить имя
                      </Button>
                    </form>
                  </div>
                  
                  {/* Change Email */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Изменить email
                    </h3>
                    <form onSubmit={handleUpdateEmail} className="space-y-4">
                      <div>
                        <Label htmlFor="current-email">Текущий email</Label>
                        <Input
                          id="current-email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="mt-1 bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-email">Новый email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="newemail@example.com"
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit" disabled={isUpdating || !newEmail}>
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Обновить email
                      </Button>
                    </form>
                  </div>

                  {/* Change Password */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Изменить пароль
                    </h3>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <Label htmlFor="new-password">Новый пароль</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={6}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Минимум 6 символов
                        </p>
                      </div>
                      <Button type="submit" disabled={isUpdating || !newPassword}>
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Обновить пароль
                      </Button>
                    </form>
                  </div>
                </div>
              </TabsContent>

              {/* Subscriptions Tab */}
              <TabsContent value="subscriptions">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
                    Мои подписки
                  </h3>
                  
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        У вас пока нет активных подписок
                      </p>
                      <Button variant="bay" onClick={() => navigate("/pricing")}>
                        Посмотреть тарифы
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map((sub) => (
                        <div 
                          key={sub.id}
                          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-secondary/50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {sub.plan_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Статус: <span className={sub.status === "active" ? "text-green-600" : "text-destructive"}>
                                {sub.status === "active" ? "Активна" : "Отменена"}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Активирована: {formatDate(sub.activated_at)}
                            </p>
                            {sub.expires_at && (
                              <p className="text-sm text-muted-foreground">
                                Действует до: {formatDate(sub.expires_at)}
                              </p>
                            )}
                          </div>
                          {sub.status === "active" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancelSubscription(sub.id)}
                            >
                              Отменить подписку
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
                    Мои курсы
                  </h3>
                  
                  {!hasFullCourse ? (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Вы ещё не приобрели курс медитации
                      </p>
                      <Button variant="bay" onClick={() => navigate("/courses")}>
                        Посмотреть курсы
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-green-700 dark:text-green-400 font-medium">
                          Курс медитации куплен — все 10 уроков доступны
                        </span>
                      </div>
                      
                      {allCourses.map((course) => {
                        const progress = courseProgress[course.id];
                        const isCompleted = progress?.completed;
                        const progressPercent = progress?.progress_percent || 0;
                        
                        return (
                          <div 
                            key={course.id}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors"
                            onClick={() => navigate(`/courses/${course.id}`)}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isCompleted ? "bg-green-100" : "bg-primary/10"
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <span className="font-heading font-semibold text-primary">
                                    {course.lesson_number}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground">
                                  Урок {course.lesson_number}: {course.title}
                                </h4>
                                <p className="text-sm text-muted-foreground truncate">
                                  {course.description}
                                </p>
                                {progressPercent > 0 && !isCompleted && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
                                      <div 
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{progressPercent}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Play size={14} />
                              {isCompleted ? "Пересмотреть" : progressPercent > 0 ? "Продолжить" : "Смотреть"}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
