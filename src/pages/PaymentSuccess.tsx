import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

type PaymentStatus = 'checking' | 'succeeded' | 'pending' | 'failed';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('checking');
  const [productType, setProductType] = useState<string | null>(null);

  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    if (!paymentId) {
      setStatus('failed');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('yookassa-payment', {
          body: {
            action: 'check-payment',
            paymentId
          }
        });

        if (error) {
          console.error('Error checking payment:', error);
          setStatus('failed');
          return;
        }

        console.log('Payment check result:', data);

        if (data.status === 'succeeded') {
          setStatus('succeeded');
          setProductType(data.metadata?.product_type || null);
        } else if (data.status === 'pending' || data.status === 'waiting_for_capture') {
          setStatus('pending');
          // Retry after 3 seconds
          setTimeout(checkPaymentStatus, 3000);
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('Payment check error:', err);
        setStatus('failed');
      }
    };

    checkPaymentStatus();
  }, [paymentId]);

  const getRedirectPath = () => {
    if (productType === 'course') return '/courses';
    if (productType === 'subscription') return '/dashboard';
    return '/';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            {status === 'checking' && (
              <>
                <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                <h1 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Проверяем оплату...
                </h1>
                <p className="text-muted-foreground">
                  Пожалуйста, подождите, мы проверяем статус вашего платежа.
                </p>
              </>
            )}

            {status === 'pending' && (
              <>
                <Loader2 className="h-16 w-16 text-amber-500 mx-auto mb-6 animate-spin" />
                <h1 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Платёж обрабатывается
                </h1>
                <p className="text-muted-foreground">
                  Ваш платёж ещё обрабатывается. Это может занять несколько минут.
                </p>
              </>
            )}

            {status === 'succeeded' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Оплата прошла успешно!
                </h1>
                <p className="text-muted-foreground mb-8">
                  Спасибо за покупку! Доступ к продукту уже открыт.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="bay" onClick={() => navigate(getRedirectPath())}>
                    Перейти к контенту
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      На главную
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {status === 'failed' && (
              <>
                <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
                <h1 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Ошибка оплаты
                </h1>
                <p className="text-muted-foreground mb-8">
                  К сожалению, платёж не был завершён. Попробуйте ещё раз или свяжитесь с поддержкой.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="bay" onClick={() => navigate(-1)}>
                    Попробовать снова
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      На главную
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
