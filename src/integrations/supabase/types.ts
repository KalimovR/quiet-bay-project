export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_reviews: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          ip_address: string
          message: string | null
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          ip_address: string
          message?: string | null
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          ip_address?: string
          message?: string | null
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed: boolean
          course_id: string
          created_at: string
          id: string
          last_video_seconds: number | null
          last_watched_at: string | null
          progress_percent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          created_at?: string
          id?: string
          last_video_seconds?: number | null
          last_watched_at?: string | null
          progress_percent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          created_at?: string
          id?: string
          last_video_seconds?: number | null
          last_watched_at?: string | null
          progress_percent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_purchases: {
        Row: {
          course_id: string
          id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          id?: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          audio_url: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          is_free: boolean | null
          lesson_number: number
          price: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          lesson_number: number
          price?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          lesson_number?: number
          price?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      crisis_events: {
        Row: {
          conversation_id: string | null
          created_at: string
          crisis_type: string
          detected_keywords: string[] | null
          id: string
          resources_shown: boolean | null
          response_given: string | null
          severity: number | null
          user_identifier: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          crisis_type: string
          detected_keywords?: string[] | null
          id?: string
          resources_shown?: boolean | null
          response_given?: string | null
          severity?: number | null
          user_identifier: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          crisis_type?: string
          detected_keywords?: string[] | null
          id?: string
          resources_shown?: boolean | null
          response_given?: string | null
          severity?: number | null
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "crisis_events_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_usage: {
        Row: {
          created_at: string | null
          date: string
          id: string
          ip_address: string
          minutes_used: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          ip_address: string
          minutes_used?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          ip_address?: string
          minutes_used?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      message_signals: {
        Row: {
          cognitive_style: string
          conversation_id: string
          created_at: string
          detected_themes: string[] | null
          emotional_intensity: number
          emotional_valence: number
          exclamation_count: number
          id: string
          initiative: string
          message_id: string
          question_count: number
          user_id: string | null
          verbosity: string
          word_count: number
        }
        Insert: {
          cognitive_style?: string
          conversation_id: string
          created_at?: string
          detected_themes?: string[] | null
          emotional_intensity?: number
          emotional_valence?: number
          exclamation_count?: number
          id?: string
          initiative?: string
          message_id: string
          question_count?: number
          user_id?: string | null
          verbosity?: string
          word_count?: number
        }
        Update: {
          cognitive_style?: string
          conversation_id?: string
          created_at?: string
          detected_themes?: string[] | null
          emotional_intensity?: number
          emotional_valence?: number
          exclamation_count?: number
          id?: string
          initiative?: string
          message_id?: string
          question_count?: number
          user_id?: string | null
          verbosity?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "message_signals_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_signals_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          item_id: string | null
          metadata: Json | null
          payment_id: string
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          item_id?: string | null
          metadata?: Json | null
          payment_id: string
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          item_id?: string | null
          metadata?: Json | null
          payment_id?: string
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      session_summaries: {
        Row: {
          conversation_id: string
          created_at: string
          duration_minutes: number | null
          emotional_state: string | null
          id: string
          key_themes: string[] | null
          message_count: number | null
          session_date: string
          summary: string
          user_id: string | null
          user_identifier: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          duration_minutes?: number | null
          emotional_state?: string | null
          id?: string
          key_themes?: string[] | null
          message_count?: number | null
          session_date?: string
          summary: string
          user_id?: string | null
          user_identifier: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          duration_minutes?: number | null
          emotional_state?: string | null
          id?: string
          key_themes?: string[] | null
          message_count?: number | null
          session_date?: string
          summary?: string
          user_id?: string | null
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_summaries_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      spam_logs: {
        Row: {
          created_at: string
          id: string
          ip_address: string
          reason: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
          reason: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
          reason?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          activated_at: string | null
          cancelled_at: string | null
          created_at: string | null
          expires_at: string
          id: string
          plan: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          plan: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          plan?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          id: string
          last_seen_at: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          id?: string
          last_seen_at?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          id?: string
          last_seen_at?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_memory: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          importance: number | null
          memory_type: string
          updated_at: string
          user_id: string | null
          user_identifier: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          importance?: number | null
          memory_type?: string
          updated_at?: string
          user_id?: string | null
          user_identifier: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          importance?: number | null
          memory_type?: string
          updated_at?: string
          user_id?: string | null
          user_identifier?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avg_message_length: number | null
          created_at: string
          dominant_patterns: Json
          history_snapshots: Json
          id: string
          last_interaction_at: string | null
          onboarding_completed: boolean
          total_conversations: number
          total_messages: number
          traits: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_message_length?: number | null
          created_at?: string
          dominant_patterns?: Json
          history_snapshots?: Json
          id?: string
          last_interaction_at?: string | null
          onboarding_completed?: boolean
          total_conversations?: number
          total_messages?: number
          traits?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_message_length?: number | null
          created_at?: string
          dominant_patterns?: Json
          history_snapshots?: Json
          id?: string
          last_interaction_at?: string | null
          onboarding_completed?: boolean
          total_conversations?: number
          total_messages?: number
          traits?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_grant_course: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      admin_grant_subscription: {
        Args: {
          _duration_unit?: string
          _duration_value: number
          _plan: string
          _user_id: string
        }
        Returns: boolean
      }
      get_all_profiles_for_admin: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          display_name: string
          email: string
          id: string
        }[]
      }
      get_user_email: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      migrate_ip_conversations_to_user: {
        Args: { _ip_address: string; _user_id: string }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
