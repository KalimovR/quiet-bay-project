import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DialogMessage {
  role: "user" | "alena";
  text: string;
}

interface DialogExample {
  messages: DialogMessage[];
}

const dialogExamples: DialogExample[] = [
  // 1. Присутствие
  {
    messages: [
      { role: "user", text: "..." },
      { role: "alena", text: "Я здесь. Можно не спешить. Хочешь просто побыть рядом или поговорить?" },
      { role: "user", text: "Не знаю..." },
      { role: "alena", text: "Это тоже нормально. Я никуда не тороплюсь." },
    ],
  },
  // 2. С якорем памяти
  {
    messages: [
      { role: "user", text: "Снова поругалась с мамой" },
      { role: "alena", text: "Ты рассказывала про ваши разговоры на прошлой неделе. Что произошло в этот раз?" },
      { role: "user", text: "Она опять критиковала мои решения" },
      { role: "alena", text: "Ты уже замечала, как её слова задевают. Это не значит, что она права. Как ты сейчас?" },
    ],
  },
  // 3. Оригинальный (без якоря)
  {
    messages: [
      { role: "user", text: "Чувствую пустоту внутри..." },
      { role: "alena", text: "Это сложное ощущение. Спасибо, что делишься. Когда ты заметила это чувство?" },
      { role: "user", text: "Не знаю, просто всё кажется бессмысленным" },
      { role: "alena", text: "Иногда так бывает. Давай побудем с этим вместе. Ты не одна." },
    ],
  },
  // 4. Оригинальный (без якоря)
  {
    messages: [
      { role: "user", text: "Сегодня был хороший день" },
      { role: "alena", text: "Как приятно это слышать! Что сделало его хорошим?" },
      { role: "user", text: "Просто выспалась наконец" },
      { role: "alena", text: "Сон — это важно. Рада, что ты заботишься о себе. Это большой шаг." },
    ],
  },
  // 5. С якорем памяти
  {
    messages: [
      { role: "user", text: "Тревога вернулась..." },
      { role: "alena", text: "Ты говорил, что последние дни было легче. Что-то изменилось?" },
      { role: "user", text: "Не знаю, просто накатило с утра" },
      { role: "alena", text: "В прошлый раз помогло дыхание и прогулка. Хочешь попробовать или просто поговорим?" },
    ],
  },
  // 6. Участник боевых действий
  {
    messages: [
      { role: "user", text: "Вернулся домой, а всё как будто чужое..." },
      { role: "alena", text: "После того, что ты пережил — это нормальная реакция. Ты не обязан сразу чувствовать себя «как раньше»." },
      { role: "user", text: "Не могу никому объяснить" },
      { role: "alena", text: "И не нужно. Здесь можно говорить или молчать. Я рядом, в твоём темпе." },
    ],
  },
];

const DialogCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % dialogExamples.length);
        setIsTransitioning(false);
      }, 800);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const currentDialog = dialogExamples[currentIndex];

  return (
    <div className="mt-12">
      {/* Dialog Card */}
      <div 
        className={cn(
          "relative bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md rounded-2xl border border-primary/10 p-6 transition-all duration-1000 ease-in-out",
          "shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.15)]",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:pointer-events-none",
          isTransitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        )}
      >
        <div className="space-y-4">
          {currentDialog.messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {message.role === "alena" && (
                  <span className="text-xs text-primary font-medium block mb-1">Алёна</span>
                )}
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {dialogExamples.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 800);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Перейти к диалогу ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DialogCarousel;
