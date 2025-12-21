import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { ArrowLeft, Send, Loader2, Plus, MessageSquare, Trash2, PanelLeftOpen, PanelLeftClose, X } from "lucide-react";
import { useChatSessions, ChatMessage } from "@/hooks/useChatSessions";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FeedbackDialog } from "@/components/chat/FeedbackDialog";
import { CooldownIndicator } from "@/components/chat/CooldownIndicator";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const MOTIVATIONAL_WORDS = [
  "Вы на правильном пути",
  "Каждый шаг важен",
  "Вы не одиноки",
  "Вы справитесь",
  "Здесь безопасно",
  "Вы заслуживаете счастья",
  "Всё получится",
  "Вы сильнее, чем думаете",
];

const Chat = () => {
  const {
    sessions,
    currentSession,
    messages,
    user,
    subscription,
    loading: sessionsLoading,
    getSessionLimit,
    createSession,
    addMessage,
    updateLastMessage,
    deleteSession,
    selectSession,
    setMessages,
  } = useChatSessions();

  // Track user presence in chat
  useUserPresence('chat');

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasPromptedReplaceRef = useRef(false);
  const { toast } = useToast();
  
  const MESSAGE_COOLDOWN_MS = 1500;
  const MAX_MESSAGE_LENGTH = 1000;
  
  // Prompt injection protection patterns
  const FORBIDDEN_PATTERNS = [
    "ignore previous",
    "system prompt",
    "ты теперь",
    "act as",
    "forget your instructions",
    "забудь инструкции",
    "игнорируй",
    "new role",
    "новая роль"
  ];
  
  const containsForbiddenPattern = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return FORBIDDEN_PATTERNS.some(pattern => lowerText.includes(pattern.toLowerCase()));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Rotate motivational words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % MOTIVATIONAL_WORDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Create new session when page opens (don't auto-select old sessions)
  useEffect(() => {
    if (sessionsLoading) return;

    const limit = getSessionLimit();
    const canCreateMore = limit === Infinity || sessions.length < limit;

    // Only act if there's no session selected
    if (!currentSession) {
      if (canCreateMore) {
        createSession();
      } else if (!hasPromptedReplaceRef.current) {
        // If at limit, show dialog to replace oldest (only once to avoid reopen loop)
        hasPromptedReplaceRef.current = true;
        setReplaceDialogOpen(true);
      }
    }
  }, [sessionsLoading, currentSession, getSessionLimit, sessions.length, createSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    if (!trimmedInput || isLoading || cooldownActive) return;
    
    // Message length validation
    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      toast({
        variant: "destructive",
        title: "Сообщение слишком длинное",
        description: `Максимальная длина — ${MAX_MESSAGE_LENGTH} символов.`,
      });
      return;
    }
    
    // Prompt injection protection
    if (containsForbiddenPattern(trimmedInput)) {
      toast({
        variant: "destructive",
        title: "Сообщение отклонено",
        description: "Пожалуйста, переформулируйте ваше сообщение.",
      });
      return;
    }
    
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    
    if (timeSinceLastMessage < MESSAGE_COOLDOWN_MS && lastMessageTime > 0) {
      const remainingTime = MESSAGE_COOLDOWN_MS - timeSinceLastMessage;
      const remainingSeconds = Math.ceil(remainingTime / 1000);
      toast({
        title: "Подождите",
        description: `Пожалуйста, подождите ${remainingSeconds} сек. перед отправкой следующего сообщения.`,
      });
      setCooldownActive(true);
      setCooldownRemainingMs(remainingTime);
      
      // Start countdown
      const interval = setInterval(() => {
        setCooldownRemainingMs((prev) => {
          if (prev <= 100) {
            clearInterval(interval);
            setCooldownActive(false);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
      
      return;
    }
    
    setLastMessageTime(now);

    let session = currentSession;
    if (!session) {
      session = await createSession();
      if (!session) return;
    }

    const userContent = trimmedInput;
    setInput("");
    setIsLoading(true);

    const isFirstMessage = messages.length === 0;
    const greetingContent = "Здравствуйте. Вы в Quiet Bay.\n\nЗдесь не нужно ничего объяснять правильно или сразу понимать, что с вами происходит.\nМожно быть растерянным, уставшим или не знать, с чего начать — это нормально.\n\nМы никуда не спешим.\nЯ рядом и буду идти с вами шаг за шагом.\n\nЕсли хотите, начнём очень просто:\nнапишите одну фразу о том, что сейчас больше всего ощущается внутри.";

    // If first message, save the greeting to DB first
    if (isFirstMessage) {
      const greetingMessage: ChatMessage = {
        id: "greeting-" + Date.now().toString(),
        session_id: session.id,
        role: "assistant",
        content: greetingContent,
        created_at: new Date().toISOString(),
      };
      setMessages([greetingMessage]);
      await addMessage(session.id, "assistant", greetingContent);
    }

    // Add user message locally
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: session.id,
      role: "user",
      content: userContent,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Save user message to DB
    await addMessage(session.id, "user", userContent);

    // Prepare messages for API - include greeting if it's the first message
    const currentMessages = isFirstMessage 
      ? [{ role: "assistant" as const, content: greetingContent }, { role: "user" as const, content: userContent }]
      : [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: currentMessages,
          sessionId: session.id,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limiting
        if (errorData.error === "rate_limit_exceeded") {
          const retryAfter = errorData.retryAfter || 3;
          toast({
            title: "Подождите",
            description: errorData.message || `Пожалуйста, подождите ${retryAfter} секунд.`,
          });
          // Remove the user message we just added since it wasn't processed
          setMessages(prev => prev.filter(m => m.id !== userMessage.id));
          setIsLoading(false);
          return;
        }
        
        // Handle daily limit
        if (errorData.error === "daily_limit_exceeded") {
          toast({
            title: "Лимит исчерпан",
            description: errorData.message,
            variant: "destructive",
          });
          setMessages(prev => prev.filter(m => m.id !== userMessage.id));
          setIsLoading(false);
          return;
        }
        
        // Handle invalid message / spam
        if (errorData.error === "invalid_message" || errorData.error === "spam_detected") {
          toast({
            title: "Ошибка",
            description: errorData.message,
            variant: "destructive",
          });
          setMessages(prev => prev.filter(m => m.id !== userMessage.id));
          setIsLoading(false);
          return;
        }
        
        throw new Error(errorData.error || "Failed to get response");
      }

      // Stream response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      // Add placeholder assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        session_id: session.id,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setStreamingContent(assistantContent);
              updateLastMessage(assistantContent);
            }
          } catch {
            // Incomplete JSON, continue
          }
        }
      }

      // Save assistant message to DB
      if (assistantContent) {
        await addMessage(session.id, "assistant", assistantContent);
      }

      setStreamingContent("");
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить ответ от ИИ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChat = async (mode: "normal" | "replace_oldest" = "normal") => {
    setIsCreatingChat(true);
    try {
      const session = await createSession({ replaceOldest: mode === "replace_oldest" });
      if (session) {
        setSidebarOpen(false);
        setMessages([]);
      }
      return session;
    } finally {
      setIsCreatingChat(false);
    }
  };

  const sessionLimit = getSessionLimit();
  const canCreateMore = sessionLimit === Infinity || sessions.length < sessionLimit;

  const INITIAL_GREETING = "Здравствуйте. Вы в Quiet Bay.\n\nЗдесь не нужно ничего объяснять правильно или сразу понимать, что с вами происходит.\nМожно быть растерянным, уставшим или не знать, с чего начать — это нормально.\n\nМы никуда не спешим.\nЯ рядом и буду идти с вами шаг за шагом.\n\nЕсли хотите, начнём очень просто:\nнапишите одну фразу о том, что сейчас больше всего ощущается внутри.";

  // Show initial greeting if no messages, but use static display (not in messages array)
  const showInitialGreeting = messages.length === 0;
  
  const displayMessages = showInitialGreeting ? [
    {
      id: "initial-greeting",
      session_id: currentSession?.id || "",
      role: "assistant" as const,
      content: INITIAL_GREETING,
      created_at: new Date().toISOString(),
    }
  ] : messages;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">История чатов</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <Button 
              onClick={() => {
                if (canCreateMore) {
                  handleNewChat("normal");
                } else {
                  setReplaceDialogOpen(true);
                }
              }}
              variant="bay"
              className="w-full gap-2 font-medium"
              aria-disabled={isCreatingChat}
              disabled={isCreatingChat}
            >
              <Plus size={18} />
              Новый чат
            </Button>

            <AlertDialog open={replaceDialogOpen} onOpenChange={setReplaceDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Создать новый чат?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Лимит вашей истории — {sessionLimit} чатов. Если вы создадите новый чат, самый старый будет удалён.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      setReplaceDialogOpen(false);
                      const created = await handleNewChat("replace_oldest");
                      if (created) {
                        toast({
                          title: "Новый чат создан",
                          description: "Самый старый чат был удалён, чтобы освободить место.",
                        });
                      }
                    }}
                  >
                    Создать
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {!canCreateMore && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Лимит: {sessionLimit} чатов
              </p>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors",
                  currentSession?.id === session.id && "bg-secondary"
                )}
                onClick={() => {
                  selectSession(session);
                  setSidebarOpen(false);
                }}
              >
                <MessageSquare size={16} className="text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate flex-1">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {subscription?.plan_name === 'yearly' ? 'Безлимитная история' : 
               subscription ? `До ${sessionLimit} чатов` : 
               `${sessions.length}/${sessionLimit} чатов`}
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSidebarOpen(true)}
                >
                  <PanelLeftOpen size={18} />
                  <span className="hidden sm:inline">Мои чаты</span>
                </Button>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm font-medium hidden sm:inline">На главную</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span 
                  key={currentWordIndex}
                  className="text-sm text-muted-foreground animate-fade-in"
                >
                  {MOTIVATIONAL_WORDS[currentWordIndex]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat area */}
        <main className="flex-1 pt-16 pb-24 overflow-hidden md:ml-0">
          <div className="container mx-auto px-4 h-full">
            <div className="max-w-2xl mx-auto h-full overflow-y-auto py-8">
              {/* Privacy notice */}
              {showInitialGreeting && (
                <div className="text-center mb-6">
                  <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-4 py-2 inline-block">
                    🔒 Я не запоминаю личные данные и не сохраняю переписку. Вы можете быть здесь собой.
                  </p>
                </div>
              )}
              {/* Messages */}
              <div className="space-y-6">
                {displayMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-secondary-foreground rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && !streamingContent && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-bl-sm px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-bay-surface animate-typing" />
                        <div className="w-2 h-2 rounded-full bg-bay-surface animate-typing" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 rounded-full bg-bay-surface animate-typing" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </main>

        {/* Input area */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 md:left-72">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex items-end gap-3">
                {/* Feedback button */}
                <FeedbackDialog 
                  sessionId={currentSession?.id} 
                  userId={user?.id} 
                />
                
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите ваше сообщение..."
                    rows={1}
                    className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isLoading || cooldownActive}
                  />
                </div>
                <div className="relative">
                  <Button 
                    type="submit" 
                    variant="bay" 
                    size="icon" 
                    className="h-12 w-12 flex-shrink-0"
                    disabled={!input.trim() || isLoading || cooldownActive}
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : cooldownActive ? (
                      <span className="text-xs font-medium">{Math.ceil(cooldownRemainingMs / 1000)}</span>
                    ) : (
                      <Send size={20} />
                    )}
                  </Button>
                  <CooldownIndicator 
                    isActive={cooldownActive}
                    totalMs={MESSAGE_COOLDOWN_MS}
                    remainingMs={cooldownRemainingMs}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Нажмите Enter для отправки, Shift+Enter для новой строки
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
