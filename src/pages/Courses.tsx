import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Lock, Play, Clock, Check, CheckCircle, Loader2, Sparkles, Brain, Heart, Smile } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";

interface Course {
  id: string;
  title: string;
  description: string;
  lesson_number: number;
  is_free: boolean;
  duration_minutes: number;
  price: number;
}

interface CourseProgress {
  course_id: string;
  progress_percent: number;
  completed: boolean;
}

const Courses = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourseIds, setUserCourseIds] = useState<string[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [hasFullCourse, setHasFullCourse] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { createPayment, isLoading: isPaymentLoading } = usePayment();

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
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData(user.id);
    } else {
      setUserCourseIds([]);
      setHasFullCourse(false);
      setCourseProgress({});
    }
  }, [user]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("lesson_number");
    
    if (data) {
      setCourses(data);
    }
    setLoading(false);
  };

  const fetchUserData = async (userId: string) => {
    // Get purchased courses
    const { data: coursesData } = await supabase
      .from("user_courses")
      .select("course_id")
      .eq("user_id", userId);
    
    if (coursesData && coursesData.length > 0) {
      setUserCourseIds(coursesData.map(c => c.course_id));
      setHasFullCourse(true); // If user has any purchased course, they have full access
    }

    // Get course progress
    const { data: progressData } = await supabase
      .from("course_progress")
      .select("course_id, progress_percent, completed")
      .eq("user_id", userId);
    
    if (progressData) {
      const progressMap: Record<string, CourseProgress> = {};
      progressData.forEach(p => {
        progressMap[p.course_id] = p;
      });
      setCourseProgress(progressMap);
    }
  };

  const canAccessCourse = (course: Course) => {
    // First 2 lessons are always free
    if (course.lesson_number <= 2) return true;
    // If user bought the course
    if (hasFullCourse) return true;
    return false;
  };

  const handleCourseClick = (course: Course) => {
    if (!user && course.lesson_number > 2) {
      toast.info("Войдите, чтобы получить доступ к курсам");
      navigate("/auth");
      return;
    }

    if (canAccessCourse(course)) {
      navigate(`/courses/${course.id}`);
    } else {
      toast.info("Купите курс за 249₽, чтобы получить доступ ко всем урокам");
    }
  };

  const handleBuyCourse = async () => {
    if (!user) {
      toast.info("Войдите, чтобы купить курс");
      navigate("/auth");
      return;
    }
    
    await createPayment({
      amount: 249,
      description: "Курс медитации — все 10 уроков",
      productType: 'course',
      productId: courses[0]?.id, // Will be updated to grant all courses
      userId: user.id,
      email: user.email || undefined
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Курс медитации"
        description="10 уроков медитации для внутреннего покоя. Первые 2 урока бесплатны."
        canonical="/courses"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Медитация
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Курс медитации
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              10 уроков для обретения внутреннего покоя. Первые 2 урока бесплатны.
            </p>

            {/* Buy course button */}
            {!hasFullCourse ? (
              <div className="flex flex-col items-center mb-8">
                <Button 
                  variant="bay" 
                  size="lg"
                  onClick={handleBuyCourse}
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    "Купить весь курс за 249₽"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground/60 mt-2">Возврат средств в течение 14 дней</p>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-8">
                <CheckCircle size={18} />
                <span className="font-medium">Курс куплен — все уроки доступны</span>
              </div>
            )}
          </div>

          {/* Course Description */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-seafoam/20 to-accent/10 border border-primary/10 rounded-3xl p-8 md:p-10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-seafoam/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">
                    О курсе
                  </h2>
                </div>

                {/* Description */}
                <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                  <p className="text-base md:text-lg">
                    Курс предназначен для тех, кто хочет освоить медитацию как практический инструмент 
                    для снижения стресса, улучшения концентрации и развития устойчивого внутреннего состояния.
                  </p>
                  <p>
                    Программа построена по принципу постепенного погружения — от базовых основ 
                    к более глубоким практикам осознанности и эмоциональной регуляции. 
                    Подходит как для начинающих, так и для тех, кто хочет систематизировать практику.
                  </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-4 bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">Основы медитации</h4>
                      <p className="text-muted-foreground text-sm">Фундаментальные принципы и регулярная практика</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-seafoam/50 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">Дыхательные техники</h4>
                      <p className="text-muted-foreground text-sm">Быстрое снижение напряжения и фокус внимания</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">Медитация любящей доброты</h4>
                      <p className="text-muted-foreground text-sm">Развитие сострадания к себе и окружающим</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-background/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Smile className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">Практики благодарности</h4>
                      <p className="text-muted-foreground text-sm">Эмоциональный баланс и удовлетворённость</p>
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                <p className="text-sm text-muted-foreground/80 text-center">
                  Не требует специальной подготовки • Применение в повседневной жизни
                </p>
              </div>
            </div>
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {courses.map((course) => {
              const accessible = canAccessCourse(course);
              const progress = courseProgress[course.id];
              const isCompleted = progress?.completed;
              const progressPercent = progress?.progress_percent || 0;
              
              return (
                <div
                  key={course.id}
                  className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                    accessible 
                      ? "border-border shadow-soft hover:shadow-elevated cursor-pointer" 
                      : "border-border/50 opacity-80"
                  }`}
                  onClick={() => handleCourseClick(course)}
                >
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    {course.lesson_number <= 2 ? (
                      <span className="inline-flex items-center gap-1 bg-seafoam/50 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Бесплатно
                      </span>
                    ) : hasFullCourse ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Check size={12} />
                        Доступно
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                        <Lock size={12} />
                        Закрыто
                      </span>
                    )}
                  </div>

                  {/* Lesson number with completion indicator */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isCompleted 
                      ? "bg-green-100" 
                      : "bg-primary/10"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <span className="font-heading text-xl font-semibold text-primary">
                        {course.lesson_number}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Progress bar (only for accessible and started courses) */}
                  {accessible && progressPercent > 0 && !isCompleted && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Прогресс</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock size={14} />
                      <span>{course.duration_minutes} мин</span>
                    </div>
                    
                    {accessible && (
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Play size={14} />
                        Смотреть
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
