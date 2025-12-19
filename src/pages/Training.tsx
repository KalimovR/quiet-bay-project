import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, Lock, Check, Clock, Star, CreditCard, Smartphone, CheckCircle, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface LessonProgress {
  lesson_id: string;
  progress_percent: number;
  completed: boolean;
  last_position: number;
}

const Training = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Курсы";
  }, []);
  const [selectedPayment, setSelectedPayment] = useState<"card" | "sbp">("card");
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasCourse, setHasCourse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessonsProgress, setLessonsProgress] = useState<Record<string, LessonProgress>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const lessons = [
    {
      id: "lesson-1",
      title: "Основы осознанного дыхания",
      duration: "7 мин",
      description: "Научитесь базовым техникам дыхания для снятия тревоги",
      isFree: true,
      videoUrl: "/videos/osnovy-1.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-2",
      title: "Сканирование тела",
      duration: "7 мин",
      description: "Практика осознанности для расслабления всего тела",
      isFree: true,
      videoUrl: "/videos/urok-2.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-3",
      title: "Медитация на отпускание",
      duration: "8 мин",
      description: "Освобождение от негативных мыслей и эмоций",
      isFree: false,
      videoUrl: "/videos/urok-3.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-4",
      title: "Визуализация безопасного места",
      duration: "8 мин",
      description: "Создание внутреннего убежища для моментов стресса",
      isFree: false,
      videoUrl: "/videos/urok-4.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-5",
      title: "Медитация благодарности",
      duration: "8 мин",
      description: "Развитие позитивного мышления через практику благодарности",
      isFree: false,
      videoUrl: "/videos/urok-5.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-6",
      title: "Глубокая релаксация",
      duration: "8 мин",
      description: "Полное расслабление для восстановления сил",
      isFree: false,
      videoUrl: "/videos/urok-6.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-7",
      title: "Медитация перед сном",
      duration: "9 мин",
      description: "Мягкое погружение в спокойный сон",
      isFree: false,
      videoUrl: "/videos/urok-7.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-8",
      title: "Утренняя практика",
      duration: "9 мин",
      description: "Энергичное начало дня с осознанностью",
      isFree: false,
      videoUrl: "/videos/urok-8.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-9",
      title: "Медитация осознанности",
      duration: "8 мин",
      description: "Глубокая практика присутствия в моменте",
      isFree: false,
      videoUrl: "/videos/urok-9.mp4",
      isLocalVideo: true,
    },
    {
      id: "lesson-10",
      title: "Заключение",
      duration: "3 мин",
      description: "Подведение итогов и достижения вашей практики",
      isFree: false,
      videoUrl: "/videos/urok-10.mp4",
      isLocalVideo: false,
    },
  ];

  const coursePrice = 249;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkPurchases(session.user.id);
          fetchLessonsProgress(session.user.id);
        } else {
          setHasCourse(false);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPurchases(session.user.id);
        fetchLessonsProgress(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPurchases = async (userId: string) => {
    const { data, error } = await supabase
      .from("course_purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", "meditation-course");

    if (!error && data && data.length > 0) {
      setHasCourse(true);
    }
    setLoading(false);
  };

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

  const handlePlayVideo = (videoUrl: string | null, lessonId: string) => {
    if (videoUrl) {
      setCurrentVideoUrl(videoUrl);
      setCurrentLessonId(lessonId);
      setVideoOpen(true);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || !currentLessonId) return;
    
    const video = videoRef.current;
    const progress = (video.currentTime / video.duration) * 100;
    const completed = progress >= 90; // Mark as completed at 90%
    
    // Save progress every 5 seconds worth of playback or when completed
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
    // Save final progress when closing
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

  // Check if lesson is accessible (free or purchased)
  const isLessonAccessible = (lesson: typeof lessons[0]) => {
    return lesson.isFree || hasCourse;
  };

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return lessonsProgress[lessonId];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Video Dialog */}
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
          <div className="aspect-video w-full bg-black relative">
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">Курс медитации</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Путь к внутреннему спокойствию
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              10 уроков медитации для снижения тревоги, улучшения сна 
              и обретения эмоционального баланса
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>70+ минут контента</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" />
                <span>{hasCourse ? "Полный доступ" : "2 бесплатных урока"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Пожизненный доступ</span>
              </div>
            </div>
            
            {hasCourse && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Курс куплен — все уроки доступны</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="py-16 bg-bay-fog/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
            Программа курса
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {lessons.map((lesson, index) => {
              const accessible = isLessonAccessible(lesson);
              const progress = getLessonProgress(lesson.id);
              const isCompleted = progress?.completed;
              const hasProgress = progress && progress.progress_percent > 0 && !isCompleted;
              
              return (
                <div
                  key={lesson.id}
                  className={`p-5 rounded-xl border transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500/5 border-green-500/30"
                      : accessible 
                        ? "bg-card border-accent/30 hover:border-accent/50" 
                        : "bg-card/50 border-border/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => accessible && lesson.videoUrl && handlePlayVideo(lesson.videoUrl, lesson.id)}
                      disabled={!accessible || !lesson.videoUrl}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? "bg-green-500/20 text-green-600 cursor-pointer"
                          : accessible 
                            ? lesson.videoUrl 
                              ? "bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer" 
                              : "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : accessible ? (
                        hasProgress ? (
                          <RotateCcw className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )
                      ) : (
                        <Lock className="w-5 h-5" />
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
                        {lesson.isFree && !hasCourse && !isCompleted && !hasProgress && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                            Бесплатно
                          </span>
                        )}
                        {hasCourse && !lesson.isFree && !isCompleted && !hasProgress && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                            Куплено
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                      
                      {/* Progress bar for lessons in progress */}
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
        </div>
      </section>

      {/* Purchase Section - Only show if user hasn't purchased */}
      {!hasCourse && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-card">
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                    Получить полный доступ
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Разблокируйте все 10 уроков медитации
                  </p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-4xl font-display font-semibold text-foreground mb-1">
                    {coursePrice} ₽
                  </div>
                  <p className="text-sm text-muted-foreground">Единоразовая оплата</p>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-foreground">Способ оплаты:</p>
                  
                  <button
                    onClick={() => setSelectedPayment("card")}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                      selectedPayment === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${selectedPayment === "card" ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-left">
                      <p className={`font-medium ${selectedPayment === "card" ? "text-foreground" : "text-foreground"}`}>
                        Банковская карта
                      </p>
                      <p className="text-xs text-muted-foreground">Visa, MasterCard, МИР</p>
                    </div>
                    {selectedPayment === "card" && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setSelectedPayment("sbp")}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                      selectedPayment === "sbp"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 ${selectedPayment === "sbp" ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-left">
                      <p className={`font-medium ${selectedPayment === "sbp" ? "text-foreground" : "text-foreground"}`}>
                        СБП (Система быстрых платежей)
                      </p>
                      <p className="text-xs text-muted-foreground">Мгновенный перевод через приложение банка</p>
                    </div>
                    {selectedPayment === "sbp" && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                </div>
                
                <Button variant="hero" size="lg" className="w-full mb-4">
                  Оплатить курс
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Безопасная оплата через ЮKassa. После оплаты вы получите доступ ко всем урокам.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Training;
