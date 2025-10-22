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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          metadata: Json | null
          resource_id: string
          resource_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id: string
          resource_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          assigned_admin_id: string | null
          chapter: Database["public"]["Enums"]["chapter_type"]
          created_at: string | null
          criteria: string[] | null
          date: string
          day: number
          guest: string | null
          id: string
          image: string | null
          long_desc: string | null
          organizer: string | null
          program_outcomes: string[] | null
          rules: string[] | null
          schedule: Json | null
          short_desc: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          assigned_admin_id?: string | null
          chapter: Database["public"]["Enums"]["chapter_type"]
          created_at?: string | null
          criteria?: string[] | null
          date: string
          day: number
          guest?: string | null
          id: string
          image?: string | null
          long_desc?: string | null
          organizer?: string | null
          program_outcomes?: string[] | null
          rules?: string[] | null
          schedule?: Json | null
          short_desc?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          assigned_admin_id?: string | null
          chapter?: Database["public"]["Enums"]["chapter_type"]
          created_at?: string | null
          criteria?: string[] | null
          date?: string
          day?: number
          guest?: string | null
          id?: string
          image?: string | null
          long_desc?: string | null
          organizer?: string | null
          program_outcomes?: string[] | null
          rules?: string[] | null
          schedule?: Json | null
          short_desc?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          branch: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          requested_role: string | null
          updated_at: string | null
          year: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          requested_role?: string | null
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          requested_role?: string | null
          updated_at?: string | null
          year?: string | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          participant_branch: string
          participant_email: string
          participant_name: string
          participant_phone: string
          participant_year: string
          payment_proof_url: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          rejection_note: string | null
          status: Database["public"]["Enums"]["registration_status"]
          transaction_id: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          participant_branch: string
          participant_email: string
          participant_name: string
          participant_phone: string
          participant_year: string
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          rejection_note?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          participant_branch?: string
          participant_email?: string
          participant_name?: string
          participant_phone?: string
          participant_year?: string
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          rejection_note?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          chapter: Database["public"]["Enums"]["chapter_type"] | null
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          chapter?: Database["public"]["Enums"]["chapter_type"] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          chapter?: Database["public"]["Enums"]["chapter_type"] | null
          created_at?: string | null
          created_by?: string | null
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
      get_user_chapter: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["chapter_type"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "elite_master"
        | "super_admin"
        | "event_admin"
        | "viewer"
        | "user"
      chapter_type: "APS" | "SPS" | "PROCOM" | "CS" | "PES"
      payment_status: "pending" | "verified" | "rejected"
      registration_status: "submitted" | "confirmed" | "rejected"
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
      app_role: [
        "elite_master",
        "super_admin",
        "event_admin",
        "viewer",
        "user",
      ],
      chapter_type: ["APS", "SPS", "PROCOM", "CS", "PES"],
      payment_status: ["pending", "verified", "rejected"],
      registration_status: ["submitted", "confirmed", "rejected"],
    },
  },
} as const
