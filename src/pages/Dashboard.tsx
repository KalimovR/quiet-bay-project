import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import GiftNotification from "@/components/GiftNotification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User, Play, Clock, LogOut, BookOpen, Camera, Pencil, Check, X, CreditCard, Calendar, Shield, Mail, Lock, Phone, Eye, EyeOff, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { z } from "zod";
import ReviewForm from "@/components/ReviewForm";
import AdminReviews from "@/components/AdminReviews";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<{ name: string | null; avatar_url: string | null }>({ name: null, avatar_url: null });
  const [editName, setEditName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("+7");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [securityTab, setSecurityTab] = useState("password");
  const [subscription, setSubscription] = useState<{ tier: string; starts_at: string; expires_at: string | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Quiet Bay — Личный кабинет";

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
        fetchSubscription(session.user.id);
        checkAdminRole(session.user.id);
      }
      setLoading(false);
    });

    return () => authSub.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("name, avatar_url").eq("id", userId).single();
    if (!error && data) {
      setProfile(data);
      setEditName(data.name || "");
    } else if (error?.code === "PGRST116") {
      const { error: insertError } = await supabase.from("profiles").insert({ id: userId, name: user?.user_metadata?.name || null });
      if (!insertError) {
        setProfile({ name: user?.user_metadata?.name || null, avatar_url: null });
        setEditName(user?.user_metadata?.name || "");
      }
    }
  };

  const fetchSubscription = async (userId: string) => {
    const { data, error } = await supabase.from("user_subscriptions").select("tier, starts_at, expires_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!error && data) setSubscription(data);
  };

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!error && data) {
      setIsAdmin(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Вы вышли из аккаунта");
    navigate("/");
  };

  // Rendering components
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {user && <GiftNotification userId={user.id} />}

      {/* Main Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleAvatarClick}>
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <button onClick={handleAvatarClick} disabled={uploadingAvatar} className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                      {uploadingAvatar ? <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Camera className="w-3 h-3" />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-40" placeholder="Ваше имя" maxLength={100} />
                        <button onClick={handleSaveName} className="p-1 text-green-600 hover:text-green-700"><Check className="w-5 h-5" /></button>
                        <button onClick={handleCancelEdit} className="p-1 text-red-500 hover:text-red-600"><X className="w-5 h-5" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="font-display text-xl font-semibold text-foreground">{profile.name || "Пользователь"}</h1>
                        <button onClick={() => setIsEditingName(true)} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>

            {/* Admin Reviews Section */}
            {isAdmin && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Отзывы пользователей</h2>
                </div>
                <AdminReviews />
              </div>
            )}

            {/* Leave Review Section for regular users */}
            {!isAdmin && user && (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Оставить отзыв</h2>
                </div>
                <ReviewForm userId={user.id} />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
