import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  RefreshCw,
  Crown,
  BookOpen,
  Mail,
  Calendar,
  Gift,
  Sparkles,
  History,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface AdminUser {
  user_id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  subscription_tier: string;
  subscription_expires_at: string | null;
  has_course: boolean;
}

interface GiftHistoryItem {
  id: string;
  user_id: string;
  gift_type: string;
  duration_days: number | null;
  message: string | null;
  created_at: string;
  expires_at: string | null;
  read: boolean;
  user_email?: string;
  user_name?: string;
}

const tierNames: Record<string, string> = { 
  free: "Бесплатный", 
  premium: "Премиум", 
  annual: "Годовой" 
};

const giftTypeOptions = [
  { value: "premium", label: "Премиум подписка", icon: Crown },
  { value: "annual", label: "Годовая подписка", icon: Crown },
  { value: "course", label: "Курс медитации", icon: BookOpen },
];

const durationOptions = [
  { value: "7", label: "1 неделя" },
  { value: "14", label: "2 недели" },
  { value: "30", label: "1 месяц" },
  { value: "90", label: "3 месяца" },
  { value: "180", label: "6 месяцев" },
  { value: "365", label: "1 год" },
  { value: "0", label: "Навсегда" },
];

const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState<string | null>(null);
  
  // Gift modal state
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [giftType, setGiftType] = useState<string>("premium");
  const [giftDuration, setGiftDuration] = useState<string>("30");
  const [giftMessage, setGiftMessage] = useState("");
  const [giftLoading, setGiftLoading] = useState(false);

  // Gift history state
  const [giftHistory, setGiftHistory] = useState<GiftHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchGiftHistory();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get users count
      const { data: countData, error: countError } = await supabase.rpc('get_users_count');
      if (!countError && countData !== null) {
        setUsersCount(countData);
      }

      // Get all users data
      const { data, error } = await supabase.rpc('get_all_users_for_admin');
      if (error) {
        console.error('Error fetching users:', error);
        toast.error("Ошибка при загрузке пользователей");
      } else if (data) {
        setUsers(data as AdminUser[]);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error("Ошибка при загрузке данных");
    } finally {
    setLoading(false);
    }
  };

  const fetchGiftHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gift history:', error);
      } else if (data) {
        // Get user info for each gift
        const giftsWithUsers = await Promise.all(
          data.map(async (gift) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email, name')
              .eq('id', gift.user_id)
              .maybeSingle();
            
            return {
              ...gift,
              user_email: profile?.email || null,
              user_name: profile?.name || null,
            };
          })
        );
        setGiftHistory(giftsWithUsers);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast.error("Email пользователя не указан");
      return;
    }
    
    setResetPasswordLoading(email);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) {
        toast.error(`Ошибка: ${error.message}`);
      } else {
        toast.success(`Письмо для сброса пароля отправлено на ${email}`);
      }
    } catch {
      toast.error("Ошибка при отправке письма");
    } finally {
      setResetPasswordLoading(null);
    }
  };

  const openGiftModal = (user: AdminUser) => {
    setSelectedUser(user);
    setGiftType("premium");
    setGiftDuration("30");
    setGiftMessage("");
    setGiftModalOpen(true);
  };

  const handleSendGift = async () => {
    if (!selectedUser) return;
    
    setGiftLoading(true);
    try {
      const durationDays = giftType === "course" ? null : (giftDuration === "0" ? null : parseInt(giftDuration));
      
      // Get current user (admin) id
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) {
        toast.error("Ошибка авторизации");
        return;
      }

      // Create gift record
      const { data: giftData, error: giftError } = await supabase
        .from('gifts')
        .insert({
          user_id: selectedUser.user_id,
          gift_type: giftType,
          duration_days: durationDays,
          message: giftMessage.trim() || null,
          created_by: adminUser.id,
        })
        .select()
        .single();

      if (giftError) {
        console.error('Gift insert error:', giftError);
        toast.error("Ошибка при создании подарка");
        return;
      }

      // Apply the gift (create subscription/course)
      const { error: applyError } = await supabase.rpc('apply_gift', {
        _gift_id: giftData.id,
        _user_id: selectedUser.user_id,
        _gift_type: giftType,
        _duration_days: durationDays,
      });

      if (applyError) {
        console.error('Apply gift error:', applyError);
        toast.error("Ошибка при применении подарка");
        return;
      }

      toast.success(`Подарок отправлен пользователю ${selectedUser.email || selectedUser.name || 'пользователю'}!`);
      setGiftModalOpen(false);
      fetchUsers();
      fetchGiftHistory();
    } catch (err) {
      console.error('Error sending gift:', err);
      toast.error("Произошла ошибка");
    } finally {
      setGiftLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: ru });
    } catch {
      return "—";
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      (user.email?.toLowerCase().includes(query)) ||
      (user.name?.toLowerCase().includes(query))
    );
  });

  const getGiftTypeName = (type: string) => {
    return giftTypeOptions.find(o => o.value === type)?.label || type;
  };

  const getDurationLabel = (days: number | null) => {
    if (days === null) return "Навсегда";
    const option = durationOptions.find(o => o.value === String(days));
    return option?.label || `${days} дней`;
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-card rounded-2xl border border-amber-500/30 shadow-card mb-8 overflow-hidden">
          <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors bg-amber-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Админ-панель
                </h2>
                <p className="text-sm text-muted-foreground">
                  Всего пользователей: {usersCount}
                </p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по email или имени..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={fetchUsers} 
                  disabled={loading}
                  className="shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{usersCount}</div>
                  <div className="text-xs text-muted-foreground">Всего</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="text-2xl font-bold text-amber-600">
                    {users.filter(u => u.subscription_tier === 'premium' || u.subscription_tier === 'annual').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Премиум</div>
                </div>
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.has_course).length}
                  </div>
                  <div className="text-xs text-muted-foreground">С курсом</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {users.filter(u => u.subscription_tier === 'free').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Бесплатных</div>
                </div>
              </div>

              {/* Users Table */}
              <div className="border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Пользователь</TableHead>
                        <TableHead className="font-semibold">Регистрация</TableHead>
                        <TableHead className="font-semibold">Подписка</TableHead>
                        <TableHead className="font-semibold">Курс</TableHead>
                        <TableHead className="font-semibold text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Загрузка...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            {searchQuery ? "Пользователи не найдены" : "Нет данных"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.user_id} className="hover:bg-muted/20">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                  {user.avatar_url ? (
                                    <img 
                                      src={user.avatar_url} 
                                      alt="" 
                                      className="w-full h-full object-cover" 
                                    />
                                  ) : (
                                    <Mail className="w-4 h-4 text-primary" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-foreground truncate">
                                    {user.name || "—"}
                                  </div>
                                  <div className="text-sm text-muted-foreground truncate">
                                    {user.email || "—"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(user.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                {(user.subscription_tier === 'premium' || user.subscription_tier === 'annual') && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                                )}
                                <span className={`text-sm ${
                                  user.subscription_tier === 'premium' || user.subscription_tier === 'annual' 
                                    ? 'text-amber-600 font-medium' 
                                    : 'text-muted-foreground'
                                }`}>
                                  {tierNames[user.subscription_tier] || user.subscription_tier}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.has_course ? (
                                <div className="flex items-center gap-1.5 text-green-600">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span className="text-sm font-medium">Есть</span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openGiftModal(user)}
                                  className="text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                                >
                                  <Gift className="w-3.5 h-3.5 mr-1" />
                                  Подарок
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => user.email && handleResetPassword(user.email)}
                                  disabled={!user.email || resetPasswordLoading === user.email}
                                  className="text-xs"
                                >
                                  {resetPasswordLoading === user.email ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    "Сбросить пароль"
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Footer note */}
              <p className="text-xs text-muted-foreground mt-3">
                Отображено {filteredUsers.length} из {users.length} пользователей
              </p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Gift History Section */}
      <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <div className="bg-card rounded-2xl border border-purple-500/30 shadow-card mb-8 overflow-hidden">
          <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors bg-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <History className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  История подарков
                </h2>
                <p className="text-sm text-muted-foreground">
                  Всего подарков: {giftHistory.length}
                </p>
              </div>
            </div>
            {isHistoryOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  onClick={fetchGiftHistory} 
                  disabled={historyLoading}
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${historyLoading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </div>

              <div className="border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Получатель</TableHead>
                        <TableHead className="font-semibold">Подарок</TableHead>
                        <TableHead className="font-semibold">Срок</TableHead>
                        <TableHead className="font-semibold">Дата</TableHead>
                        <TableHead className="font-semibold">Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Загрузка...
                          </TableCell>
                        </TableRow>
                      ) : giftHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Подарки ещё не отправлялись
                          </TableCell>
                        </TableRow>
                      ) : (
                        giftHistory.map((gift) => (
                          <TableRow key={gift.id} className="hover:bg-muted/20">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                  <Gift className="w-4 h-4 text-purple-500" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-foreground truncate">
                                    {gift.user_name || "—"}
                                  </div>
                                  <div className="text-sm text-muted-foreground truncate">
                                    {gift.user_email || "—"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                {gift.gift_type === 'course' ? (
                                  <BookOpen className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                                )}
                                <span className={`text-sm font-medium ${
                                  gift.gift_type === 'course' ? 'text-green-600' : 'text-amber-600'
                                }`}>
                                  {getGiftTypeName(gift.gift_type)}
                                </span>
                              </div>
                              {gift.message && (
                                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                                  "{gift.message}"
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {gift.gift_type === 'course' ? '—' : getDurationLabel(gift.duration_days)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(gift.created_at)}
                              </div>
                              {gift.expires_at && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                  <ArrowRight className="w-3 h-3" />
                                  {formatDate(gift.expires_at)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {gift.read ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                  Просмотрен
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                                  Новый
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Показано {giftHistory.length} подарков
              </p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Gift Modal */}
      <Dialog open={giftModalOpen} onOpenChange={setGiftModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-500" />
              Отправить подарок
            </DialogTitle>
            <DialogDescription>
              Подарок для {selectedUser?.name || selectedUser?.email || "пользователя"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Gift Type */}
            <div className="space-y-2">
              <Label>Тип подарка</Label>
              <Select value={giftType} onValueChange={setGiftType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {giftTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className={`w-4 h-4 ${
                          option.value === 'course' ? 'text-green-500' : 'text-amber-500'
                        }`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration (only for subscriptions) */}
            {giftType !== 'course' && (
              <div className="space-y-2">
                <Label>Срок действия</Label>
                <Select value={giftDuration} onValueChange={setGiftDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label>Сообщение (необязательно)</Label>
              <Textarea
                placeholder="Добавьте личное сообщение к подарку..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-pink-50 dark:from-amber-950/20 dark:to-pink-950/20 border border-amber-200/30 dark:border-amber-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-foreground">Превью подарка</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {giftTypeOptions.find(o => o.value === giftType)?.label}
                {giftType !== 'course' && ` • ${durationOptions.find(o => o.value === giftDuration)?.label}`}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setGiftModalOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSendGift}
              disabled={giftLoading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {giftLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Gift className="w-4 h-4 mr-2" />
              )}
              Отправить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPanel;
