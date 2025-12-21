import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Shield, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Loader2, 
  Search,
  Gift,
  Activity,
  RefreshCw,
  Star,
  AlertTriangle,
  Image,
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  ThumbsDown
} from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  username: string | null;
}

interface UserPresence {
  user_id: string;
  email: string | null;
  status: string;
  current_activity: string | null;
  last_seen_at: string;
}

interface ChatAnalytics {
  totalSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
  avgSessionDuration: number;
  shortSessions: number; // sessions with < 3 messages (stuck users)
  crisisDetections: number;
  sessionsToday: number;
  sessionsThisWeek: number;
  avgRating: number;
  lowRatings: number;
}

interface Course {
  id: string;
  title: string;
  lesson_number: number;
}

interface Feedback {
  id: string;
  user_id: string | null;
  session_id: string | null;
  rating: number;
  message: string | null;
  photo_url: string | null;
  ip_address: string | null;
  created_at: string;
}

interface SpamLog {
  id: string;
  ip_address: string;
  user_id: string | null;
  spam_type: string;
  message_content: string | null;
  created_at: string;
}

const ADMIN_EMAIL = "admin@gmail.com";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [chatAnalytics, setChatAnalytics] = useState<ChatAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [spamLogs, setSpamLogs] = useState<SpamLog[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isGranting, setIsGranting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user || user.email !== ADMIN_EMAIL) {
        toast.error("Доступ запрещён");
        navigate("/");
        return;
      }
      
      setIsAdmin(true);
      setLoading(false);
      
      // Load initial data
      fetchProfiles();
      fetchCourses();
      fetchOnlineUsers();
      fetchChatAnalytics();
      fetchFeedbacks();
      fetchSpamLogs();
    };

    checkAdmin();

    // Subscribe to presence changes
    const channel = supabase
      .channel('admin-presence')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        () => fetchOnlineUsers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, username')
      .order('created_at', { ascending: false });
    
    if (data) setProfiles(data);
  };

  const fetchCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('id, title, lesson_number')
      .order('lesson_number');
    
    if (data) setCourses(data);
  };

  const fetchOnlineUsers = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from('user_presence')
      .select('*')
      .gte('last_seen_at', fiveMinutesAgo);
    
    if (data) setOnlineUsers(data);
  };

  const fetchChatAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      // Fetch sessions count and basic stats
      const { data: sessions, count: totalSessions } = await supabase
        .from('chat_sessions')
        .select('id, created_at, updated_at', { count: 'exact' });

      // Fetch message counts per session (without content)
      const { data: messageCounts } = await supabase
        .from('chat_messages')
        .select('session_id');

      // Fetch feedbacks for ratings
      const { data: feedbackData } = await supabase
        .from('chat_feedback')
        .select('rating');

      // Calculate analytics
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const sessionsToday = sessions?.filter(s => s.created_at >= todayStart).length || 0;
      const sessionsThisWeek = sessions?.filter(s => s.created_at >= weekStart).length || 0;

      // Count messages per session
      const sessionMessageCounts: Record<string, number> = {};
      messageCounts?.forEach(m => {
        sessionMessageCounts[m.session_id] = (sessionMessageCounts[m.session_id] || 0) + 1;
      });

      const sessionIds = Object.keys(sessionMessageCounts);
      const totalMessages = messageCounts?.length || 0;
      const avgMessagesPerSession = sessionIds.length > 0 
        ? totalMessages / sessionIds.length 
        : 0;

      // Short sessions (stuck users) - less than 3 messages
      const shortSessions = sessionIds.filter(id => sessionMessageCounts[id] < 3).length;

      // Calculate avg session duration (in minutes)
      let totalDuration = 0;
      sessions?.forEach(s => {
        const created = new Date(s.created_at).getTime();
        const updated = new Date(s.updated_at).getTime();
        totalDuration += (updated - created) / 1000 / 60; // minutes
      });
      const avgSessionDuration = sessions?.length ? totalDuration / sessions.length : 0;

      // Ratings analysis
      const ratings = feedbackData?.map(f => f.rating) || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;
      const lowRatings = ratings.filter(r => r <= 4).length;

      // Fetch spam logs with crisis type (as proxy for crisis detections)
      const { count: crisisCount } = await supabase
        .from('spam_logs')
        .select('*', { count: 'exact', head: true })
        .eq('spam_type', 'crisis');

      setChatAnalytics({
        totalSessions: totalSessions || 0,
        totalMessages,
        avgMessagesPerSession: Math.round(avgMessagesPerSession * 10) / 10,
        avgSessionDuration: Math.round(avgSessionDuration),
        shortSessions,
        crisisDetections: crisisCount || 0,
        sessionsToday,
        sessionsThisWeek,
        avgRating: Math.round(avgRating * 10) / 10,
        lowRatings,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from('chat_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setFeedbacks(data as Feedback[]);
  };

  const fetchSpamLogs = async () => {
    const { data } = await supabase
      .from('spam_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (data) setSpamLogs(data as SpamLog[]);
  };

  const handleGrantCourse = async () => {
    if (!selectedUserId) {
      toast.error("Выберите пользователя");
      return;
    }

    setIsGranting(true);
    try {
      // Grant access to all courses for the user
      const { error } = await supabase
        .from('user_courses')
        .insert({
          user_id: selectedUserId,
          course_id: selectedCourseId || courses[0]?.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("Курс уже выдан этому пользователю");
        } else {
          throw error;
        }
      } else {
        toast.success("Курс успешно выдан!");
        setSelectedUserId("");
        setSelectedCourseId("");
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка при выдаче курса");
    } finally {
      setIsGranting(false);
    }
  };

  const handleGrantSubscription = async () => {
    if (!selectedUserId || !selectedPlan) {
      toast.error("Выберите пользователя и план");
      return;
    }

    setIsGranting(true);
    try {
      const expiresAt = selectedPlan === 'yearly' 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: selectedUserId,
          plan_name: selectedPlan,
          status: 'active',
          expires_at: expiresAt,
        });

      if (error) throw error;
      
      toast.success("Подписка успешно выдана!");
      setSelectedUserId("");
      setSelectedPlan("");
    } catch (error: any) {
      toast.error(error.message || "Ошибка при выдаче подписки");
    } finally {
      setIsGranting(false);
    }
  };

  const filteredProfiles = searchEmail
    ? profiles.filter(p => 
        p.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchEmail.toLowerCase())
      )
    : profiles;

  const onlineInChat = onlineUsers.filter(u => u.current_activity === 'chat').length;
  const onlineInCourse = onlineUsers.filter(u => u.current_activity === 'course').length;
  const onlineBrowsing = onlineUsers.filter(u => u.current_activity === 'browsing' || !u.current_activity).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                  Панель администратора
                </h1>
                <p className="text-muted-foreground text-sm">
                  Управление пользователями и мониторинг
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Activity size={16} />
                  <span className="text-sm">Онлайн</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{onlineUsers.length}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MessageSquare size={16} />
                  <span className="text-sm">В чате</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{onlineInChat}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <BookOpen size={16} />
                  <span className="text-sm">Смотрят курсы</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{onlineInCourse}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users size={16} />
                  <span className="text-sm">Всего юзеров</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{profiles.length}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users size={16} />
                  <span className="hidden sm:inline">Пользователи</span>
                </TabsTrigger>
                <TabsTrigger value="grants" className="flex items-center gap-2">
                  <Gift size={16} />
                  <span className="hidden sm:inline">Доступ</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  <span className="hidden sm:inline">Аналитика</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-2">
                  <Star size={16} />
                  <span className="hidden sm:inline">Отзывы</span>
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      Онлайн пользователи
                    </h3>
                    <Button variant="outline" size="sm" onClick={fetchOnlineUsers}>
                      <RefreshCw size={16} className="mr-2" />
                      Обновить
                    </Button>
                  </div>

                  {onlineUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Нет активных пользователей
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {onlineUsers.map((presence) => (
                        <div 
                          key={presence.user_id}
                          className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <div>
                              <p className="font-medium text-foreground">
                                {presence.email || "Неизвестный"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Последняя активность: {new Date(presence.last_seen_at).toLocaleTimeString('ru-RU')}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            presence.current_activity === 'chat' ? 'default' :
                            presence.current_activity === 'course' ? 'secondary' : 'outline'
                          }>
                            {presence.current_activity === 'chat' ? 'В чате' :
                             presence.current_activity === 'course' ? 'Смотрит курс' : 'Просматривает'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Grants Tab */}
              <TabsContent value="grants">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Grant Course */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Выдать курс
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Поиск пользователя</Label>
                        <div className="relative mt-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            placeholder="Email или имя..."
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Выберите пользователя</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Выберите пользователя" />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-48">
                              {filteredProfiles.map((profile) => (
                                <SelectItem key={profile.id} value={profile.id}>
                                  {profile.email || profile.username || profile.id}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={handleGrantCourse} 
                        disabled={isGranting || !selectedUserId}
                        className="w-full"
                      >
                        {isGranting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Выдать полный курс
                      </Button>
                    </div>
                  </div>

                  {/* Grant Subscription */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Выдать подписку
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Выберите пользователя</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Выберите пользователя" />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-48">
                              {filteredProfiles.map((profile) => (
                                <SelectItem key={profile.id} value={profile.id}>
                                  {profile.email || profile.username || profile.id}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Тип подписки</Label>
                        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Выберите план" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Премиум (месяц)</SelectItem>
                            <SelectItem value="yearly">Годовой</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={handleGrantSubscription} 
                        disabled={isGranting || !selectedUserId || !selectedPlan}
                        className="w-full"
                      >
                        {isGranting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Выдать подписку
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                      <BarChart3 size={20} />
                      Аналитика чатов
                    </h3>
                    <Button variant="outline" size="sm" onClick={fetchChatAnalytics} disabled={analyticsLoading}>
                      {analyticsLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    </Button>
                  </div>

                  {analyticsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : chatAnalytics ? (
                    <>
                      {/* Main metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <MessageSquare size={16} />
                            <span className="text-sm">Всего сессий</span>
                          </div>
                          <p className="text-2xl font-semibold text-foreground">{chatAnalytics.totalSessions}</p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <TrendingUp size={16} />
                            <span className="text-sm">Сегодня</span>
                          </div>
                          <p className="text-2xl font-semibold text-foreground">{chatAnalytics.sessionsToday}</p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Activity size={16} />
                            <span className="text-sm">За неделю</span>
                          </div>
                          <p className="text-2xl font-semibold text-foreground">{chatAnalytics.sessionsThisWeek}</p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <MessageSquare size={16} />
                            <span className="text-sm">Всего сообщений</span>
                          </div>
                          <p className="text-2xl font-semibold text-foreground">{chatAnalytics.totalMessages}</p>
                        </div>
                      </div>

                      {/* Engagement metrics */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-card border border-border rounded-xl p-6">
                          <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
                            Вовлечённость
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <MessageSquare size={16} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Среднее сообщений/сессия</span>
                              </div>
                              <span className="text-lg font-semibold">{chatAnalytics.avgMessagesPerSession}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Средняя длительность</span>
                              </div>
                              <span className="text-lg font-semibold">{chatAnalytics.avgSessionDuration} мин</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Star size={16} className="text-yellow-500" />
                                <span className="text-sm text-muted-foreground">Средняя оценка</span>
                              </div>
                              <span className="text-lg font-semibold">{chatAnalytics.avgRating}/10</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6">
                          <h4 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-yellow-500" />
                            Сигналы внимания
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <AlertTriangle size={16} className="text-orange-500" />
                                <span className="text-sm text-muted-foreground">Застряли на старте (&lt;3 сообщ.)</span>
                              </div>
                              <Badge variant={chatAnalytics.shortSessions > 10 ? "destructive" : "secondary"}>
                                {chatAnalytics.shortSessions}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-500" />
                                <span className="text-sm text-muted-foreground">Кризисные срабатывания</span>
                              </div>
                              <Badge variant={chatAnalytics.crisisDetections > 0 ? "destructive" : "secondary"}>
                                {chatAnalytics.crisisDetections}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <ThumbsDown size={16} className="text-orange-500" />
                                <span className="text-sm text-muted-foreground">Низкие оценки (≤4)</span>
                              </div>
                              <Badge variant={chatAnalytics.lowRatings > 5 ? "destructive" : "secondary"}>
                                {chatAnalytics.lowRatings}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Privacy notice */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-start gap-3">
                        <Shield size={20} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Конфиденциальность соблюдена</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Вы видите только метрики и паттерны. Содержимое чатов не отображается для защиты приватности пользователей.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-16 text-muted-foreground">
                      <p>Нет данных для отображения</p>
                    </div>
                  )}
                </div>
              </TabsContent>


              {/* Feedback Tab */}
              <TabsContent value="feedback">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Feedbacks list */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-xl font-semibold text-foreground">
                        Оценки пользователей
                      </h3>
                      <Button variant="outline" size="sm" onClick={fetchFeedbacks}>
                        <RefreshCw size={16} />
                      </Button>
                    </div>

                    {feedbacks.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Пока нет отзывов
                      </p>
                    ) : (
                      <ScrollArea className="h-96">
                        <div className="space-y-3">
                          {feedbacks.map((feedback) => {
                            const userProfile = profiles.find(p => p.id === feedback.user_id);
                            return (
                              <div 
                                key={feedback.id}
                                className="p-4 bg-secondary/50 rounded-lg space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    {[...Array(10)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        className={i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">{feedback.rating}/10</span>
                                </div>
                                
                                <p className="text-xs text-muted-foreground">
                                  {userProfile?.email || feedback.ip_address || "Аноним"}
                                </p>
                                
                                {feedback.message && (
                                  <p className="text-sm text-foreground">
                                    {feedback.message}
                                  </p>
                                )}
                                
                                {feedback.photo_url && (
                                  <button
                                    onClick={() => setSelectedPhoto(feedback.photo_url)}
                                    className="flex items-center gap-2 text-xs text-primary hover:underline"
                                  >
                                    <Image size={14} />
                                    Посмотреть фото
                                  </button>
                                )}
                                
                                <p className="text-xs text-muted-foreground">
                                  {new Date(feedback.created_at).toLocaleString('ru-RU')}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </div>

                  {/* Spam logs */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle size={18} className="text-yellow-500" />
                        Спам-попытки
                      </h3>
                      <Button variant="outline" size="sm" onClick={fetchSpamLogs}>
                        <RefreshCw size={16} />
                      </Button>
                    </div>

                    {spamLogs.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Спам-попыток не обнаружено
                      </p>
                    ) : (
                      <ScrollArea className="h-96">
                        <div className="space-y-3">
                          {spamLogs.map((log) => (
                            <div 
                              key={log.id}
                              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant="destructive" className="text-xs">
                                  {log.spam_type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(log.created_at).toLocaleString('ru-RU')}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                IP: {log.ip_address}
                              </p>
                              {log.message_content && (
                                <p className="text-sm text-foreground bg-background/50 p-2 rounded mt-2 break-all">
                                  {log.message_content}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                {/* Photo modal */}
                {selectedPhoto && (
                  <div 
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    <img
                      src={selectedPhoto}
                      alt="Feedback photo"
                      className="max-w-full max-h-full rounded-lg"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
