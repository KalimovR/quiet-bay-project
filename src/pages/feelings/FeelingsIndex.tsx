import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, Heart, Brain, Moon, Flame, CircleDot } from "lucide-react";

interface FeelingCard {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const feelings: FeelingCard[] = [
  {
    slug: "grust",
    title: "Грусть",
    description: "Когда грустно без причины и не понятно, что делать",
    icon: <Moon className="w-6 h-6" />,
    color: "from-blue-500/20 to-indigo-500/20"
  },
  {
    slug: "trevoga",
    title: "Тревога",
    description: "Когда внутри беспокойство и сложно успокоиться",
    icon: <Flame className="w-6 h-6" />,
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    slug: "odinochestvo",
    title: "Одиночество",
    description: "Когда чувствуешь себя одиноким, даже среди людей",
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-500/20 to-rose-500/20"
  },
  {
    slug: "vygoranie",
    title: "Выгорание",
    description: "Когда устал от всего и нет сил продолжать",
    icon: <Brain className="w-6 h-6" />,
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    slug: "pustota",
    title: "Пустота",
    description: "Когда внутри пусто и ничего не чувствуешь",
    icon: <CircleDot className="w-6 h-6" />,
    color: "from-gray-500/20 to-slate-500/20"
  }
];

const FeelingsIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Quiet Bay — Эмоциональные состояния"
        description="Грусть, тревога, одиночество, выгорание, пустота — узнайте, как ИИ психолог может помочь справиться с этими состояниями. Анонимная поддержка онлайн."
        canonical="/feelings"
      />
      
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Эмоциональная поддержка
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6">
              С чем помогает ИИ психолог
            </h1>
            <p className="text-muted-foreground text-lg">
              Выберите состояние, которое вам близко сейчас. Узнайте, как Quiet Bay может помочь.
            </p>
          </div>

          {/* Feelings grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {feelings.map((feeling) => (
              <Link
                key={feeling.slug}
                to={`/feelings/${feeling.slug}`}
                className="group relative bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feeling.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {feeling.icon}
                  </div>
                  
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {feeling.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {feeling.description}
                  </p>
                  
                  <div className="flex items-center text-primary text-sm font-medium">
                    Подробнее
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Не нашли своё состояние? Это нормально.
            </p>
            <Link to="/chat">
              <Button variant="bay" size="lg">
                <MessageCircle className="mr-2" size={20} />
                Просто поговорить
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeelingsIndex;