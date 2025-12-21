import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Loader2, ShieldCheck, CreditCard, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { usePayment } from "@/hooks/usePayment";
import { toast } from "sonner";

interface Feature {
  text: string;
  premium?: boolean; // true = gold checkmark for premium-only features
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: Feature[];
  cta: string;
  variant: "calm" | "bay";
  popular: boolean;
  isPremium: boolean;
}

const plans: Plan[] = [
  {
    name: "Бесплатно",
    price: "0",
    period: "навсегда",
    description: "Идеально для знакомства с Quiet Bay",
    features: [
      { text: "Ограниченное время общения" },
      { text: "История до 3 чатов" },
      { text: "Базовая эмоциональная поддержка" },
      { text: "Доступ к дыхательным упражнениям" },
      { text: "Кризисные ресурсы доступны" },
    ],
    cta: "Начать бесплатно",
    variant: "calm" as const,
    popular: false,
    isPremium: false,
  },
  {
    name: "Премиум",
    price: "399",
    period: "в месяц",
    description: "Для постоянной поддержки и глубоких разговоров",
    features: [
      { text: "Безлимитные сообщения" },
      { text: "Продвинутые успокаивающие упражнения" },
      { text: "История до 7 чатов", premium: true },
      { text: "Приоритетное время ответа", premium: true },
      { text: "Персонализированные проверки", premium: true },
      { text: "Отчёты по email (опционально)", premium: true },
    ],
    cta: "Получить Премиум",
    variant: "bay" as const,
    popular: true,
    isPremium: true,
  },
  {
    name: "Годовой Премиум",
    price: "3899",
    period: "в год",
    description: "Лучшая цена — экономия более 30%",
    features: [
      { text: "Всё из Премиума" },
      { text: "Безлимитная история чатов", premium: true },
      { text: "Экономия 900₽ в год", premium: true },
      { text: "Ранний доступ к новым функциям", premium: true },
      { text: "Приоритетная поддержка", premium: true },
    ],
    cta: "Получить Годовой Премиум",
    variant: "calm" as const,
    popular: false,
    isPremium: true,
  },
];

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  expires_at: string | null;
}

const Pricing = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const navigate = useNavigate();
  const { createPayment, isLoading } = usePayment();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscription(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchSubscription(session.user.id);
        } else {
          setActiveSubscription(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchSubscription = async (userId: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (data) {
      setActiveSubscription(data);
    }
  };

  const handlePlanClick = async (plan: Plan) => {
    if (plan.price === "0") {
      navigate("/chat");
      return;
    }

    if (!user) {
      toast.info("Войдите, чтобы оформить подписку");
      navigate("/auth");
      return;
    }

    setLoadingPlan(plan.name);
    
    const isYearly = plan.name === "Годовой Премиум";
    
    await createPayment({
      amount: parseInt(plan.price),
      description: `Подписка ${plan.name} — Quiet Bay`,
      productType: 'subscription',
      productId: isYearly ? 'yearly' : 'monthly',
      userId: user.id,
      email: user.email || undefined
    });

    setLoadingPlan(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Тарифы"
        description="Выберите подходящий тариф. Начните бесплатно или получите безлимитный доступ с Премиум."
        canonical="/pricing"
      />
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Тарифы
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Выберите свой путь к покою
            </h1>
            <p className="text-muted-foreground text-lg">
              Начните бесплатно и переходите на платный план, когда будете готовы. Без обязательств, отмена в любое время.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const isPlanLoading = loadingPlan === plan.name;
              const isActivePlan = activeSubscription && (
                (plan.name === "Премиум" && activeSubscription.plan_name === "monthly") ||
                (plan.name === "Годовой Премиум" && activeSubscription.plan_name === "yearly")
              );
              
              return (
                <div
                  key={index}
                  className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                    isActivePlan
                      ? "bg-card border-green-500 shadow-elevated ring-2 ring-green-500/20"
                      : plan.popular
                        ? "bg-card border-primary shadow-elevated"
                        : "bg-card border-border shadow-soft hover:shadow-elevated"
                  }`}
                >
                  {/* Active badge */}
                  {isActivePlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                        <Check size={14} />
                        Активна
                      </div>
                    </div>
                  )}
                  {/* Popular badge */}
                  {plan.popular && !isActivePlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                        <Sparkles size={14} />
                        Популярный
                      </div>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-heading font-semibold text-foreground">
                        {plan.price}₽
                      </span>
                      <span className="text-muted-foreground text-sm">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          feature.premium && plan.isPremium
                            ? "bg-amber-100 dark:bg-amber-900/30"
                            : "bg-seafoam/50"
                        }`}>
                          {feature.premium && plan.isPremium ? (
                            <Crown size={12} className="text-amber-500" />
                          ) : (
                            <Check size={12} className="text-primary" />
                          )}
                        </div>
                        <span className="text-foreground/80 text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button 
                    variant={isActivePlan ? "outline" : plan.variant} 
                    className="w-full"
                    onClick={() => handlePlanClick(plan)}
                    disabled={isPlanLoading || isLoading || isActivePlan}
                  >
                    {isPlanLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Загрузка...
                      </>
                    ) : isActivePlan ? (
                      "Текущий план"
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Service Description */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Info size={20} className="text-primary" />
                Что входит в подписку
              </h3>
              <p className="text-foreground/80 mb-4">
                Вы получаете доступ к диалогам с ИИ-ассистентом для эмоциональной поддержки и саморефлексии. 
                Подписка активируется сразу после оплаты и действует в течение выбранного периода.
              </p>
              <ul className="text-foreground/70 text-sm space-y-2 mb-6">
                <li>• Безлимитные сообщения с ИИ-ассистентом</li>
                <li>• Расширенная история чатов</li>
                <li>• Продвинутые упражнения для саморефлексии</li>
                <li>• Возможность отмены в любое время в личном кабинете</li>
              </ul>
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-foreground/80 text-sm">
                  <strong>Важно:</strong> Quiet Bay — это сервис эмоциональной поддержки, а не медицинская услуга. 
                  ИИ не ставит диагнозы и не заменяет консультацию врача или психолога.
                </p>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-secondary/50 border border-border rounded-xl p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Отказ от медицинской ответственности</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Quiet Bay не является медицинским сервисом. ИИ не ставит диагнозы и не заменяет специалиста. 
                    В кризисных ситуациях рекомендуем обращаться за профессиональной помощью.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-3">
                <CreditCard className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Безопасная оплата</h4>
                  <ul className="text-foreground/70 text-sm space-y-1">
                    <li>• Оплата проходит через ЮKassa</li>
                    <li>• Платёж защищён по стандарту PCI DSS</li>
                    <li>• Можно отменить подписку в личном кабинете</li>
                    <li>• Возврат средств в течение 14 дней</li>
                  </ul>
                  <div className="flex gap-4 mt-4 text-sm">
                    <Link to="/payment-terms" className="text-primary hover:underline">
                      Условия оплаты и возврата
                    </Link>
                    <Link to="/contacts" className="text-primary hover:underline">
                      Контакты продавца
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ link */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Есть вопросы о наших планах?
            </p>
            <Link to="/faq" className="text-primary hover:underline font-medium">
              Посмотрите наши частые вопросы →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
