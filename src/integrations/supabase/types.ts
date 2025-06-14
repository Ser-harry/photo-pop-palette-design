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
      advertisements: {
        Row: {
          clicks: number
          created_at: string
          cta_text: string
          end_date: string
          id: string
          image_url: string
          impressions: number
          is_active: boolean
          placement: string
          start_date: string
          target_url: string
          title: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          cta_text: string
          end_date: string
          id?: string
          image_url: string
          impressions?: number
          is_active?: boolean
          placement: string
          start_date: string
          target_url: string
          title: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          cta_text?: string
          end_date?: string
          id?: string
          image_url?: string
          impressions?: number
          is_active?: boolean
          placement?: string
          start_date?: string
          target_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      Billboard: {
        Row: {
          createdAt: string
          id: string
          imageUrl: string
          label: string
          storeId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          imageUrl: string
          label: string
          storeId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          imageUrl?: string
          label?: string
          storeId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          code: string
          created_at: string
          duration: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          duration?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          duration?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      Category: {
        Row: {
          billboardId: string
          createdAt: string
          id: string
          name: string
          storeId: string
          updatedAt: string
        }
        Insert: {
          billboardId: string
          createdAt?: string
          id: string
          name: string
          storeId: string
          updatedAt: string
        }
        Update: {
          billboardId?: string
          createdAt?: string
          id?: string
          name?: string
          storeId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          created_at: string
          district: string
          established: number | null
          facilities: string[] | null
          featured: boolean
          id: string
          location: string
          naac_grade: string | null
          name: string
          slug: string
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          district: string
          established?: number | null
          facilities?: string[] | null
          featured?: boolean
          id?: string
          location: string
          naac_grade?: string | null
          name: string
          slug: string
          type: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          district?: string
          established?: number | null
          facilities?: string[] | null
          featured?: boolean
          id?: string
          location?: string
          naac_grade?: string | null
          name?: string
          slug?: string
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      Color: {
        Row: {
          createdAt: string
          id: string
          name: string
          storeId: string
          updatedAt: string
          value: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          storeId: string
          updatedAt: string
          value: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          storeId?: string
          updatedAt?: string
          value?: string
        }
        Relationships: []
      }
      cutoff_data: {
        Row: {
          branch_id: string | null
          category: string
          closing_rank: number | null
          college_id: string | null
          created_at: string
          cutoff_mark: number
          id: string
          opening_rank: number | null
          year: number
        }
        Insert: {
          branch_id?: string | null
          category: string
          closing_rank?: number | null
          college_id?: string | null
          created_at?: string
          cutoff_mark: number
          id?: string
          opening_rank?: number | null
          year: number
        }
        Update: {
          branch_id?: string | null
          category?: string
          closing_rank?: number | null
          college_id?: string | null
          created_at?: string
          cutoff_mark?: number
          id?: string
          opening_rank?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "cutoff_data_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cutoff_data_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      Image: {
        Row: {
          createdAt: string
          id: string
          productId: string
          updatedAt: string
          url: string
        }
        Insert: {
          createdAt?: string
          id: string
          productId: string
          updatedAt: string
          url: string
        }
        Update: {
          createdAt?: string
          id?: string
          productId?: string
          updatedAt?: string
          url?: string
        }
        Relationships: []
      }
      Order: {
        Row: {
          address: string
          createdAt: string
          id: string
          isPaid: boolean
          phone: string
          storeId: string
          updatedAt: string
        }
        Insert: {
          address?: string
          createdAt?: string
          id: string
          isPaid?: boolean
          phone?: string
          storeId: string
          updatedAt: string
        }
        Update: {
          address?: string
          createdAt?: string
          id?: string
          isPaid?: boolean
          phone?: string
          storeId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      OrderItems: {
        Row: {
          id: string
          orderId: string
          productId: string
        }
        Insert: {
          id: string
          orderId: string
          productId: string
        }
        Update: {
          id?: string
          orderId?: string
          productId?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          page_path: string
          referrer: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Product: {
        Row: {
          categoryId: string
          colorId: string
          createdAt: string
          id: string
          isArchived: boolean
          isFeatured: boolean
          name: string
          price: number
          sizeId: string
          storeId: string
          updatedAt: string
        }
        Insert: {
          categoryId: string
          colorId: string
          createdAt?: string
          id: string
          isArchived?: boolean
          isFeatured?: boolean
          name: string
          price: number
          sizeId: string
          storeId: string
          updatedAt: string
        }
        Update: {
          categoryId?: string
          colorId?: string
          createdAt?: string
          id?: string
          isArchived?: boolean
          isFeatured?: boolean
          name?: string
          price?: number
          sizeId?: string
          storeId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          branches: string[] | null
          category: string
          college_types: string[] | null
          created_at: string
          id: string
          marks: number
          preferred_district: string | null
          results_count: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          branches?: string[] | null
          category: string
          college_types?: string[] | null
          created_at?: string
          id?: string
          marks: number
          preferred_district?: string | null
          results_count?: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          branches?: string[] | null
          category?: string
          college_types?: string[] | null
          created_at?: string
          id?: string
          marks?: number
          preferred_district?: string | null
          results_count?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Size: {
        Row: {
          createdAt: string
          id: string
          name: string
          storeId: string
          updatedAt: string
          value: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          storeId: string
          updatedAt: string
          value: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          storeId?: string
          updatedAt?: string
          value?: string
        }
        Relationships: []
      }
      Store: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          branch_id: string | null
          college_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          branch_id?: string | null
          college_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          branch_id?: string | null
          college_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          category: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_district: string | null
          tnea_marks: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_district?: string | null
          tnea_marks?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_district?: string | null
          tnea_marks?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
