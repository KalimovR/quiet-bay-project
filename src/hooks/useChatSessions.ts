import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CHAT_SESSIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-sessions`;

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const callSessionsAPI = async (body: any) => {
  const response = await fetch(CHAT_SESSIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }
  
  return data;
};

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [sessionLimit, setSessionLimit] = useState(3);
  const { toast } = useToast();

  // Fetch user and subscription
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
        setSubscription(sub);
      }
    };

    fetchUser();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => authSub.unsubscribe();
  }, []);

  // Calculate session limit based on subscription
  const getSessionLimit = useCallback(() => {
    if (!subscription) return 3;
    if (subscription.plan_name === 'yearly') return Infinity;
    return 7;
  }, [subscription]);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await callSessionsAPI({
        action: 'list',
        userId: user?.id,
      });

      setSessions(data.sessions || []);
      setSessionLimit(data.limit || 3);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for a session
  const fetchMessages = async (sessionId: string) => {
    try {
      const data = await callSessionsAPI({
        action: 'get_messages',
        sessionId,
        userId: user?.id,
      });

      setMessages((data.messages || []).map((m: any) => ({
        ...m,
        role: m.role as 'user' | 'assistant'
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Create new session
  const createSession = async (options?: { replaceOldest?: boolean }) => {
    try {
      const limit = getSessionLimit();
      const shouldEnforceLimit = limit !== Infinity;

      // If limit reached and NOT replacing, show toast
      if (shouldEnforceLimit && sessions.length >= limit && !options?.replaceOldest) {
        toast({
          title: "Лимит чатов",
          description:
            limit === 3
              ? "Бесплатный аккаунт позволяет хранить до 3 чатов. Оформите подписку для увеличения лимита."
              : "Премиум аккаунт позволяет хранить до 7 чатов. Оформите годовую подписку для безлимитного доступа.",
          variant: "destructive",
        });
        return null;
      }

      // Call create with replaceOldest flag - backend handles deletion
      const data = await callSessionsAPI({
        action: 'create',
        userId: user?.id,
        replaceOldest: options?.replaceOldest || false,
      });

      const newSession = data.session;
      
      // If we replaced, refetch sessions to get updated list
      if (options?.replaceOldest) {
        await fetchSessions();
      } else {
        setSessions(prev => [newSession, ...prev]);
      }
      
      setCurrentSession(newSession);
      setMessages([]);

      return newSession;
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать новый чат",
        variant: "destructive",
      });
      return null;
    }
  };

  // Add message to session (saves to DB, does NOT update local state - caller handles that)
  const addMessage = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
    try {
      const data = await callSessionsAPI({
        action: 'add_message',
        sessionId,
        role,
        content,
        userId: user?.id,
      });

      const newMessage = {
        ...data.message,
        role: data.message.role as 'user' | 'assistant'
      };

      // Update session title locally if first user message
      if (role === 'user' && messages.filter(m => m.role === 'user').length === 0) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, title } : s
        ));
      }

      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  };

  // Update last message (for streaming)
  const updateLastMessage = (content: string) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content,
        };
      }
      return newMessages;
    });
  };

  // Delete session
  const deleteSession = async (sessionId: string) => {
    try {
      await callSessionsAPI({
        action: 'delete',
        sessionId,
        userId: user?.id,
      });

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Select session
  const selectSession = async (session: ChatSession) => {
    setCurrentSession(session);
    await fetchMessages(session.id);
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    currentSession,
    messages,
    loading,
    user,
    subscription,
    getSessionLimit,
    createSession,
    addMessage,
    updateLastMessage,
    deleteSession,
    selectSession,
    fetchSessions,
    setMessages,
  };
};
