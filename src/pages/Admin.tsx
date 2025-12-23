import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageCircle, 
  BookOpen, 
  Crown, 
  Activity,
  Gift,
  Star,
  ShieldAlert,
  Trash2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  MessageSquare,
  UserX,
  Zap
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  lesson_number: number;
}

interface UserActivity {
  user_id: string;
  activity_type: string;
  last_seen_at: string;
}

interface ChatReview {
  id: string;
  ip_address: string;
  user_id: string | null;
  rating: number;
  message: string | null;
  image_url: string | null;
  created_at: string;
}

interface SpamLog {
  id: string;
  ip_address: string;
  reason: string;
  user_agent: string | null;
  created_at: string;
}

interface ChatSignals {
  totalConversations: number;
  totalMessages: number;
  avgMessagesPerConversation: number;
  shortConversations: number; // <= 2 messages (stuck at start)
  mediumConversations: number; // 3-10 messages
  longConversations: number; // > 10 messages
  abandonedRate: number; // % of conversations with only 1 user message
  avgConversationLength: number;
  todayConversations: number;
  weekConversations: number;
  conversationsWithManyMessages: number; // possible crisis indicators
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [reviews, setReviews] = useState<ChatReview[]>([]);
  const [spamLogs, setSpamLogs] = useState<SpamLog[]>([]);
  const [signals, setSignals] = useState<ChatSignals | null>(null);
  const [signalsLoading, setSignalsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [grantType, setGrantType] = useState<'course' | 'subscription'>('course');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [durationValue, setDurationValue] = useState<string>('1');
  const [durationUnit, setDurationUnit] = useState<string>('months');
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchCourses();
      fetchActivities();
      fetchReviews();
      fetchSpamLogs();
      fetchChatSignals();
      
      // Subscribe to realtime activity updates
      const channel = supabase
        .channel('admin-activity')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_activity' },
          () => {
            fetchActivities();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc('get_all_profiles_for_admin');
    if (!error && data) {
      setUsers(data as UserProfile[]);
    }
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, lesson_number')
      .order('lesson_number');
    if (!error && data) {
      setCourses(data);
    }
  };

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .gte('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());
    if (!error && data) {
      setActivities(data);
    }
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('chat_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) {
      setReviews(data as ChatReview[]);
    }
  };

  const fetchSpamLogs = async () => {
    const { data, error } = await supabase
      .from('spam_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) {
      setSpamLogs(data as SpamLog[]);
    }
  };

  const fetchChatSignals = async () => {
    setSignalsLoading(true);
    try {
      // Fetch all conversations
      const { data: conversations, error: convError } = await supabase
        .from('chat_conversations')
        .select('id, created_at');
      
      if (convError) throw convError;
      
      // Fetch all messages with conversation_id
      const { data: messages, error: msgError } = await supabase
        .from('chat_messages')
        .select('conversation_id, role, created_at');
      
      if (msgError) throw msgError;
      
      // Calculate signals
      const totalConversations = conversations?.length || 0;
      const totalMessages = messages?.length || 0;
      
      // Group messages by conversation
      const messagesByConversation = new Map<string, { user: number; assistant: number }>();
      messages?.forEach(msg => {
        const current = messagesByConversation.get(msg.conversation_id) || { user: 0, assistant: 0 };
        if (msg.role === 'user') current.user++;
        else current.assistant++;
        messagesByConversation.set(msg.conversation_id, current);
      });
      
      let shortConversations = 0; // 1-2 messages (stuck)
      let mediumConversations = 0; // 3-10 messages
      let longConversations = 0; // > 10 messages
      let abandonedCount = 0; // only 1 user message
      let highMessageCount = 0; // > 20 messages (potential crisis)
      
      const conversationLengths: number[] = [];
      
      messagesByConversation.forEach(({ user, assistant }) => {
        const total = user + assistant;
        conversationLengths.push(total);
        
        if (total <= 2) shortConversations++;
        else if (total <= 10) mediumConversations++;
        else longConversations++;
        
        if (user <= 1) abandonedCount++;
        if (total > 20) highMessageCount++;
      });
      
      const avgMessagesPerConversation = totalConversations > 0 
        ? Math.round(totalMessages / totalConversations * 10) / 10 
        : 0;
      
      const abandonedRate = totalConversations > 0 
        ? Math.round(abandonedCount / totalConversations * 100) 
        : 0;
      
      const avgLength = conversationLengths.length > 0
        ? Math.round(conversationLengths.reduce((a, b) => a + b, 0) / conversationLengths.length * 10) / 10
        : 0;
      
      // Today's and week's conversations
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const todayConversations = conversations?.filter(c => c.created_at && c.created_at >= todayStart).length || 0;
      const weekConversations = conversations?.filter(c => c.created_at && c.created_at >= weekAgo).length || 0;
      
      setSignals({
        totalConversations,
        totalMessages,
        avgMessagesPerConversation,
        shortConversations,
        mediumConversations,
        longConversations,
        abandonedRate,
        avgConversationLength: avgLength,
        todayConversations,
        weekConversations,
        conversationsWithManyMessages: highMessageCount
      });
    } catch (error) {
      console.error('Error fetching chat signals:', error);
    } finally {
      setSignalsLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    const { error } = await supabase
      .from('chat_reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить отзыв"
      });
    } else {
      toast({ title: "Отзыв удалён" });
      fetchReviews();
    }
  };

