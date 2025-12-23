import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { usePaymentFromUrl, usePaymentPolling } from "@/hooks/usePaymentPolling";
import { supabase } from "@/integrations/supabase/client";
import { Play, Clock, Lock, CheckCircle, Sparkles, ShoppingCart, Loader2 } from "lucide-react";
import SEO, { courseSchema, breadcrumbSchema } from "@/components/SEO";

interface Course {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  is_free: boolean;
  lesson_number: number;
  price: number;
  video_url?: string;
}

interface CourseProgress {
  course_id: string;
  progress_percent: number;
  completed: boolean;
  last_video_seconds?: number;
}

interface VideoPlayerProps {
  src: string;
  courseId: string;
  onProgressUpdate: (percent: number, seconds: number) => void;
  initialProgress: number;
  initialSeconds: number;
}

const VideoPlayer = ({ src, courseId, onProgressUpdate, initialProgress, initialSeconds }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedProgress = useRef(initialProgress);
  const hasSetInitialTime = useRef(false);
  const [isBuffering, setIsBuffering] = useState(true);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video || hasSetInitialTime.current) return;
    
    // Resume from saved position
    if (initialSeconds > 0 && initialSeconds < video.duration) {
      video.currentTime = initialSeconds;
    }
    hasSetInitialTime.current = true;
  }, [initialSeconds]);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handlePlaying = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.duration === 0) return;

    const currentPercent = Math.round((video.currentTime / video.duration) * 100);
    
    // Only update if progress increased by at least 5% to avoid too many updates
    if (currentPercent > lastSavedProgress.current && currentPercent - lastSavedProgress.current >= 5) {
      lastSavedProgress.current = currentPercent;
      onProgressUpdate(currentPercent, Math.floor(video.currentTime));
    }
  }, [onProgressUpdate]);

  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.duration === 0) return;

    const currentPercent = Math.round((video.currentTime / video.duration) * 100);
    const currentSeconds = Math.floor(video.currentTime);
    
    // Always save position on pause
    if (currentPercent >= lastSavedProgress.current) {
      lastSavedProgress.current = currentPercent;
      onProgressUpdate(currentPercent, currentSeconds);
    }
  }, [onProgressUpdate]);

  const handleEnded = useCallback(() => {
    onProgressUpdate(100, 0);
    lastSavedProgress.current = 100;
  }, [onProgressUpdate]);

  return (
    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black relative">
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <span className="text-sm text-white/80">Загрузка видео...</span>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        controlsList="nodownload"
        preload="auto"
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onEnded={handleEnded}
      >
        Ваш браузер не поддерживает видео
      </video>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [hasPurchasedCourse, setHasPurchasedCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [currentProgress, setCurrentProgress] = useState(0);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Payment polling after redirect
  const { paymentId, paymentSuccess, clearPaymentFromUrl } = usePaymentFromUrl();
  const { isPolling, startPolling } = usePaymentPolling({
    paymentId,
    onSuccess: (result) => {
      setHasPurchasedCourse(true);
      clearPaymentFromUrl();
      toast({
        title: "Курс активирован!",
        description: "Все уроки теперь доступны",
      });
    },
    onError: () => {
      clearPaymentFromUrl();
    },
  });
  
  // Track course viewing activity when a course is selected
  useActivityTracker(selectedCourse ? 'watching_course' : 'online', 
    selectedCourse ? { course_id: selectedCourse.id } : {});

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchPurchaseStatus();
      fetchCourseProgress();
    }
  }, [user]);

  // Start polling if we came back from payment
  useEffect(() => {
    if (paymentSuccess && user) {
      startPolling();
      // Also do an immediate refetch
      fetchPurchaseStatus();
    }
  }, [paymentSuccess, user]);

  useEffect(() => {
    const lessonParam = searchParams.get("lesson");
    if (lessonParam && courses.length > 0) {
      const course = courses.find(c => c.lesson_number === parseInt(lessonParam));
      if (course) {
        setSelectedCourse(course);
      }
    }
  }, [searchParams, courses]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("lesson_number", { ascending: true });

    if (!error && data) {
      setCourses(data);
    }
    setIsLoading(false);
  };

  const fetchPurchaseStatus = async () => {
    const { data, error } = await supabase
      .from("course_purchases")
      .select("course_id")
      .limit(1);

    if (!error && data && data.length > 0) {
      setHasPurchasedCourse(true);
    }
  };

  const fetchCourseProgress = async () => {
    const { data, error } = await supabase
      .from("course_progress")
      .select("course_id, progress_percent, completed, last_video_seconds");

    if (!error && data) {
      const progressMap: Record<string, CourseProgress> = {};
      data.forEach((p: any) => {
        progressMap[p.course_id] = p;
      });
      setCourseProgress(progressMap);
    }
  };

  const canAccessCourse = (course: Course) => {
    // First two lessons are always free
    if (course.lesson_number <= 2) return true;
    // If user has purchased the course, all lessons are accessible
    if (hasPurchasedCourse) return true;
    return false;
  };

  const handleCourseClick = (course: Course) => {
    if (!canAccessCourse(course)) {
      if (!user) {
        toast({
          title: "Требуется авторизация",
          description: "Войдите или зарегистрируйтесь для покупки курса",
        });
        navigate("/auth");
        return;
      }
      toast({
        title: "Курс не приобретён",
        description: "Приобретите полный курс за 249 ₽",
      });
      return;
    }
    setSelectedCourse(course);
    // Set current progress for the selected course
    const progress = courseProgress[course.id];
    setCurrentProgress(progress?.progress_percent || 0);
  };

  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchaseCourse = async () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите или зарегистрируйтесь для покупки курса",
      });
      navigate("/auth");
      return;
    }

    setIsPurchasing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: 'course',
            itemId: courses[0]?.id, // First course as the main course
            amount: 249,
            description: 'Курс медитации - полный доступ (10 уроков)',
            returnUrl: `${window.location.origin}/courses?payment=success`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания платежа');
      }

      // Сохраняем payment_id для polling после редиректа
      localStorage.setItem('pending_payment_id', data.paymentId);

      // Redirect to YooKassa payment page
      window.location.href = data.confirmationUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Ошибка оплаты",
        description: error instanceof Error ? error.message : "Попробуйте ещё раз",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const updateProgress = async (courseId: string, percent: number, seconds: number = 0) => {
    if (!user) return;

    const completed = percent >= 100;
    
    const { error } = await supabase
      .from("course_progress")
      .upsert({
        user_id: user.id,
        course_id: courseId,
        progress_percent: percent,
        completed,
        last_video_seconds: seconds,
        last_watched_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id'
      });

    if (!error) {
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: { course_id: courseId, progress_percent: percent, completed, last_video_seconds: seconds }
      }));
      setCurrentProgress(percent);
    }
  };

  const getProgressColor = (progress: CourseProgress | undefined) => {
    if (!progress) return "bg-muted";
    if (progress.completed) return "bg-green-500";
    return "bg-primary";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Курс медитации"
        description="Онлайн-курс медитации: 10 уроков от основ до продвинутых техник. 2 бесплатных урока. Полный курс за 249₽."
        canonical="/courses"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            courseSchema,
            breadcrumbSchema([
              { name: "Главная", url: "/" },
              { name: "Курсы", url: "/courses" }
            ])
          ]
        }}
      />
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        {/* Hero Section - Compact and elegant */}
        <section className="container mx-auto px-4 mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-medium text-primary">Онлайн-курс медитации</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3 text-foreground">
              Курс медитации
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Образовательные материалы от основ до продвинутых техник. 
              Начните с бесплатных уроков.
            </p>
          </div>
        </section>

        {/* Main Info Card - Combines pricing and description */}
        <section className="container mx-auto px-4 mb-10">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-card via-card to-secondary/30 border border-border/60 overflow-hidden">
              {/* Top section - Price and access */}
              <div className="p-6 md:p-8 border-b border-border/40">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
                        2 урока бесплатно
                      </h2>
                      <p className="text-sm text-muted-foreground">Полный курс из 10 уроков</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-bold text-primary">249</span>
                    <span className="text-muted-foreground">₽</span>
                  </div>
                </div>
                
                {/* Quick info */}
                <div className="flex flex-wrap gap-3 mt-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 text-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground/80">Цифровой продукт</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 text-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground/80">Доступ сразу после оплаты</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 text-sm">
                    <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-foreground/80">Отдельно от подписки</span>
                  </div>
                </div>
              </div>
              
              {/* Bottom section - Course description */}
              <div className="p-6 md:p-8 bg-background/30">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">О курсе</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Практический курс для снижения стресса, улучшения концентрации и развития 
                  устойчивого внутреннего состояния. Подходит для начинающих и практикующих.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Основы медитации и регулярная практика</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Дыхательные техники</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Медитация любящей доброты</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Практики благодарности</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-card/50">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const hasAccess = canAccessCourse(course);
                const progress = courseProgress[course.id];
                
                return (
                  <Card 
                    key={course.id} 
                    className={`bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:border-primary/50 ${
                      !hasAccess ? "opacity-80" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        {hasAccess ? (
                          progress?.completed ? (
                            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Просмотрено
                            </Badge>
                          ) : (
                            <Badge variant="default">Бесплатно</Badge>
                          )
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            <Lock className="h-3 w-3 mr-1" />
                            Закрыт
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Урок {course.lesson_number}
                        </span>
                      </div>
                      <CardTitle className="font-serif text-xl">{course.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration_minutes} минут
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {course.description}
                      </p>
                      
                      {/* Progress bar for accessible courses */}
                      {hasAccess && progress && progress.progress_percent > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Прогресс</span>
                            <span>{progress.progress_percent}%</span>
                          </div>
                          <Progress 
                            value={progress.progress_percent} 
                            className={`h-2 ${progress.completed ? '[&>div]:bg-green-500' : ''}`}
                          />
                        </div>
                      )}
                      
                      {hasAccess ? (
                        <Button 
                          className="w-full" 
                          onClick={() => handleCourseClick(course)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {progress?.progress_percent > 0 && !progress.completed ? "Продолжить" : "Начать урок"}
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          variant="secondary"
                          onClick={() => handleCourseClick(course)}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Закрыт
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Payment Status Banner */}
          {isPolling && (
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-3 p-5 rounded-xl bg-primary/10 border border-primary/20">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <div className="text-center">
                  <p className="font-medium text-foreground">Обрабатываем оплату...</p>
                  <p className="text-sm text-muted-foreground">Это займёт несколько секунд</p>
                </div>
              </div>
            </div>
          )}

          {/* YooKassa Payment Section - Compact */}
          {!hasPurchasedCourse && !isPolling && (
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-[#00BF96]/10 to-primary/5 border border-[#00BF96]/20">
                <div className="text-center sm:text-left">
                  <p className="font-medium text-foreground">Получить полный доступ</p>
                  <p className="text-sm text-muted-foreground">10 уроков • Оплата через ЮКасса</p>
                </div>
                <Button 
                  className="bg-[#00BF96] hover:bg-[#00A67E] text-white whitespace-nowrap"
                  onClick={handlePurchaseCourse}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Оплатить 249 ₽
                    </>
                  )}
                </Button>
              </div>
              <p className="text-center text-muted-foreground/60 text-xs mt-3">
                Возврат средств возможен в течение 14 дней с момента покупки
              </p>
            </div>
          )}

          {/* Success Banner */}
          {hasPurchasedCourse && (
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-3 p-5 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="text-center">
                  <p className="font-medium text-foreground">Курс приобретён!</p>
                  <p className="text-sm text-muted-foreground">Все 10 уроков теперь доступны</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section - Simplified */}
        <section className="container mx-auto px-4 mt-12">
          <div className="max-w-xl mx-auto text-center p-6 rounded-xl bg-card/50 border border-border/40">
            <h2 className="font-serif text-xl font-semibold mb-2 text-foreground">
              Нужна поддержка ассистента?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Оформите подписку для безлимитного общения. Курсы приобретаются отдельно.
            </p>
            <Button variant="outline" onClick={() => navigate("/pricing")}>
              Посмотреть тарифы
            </Button>
          </div>
        </section>
      </main>

      {/* Course Player Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Урок {selectedCourse?.lesson_number}: {selectedCourse?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedCourse?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            {selectedCourse && canAccessCourse(selectedCourse) ? (
              <>
                {selectedCourse.video_url ? (
                  <VideoPlayer
                    src={selectedCourse.video_url}
                    courseId={selectedCourse.id}
                    onProgressUpdate={(percent, seconds) => updateProgress(selectedCourse.id, percent, seconds)}
                    initialProgress={currentProgress}
                    initialSeconds={courseProgress[selectedCourse.id]?.last_video_seconds || 0}
                  />
                ) : (
                  <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Play className="h-16 w-16 mx-auto text-primary mb-4" />
                      <p className="text-muted-foreground">
                        Видео скоро будет добавлено
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Progress controls in dialog */}
                {user && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Прогресс просмотра</span>
                      <span className={currentProgress >= 100 ? "text-green-500 font-medium" : ""}>
                        {currentProgress}%
                      </span>
                    </div>
                    <Progress 
                      value={currentProgress} 
                      className={`h-3 mb-3 ${currentProgress >= 100 ? '[&>div]:bg-green-500' : ''}`}
                    />
                    <div className="flex gap-2 justify-center">
                      <Button 
                        size="sm" 
                        className={currentProgress >= 100 ? "bg-green-500 hover:bg-green-600" : ""}
                        onClick={() => updateProgress(selectedCourse.id, 100)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Завершить
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium mb-2">
                    Этот урок ещё не приобретён
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Приобретите полный курс за 249 ₽
                  </p>
                  <Button onClick={handlePurchaseCourse} disabled={isPurchasing}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isPurchasing ? "Загрузка..." : "Купить курс"}
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Длительность: {selectedCourse?.duration_minutes} минут
              </span>
              {selectedCourse && canAccessCourse(selectedCourse) ? (
                <Badge className={courseProgress[selectedCourse.id]?.completed ? "bg-green-500/20 text-green-600" : ""}>
                  {courseProgress[selectedCourse.id]?.completed ? "Просмотрено" : "Доступен"}
                </Badge>
              ) : (
                <Badge variant="secondary">Закрыт</Badge>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Courses;