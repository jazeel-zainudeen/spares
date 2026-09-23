export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      car_companies: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      car_models: {
        Row: {
          id: string
          company_id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      parts: {
        Row: {
          id: string
          model_id: string
          ref_number: string
          oem_number: string | null
          item: string
          description: string | null
          image_url: string | null
          cloudinary_public_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          model_id: string
          ref_number: string
          oem_number?: string | null
          item: string
          description?: string | null
          image_url?: string | null
          cloudinary_public_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          model_id?: string
          ref_number?: string
          oem_number?: string | null
          item?: string
          description?: string | null
          image_url?: string | null
          cloudinary_public_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
