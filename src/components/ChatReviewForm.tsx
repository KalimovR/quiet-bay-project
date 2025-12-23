import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatReviewFormProps {
  ipAddress: string;
  onClose: () => void;
}

const ChatReviewForm = ({ ipAddress, onClose }: ChatReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла — 10 МБ",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Неверный формат",
        description: "Можно загружать только изображения",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Выберите оценку",
        description: "Пожалуйста, поставьте оценку от 1 до 10",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("review-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Не удалось загрузить изображение");
        }

        const { data: urlData } = supabase.storage
          .from("review-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Save review
      const { error } = await supabase.from("chat_reviews").insert({
        ip_address: ipAddress,
        user_id: user?.id || null,
        rating,
        message: message.trim() || null,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Спасибо за отзыв!",
        description: "Ваша оценка помогает нам становиться лучше",
      });

      onClose();
    } catch (error) {
      console.error("Review submit error:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить отзыв",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-foreground">Оценить общение</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-secondary rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Star Rating */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Ваша оценка</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{rating} из 10</p>
        )}
      </div>

      {/* Message */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Ваш отзыв (необязательно)</p>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Расскажите о вашем опыте общения..."
          className="resize-none h-20"
          maxLength={1000}
        />
      </div>

      {/* Image Upload */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Прикрепить фото (до 10 МБ)</p>
        
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-border"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Фото</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className="w-full"
        variant="hero"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Отправить отзыв
          </>
        )}
      </Button>
    </div>
  );
};

export default ChatReviewForm;