  const handleGrantCourse = async () => {
    if (!selectedUser || !selectedCourseId) return;
    
    const { error } = await supabase.rpc('admin_grant_course', {
      _user_id: selectedUser.id,
      _course_id: selectedCourseId
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message
      });
    } else {
      toast({
        title: "Успешно",
        description: `Курс выдан пользователю ${selectedUser.display_name || selectedUser.email}`
      });
      setGrantDialogOpen(false);
    }
  };

  const handleGrantSubscription = async () => {
    if (!selectedUser || !selectedPlan) return;
    
    const { error } = await supabase.rpc('admin_grant_subscription', {
      _user_id: selectedUser.id,
      _plan: selectedPlan,
      _duration_value: parseInt(durationValue),
      _duration_unit: durationUnit
    });
    
    const unitLabels: Record<string, string> = {
      hours: 'ч.',
      days: 'дн.',
      weeks: 'нед.',
      months: 'мес.',
      years: 'г.'
    };
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message
      });
    } else {
      toast({
        title: "Успешно",
        description: `Подписка ${selectedPlan} выдана на ${durationValue} ${unitLabels[durationUnit]}`
      });
      setGrantDialogOpen(false);
    }
  };

  const openGrantDialog = (user: UserProfile, type: 'course' | 'subscription') => {
    setSelectedUser(user);
    setGrantType(type);
    setGrantDialogOpen(true);
  };

  const onlineCount = activities.length;
  const watchingCourseCount = activities.filter(a => a.activity_type === 'watching_course').length;
  const chattingCount = activities.filter(a => a.activity_type === 'chatting').length;

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length * 10) / 10
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Админ-панель</h1>
              <p className="text-muted-foreground">Управление пользователями и аналитика</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{users.length}</p>
                    <p className="text-sm text-muted-foreground">Всего пользователей</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{onlineCount}</p>
                    <p className="text-sm text-muted-foreground">Онлайн сейчас</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{watchingCourseCount}</p>
                    <p className="text-sm text-muted-foreground">Смотрят курсы</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{chattingCount}</p>
                    <p className="text-sm text-muted-foreground">Общаются с ИИ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="signals" className="space-y-6">
            <TabsList>
              <TabsTrigger value="signals">📊 Сигналы</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы ({reviews.length})</TabsTrigger>
              <TabsTrigger value="spam">Спам ({spamLogs.length})</TabsTrigger>
            </TabsList>

            {/* Signals Tab - NEW */}
            <TabsContent value="signals">
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Всего диалогов
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">
                        {signalsLoading ? '...' : signals?.totalConversations || 0}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {signals?.totalMessages || 0} сообщений
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Ср. длина диалога
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">
                        {signalsLoading ? '...' : signals?.avgMessagesPerConversation || 0}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        сообщений на диалог
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        Средняя оценка
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">
                        {avgRating}/10
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        на основе {reviews.length} отзывов
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Patterns & Anomalies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Conversation Distribution */}
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Распределение диалогов
                      </CardTitle>
                      <CardDescription>По количеству сообщений</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {signalsLoading ? (
                        <div className="animate-pulse space-y-3">
                          <div className="h-8 bg-muted rounded" />
                          <div className="h-8 bg-muted rounded" />
                          <div className="h-8 bg-muted rounded" />
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">🔴 Короткие (1-2 сообщ.)</span>
                              <span className="font-medium">{signals?.shortConversations || 0}</span>
                            </div>
                            <Progress 
                              value={signals?.totalConversations ? (signals.shortConversations / signals.totalConversations * 100) : 0} 
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">🟡 Средние (3-10 сообщ.)</span>
                              <span className="font-medium">{signals?.mediumConversations || 0}</span>
                            </div>
                            <Progress 
                              value={signals?.totalConversations ? (signals.mediumConversations / signals.totalConversations * 100) : 0} 
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">🟢 Длинные (&gt;10 сообщ.)</span>
                              <span className="font-medium">{signals?.longConversations || 0}</span>
                            </div>
                            <Progress 
                              value={signals?.totalConversations ? (signals.longConversations / signals.totalConversations * 100) : 0} 
                              className="h-2"
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Anomalies & Alerts */}
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Сигналы внимания
                      </CardTitle>
                      <CardDescription>Паттерны и аномалии</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {signalsLoading ? (
                        <div className="animate-pulse space-y-3">
                          <div className="h-16 bg-muted rounded" />
                          <div className="h-16 bg-muted rounded" />
                        </div>
                      ) : (
                        <>
                          {/* Abandoned Rate */}
                          <div className={`p-3 rounded-lg border ${
                            (signals?.abandonedRate || 0) > 50 
                              ? 'bg-destructive/10 border-destructive/30' 
                              : (signals?.abandonedRate || 0) > 30 
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-green-500/10 border-green-500/30'
                          }`}>
                            <div className="flex items-center gap-2">
                              <UserX className={`w-5 h-5 ${
                                (signals?.abandonedRate || 0) > 50 ? 'text-destructive' : 
                                (signals?.abandonedRate || 0) > 30 ? 'text-amber-500' : 'text-green-500'
                              }`} />
                              <div>
                                <p className="font-medium text-sm">
                                  {signals?.abandonedRate || 0}% уходят на старте
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Диалоги с 1 сообщением пользователя
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* High message conversations (potential crisis) */}
                          <div className={`p-3 rounded-lg border ${
                            (signals?.conversationsWithManyMessages || 0) > 10 
                              ? 'bg-amber-500/10 border-amber-500/30' 
                              : 'bg-muted/50 border-border/30'
                          }`}>
                            <div className="flex items-center gap-2">
                              <Zap className={`w-5 h-5 ${
                                (signals?.conversationsWithManyMessages || 0) > 10 ? 'text-amber-500' : 'text-muted-foreground'
                              }`} />
                              <div>
                                <p className="font-medium text-sm">
                                  {signals?.conversationsWithManyMessages || 0} интенсивных диалогов
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Более 20 сообщений (возможно кризисное состояние)
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Short conversations indicator */}
                          {signals && signals.shortConversations > signals.totalConversations * 0.4 && (
                            <div className="p-3 rounded-lg border bg-destructive/10 border-destructive/30">
                              <div className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-destructive" />
                                <div>
                                  <p className="font-medium text-sm">
                                    Много застрявших на старте
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    &gt;40% диалогов — короткие. Проверьте первое сообщение бота.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Time-based metrics */}
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Активность по времени
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold text-foreground">
                          {signalsLoading ? '...' : signals?.todayConversations || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Сегодня</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold text-foreground">
                          {signalsLoading ? '...' : signals?.weekConversations || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">За неделю</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold text-foreground">
                          {signalsLoading ? '...' : Math.round((signals?.weekConversations || 0) / 7)}
                        </p>
                        <p className="text-sm text-muted-foreground">В среднем/день</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-2xl font-bold text-foreground">
                          {spamLogs.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Попыток спама</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  variant="outline" 
                  onClick={fetchChatSignals}
                  disabled={signalsLoading}
                >
                  🔄 Обновить сигналы
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Все пользователи</CardTitle>
                  <CardDescription>Управление курсами и подписками</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {users.map((u) => (
                        <div 
                          key={u.id} 
                          className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Users className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {u.display_name || 'Без имени'}
                              </p>
                              <p className="text-sm text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openGrantDialog(u, 'course')}
                            >
                              <BookOpen className="w-4 h-4 mr-1" />
                              Курс
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openGrantDialog(u, 'subscription')}
                            >
                              <Crown className="w-4 h-4 mr-1" />
                              Подписка
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    Отзывы пользователей
                  </CardTitle>
                  <CardDescription>Оценки и отзывы о работе чата</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {reviews.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Отзывов пока нет</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div 
                            key={review.id} 
                            className="p-4 rounded-lg bg-background/50 border border-border/30"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {/* Star Rating Display */}
                                  <div className="flex gap-0.5">
                                    {[1,2,3,4,5,6,7,8,9,10].map((s) => (
                                      <Star 
                                        key={s} 
                                        className={`w-4 h-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium text-foreground">{review.rating}/10</span>
                                </div>
                                
                                {review.message && (
                                  <p className="text-sm text-foreground mb-2">{review.message}</p>
                                )}
                                
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>IP: {review.ip_address}</span>
                                  <span>{new Date(review.created_at).toLocaleString('ru-RU')}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2">
                                {review.image_url && (
                                  <button
                                    onClick={() => setSelectedReviewImage(review.image_url)}
                                    className="w-12 h-12 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
                                  >
                                    <img 
                                      src={review.image_url} 
                                      alt="Фото отзыва" 
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteReview(review.id)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spam Logs Tab */}
            <TabsContent value="spam">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                    Логи спама
                  </CardTitle>
                  <CardDescription>Попытки спама и rate limit нарушения</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {spamLogs.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Попыток спама не обнаружено</p>
                    ) : (
                      <div className="space-y-2">
                        {spamLogs.map((log) => (
                          <div 
                            key={log.id} 
                            className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="destructive">{log.reason}</Badge>
                                <span className="text-sm text-muted-foreground">IP: {log.ip_address}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleString('ru-RU')}
                              </span>
                            </div>
                            {log.user_agent && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {log.user_agent}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Grant Dialog */}
      <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {grantType === 'course' ? 'Выдать курс' : 'Выдать подписку'}
            </DialogTitle>
            <DialogDescription>
              Пользователь: {selectedUser?.display_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          {grantType === 'course' ? (
            <div className="space-y-4">
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите курс" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      Урок {course.lesson_number}: {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGrantCourse} className="w-full">
                <Gift className="w-4 h-4 mr-2" />
                Выдать курс
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите план" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Премиум (399₽/мес)</SelectItem>
                  <SelectItem value="yearly">Годовой Премиум (3899₽/год)</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Select value={durationValue} onValueChange={setDurationValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Количество" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={durationUnit} onValueChange={setDurationUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Единица" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Час(ов)</SelectItem>
                      <SelectItem value="days">День(дней)</SelectItem>
                      <SelectItem value="weeks">Неделя(ь)</SelectItem>
                      <SelectItem value="months">Месяц(ев)</SelectItem>
                      <SelectItem value="years">Год(лет)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGrantSubscription} className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Выдать подписку
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview */}
      {selectedReviewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedReviewImage(null)}
        >
          <img 
            src={selectedReviewImage} 
            alt="Фото отзыва" 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Admin;
