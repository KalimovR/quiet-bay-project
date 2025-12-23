import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Heart, 
  Users, 
  Battery, 
  Circle,
  ArrowRight,
  MessageCircle
} from "lucide-react";

const feelingsData = [
  {
    slug: "grust",
    title: "Грусть",
    description: "Когда всё кажется серым и безрадостным",
    icon: Cloud,
    color: "from-blue-500/20 to-slate-500/20",
    iconColor: "text-blue-400"
  },
  {
    slug: "trevoga",
    title: "Тревога",
    description: "Когда сердце бьётся быстрее, а мысли не дают покоя",
    icon: Heart,
    color: "from-amber-500/20 to-red-500/20",
    iconColor: "text-amber-400"
  },
  {
    slug: "odinochestvo",
    title: "Одиночество",
    description: "Когда рядом никого нет, кто бы понял",
    icon: Users,
    color: "from-purple-500/20 to-indigo-500/20",
    iconColor: "text-purple-400"
  },
  {
    slug: "vygoranie",
    title: "Выгорание",
    description: "Когда силы на исходе, а дел ещё много",
    icon: Battery,
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400"
  },
  {
    slug: "pustota",
    title: "Пустота",
    description: "Когда внутри ничего не чувствуешь",
    icon: Circle,
    color: "from-gray-500/20 to-slate-500/20",
    iconColor: "text-gray-400"
  }
];

const FeelingsIndex = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Эмоциональные состояния — Quiet Bay" 
        description="Узнайте больше о своих эмоциях: грусть, тревога, одиночество, выгорание, пустота. Получите поддержку ИИ-ассистента."
      />
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Что вы сейчас чувствуете?
            </h1>
            <p className="text-lg text-muted-foreground">
              Выберите состояние, которое вам ближе всего. Мы поможем разобраться 
              в ваших эмоциях и найти путь к внутреннему спокойствию.
            </p>
          </div>

          {/* Feelings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {feelingsData.map((feeling) => {
              const Icon = feeling.icon;
              return (
                <Link 
                  key={feeling.slug} 
                  to={`/feelings/${feeling.slug}`}
                  className="group"
                >
                  <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feeling.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-7 h-7 ${feeling.iconColor}`} />
                      </div>
                      <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                        {feeling.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {feeling.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-primary font-medium">
                        Узнать больше
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Хотите поговорить прямо сейчас?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Наш ИИ-ассистент готов выслушать вас в любое время. 
                  Первые 5 минут — бесплатно.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/chat">
                    Начать разговор
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeelingsIndex;
