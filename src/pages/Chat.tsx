import { Button } from "@/components/ui/button";
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
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Bot, User, Plus, MessageSquare, Trash2, PanelLeftClose, ArrowLeft, Star, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Link, useSearchParams } from "react-router-dom";
import alenaPortrait from "@/assets/alena-portrait.jpg";
import ChatReviewForm from "@/components/ChatReviewForm";
import SEO from "@/components/SEO";

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

// Get subscription type from localStorage (in real app this would come from auth)
const getSubscriptionType = (): 'free' | 'premium' | 'annual' => {
  return (localStorage.getItem('subscription_type') as 'free' | 'premium' | 'annual') || 'free';
};

const getMaxConversations = (subscriptionType: string): number => {
  switch (subscriptionType) {
    case 'annual': return Infinity;
    case 'premium': return 7;
    default: return 3;
  }
};

const MESSAGE_DELAY_MS = 1500; // 1.5 seconds delay between messages (matches server)
const MIN_MESSAGE_LENGTH = 1;
const MAX_MESSAGE_LENGTH = 5000;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [replaceOldestDialogOpen, setReplaceOldestDialogOpen] = useState(false);
  const [isReplacingOldest, setIsReplacingOldest] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false); // Prevent duplicate submissions
  const { toast } = useToast();
  
  // Track chat activity
  useActivityTracker('chatting');
  
  const subscriptionType = getSubscriptionType();
  const maxConversations = getMaxConversations(subscriptionType);

  // Get IP address
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch {
        // Fallback to random ID if IP fetch fails
        setIpAddress(`local-${Math.random().toString(36).substring(7)}`);
      }
    };
    getIP();
  }, []);

  // Load conversations - for authenticated users by user_id, for guests by IP
  const loadConversations = useCallback(async () => {
    if (!ipAddress) return;
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase
      .from('chat_conversations')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(maxConversations === Infinity ? 100 : maxConversations);
    
    if (user) {
      // Authenticated user - load by user_id
      query = query.eq('user_id', user.id);
    } else {
      // Guest - load by IP address
      query = query.eq('ip_address', ipAddress).is('user_id', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }

    setConversations(data || []);
  }, [ipAddress, maxConversations]);

  // Handle URL conversation parameter
  const [searchParams] = useSearchParams();
  const urlConversationId = searchParams.get('conversation');

  useEffect(() => {
    if (ipAddress) {
      loadConversations();
    }
  }, [ipAddress, loadConversations]);

  // Load conversation from URL parameter
  useEffect(() => {
    if (urlConversationId && ipAddress && conversations.length > 0) {
      const conv = conversations.find(c => c.id === urlConversationId);
      if (conv && currentConversationId !== urlConversationId) {
        selectConversation(conv);
      }
    }
  }, [urlConversationId, ipAddress, conversations]);

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data?.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.created_at),
    })) || []);
  };

  const isConversationLimitReached =
    maxConversations !== Infinity && conversations.length >= maxConversations;

  const oldestConversation =
    isConversationLimitReached ? conversations[conversations.length - 1] : null;

  const deleteConversationById = async (convId: string) => {
    if (!ipAddress) return false;

    const { error } = await supabase.functions.invoke("chat-conversation-delete", {
      body: { conversationId: convId, ipAddress },
    });

    if (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Не удалось удалить чат",
        description: "Попробуйте ещё раз.",
        variant: "destructive",
      });
      return false;
    }

    if (currentConversationId === convId) {
      setCurrentConversationId(null);
      setMessages([]);
    }

    return true;
  };

  const createConversationRecord = async (): Promise<string | null> => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({
        ip_address: ipAddress,
        title: "Новый разговор",
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Не удалось создать чат",
        description: "Попробуйте ещё раз.",
        variant: "destructive",
      });
      return null;
    }

    const welcomeMessage = "Я здесь.\nЗдесь можно быть любым и не подбирать слова.\nМы никуда не спешим.";

    // Save welcome message to database so it persists
    const { data: welcomeData } = await supabase.from('chat_messages').insert({
      conversation_id: data.id,
      role: 'assistant',
      content: welcomeMessage,
    }).select().single();

    setCurrentConversationId(data.id);
    setMessages([
      {
        id: welcomeData?.id || "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);

    await loadConversations();
    return data.id;
  };

  // Create new conversation (if лимит достигнут — предложить заменить самый старый чат)
  const createNewConversation = async (): Promise<string | null> => {
    if (!ipAddress) return null;

    if (isConversationLimitReached) {
      setReplaceOldestDialogOpen(true);
      return null;
    }

    return await createConversationRecord();
  };

  const replaceOldestAndCreate = async () => {
    if (!ipAddress || isReplacingOldest) return;

    setIsReplacingOldest(true);

    try {
      if (oldestConversation) {
        const deleted = await deleteConversationById(oldestConversation.id);
        if (deleted) {
          toast({
            title: "Старый чат удалён",
            description: "Освободили место для нового разговора.",
          });
        }
      }

      await createConversationRecord();
    } finally {
      setIsReplacingOldest(false);
    }
  };

  // Select conversation
  const selectConversation = async (conv: Conversation) => {
    setCurrentConversationId(conv.id);
    await loadMessages(conv.id);
  };

  // Show limit reached message from Alena
  const showLimitReachedMessage = () => {
    const limitMessage: Message = {
      id: `limit-${Date.now()}`,
      role: "assistant",
      content: `💫 Мы так хорошо поговорили сегодня...

К сожалению, твой бесплатный лимит на 35 минут в день исчерпан.

Но я буду рада продолжить наш разговор! С премиум-подпиской ты получишь:

✨ **Безлимитное общение** — мы сможем говорить столько, сколько тебе нужно
🧠 **Я буду помнить тебя** — наши разговоры станут глубже
📚 **Доступ к курсам** — практические упражнения для работы над собой

[Посмотреть тарифы →](/pricing)

Увидимся завтра или... в премиуме? 💛`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, limitMessage]);
  };

  // Check usage limits
  const checkUsageLimit = async (): Promise<{ canProceed: boolean; remainingMinutes?: number }> => {
    if (subscriptionType !== 'free') return { canProceed: true };

    try {
      const { data, error } = await supabase.functions.invoke('usage-tracking', {
        body: { ipAddress, action: 'check' }
      });

      if (error) throw error;

      if (data.isLimitReached) {
        showLimitReachedMessage();
        return { canProceed: false };
      }
      return { canProceed: true, remainingMinutes: data.remainingMinutes };
    } catch (error) {
      console.error('Error checking usage:', error);
      return { canProceed: true }; // Allow on error
    }
  };

  // Update usage time
  const updateUsageTime = async (minutes: number) => {
    if (subscriptionType !== 'free') return;

    try {
      await supabase.functions.invoke('usage-tracking', {
        body: { ipAddress, action: 'update', minutesToAdd: minutes }
      });
    } catch (error) {
      console.error('Error updating usage:', error);
    }
  };

  // Cooldown timer for rate limiting
  const startCooldownTimer = (durationMs: number) => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }
    
    setCooldownRemaining(Math.ceil(durationMs / 1000));
    
    cooldownIntervalRef.current = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Log spam attempt
  const logSpamAttempt = async (reason: string) => {
    try {
      await supabase.from('spam_logs').insert({
        ip_address: ipAddress,
        reason,
        user_agent: navigator.userAgent,
      });
      console.log(`Spam attempt logged: ${reason} from ${ipAddress}`);
    } catch (error) {
      console.error('Failed to log spam attempt:', error);
    }
  };

  // Cleanup cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Stream chat response
  const streamChat = async (userMessages: { role: string; content: string }[]) => {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: userMessages,
        conversationId: currentConversationId,
        ipAddress,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = errorData.retryAfter || 5;
        throw new Error(`${errorData.error || 'Слишком много запросов'} (осталось ${retryAfter} сек.)`);
      }
      
      throw new Error(errorData.error || 'Ошибка сервиса');
    }

    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmittingRef.current) return;
    
    const trimmedInput = input.trim();
    
    // Client-side validation
    if (!trimmedInput || isLoading || cooldownRemaining > 0) return;
    
    // Lock submission
    isSubmittingRef.current = true;
    
    if (trimmedInput.length < MIN_MESSAGE_LENGTH) {
      toast({
        title: "Ошибка",
        description: "Сообщение слишком короткое",
        variant: "destructive",
      });
      return;
    }
    
    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Ошибка",
        description: `Сообщение слишком длинное (максимум ${MAX_MESSAGE_LENGTH} символов)`,
        variant: "destructive",
      });
      return;
    }
    
    // Check for spam patterns
    const spamPattern = /(.)\1{20,}/;
    if (spamPattern.test(trimmedInput)) {
      toast({
        title: "Ошибка",
        description: "Обнаружен спам-контент",
        variant: "destructive",
      });
      return;
    }

    // Check if enough time has passed since last message - BLOCK if too soon
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    
    if (lastMessageTime > 0 && timeSinceLastMessage < MESSAGE_DELAY_MS) {
      const remainingDelay = MESSAGE_DELAY_MS - timeSinceLastMessage;
      const remainingSec = Math.ceil(remainingDelay / 1000);
      
      // Log spam attempt
      logSpamAttempt('rate_limit_exceeded');
      
      toast({
        title: "Подождите",
        description: `Можно отправить сообщение через ${remainingSec} сек.`,
        variant: "destructive",
      });
      
      // Start cooldown timer
      startCooldownTimer(remainingDelay);
      
      return; // BLOCK - don't send message
    }

    // Check usage limit
    const usageCheck = await checkUsageLimit();
    if (!usageCheck.canProceed) {
      isSubmittingRef.current = false;
      return;
    }

    // Create conversation if none exists
    let activeConversationId = currentConversationId;
    if (!activeConversationId) {
      const newConvId = await createNewConversation();
      if (!newConvId) return; // Dialog shown or error
      activeConversationId = newConvId;
    }

    setStartTime(new Date());
    setLastMessageTime(Date.now());
    
    // Start cooldown after sending
    startCooldownTimer(MESSAGE_DELAY_MS);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    // Get current messages before updating state
    const currentMessages = [...messages];

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Save user message to database
    const { data: savedUserMsg } = await supabase.from('chat_messages').insert({
      conversation_id: activeConversationId,
      role: 'user',
      content: userMessage.content,
    }).select().single();

    // Update message id with saved id
    if (savedUserMsg) {
      userMessage.id = savedUserMsg.id;
    }

    // Update conversation title if it's the first user message
    if (currentMessages.filter(m => m.role === 'user').length === 0) {
      const title = userMessage.content.substring(0, 50) + (userMessage.content.length > 50 ? '...' : '');
      await supabase
        .from('chat_conversations')
        .update({ title })
        .eq('id', activeConversationId);
      await loadConversations();
    }

    try {
      // Send ALL messages (including welcome) to AI so it has full context
      const messagesForApi = currentMessages
        .map(m => ({ role: m.role, content: m.content }))
        .concat([{ role: 'user', content: userMessage.content }]);

      const response = await streamChat(messagesForApi);
      
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      const assistantId = (Date.now() + 1).toString();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, {
                  id: assistantId,
                  role: "assistant",
                  content: assistantContent,
                  timestamp: new Date(),
                }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save assistant message to database
      if (activeConversationId && assistantContent) {
        await supabase.from('chat_messages').insert({
          conversation_id: activeConversationId,
          role: 'assistant',
          content: assistantContent,
        });
      }

      // Update usage time
      if (startTime) {
        const minutesUsed = Math.ceil((new Date().getTime() - startTime.getTime()) / 60000);
        await updateUsageTime(minutesUsed);
      }

      // Generate session summary and extract memory after enough messages
      const userMsgCount = messages.filter(m => m.role === 'user').length + 1; // +1 for current message
      if (userMsgCount >= 5 && userMsgCount % 5 === 0) {
        // Generate summary every 5 user messages
        try {
          await supabase.functions.invoke('generate-session-summary', {
            body: { conversationId: activeConversationId, ipAddress }
          });
        } catch (summaryError) {
          console.log('Summary generation skipped:', summaryError);
        }

        // Extract memories every 5 user messages
        try {
          await supabase.functions.invoke('extract-memory', {
            body: { conversationId: activeConversationId, ipAddress }
          });
        } catch (memoryError) {
          console.log('Memory extraction skipped:', memoryError);
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при отправке сообщения",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setStartTime(null);
      isSubmittingRef.current = false; // Unlock submission
    }
  };

  // Delete conversation
  const deleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const deleted = await deleteConversationById(convId);
    if (!deleted) return;

    await loadConversations();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Чат с Алёной"
        description="Начните разговор с ИИ-психологом Алёной. Эмоциональная поддержка 24/7, без осуждения, полная конфиденциальность."
        canonical="/chat"
        noindex={true}
      />
      {/* Minimal Header for Chat */}
      <header className="h-14 bg-background/80 backdrop-blur-lg border-b border-border/50 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-sm">Q</span>
            </div>
            <span className="font-serif text-lg font-semibold text-foreground hidden sm:inline">Quiet Bay</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label={showSidebar ? "Скрыть историю" : "Показать историю"}
            title={showSidebar ? "Скрыть историю чатов" : "Показать историю чатов"}
          >
            {showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          </button>
          <Link 
            to="/" 
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="На главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>
      
      <main className="flex-1 pt-14 flex">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-card border-r border-border flex-shrink-0 transition-all duration-300 overflow-hidden fixed top-14 left-0 bottom-0 z-40`}>
          <div className="p-4 h-full flex flex-col w-64">
            <Button 
              onClick={() => createNewConversation()} 
              variant="hero" 
              className="w-full mb-4"
              type="button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Новый разговор
            </Button>

            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversationId === conv.id
                      ? 'bg-primary/20 border border-primary/30'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">
                    {conv.title}
                  </span>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {subscriptionType === 'free' && `${conversations.length}/${maxConversations} разговоров`}
                {subscriptionType === 'premium' && `${conversations.length}/${maxConversations} разговоров`}
                {subscriptionType === 'annual' && 'Безлимитные разговоры'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className={`flex-1 flex flex-col max-w-4xl mx-auto px-4 transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 py-6">
            {!currentConversationId && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <img 
                  src={alenaPortrait} 
                  alt="Алёна"
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary/30"
                />
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                  Добро пожаловать!
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Нажмите "Новый разговор", чтобы начать беседу с Алёной
                </p>
                <Button onClick={createNewConversation} variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Начать разговор
                </Button>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 animate-fade-in-up ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.role === "assistant" ? (
                        <img 
                          src={alenaPortrait} 
                          alt="Алёна"
                          className="w-10 h-10 rounded-full object-cover border border-primary/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-5 h-5 text-secondary-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "assistant"
                          ? "bg-card border border-border text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content.split(/(\[.*?\]\(\/.*?\))/).map((part, idx) => {
                          const linkMatch = part.match(/\[(.*?)\]\((\/.*?)\)/);
                          if (linkMatch) {
                            return (
                              <Link 
                                key={idx} 
                                to={linkMatch[2]} 
                                className="text-primary hover:underline font-medium"
                              >
                                {linkMatch[1]}
                              </Link>
                            );
                          }
                          // Handle markdown bold
                          return part.split(/(\*\*.*?\*\*)/).map((textPart, textIdx) => {
                            if (textPart.startsWith('**') && textPart.endsWith('**')) {
                              return <strong key={`${idx}-${textIdx}`}>{textPart.slice(2, -2)}</strong>;
                            }
                            return <span key={`${idx}-${textIdx}`}>{textPart}</span>;
                          });
                        })}
                      </div>
                      <p className="text-xs mt-2 opacity-60">
                        {message.timestamp.toLocaleTimeString('ru-RU', { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex items-start gap-3 animate-fade-in-up">
                    <img 
                      src={alenaPortrait} 
                      alt="Алёна"
                      className="w-10 h-10 rounded-full object-cover border border-primary/30"
                    />
                    <div className="bg-card border border-border rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Алёна печатает...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          {currentConversationId && (
            <form onSubmit={handleSubmit} className="sticky bottom-0 bg-background pt-4 pb-6">
              <div className="flex gap-3 items-end">
                {/* Review Button */}
                <button
                  type="button"
                  onClick={() => setShowReviewForm(true)}
                  className="flex-shrink-0 p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  title="Оценить общение"
                >
                  <Star className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 transition-colors" />
                </button>
                
                {/* Input Container */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={cooldownRemaining > 0 ? `Подождите ${cooldownRemaining} сек...` : "Поделитесь тем, что у вас на душе..."}
                    className="w-full bg-card border border-border rounded-xl px-4 py-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
                    disabled={isLoading || cooldownRemaining > 0}
                  />
                  
                  {/* Send Button with Cooldown */}
                  <Button
                    type="submit"
                    variant={cooldownRemaining > 0 ? "outline" : "hero"}
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg min-w-10"
                    disabled={!input.trim() || isLoading || cooldownRemaining > 0}
                  >
                    {cooldownRemaining > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">{cooldownRemaining}</span>
                      </div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {/* Cooldown Progress Bar */}
                  {cooldownRemaining > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border rounded-b-xl overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-linear"
                        style={{ 
                          width: `${((MESSAGE_DELAY_MS / 1000 - cooldownRemaining) / (MESSAGE_DELAY_MS / 1000)) * 100}%` 
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Алёна — ИИ-ассистент и не заменяет консультацию специалиста.
                <a href="/safety" className="text-primary hover:underline ml-1">Узнать больше</a>
              </p>
            </form>
          )}
        </div>
      </main>

      <AlertDialog open={replaceOldestDialogOpen} onOpenChange={setReplaceOldestDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Создать новый разговор?</AlertDialogTitle>
            <AlertDialogDescription>
              У вас достигнут лимит в {maxConversations} чатов. Если вы создадите новый разговор,
              самый старый чат будет удалён, чтобы освободить место.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReplacingOldest}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              disabled={isReplacingOldest}
              onClick={(e) => {
                e.preventDefault();
                setReplaceOldestDialogOpen(false);
                void replaceOldestAndCreate();
              }}
            >
              {isReplacingOldest ? "Создаём..." : "Создать новый"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Form Dialog */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ChatReviewForm 
              ipAddress={ipAddress} 
              onClose={() => setShowReviewForm(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
