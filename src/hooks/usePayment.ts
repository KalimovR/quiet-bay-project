import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentParams {
  amount: number;
  description: string;
  productType: 'course' | 'subscription';
  productId?: string;
  userId?: string;
  email?: string;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPayment = async (params: PaymentParams) => {
    setIsLoading(true);
    
    try {
      const returnUrl = `${window.location.origin}/payment/success?paymentId=`;
      
      const { data, error } = await supabase.functions.invoke('yookassa-payment', {
        body: {
          action: 'create-payment',
          ...params,
          returnUrl
        }
      });

      if (error) {
        console.error('Payment creation error:', error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось создать платёж. Попробуйте позже."
        });
        return null;
      }

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: data.error
        });
        return null;
      }

      // Update return URL with payment ID
      const finalReturnUrl = `${window.location.origin}/payment/success?paymentId=${data.paymentId}`;
      
      // Re-create payment with correct return URL
      const { data: finalData, error: finalError } = await supabase.functions.invoke('yookassa-payment', {
        body: {
          action: 'create-payment',
          ...params,
          returnUrl: finalReturnUrl
        }
      });

      if (finalError || finalData.error) {
        // If second attempt fails, use first payment
        if (data.confirmationUrl) {
          window.location.href = data.confirmationUrl;
          return data;
        }
        throw new Error(finalError?.message || finalData?.error);
      }

      // Redirect to YooKassa payment page
      if (finalData.confirmationUrl) {
        window.location.href = finalData.confirmationUrl;
      }

      return finalData;
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        variant: "destructive",
        title: "Ошибка оплаты",
        description: "Произошла ошибка при создании платежа."
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPayment, isLoading };
};
