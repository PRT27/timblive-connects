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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_image: string | null
          followers: number | null
          following: number | null
          full_name: string | null
          id: string
          joined: string | null
          last_sign_in: string | null
          organization: string | null
          role: string | null
          tags: string[] | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_image?: string | null
          followers?: number | null
          following?: number | null
          full_name?: string | null
          id: string
          joined?: string | null
          last_sign_in?: string | null
          organization?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_image?: string | null
          followers?: number | null
          following?: number | null
          full_name?: string | null
          id?: string
          joined?: string | null
          last_sign_in?: string | null
          organization?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      promotional_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          role: string | null
          tags: string[] | null
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id?: string
          role?: string | null
          tags?: string[] | null
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          role?: string | null
          tags?: string[] | null
          updated_at?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      stream_integrations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          platform: string
          stream_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform: string
          stream_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          stream_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      streams: {
        Row: {
          created_at: string
          description: string | null
          ended_at: string | null
          id: string
          likes_count: number | null
          scheduled_at: string | null
          started_at: string | null
          status: string | null
          stream_type: string | null
          stream_url: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          viewer_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          likes_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          viewer_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          likes_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          stream_type?: string | null
          stream_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      user_promotional_profiles: {
        Row: {
          created_at: string
          id: string
          main_user_id: string
          promotional_profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          main_user_id: string
          promotional_profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          main_user_id?: string
          promotional_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_promotional_profiles_promotional_profile_id_fkey"
            columns: ["promotional_profile_id"]
            isOneToOne: false
            referencedRelation: "promotional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      associate_promotional_profile: {
        Args: { user_uuid: string; profile_uuid: string }
        Returns: boolean
      }
      create_stream: {
        Args: {
          user_uuid: string
          stream_title: string
          stream_description?: string
          stream_type_param?: string
          stream_tags?: string[]
        }
        Returns: string
      }
      disassociate_promotional_profile: {
        Args: { user_uuid: string; profile_uuid: string }
        Returns: boolean
      }
      get_active_streams: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          title: string
          description: string
          stream_type: string
          viewer_count: number
          likes_count: number
          tags: string[]
          started_at: string
          created_at: string
        }[]
      }
      get_promotional_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          full_name: string
          username: string
          bio: string
          role: string
          avatar_url: string
          website: string
          tags: string[]
          created_at: string
        }[]
      }
      get_user_promotional_profiles: {
        Args: { user_uuid: string }
        Returns: {
          promotional_profile_id: string
        }[]
      }
      update_stream_status: {
        Args: { stream_uuid: string; new_status: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
