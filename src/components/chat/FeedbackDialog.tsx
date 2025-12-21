import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquareHeart, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FeedbackDialogProps {
  sessionId?: string;
  userId?: string;
}

export function FeedbackDialog({ sessionId, userId }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла — 10 МБ",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Неверный формат",
        description: "Можно загружать только изображения",
        variant: "destructive",
      });
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Выберите оценку",
        description: "Пожалуйста, поставьте оценку от 1 до 10 звёзд",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;

      // Upload photo if exists
      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("feedback-photos")
          .upload(fileName, photo);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Не удалось загрузить фотографию");
        }

        const { data: urlData } = supabase.storage
          .from("feedback-photos")
          .getPublicUrl(fileName);
        
        photoUrl = urlData.publicUrl;
      }

      // Insert feedback
      const { error } = await supabase.from("chat_feedback").insert({
        user_id: userId || null,
        session_id: sessionId || null,
        rating,
        message: message.trim() || null,
        photo_url: photoUrl,
      });

      if (error) throw error;

      toast({
        title: "Спасибо за отзыв!",
        description: "Ваша оценка помогает нам стать лучше",
      });

      // Reset form
      setRating(0);
      setMessage("");
      removePhoto();
      setOpen(false);
    } catch (error: any) {
      console.error("Feedback error:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить отзыв",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
        >
          <MessageSquareHeart size={18} />
          <span className="hidden sm:inline">Оценить</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareHeart className="h-5 w-5 text-primary" />
            Оценить общение
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Rating stars */}
          <div>
            <Label className="text-sm text-muted-foreground mb-3 block">
              Оцените качество общения с ИИ
            </Label>
            <div className="flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={cn(
                      "transition-colors",
                      star <= displayRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            {displayRating > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {displayRating}/10 звёзд
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="feedback-message" className="text-sm text-muted-foreground">
              Расскажите подробнее (необязательно)
            </Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Что вам понравилось или что можно улучшить?"
              className="mt-2 min-h-[100px] resize-none"
              maxLength={1000}
            />
          </div>

          {/* Photo upload */}
          <div>
            <Label className="text-sm text-muted-foreground">
              Прикрепить скриншот (до 10 МБ)
            </Label>
            
            {photoPreview ? (
              <div className="mt-2 relative inline-block">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="max-h-32 rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="feedback-photo"
                />
                <label
                  htmlFor="feedback-photo"
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"
                >
                  <Upload size={16} />
                  Выбрать файл
                </label>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Отправка...
              </>
            ) : (
              "Отправить отзыв"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
