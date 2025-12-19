import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import { Check, Sparkles, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionTier = "free" | "premium" | "annual";

const Pricing = () => {
  useEffect(() => {
    document.title = "Quiet Bay — Тарифы";
  }, []);
  const [userTier, setUserTier] = useState<SubscriptionTier | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    planName: string;
    price: string;
    period: string;
  }>({ open: false, planName: "", price: "", period: "" });

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsLoggedIn(true);
        
        // Fetch user's subscription tier
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('tier, expires_at')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (subscription) {
          // Check if subscription is still active
          if (!subscription.expires_at || new Date(subscription.expires_at) > new Date()) {
            setUserTier(subscription.tier as SubscriptionTier);
          } else {
            setUserTier('free');
          }
        } else {
          setUserTier('free');
        }
      }
    };

    checkSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        checkSubscription();
      } else {
        setIsLoggedIn(false);
        setUserTier(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Map plan names to tier values
  const getTierFromPlanName = (planName: string): SubscriptionTier => {
    switch (planName) {
      case "Премиум": return "premium";
      case "Годовой": return "annual";
      default: return "free";
    }
  };

  const plans = [
    {
      name: "Бесплатно",
      tier: "free" as SubscriptionTier,
      description: "Для первого знакомства",
      price: "0",
      period: "навсегда",
      features: [
        "Ограниченное время общения",
        "Базовая поддержка",
        "Доступ к дыхательным упражнениям",
      ],
      limitations: [
        "Ограниченное время в день",
        "Стандартное время ответа",
        "Только 3 сохранённых чата",
      ],
      cta: "Начать бесплатно",
      variant: "mist" as const,
      popular: false,
    },
    {
      name: "Премиум",
      tier: "premium" as SubscriptionTier,
      description: "Полный доступ к поддержке",
      price: "399",
      period: "в месяц",
      features: [
        "Безлимитные сообщения",
        "Приоритетное время ответа",
        "Расширенные сценарии поддержки",
        "Техники заземления и успокоения",
        "Увеличенная история чатов (7)",
        "Персонализированные рекомендации",
      ],
      limitations: [],
      cta: "Выбрать Премиум",
      variant: "hero" as const,
      popular: true,
    },
    {
      name: "Годовой",
      tier: "annual" as SubscriptionTier,
      description: "Выгодное предложение",
      price: "3199",
      period: "в год",
      savings: "Экономия 1589 ₽",
      features: [
        "Всё из Премиум тарифа",
        "Безлимитная история чатов",
        "2 месяца бесплатно",
        "Приоритетная поддержка",
        "Ранний доступ к новым функциям",
      ],
      limitations: [],
      cta: "Выбрать Годовой",
      variant: "calm" as const,
      popular: false,
    },
  ];

  const isPlanActive = (planTier: SubscriptionTier): boolean => {
    if (!isLoggedIn || !userTier) return false;
    return userTier === planTier;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-bay-fog/30 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Выберите свой путь к спокойствию
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Начните бесплатно или получите полный доступ к поддержке с Премиум тарифом
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-bay-fog/20 to-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const isActive = isPlanActive(plan.tier);
              
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-6 md:p-8 transition-all duration-500 hover:shadow-card ${
                    plan.popular
                      ? "border-primary bg-card shadow-soft scale-105 md:scale-110"
                      : "border-border/50 bg-card/50"
                  } ${isActive ? "ring-2 ring-accent" : ""}`}
                >
                  {plan.popular && !isActive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        Популярный
                      </div>
                    </div>
                  )}
                  
                  {isActive && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Ваш тариф
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-display text-4xl font-semibold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">₽</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.period}
                    </p>
                    {plan.savings && (
                      <p className="text-sm text-accent font-medium mt-2">
                        {plan.savings}
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-0.5 bg-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isActive ? (
                    <Button 
                      variant="outline" 
                      className="w-full cursor-default"
                      disabled
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Активен
                    </Button>
                  ) : plan.price === "0" ? (
                    <Link to="/chat" className="block">
                      <Button variant={plan.variant} className="w-full">
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      variant={plan.variant} 
                      className="w-full"
                      onClick={() => setPaymentModal({
                        open: true,
                        planName: plan.name,
                        price: plan.price,
                        period: plan.period,
                      })}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-16 bg-gradient-to-b from-background to-bay-fog/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            Есть вопросы?
          </h2>
          <p className="text-muted-foreground mb-6">
            Посетите наш раздел FAQ для получения ответов на частые вопросы
          </p>
          <Link to="/faq">
            <Button variant="mist">
              Перейти в FAQ
            </Button>
          </Link>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Гарантия возврата средств
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Если в течение 14 дней после оплаты вы решите, что Quiet Bay вам не подходит, 
              мы вернём полную стоимость подписки без лишних вопросов.
            </p>
            <div className="bg-bay-fog/30 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-sm text-muted-foreground">
                Продукт является цифровым. Доставка в физическом виде не осуществляется.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <PaymentModal
        open={paymentModal.open}
        onOpenChange={(open) => setPaymentModal({ ...paymentModal, open })}
        planName={paymentModal.planName}
        price={paymentModal.price}
        period={paymentModal.period}
      />
    </div>
  );
};

export default Pricing;
