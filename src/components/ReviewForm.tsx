import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Check } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  userId: string;
}

interface Review {
  id: string;
  rating: number;
  text: string;
  created_at: string;
}

const ReviewForm = ({ userId }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingReview, setLoadingReview] = useState(true);

  useEffect(() => {
    fetchExistingReview();
  }, [userId]);

  const fetchExistingReview = async () => {
    setLoadingReview(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setExistingReview(data);
      setRating(data.rating);
      setText(data.text);
    }
    setLoadingReview(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Пожалуйста, выберите оценку");
      return;
    }
    
    if (text.trim().length === 0) {
      toast.error("Пожалуйста, напишите отзыв");
      return;
    }

    if (text.length > 1000) {
      toast.error("Отзыв не должен превышать 1000 символов");
      return;
    }

    setLoading(true);

    try {
      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from("reviews")
          .update({ rating, text: text.trim() })
          .eq("id", existingReview.id);

        if (error) throw error;
        toast.success("Отзыв обновлён");
        setExistingReview({ ...existingReview, rating, text: text.trim() });
        setIsEditing(false);
      } else {
        // Insert new review
        const { data, error } = await supabase
          .from("reviews")
          .insert({ user_id: userId, rating, text: text.trim() })
          .select()
          .single();

        if (error) throw error;
        toast.success("Спасибо за ваш отзыв!");
        setExistingReview(data);
      }
    } catch (error: any) {
      toast.error(error.message || "Не удалось сохранить отзыв");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", existingReview.id);

      if (error) throw error;
      toast.success("Отзыв удалён");
      setExistingReview(null);
      setRating(0);
      setText("");
    } catch (error: any) {
      toast.error("Не удалось удалить отзыв");
    } finally {
      setLoading(false);
    }
  };

  if (loadingReview) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  // Show existing review
  if (existingReview && !isEditing) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < existingReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">{existingReview.rating}/10</span>
          </div>
          <p className="text-foreground whitespace-pre-wrap">{existingReview.text}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete} disabled={loading}>
            Удалить
          </Button>
        </div>
      </div>
    );
  }

  // Show form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Ваша оценка
        </label>
        <div className="flex items-center gap-1">
          {[...Array(10)].map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    starValue <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30 hover:text-muted-foreground/50"
                  }`}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-3 text-sm text-muted-foreground">{rating}/10</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Ваш отзыв
        </label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Расскажите о вашем опыте использования..."
          className="min-h-[120px] resize-none"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {text.length}/1000
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || rating === 0 || text.trim().length === 0}>
          {loading ? "Сохранение..." : existingReview ? "Сохранить изменения" : "Отправить отзыв"}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={() => {
            setIsEditing(false);
            setRating(existingReview?.rating || 0);
            setText(existingReview?.text || "");
          }}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;