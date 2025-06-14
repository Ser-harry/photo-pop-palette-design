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
