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
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          location: string | null
          images: string[]
          status: 'upcoming' | 'past'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          location?: string | null
          images?: string[]
          status?: 'upcoming' | 'past'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          location?: string | null
          images?: string[]
          status?: 'upcoming' | 'past'
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          member_name: string
          title: string
          rank: string | null
          description: string | null
          date: string
          category: 'Academic' | 'Sports' | 'Cultural' | 'Other'
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          member_name: string
          title: string
          rank?: string | null
          description?: string | null
          date: string
          category?: 'Academic' | 'Sports' | 'Cultural' | 'Other'
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          member_name?: string
          title?: string
          rank?: string | null
          description?: string | null
          date?: string
          category?: 'Academic' | 'Sports' | 'Cultural' | 'Other'
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          name: string
          role: string
          photo: string | null
          year: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string
          photo?: string | null
          year: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          photo?: string | null
          year?: number
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          donor_name: string
          email: string
          amount: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          donor_name: string
          email: string
          amount: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          donor_name?: string
          email?: string
          amount?: number
          date?: string
          created_at?: string
        }
      }
      donation_goals: {
        Row: {
          id: string
          goal_amount: number
          current_amount: number
          title: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          goal_amount: number
          current_amount?: number
          title: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          goal_amount?: number
          current_amount?: number
          title?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
