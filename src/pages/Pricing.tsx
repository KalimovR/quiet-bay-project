import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Check, Crown, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SEO, { breadcrumbSchema } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { usePaymentFromUrl, usePaymentPolling } from "@/hooks/usePaymentPolling";

interface Feature {
  text: string;
  isPremium?: boolean;
}

interface Subscription {
  plan: string;
  status: string;
  expires_at: string;
}

const tiers: {
  name: string;
  planKey: string;
  price: string;
  priceValue: number;
  period: string;
  description: string;
  features: Feature[];
  cta: string;
  href: string;
  popular: boolean;
  isPaid: boolean;
}[] = [
  {
    name: "Бесплатный",
    planKey: "free",
    price: "0 ₽",
    priceValue: 0,
    period: "навсегда",
    description: "Начните путь к благополучию с базовой поддержкой",
    features: [
      { text: "Ограниченное время общения" },
      { text: "История до 3 чатов" },
      { text: "Базовая эмоциональная поддержка" },
      { text: "Доступ к кризисным ресурсам" },
      { text: "2 бесплатных урока медитации" },
      { text: "Веб-доступ" },
    ],
    cta: "Начать бесплатно",
    href: "/chat",
    popular: false,
    isPaid: false,
  },
  {
    name: "Премиум",
    planKey: "premium",
    price: "399 ₽",
    priceValue: 399,
    period: "в месяц",
    description: "Расширенная поддержка для глубокого самопознания",
    features: [
      { text: "Доступ к кризисным ресурсам" },
      { text: "Безлимитное общение с ассистентом", isPremium: true },
      { text: "История до 7 чатов", isPremium: true },
      { text: "Отслеживание настроения и аналитика", isPremium: true },
      { text: "Персональные упражнения", isPremium: true },
      { text: "Приоритетное время ответа", isPremium: true },
    ],
    cta: "Выбрать Премиум",
    href: "/chat",
    popular: true,
    isPaid: true,
  },
  {
    name: "Годовой Премиум",
    planKey: "yearly",
    price: "3 899 ₽",
    priceValue: 3899,
    period: "в год",
    description: "Лучшая цена для серьёзной работы над собой",
    features: [
      { text: "Всё из Премиума" },
      { text: "Безлимитная история чатов", isPremium: true },
      { text: "Ранний доступ к функциям", isPremium: true },
      { text: "Эксклюзивная библиотека контента", isPremium: true },
      { text: "Ежемесячные отчёты о благополучии", isPremium: true },
      { text: "Приоритетная поддержка", isPremium: true },
    ],
    cta: "Сэкономить с Годовым",
    href: "/chat",
    popular: false,
    isPaid: true,
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);

  // Payment polling after redirect
  const { paymentId, paymentSuccess, clearPaymentFromUrl } = usePaymentFromUrl();
  const { isPolling, startPolling } = usePaymentPolling({
    paymentId,
    onSuccess: (result) => {
      clearPaymentFromUrl();
      // Refetch subscription
      fetchSubscription();
      toast({
        title: "Подписка активирована!",
        description: "Теперь вам доступны все премиум-функции",
      });
    },
    onError: () => {
      clearPaymentFromUrl();
    },
  });

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan, status, expires_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setSubscription(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  // Start polling if we came back from payment
  useEffect(() => {
    if (paymentSuccess && user) {
      startPolling();
      // Also do an immediate refetch
      fetchSubscription();
    }
  }, [paymentSuccess, user]);

  const isActivePlan = (planKey: string) => {
    if (!subscription) return false;
    return subscription.plan.toLowerCase() === planKey.toLowerCase();
  };

  const handlePurchaseSubscription = async (tier: typeof tiers[0]) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите или зарегистрируйтесь для покупки подписки",
      });
      navigate("/auth");
      return;
    }

    setPurchasingPlan(tier.planKey);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: 'subscription',
            plan: tier.planKey,
            amount: tier.priceValue,
            description: `Подписка ${tier.name} - ${tier.period}`,
            returnUrl: `${window.location.origin}/pricing?payment=success`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания платежа');
      }

      // Сохраняем payment_id для polling после редиректа
      localStorage.setItem('pending_payment_id', data.paymentId);

      window.location.href = data.confirmationUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Ошибка оплаты",
        description: error instanceof Error ? error.message : "Попробуйте ещё раз",
        variant: "destructive",
      });
    } finally {
      setPurchasingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Тарифы"
        description="Простые и прозрачные тарифы Quiet Bay. Бесплатный старт, Премиум за 399₽/мес с безлимитным общением. Отмена в любое время."
        canonical="/pricing"
        structuredData={breadcrumbSchema([
          { name: "Главная", url: "/" },
          { name: "Тарифы", url: "/pricing" }
        ])}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Простые и прозрачные тарифы
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Начните бесплатно и перейдите на платный тариф, когда будете готовы. Без скрытых платежей, отмена в любое время.
            </p>
          </div>

          {/* Payment Processing Banner */}
          {isPolling && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-3 p-5 rounded-xl bg-primary/10 border border-primary/20">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <div className="text-center">
                  <p className="font-medium text-foreground">Обрабатываем оплату...</p>
                  <p className="text-sm text-muted-foreground">Это займёт несколько секунд</p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => {
              const isActive = isActivePlan(tier.planKey);
              
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl p-8 ${
                    isActive
                      ? "bg-gradient-to-b from-green-500/10 to-card border-2 border-green-500 ring-2 ring-green-500/20"
                      : tier.popular
                        ? "bg-gradient-to-b from-primary/10 to-card border-2 border-primary"
                        : "bg-card border border-border"
                  }`}
                >
                  {isActive && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-white text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Активный план
                      </span>
                    </div>
                  )}
                  {!isActive && tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-4 py-1.5 rounded-full">
                        Самый популярный
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-muted-foreground">/{tier.period}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{tier.description}</p>
                    {isActive && subscription && (
                      <p className="text-green-600 text-xs mt-2">
                        Активна до {new Date(subscription.expires_at).toLocaleDateString('ru-RU')}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.isPremium ? (
                          <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-foreground text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {isActive ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-green-500 text-green-600 hover:bg-green-500/10"
                      disabled
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Ваш текущий план
                    </Button>
                  ) : tier.isPaid ? (
                    <Button
                      variant={tier.popular ? "hero" : "outline"}
                      size="lg"
                      className="w-full"
                      onClick={() => handlePurchaseSubscription(tier)}
                      disabled={purchasingPlan === tier.planKey}
                    >
                      {purchasingPlan === tier.planKey ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Загрузка...
                        </>
                      ) : (
                        tier.cta
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link to={tier.href}>{tier.cta}</Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Courses Note */}
          <div className="mt-12 max-w-2xl mx-auto text-center bg-card/50 rounded-xl p-6 border border-border">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Курсы медитации</strong> — это онлайн-курс (цифровой продукт), 
              приобретается отдельно и не входит в стоимость подписки. 
              Стоимость всего курса — <strong className="text-primary">249 ₽</strong>.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Продукт является цифровым. Доставка в физическом виде не осуществляется.
            </p>
            <p className="text-muted-foreground/60 text-xs mt-3">
              Возврат средств возможен в течение 14 дней с момента покупки
            </p>
          </div>

          {/* FAQ Preview */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Есть вопросы?{" "}
              <Link to="/safety" className="text-primary hover:underline">
                Посмотрите наш FAQ
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
