import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, AlertTriangle, MessageSquare, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const MAX_CONVERSATIONS = 3;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const FREE_DAILY_LIMIT_SECONDS = 35 * 60; // 35 minutes
const MESSAGE_DELAY_MS = 1420; // 1.42 seconds delay between messages

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userTier, setUserTier] = useState<string>('free');
  const [dailySecondsUsed, setDailySecondsUsed] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [showNewChatWarning, setShowNewChatWarning] = useState(false);
  const [isSendingBlocked, setIsSendingBlocked] = useState(false);
  const sessionStartRef = useRef<number | null>(null);
  const usageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const lastMessageTimeRef = useRef<number>(0);
  const navigate = useNavigate();

  const welcomeMessages = [
    "Я здесь. Если хочешь — можешь просто написать, что сейчас внутри.",
    "Иногда сложно понять, что чувствуешь. Можем попробовать разобраться вместе.",
    "Можно не знать, с чего начать. Пиши как получается — я рядом.",
    "Привет. Не нужно подбирать слова — просто напиши, что на душе.",
    "Здесь можно быть честным. Что сейчас происходит?"
  ];

  const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
    timestamp: new Date(),
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Limit expired message
  const limitExpiredMessage: Message = {
    id: "limit-expired",
    role: "assistant",
    content: "К сожалению, ваше бесплатное время использования чата на сегодня закончилось. Мне было приятно общаться с вами.\n\nЧтобы продолжить наши беседы без ограничений, вы можете перейти на Premium-тариф. Это даст вам неограниченный доступ к нашему психологу 24/7.",
    timestamp: new Date(),
  };

  // Upgrade prompt message
  const upgradeMessage: Message = {
    id: "upgrade-prompt",
    role: "assistant",
    content: "💎 Перейти на Premium — безлимитный доступ к чату, приоритетная поддержка и эксклюзивные материалы. Посмотрите наши тарифы на странице /pricing",
    timestamp: new Date(),
  };

  // Load user subscription tier
  const loadUserTier = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('user_subscriptions')
      .select('tier')
      .eq('user_id', userId)
      .maybeSingle();
    
    const tier = data?.tier || 'free';
    setUserTier(tier);
    return tier;
  }, []);

  // Load daily chat usage for logged-in users
  const loadDailyUsage = useCallback(async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('chat_usage')
      .select('seconds_used')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .maybeSingle();
    
    const used = data?.seconds_used || 0;
    setDailySecondsUsed(used);
    return used;
  }, []);

  // Check anonymous user limit via edge function (IP-based)
  const checkAnonymousLimit = useCallback(async (): Promise<{ isLimitReached: boolean; secondsUsed: number }> => {
    try {
      const response = await supabase.functions.invoke('check-chat-limit', {
        body: { action: 'check' }
      });
      
      if (response.error) {
        console.error('Error checking anonymous limit:', response.error);
        return { isLimitReached: false, secondsUsed: 0 };
      }
      
      return {
        isLimitReached: response.data?.isLimitReached || false,
        secondsUsed: response.data?.secondsUsed || 0
      };
    } catch (error) {
      console.error('Error checking anonymous limit:', error);
      return { isLimitReached: false, secondsUsed: 0 };
    }
  }, []);

  // Update anonymous user usage via edge function
  const updateAnonymousUsage = useCallback(async (secondsToAdd: number) => {
    try {
      const response = await supabase.functions.invoke('check-chat-limit', {
        body: { action: 'update', secondsToAdd }
      });
      
      if (response.data) {
        setDailySecondsUsed(response.data.secondsUsed);
        return response.data;
      }
    } catch (error) {
      console.error('Error updating anonymous usage:', error);
    }
    return null;
  }, []);

  // Update usage in database for logged-in users
  const updateUsage = useCallback(async (userId: string, secondsToAdd: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabase
      .from('chat_usage')
      .select('id, seconds_used')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .maybeSingle();
    
    if (existing) {
      const newTotal = existing.seconds_used + secondsToAdd;
      await supabase
        .from('chat_usage')
        .update({ seconds_used: newTotal })
        .eq('id', existing.id);
      setDailySecondsUsed(newTotal);
      return newTotal;
    } else {
      await supabase
        .from('chat_usage')
        .insert({ user_id: userId, usage_date: today, seconds_used: secondsToAdd });
      setDailySecondsUsed(secondsToAdd);
      return secondsToAdd;
    }
  }, []);

  // Start session tracking
  const startSessionTracking = useCallback(() => {
    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
    }
  }, []);

  // Stop session tracking and save usage
  const stopSessionTracking = useCallback(async () => {
    if (sessionStartRef.current) {
      const sessionDuration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      if (sessionDuration > 0) {
        if (user) {
          await updateUsage(user.id, sessionDuration);
        } else {
          await updateAnonymousUsage(sessionDuration);
        }
      }
      sessionStartRef.current = null;
    }
  }, [user, updateUsage, updateAnonymousUsage]);

  // Show limit reached messages in chat
  const showLimitReachedMessages = useCallback(() => {
    setMessages(prev => {
      // Check if limit messages already shown
      if (prev.some(m => m.id === 'limit-expired')) {
        return prev;
      }
      return [...prev, limitExpiredMessage, upgradeMessage];
    });
    setIsLimitReached(true);
  }, []);

  // Check if limit is reached
  const checkLimit = useCallback((seconds: number, tier: string) => {
    if (tier !== 'free') {
      return false;
    }
    if (seconds >= FREE_DAILY_LIMIT_SECONDS) {
      showLimitReachedMessages();
      return true;
    }
    return false;
  }, [showLimitReachedMessages]);

  // Effect to track usage periodically (both logged-in and anonymous)
  useEffect(() => {
    // Only track for free tier (logged-in) or anonymous users
    const shouldTrack = (!user || userTier === 'free') && !isLimitReached;
    
    if (shouldTrack) {
      usageIntervalRef.current = setInterval(async () => {
        if (sessionStartRef.current) {
          const sessionDuration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
          const totalUsed = dailySecondsUsed + sessionDuration;
          
          if (totalUsed >= FREE_DAILY_LIMIT_SECONDS) {
            await stopSessionTracking();
            showLimitReachedMessages();
          }
        }
      }, 30000); // Check every 30 seconds
    }

    return () => {
      if (usageIntervalRef.current) {
        clearInterval(usageIntervalRef.current);
      }
    };
  }, [user, userTier, dailySecondsUsed, isLimitReached, stopSessionTracking, showLimitReachedMessages]);

  // Save usage on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionStartRef.current && user) {
        const sessionDuration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        if (sessionDuration > 0) {
          // Use sendBeacon for reliable tracking on unload
          navigator.sendBeacon(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/chat_usage`,
            JSON.stringify({})
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  // Check auth and load conversations
  useEffect(() => {
    let isMounted = true;
    
    const initializeChat = async (session: any) => {
      if (!isMounted) return;
      
      if (session?.user) {
        // Logged-in user
        setUser(session.user);
        
        // Only load conversations once
        if (!isInitializedRef.current) {
          isInitializedRef.current = true;
          await loadConversationsOnce();
        }
        
        const tier = await loadUserTier(session.user.id);
        const used = await loadDailyUsage(session.user.id);
        checkLimit(used, tier);
        startSessionTracking();
      } else {
        // Anonymous user - check IP-based limit
        setUser(null);
        setMessages([welcomeMessage]);
        setIsLoading(false);
        isInitializedRef.current = true;
        
        // Check anonymous limit
        const { isLimitReached: limitReached, secondsUsed } = await checkAnonymousLimit();
        if (!isMounted) return;
        setDailySecondsUsed(secondsUsed);
        if (limitReached) {
          showLimitReachedMessages();
        } else {
          startSessionTracking();
        }
      }
    };
    
    const loadConversationsOnce = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!isMounted) return;
      
      if (error) {
        console.error('Error loading conversations:', error);
        setMessages([welcomeMessage]);
        setIsLoading(false);
        return;
      }

      setConversations(data || []);
      
      if (data && data.length > 0) {
        await loadMessagesOnce(data[0].id);
      } else {
        setMessages([welcomeMessage]);
        setIsLoading(false);
      }
    };
    
    const loadMessagesOnce = async (conversationId: string) => {
      setCurrentConversationId(conversationId);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!isMounted) return;
      
      if (error) {
        console.error('Error loading messages:', error);
        setMessages([welcomeMessage]);
      } else if (data && data.length > 0) {
        setMessages(data.map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: new Date(msg.created_at),
        })));
      } else {
        setMessages([welcomeMessage]);
      }
      setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle on initial load or sign in/out
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        initializeChat(session);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isInitializedRef.current) {
        initializeChat(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      stopSessionTracking();
    };
  }, []);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      setIsLoading(false);
      return;
    }

    setConversations(data || []);
    
    if (data && data.length > 0) {
      loadMessages(data[0].id);
    } else {
      setMessages([welcomeMessage]);
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setIsLoading(true);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      setMessages([welcomeMessage]);
    } else if (data && data.length > 0) {
      setMessages(data.map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.created_at),
      })));
    } else {
      setMessages([welcomeMessage]);
    }
    setIsLoading(false);
  };

  const handleNewConversationClick = () => {
    if (!user) {
      toast.error("Войдите, чтобы сохранять историю разговоров");
      navigate('/auth');
      return;
    }

    // If we're at max, show warning
    if (conversations.length >= MAX_CONVERSATIONS) {
      setShowNewChatWarning(true);
    } else {
      createNewConversation();
    }
  };

  const createNewConversation = async () => {
    if (!user) return;

    // If at max, delete the oldest conversation first
    if (conversations.length >= MAX_CONVERSATIONS) {
      const oldestConversation = conversations[conversations.length - 1];
      const { error: deleteError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', oldestConversation.id);

      if (deleteError) {
        console.error('Error deleting oldest conversation:', deleteError);
        toast.error("Ошибка удаления старого разговора");
        return;
      }
      
      setConversations(prev => prev.filter(c => c.id !== oldestConversation.id));
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: 'Новый разговор' })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      toast.error("Ошибка создания разговора");
      return;
    }

    setConversations(prev => [data, ...prev]);
    setCurrentConversationId(data.id);
    setMessages([welcomeMessage]);
    setShowSidebar(false);
  };

  const deleteConversation = async (id: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Ошибка удаления разговора");
      return;
    }

    setConversations(prev => prev.filter(c => c.id !== id));
    
    if (currentConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        loadMessages(remaining[0].id);
      } else {
        setCurrentConversationId(null);
        setMessages([welcomeMessage]);
      }
    }
  };

  const saveMessage = async (message: Message, conversationId: string) => {
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Check if sending is blocked due to rate limit
    if (isSendingBlocked) {
      const remainingTime = Math.ceil((MESSAGE_DELAY_MS - (Date.now() - lastMessageTimeRef.current)) / 1000);
      toast.error(`Подождите ${remainingTime > 0 ? remainingTime : 1} сек. перед отправкой`);
      return;
    }
    
    // Check limit for both logged-in free users and anonymous users
    const isFreeUser = !user || userTier === 'free';
    
    if (isFreeUser) {
      const currentSessionSeconds = sessionStartRef.current 
        ? Math.floor((Date.now() - sessionStartRef.current) / 1000) 
        : 0;
      const totalUsed = dailySecondsUsed + currentSessionSeconds;
      
      if (totalUsed >= FREE_DAILY_LIMIT_SECONDS) {
        await stopSessionTracking();
        showLimitReachedMessages();
        return;
      }
    }

    // Set rate limit - block sending for 1.42 seconds
    setIsSendingBlocked(true);
    lastMessageTimeRef.current = Date.now();
    setTimeout(() => {
      setIsSendingBlocked(false);
    }, MESSAGE_DELAY_MS);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Create conversation if user is logged in and no current conversation
    let convId = currentConversationId;
    if (user && !convId) {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, title: userMessage.content.slice(0, 50) })
        .select()
        .single();

      if (!error && data) {
        convId = data.id;
        setCurrentConversationId(data.id);
        setConversations(prev => [data, ...prev]);
      }
    }

    // Save user message
    if (user && convId) {
      await saveMessage(userMessage, convId);
      // Update conversation title if it's the first message
      if (messages.length <= 1) {
        await supabase
          .from('conversations')
          .update({ title: userMessage.content.slice(0, 50) })
          .eq('id', convId);
        
        setConversations(prev => 
          prev.map(c => c.id === convId ? { ...c, title: userMessage.content.slice(0, 50) } : c)
        );
      }
    }

    // Get AI response
    try {
      // Build conversation history for AI (excluding welcome message)
      const conversationHistory = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.role,
          content: m.content,
        }));
      
      conversationHistory.push({
        role: "user",
        content: userMessage.content,
      });

      const response = await supabase.functions.invoke('psychologist-chat', {
        body: { messages: conversationHistory, userTier },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Ошибка получения ответа');
      }

      const aiContent = response.data?.content;
      
      if (!aiContent) {
        throw new Error('Пустой ответ от ИИ');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // Save AI message
      if (user && convId) {
        await saveMessage(aiMessage, convId);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      toast.error("Не удалось получить ответ. Попробуйте ещё раз.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Назад</span>
              </Link>
              
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">История</span>
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-muted-foreground">ИИ-психолог онлайн</span>
            </div>
            
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewConversationClick}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Новый</span>
              </Button>
            )}
            
            {!user && <div className="w-20" />}
          </div>
        </div>
      </header>

      {/* Sidebar for conversations */}
      {showSidebar && user && (
        <div className="fixed left-0 top-16 bottom-0 w-72 bg-background border-r border-border/50 z-40 overflow-y-auto">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">История разговоров</h3>
              <span className="text-xs text-muted-foreground">{conversations.length}/{MAX_CONVERSATIONS}</span>
            </div>
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет сохранённых разговоров</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversationId === conv.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-bay-fog/50'
                  }`}
                  onClick={() => {
                    loadMessages(conv.id);
                    setShowSidebar(false);
                  }}
                >
                  <span className="text-sm truncate flex-1">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <main className={`flex-1 pt-20 pb-32 overflow-y-auto ${showSidebar && user ? 'ml-72' : ''}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Disclaimer */}
          <div className="mb-8 p-4 rounded-xl bg-bay-warm/50 border border-bay-mist/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Quiet Bay не является медицинским сервисом. Если вы находитесь в кризисной ситуации 
                  или испытываете мысли о самоповреждении, пожалуйста, обратитесь за профессиональной помощью: 
                  телефон доверия 8-800-2000-122 (бесплатно по России).
                </p>
                {!user && (
                  <p className="text-xs text-primary">
                    <Link to="/auth" className="underline hover:no-underline">Войдите</Link>, чтобы сохранять историю разговоров
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-bay-fog text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className={`text-xs mt-2 block ${
                    message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString("ru-RU", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-bay-fog rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 ${showSidebar && user ? 'ml-72' : ''}`}>
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={isLimitReached ? "Сервис временно недоступен..." : "Напишите, что вас беспокоит..."}
                className="w-full px-4 py-3 rounded-xl bg-bay-fog/50 border border-bay-mist/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground transition-all duration-300 min-h-[48px] max-h-[120px]"
                rows={1}
                disabled={isLimitReached}
              />
            </div>
            <Button
              type="submit"
              variant="calm"
              size="icon"
              className="h-12 w-12 rounded-xl flex-shrink-0"
              disabled={!input.trim() || isTyping || isLimitReached}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Нажмите Enter для отправки • Shift+Enter для новой строки
          </p>
        </div>
      </div>

      {/* Warning dialog for max conversations */}
      <AlertDialog open={showNewChatWarning} onOpenChange={setShowNewChatWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Создать новый разговор?</AlertDialogTitle>
            <AlertDialogDescription>
              В истории чата хранится максимум {MAX_CONVERSATIONS} прошлых чата. 
              После создания нового разговора самый старый чат будет удалён навсегда без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowNewChatWarning(false);
              createNewConversation();
            }}>
              Создать новый
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chat;