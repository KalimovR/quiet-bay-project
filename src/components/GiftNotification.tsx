import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Crown, BookOpen, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface GiftData {
  id: string;
  gift_type: string;
  duration_days: number | null;
  expires_at: string | null;
  message: string | null;
  created_at: string;
}

const giftTypeNames: Record<string, string> = {
  premium: "Премиум подписка",
  annual: "Годовая подписка",
  course: "Курс медитации",
};

const giftTypeIcons: Record<string, React.ReactNode> = {
  premium: <Crown className="w-12 h-12 text-amber-500" />,
  annual: <Crown className="w-12 h-12 text-purple-500" />,
  course: <BookOpen className="w-12 h-12 text-green-500" />,
};

const GiftNotification = ({ userId }: { userId: string }) => {
  const [gift, setGift] = useState<GiftData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check for unread gifts on mount
    checkUnreadGifts();

    // Subscribe to new gifts in realtime
    const channel = supabase
      .channel('gifts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gifts',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newGift = payload.new as GiftData;
          setGift(newGift);
          setOpen(true);
          triggerConfetti();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const checkUnreadGifts = async () => {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setGift(data);
      setOpen(true);
      setTimeout(triggerConfetti, 300);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleClose = async () => {
    if (gift) {
      await supabase
        .from('gifts')
        .update({ read: true })
        .eq('id', gift.id);
    }
    setOpen(false);
    setGift(null);
  };

  const formatDuration = (days: number | null) => {
    if (!days) return "навсегда";
    if (days === 1) return "1 день";
    if (days < 5) return `${days} дня`;
    if (days === 7) return "1 неделя";
    if (days === 14) return "2 недели";
    if (days === 30) return "1 месяц";
    if (days === 90) return "3 месяца";
    if (days === 180) return "6 месяцев";
    if (days === 365) return "1 год";
    return `${days} дней`;
  };

  if (!gift) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <div className="relative bg-gradient-to-br from-amber-50 via-white to-pink-50 dark:from-amber-950/30 dark:via-background dark:to-pink-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/30 p-8 text-center">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 text-amber-400/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute top-4 right-4 text-pink-400/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-4 left-8 text-purple-400/20">
            <Heart className="w-5 h-5" />
          </div>
          <div className="absolute bottom-4 right-8 text-amber-400/20">
            <Heart className="w-5 h-5" />
          </div>

          {/* Gift icon with animation */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-100 to-pink-100 dark:from-amber-900/30 dark:to-pink-900/30 flex items-center justify-center shadow-lg animate-pulse">
              <Gift className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="absolute -top-2 -right-2 left-1/2 transform -translate-x-1/2">
              <Sparkles className="w-8 h-8 text-amber-500 animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Вам подарок! 🎁
          </h2>

          <p className="text-muted-foreground mb-6">
            Quiet Bay дарит вам особенный подарок
          </p>

          {/* Gift details */}
          <div className="bg-white/80 dark:bg-background/50 rounded-xl p-6 mb-6 border border-amber-200/30 dark:border-amber-800/20 shadow-inner">
            <div className="flex justify-center mb-3">
              {giftTypeIcons[gift.gift_type]}
            </div>
            <h3 className="font-semibold text-xl text-foreground mb-2">
              {giftTypeNames[gift.gift_type]}
            </h3>
            {gift.gift_type !== 'course' && (
              <p className="text-sm text-muted-foreground">
                Срок действия: <span className="font-medium text-foreground">{formatDuration(gift.duration_days)}</span>
              </p>
            )}
            {gift.message && (
              <p className="mt-4 text-sm italic text-muted-foreground border-t border-border/50 pt-4">
                "{gift.message}"
              </p>
            )}
          </div>

          {/* Motivational message */}
          <div className="mb-6">
            <p className="text-lg font-medium text-foreground mb-1">
              Вы заслуживаете лучшего! ✨
            </p>
            <p className="text-sm text-muted-foreground">
              Наслаждайтесь вашим подарком и продолжайте путь к внутреннему спокойствию
            </p>
          </div>

          {/* Close button */}
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
            size="lg"
          >
            <Heart className="w-4 h-4 mr-2" />
            Спасибо! 💖
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiftNotification;
