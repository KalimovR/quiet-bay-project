import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserPresence } from "@/hooks/useUserPresence";
import { toast } from "sonner";
import { ArrowLeft, Clock, Lock, Play, Loader2, CheckCircle } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  lesson_number: number;
  is_free: boolean;
  duration_minutes: number;
  video_url: string | null;
}

interface CourseProgress {
  id: string;
  progress_percent: number;
  completed: boolean;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // Track user presence in course
  useUserPresence('course', id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  useEffect(() => {
    if (course && user) {
      checkAccess();
      fetchProgress();
    } else if (course && course.lesson_number <= 2) {
      setHasAccess(true);
    }
  }, [course, user]);

  const fetchCourse = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (data) {
      setCourse(data);
      if (data.lesson_number <= 2) {
        setHasAccess(true);
      }
    }
    setLoading(false);
  };

  const checkAccess = async () => {
    if (!user || !course) return;

    // First 2 lessons are always free
    if (course.lesson_number <= 2) {
      setHasAccess(true);
      return;
    }

    // Check if user purchased the course
    const { data: purchaseData } = await supabase
      .from("user_courses")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);
    
    if (purchaseData && purchaseData.length > 0) {
      setHasAccess(true);
    }
  };

  const fetchProgress = async () => {
    if (!user || !course) return;

    const { data } = await supabase
      .from("course_progress")
      .select("id, progress_percent, completed")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();
    
    if (data) {
      setProgress(data);
      setCurrentProgress(data.progress_percent);
    }
  };

  const updateProgress = async (percent: number, completed: boolean = false) => {
    if (!user || !course) return;

    const progressData = {
      user_id: user.id,
      course_id: course.id,
      progress_percent: Math.round(percent),
      completed,
      last_watched_at: new Date().toISOString(),
    };

    if (progress) {
      // Update existing
      await supabase
        .from("course_progress")
        .update({
          progress_percent: progressData.progress_percent,
          completed: progressData.completed,
          last_watched_at: progressData.last_watched_at,
        })
        .eq("id", progress.id);
    } else {
      // Insert new
      const { data } = await supabase
        .from("course_progress")
        .insert(progressData)
        .select("id, progress_percent, completed")
        .single();
      
      if (data) {
        setProgress(data);
      }
    }

    setCurrentProgress(percent);
    if (completed && !progress?.completed) {
      toast.success("Урок завершён!");
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const percent = (video.currentTime / video.duration) * 100;
    
    // Update progress every 10%
    if (Math.abs(percent - currentProgress) >= 10) {
      updateProgress(percent, percent >= 95);
    }
  };

  const handleVideoEnded = () => {
    updateProgress(100, true);
  };

  const markAsComplete = () => {
    updateProgress(100, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-2xl text-foreground mb-4">
              Урок не найден
            </h1>
            <Button onClick={() => navigate("/courses")}>
              Вернуться к курсам
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isCompleted = progress?.completed || currentProgress >= 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link 
              to="/courses" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Назад к курсам</span>
            </Link>

            {/* Course header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCompleted ? "bg-green-100" : "bg-primary/10"
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <span className="font-heading text-xl font-semibold text-primary">
                      {course.lesson_number}
                    </span>
                  )}
                </div>
                {course.lesson_number <= 2 ? (
                  <span className="bg-seafoam/50 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Бесплатно
                  </span>
                ) : hasAccess ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Доступно
                  </span>
                ) : (
                  <span className="bg-secondary text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Закрыто
                  </span>
                )}
                {isCompleted && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Просмотрено
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
                {course.title}
              </h1>
              
              <p className="text-muted-foreground text-lg mb-4">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{course.duration_minutes} минут</span>
                </div>
              </div>

              {/* Progress bar for accessible courses */}
              {hasAccess && user && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Прогресс урока</span>
                    <span className={isCompleted ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {Math.round(currentProgress)}%
                    </span>
                  </div>
                  <Progress 
                    value={currentProgress} 
                    className={`h-3 ${isCompleted ? "[&>div]:bg-green-500" : ""}`} 
                  />
                </div>
              )}
            </div>

            {/* Video or locked state */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {hasAccess ? (
                <div className="aspect-video bg-dusk flex items-center justify-center">
                  {course.video_url ? (
                    <video
                      ref={videoRef}
                      src={course.video_url}
                      controls
                      className="w-full h-full"
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={handleVideoEnded}
                    />
                  ) : (
                    <div className="text-center text-primary-foreground p-8">
                      <Play size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Видео скоро будет добавлено</p>
                      <p className="text-sm opacity-70 mt-2 mb-6">
                        Пока вы можете практиковать медитацию самостоятельно, следуя описанию урока
                      </p>
                      {user && !isCompleted && (
                        <Button 
                          variant="secondary" 
                          onClick={markAsComplete}
                        >
                          Отметить как просмотрено
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-secondary flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Lock size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      Доступ ограничен
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {user 
                        ? "Купите курс за 249₽, чтобы получить доступ ко всем урокам."
                        : "Войдите в аккаунт и купите курс для доступа к этому уроку."
                      }
                    </p>
                    {user ? (
                      <Button variant="bay" onClick={() => toast.info("Оплата через ЮКассу скоро будет доступна")}>
                        Купить курс за 249₽
                      </Button>
                    ) : (
                      <div className="flex gap-4 justify-center">
                        <Button variant="bay" onClick={() => navigate("/auth")}>
                          Войти
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/courses")}>
                          К курсам
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Lesson content */}
            {hasAccess && (
              <div className="mt-8 bg-card border border-border rounded-xl p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                  О чём этот урок
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {course.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
