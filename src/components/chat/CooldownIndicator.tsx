import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CooldownIndicatorProps {
  isActive: boolean;
  totalMs: number;
  remainingMs: number;
}

export function CooldownIndicator({ isActive, totalMs, remainingMs }: CooldownIndicatorProps) {
  const [progress, setProgress] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(100);
      setSecondsLeft(0);
      return;
    }

    const updateProgress = () => {
      const elapsed = totalMs - remainingMs;
      const newProgress = Math.max(0, 100 - (elapsed / totalMs) * 100);
      setProgress(newProgress);
      setSecondsLeft(Math.ceil(remainingMs / 1000));
    };

    updateProgress();

    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrement = (100 / (totalMs / 100));
        return Math.max(0, prev - decrement);
      });
      setSecondsLeft((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, totalMs, remainingMs]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Circular progress */}
      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          strokeLinecap="round"
          className={cn(
            "text-primary transition-all duration-100",
            progress < 30 && "text-green-500"
          )}
          style={{
            strokeDasharray: `${progress} 100`,
          }}
        />
      </svg>
      {/* Timer text */}
      <span className="absolute text-xs font-medium text-muted-foreground">
        {Math.ceil(secondsLeft)}
      </span>
    </div>
  );
}
