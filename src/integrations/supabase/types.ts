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
      admin_activity_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      analytics_daily_stats: {
        Row: {
          ad_clicks: number | null
          ad_impressions: number | null
          avg_session_duration: number | null
          bounce_rate: number | null
          created_at: string
          date: string
          id: string
          total_page_views: number | null
          total_searches: number | null
          unique_visitors: number | null
          updated_at: string
        }
        Insert: {
          ad_clicks?: number | null
          ad_impressions?: number | null
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date: string
          id?: string
          total_page_views?: number | null
          total_searches?: number | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Update: {
          ad_clicks?: number | null
          ad_impressions?: number | null
          avg_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date?: string
          id?: string
          total_page_views?: number | null
          total_searches?: number | null
          unique_visitors?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      article_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          article_label: string | null
          author_id: string
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          article_label?: string | null
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          article_label?: string | null
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["id"]
          },
        ]
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
          address: string | null
          created_at: string
          display_order: number | null
          district: string
          email: string | null
          established: number | null
          facilities: string[] | null
          featured: boolean
          homepage_featured: boolean
          id: string
          image_url: string | null
          location: string
          naac_grade: string | null
          name: string
          phone: string | null
          principal_name: string | null
          slug: string
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          display_order?: number | null
          district: string
          email?: string | null
          established?: number | null
          facilities?: string[] | null
          featured?: boolean
          homepage_featured?: boolean
          id?: string
          image_url?: string | null
          location: string
          naac_grade?: string | null
          name: string
          phone?: string | null
          principal_name?: string | null
          slug: string
          type: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          display_order?: number | null
          district?: string
          email?: string | null
          established?: number | null
          facilities?: string[] | null
          featured?: boolean
          homepage_featured?: boolean
          id?: string
          image_url?: string | null
          location?: string
          naac_grade?: string | null
          name?: string
          phone?: string | null
          principal_name?: string | null
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
      crm_contacts: {
        Row: {
          contact_type: string
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contact_type?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contact_type?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_interactions: {
        Row: {
          contact_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          interaction_type: string
          lead_id: string | null
          next_action: string | null
          next_action_date: string | null
          outcome: string | null
          subject: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          interaction_type: string
          lead_id?: string | null
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          interaction_type?: string
          lead_id?: string | null
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_interactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          assigned_to: string | null
          category: string | null
          contact_id: string | null
          created_at: string
          expected_admission_year: number | null
          id: string
          interested_colleges: string[] | null
          last_contacted: string | null
          lead_source: string | null
          notes: string | null
          preferred_branches: string[] | null
          preferred_district: string | null
          priority: string
          status: string
          tnea_marks: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          contact_id?: string | null
          created_at?: string
          expected_admission_year?: number | null
          id?: string
          interested_colleges?: string[] | null
          last_contacted?: string | null
          lead_source?: string | null
          notes?: string | null
          preferred_branches?: string[] | null
          preferred_district?: string | null
          priority?: string
          status?: string
          tnea_marks?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          contact_id?: string | null
          created_at?: string
          expected_admission_year?: number | null
          id?: string
          interested_colleges?: string[] | null
          last_contacted?: string | null
          lead_source?: string | null
          notes?: string | null
          preferred_branches?: string[] | null
          preferred_district?: string | null
          priority?: string
          status?: string
          tnea_marks?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
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
      homepage_articles: {
        Row: {
          article_id: string
          created_at: string
          id: string
          is_active: boolean
          position: number
          section: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          position: number
          section?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          section?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_content: {
        Row: {
          content: Json
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          section_name: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_name: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          section_name?: string
          title?: string
          updated_at?: string
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
      temp_cutoff_import: {
        Row: {
          bc: number | null
          bcm: number | null
          branch_code: string | null
          branch_name: string | null
          college_name: string | null
          id: number
          mbc: number | null
          mbcdnc: number | null
          mbcv: number | null
          oc: number | null
          processed: boolean | null
          sc: number | null
          sca: number | null
          st: number | null
          year: number | null
        }
        Insert: {
          bc?: number | null
          bcm?: number | null
          branch_code?: string | null
          branch_name?: string | null
          college_name?: string | null
          id?: number
          mbc?: number | null
          mbcdnc?: number | null
          mbcv?: number | null
          oc?: number | null
          processed?: boolean | null
          sc?: number | null
          sca?: number | null
          st?: number | null
          year?: number | null
        }
        Update: {
          bc?: number | null
          bcm?: number | null
          branch_code?: string | null
          branch_name?: string | null
          college_name?: string | null
          id?: number
          mbc?: number | null
          mbcdnc?: number | null
          mbcv?: number | null
          oc?: number | null
          processed?: boolean | null
          sc?: number | null
          sca?: number | null
          st?: number | null
          year?: number | null
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
      aggregate_daily_analytics: {
        Args: { target_date?: string }
        Returns: undefined
      }
      check_admin_login_rate_limit: {
        Args: { email_input: string }
        Returns: boolean
      }
      get_admin_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      increment_ad_clicks: {
        Args: { ad_id: string }
        Returns: undefined
      }
      increment_ad_impressions: {
        Args: { ad_id: string }
        Returns: undefined
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      process_cutoff_import: {
        Args: { import_year?: number }
        Returns: number
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
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
      admin_role: ["super_admin", "admin", "moderator"],
    },
  },
} as const
