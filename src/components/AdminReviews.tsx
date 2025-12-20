import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ReviewWithProfile {
  id: string;
  rating: number;
  text: string;
  created_at: string;
  user_id: string;
  profile: {
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    
    // First get all reviews (admin can see all via RLS policy)
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError);
      setLoading(false);
      return;
    }

    // Then get profiles for each review
    const reviewsWithProfiles: ReviewWithProfile[] = [];
    
    for (const review of reviewsData || []) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, email, avatar_url")
        .eq("id", review.user_id)
        .maybeSingle();
      
      reviewsWithProfiles.push({
        ...review,
        profile: profileData
      });
    }

    setReviews(reviewsWithProfiles);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Загрузка отзывов...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Отзывов пока нет</h3>
        <p className="text-sm text-muted-foreground">Пользователи ещё не оставили отзывов</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-2xl font-bold text-primary">{reviews.length}</p>
          <p className="text-sm text-muted-foreground">Всего отзывов</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold text-yellow-600">{getAverageRating()}</p>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-sm text-muted-foreground">Средняя оценка</p>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-xl border border-border/50 bg-background/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {review.profile?.avatar_url ? (
                  <img src={review.profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium text-foreground truncate">
                    {review.profile?.name || review.profile?.email || "Пользователь"}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.profile?.email && review.profile?.name && (
                  <p className="text-xs text-muted-foreground mb-2">{review.profile.email}</p>
                )}
                <p className="text-foreground whitespace-pre-wrap mb-2">{review.text}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(review.created_at)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;