export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          client_id: string
          created_at: string | null
          duration_minutes: number | null
          google_calendar_event_id: string | null
          id: string
          notes: string | null
          reminder_sent: boolean | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          duration_minutes?: number | null
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          google_calendar_event_id?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          cost_per_session: number | null
          created_at: string | null
          date_archived: string | null
          date_joined: string | null
          email: string | null
          goals: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          trainer_id: string
          training_days_per_week: number | null
          updated_at: string | null
        }
        Insert: {
          cost_per_session?: number | null
          created_at?: string | null
          date_archived?: string | null
          date_joined?: string | null
          email?: string | null
          goals?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          trainer_id: string
          training_days_per_week?: number | null
          updated_at?: string | null
        }
        Update: {
          cost_per_session?: number | null
          created_at?: string | null
          date_archived?: string | null
          date_joined?: string | null
          email?: string | null
          goals?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          trainer_id?: string
          training_days_per_week?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_by_trainer_id: string | null
          force_type: string
          id: string
          is_favorite: boolean | null
          is_public: boolean | null
          muscle_group: string
          name: string
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          created_by_trainer_id?: string | null
          force_type: string
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          muscle_group: string
          name: string
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          created_by_trainer_id?: string | null
          force_type?: string
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          muscle_group?: string
          name?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_created_by_trainer_id_fkey"
            columns: ["created_by_trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_records: {
        Row: {
          client_id: string
          created_at: string | null
          date: string
          exercise_id: string
          id: string
          pr_type: string | null
          reps: number
          session_id: string | null
          set_number: number
          total_volume: number | null
          weight: number
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date: string
          exercise_id: string
          id?: string
          pr_type?: string | null
          reps: number
          session_id?: string | null
          set_number: number
          total_volume?: number | null
          weight: number
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          exercise_id?: string
          id?: string
          pr_type?: string | null
          reps?: number
          session_id?: string | null
          set_number?: number
          total_volume?: number | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          refresh_token: string | null
          settings: Json | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          refresh_token?: string | null
          settings?: Json | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          refresh_token?: string | null
          settings?: Json | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_integrations_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          branding_colors: Json | null
          business_name: string | null
          client_limit: number | null
          created_at: string | null
          email: string
          first_name: string
          google_calendar_connected: boolean | null
          google_sheets_connected: boolean | null
          id: string
          last_name: string
          phone: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          branding_colors?: Json | null
          business_name?: string | null
          client_limit?: number | null
          created_at?: string | null
          email: string
          first_name: string
          google_calendar_connected?: boolean | null
          google_sheets_connected?: boolean | null
          id?: string
          last_name: string
          phone?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          branding_colors?: Json | null
          business_name?: string | null
          client_limit?: number | null
          created_at?: string | null
          email?: string
          first_name?: string
          google_calendar_connected?: boolean | null
          google_sheets_connected?: boolean | null
          id?: string
          last_name?: string
          phone?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          client_id: string
          created_at: string | null
          date: string
          duration_minutes: number | null
          id: string
          notes: string | null
          synced_to_sheets: boolean | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          synced_to_sheets?: boolean | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          synced_to_sheets?: boolean | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          is_pr: boolean | null
          reps: number
          session_id: string
          set_number: number
          weight: number
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          is_pr?: boolean | null
          reps: number
          session_id: string
          set_number: number
          weight: number
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          is_pr?: boolean | null
          reps?: number
          session_id?: string
          set_number?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_workout_sets_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string | null
          description: string | null
          exercise_ids: string[]
          id: string
          is_favorite: boolean | null
          name: string
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          exercise_ids: string[]
          id?: string
          is_favorite?: boolean | null
          name: string
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          exercise_ids?: string[]
          id?: string
          is_favorite?: boolean | null
          name?: string
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_templates_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "trainer" | "client"
      appointment_status: "scheduled" | "completed" | "cancelled" | "no_show"
      subscription_tier: "basic" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "trainer", "client"],
      appointment_status: ["scheduled", "completed", "cancelled", "no_show"],
      subscription_tier: ["basic", "pro", "enterprise"],
    },
  },
} as const
