import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentStatusResult {
  status: 'pending' | 'succeeded' | 'cancelled' | 'failed' | 'not_found';
  type?: 'course' | 'subscription';
  message?: string;
}

interface UsePaymentPollingOptions {
  paymentId: string | null;
  onSuccess?: (result: PaymentStatusResult) => void;
  onError?: (error: string) => void;
  maxAttempts?: number;
  intervalMs?: number;
}

export const usePaymentPolling = ({
  paymentId,
  onSuccess,
  onError,
  maxAttempts = 20,
  intervalMs = 3000,
}: UsePaymentPollingOptions) => {
  const [isPolling, setIsPolling] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<PaymentStatusResult | null>(null);
  const { toast } = useToast();

  const checkStatus = useCallback(async () => {
    if (!paymentId) return null;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Не авторизован');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-payment-status?payment_id=${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка проверки статуса');
      }

      const result: PaymentStatusResult = await response.json();
      setStatus(result);
      return result;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  }, [paymentId]);

  const startPolling = useCallback(() => {
    if (!paymentId || isPolling) return;
    
    setIsPolling(true);
    setAttempts(0);
    setStatus(null);
  }, [paymentId, isPolling]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (!isPolling || !paymentId) return;

    const poll = async () => {
      const result = await checkStatus();
      
      if (!result) {
        setAttempts(prev => prev + 1);
        return;
      }

      if (result.status === 'succeeded') {
        setIsPolling(false);
        toast({
          title: "Оплата успешна!",
          description: result.message || 'Доступ активирован',
        });
        onSuccess?.(result);
      } else if (result.status === 'cancelled' || result.status === 'failed') {
        setIsPolling(false);
        toast({
          title: "Платёж не прошёл",
          description: result.message || 'Попробуйте ещё раз',
          variant: "destructive",
        });
        onError?.(result.message || 'Payment failed');
      } else if (result.status === 'pending') {
        setAttempts(prev => prev + 1);
      }
    };

    // Initial check immediately
    poll();

    // Set up interval for subsequent checks
    const interval = setInterval(() => {
      if (attempts >= maxAttempts) {
        setIsPolling(false);
        toast({
          title: "Обработка платежа",
          description: "Мы получили оплату и завершаем активацию. Это займёт несколько секунд.",
        });
        return;
      }
      poll();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPolling, paymentId, attempts, maxAttempts, intervalMs, checkStatus, onSuccess, onError, toast]);

  return {
    isPolling,
    attempts,
    status,
    startPolling,
    stopPolling,
    checkStatus,
  };
};

// Hook to get the payment ID from URL after redirect
export const usePaymentFromUrl = () => {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const pid = urlParams.get('payment_id');
    
    if (payment === 'success') {
      setPaymentSuccess(true);
    }
    
    if (pid) {
      setPaymentId(pid);
    }

    // Check localStorage for pending payment
    const pendingPayment = localStorage.getItem('pending_payment_id');
    if (pendingPayment && payment === 'success') {
      setPaymentId(pendingPayment);
    }
  }, []);

  const clearPaymentFromUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    url.searchParams.delete('payment_id');
    window.history.replaceState({}, '', url.toString());
    localStorage.removeItem('pending_payment_id');
    setPaymentId(null);
    setPaymentSuccess(false);
  }, []);

  return {
    paymentId,
    paymentSuccess,
    clearPaymentFromUrl,
  };
};
