export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'teacher' | 'admin'
export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu'
export type TaskStatus = 'todo' | 'in_progress' | 'completed'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          full_name: string
          email: string
          avatar_url: string | null
          role: UserRole
          phone_number: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          full_name: string
          email: string
          avatar_url?: string | null
          role?: UserRole
          phone_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          full_name?: string
          email?: string
          avatar_url?: string | null
          role?: UserRole
          phone_number?: string | null
        }
      }
      schedules: {
        Row: {
          id: string
          created_at: string
          subject_name: string
          day: DayName
          start_time: string
          end_time: string
          lecturer: string
          room: string
          meeting_link: string | null
          color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          subject_name: string
          day: DayName
          start_time: string
          end_time: string
          lecturer: string
          room: string
          meeting_link?: string | null
          color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          subject_name?: string
          day?: DayName
          start_time?: string
          end_time?: string
          lecturer?: string
          room?: string
          meeting_link?: string | null
          color?: string | null
        }
      }
      materials: {
        Row: {
          id: string
          created_at: string
          title: string
          subject_name: string
          week_number: number
          file_url: string
          file_name: string
          file_size: number | null
          file_type: string | null
          description: string | null
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          subject_name: string
          week_number: number
          file_url: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          description?: string | null
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          subject_name?: string
          week_number?: number
          file_url?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          description?: string | null
          uploaded_by?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          subject_name: string
          description: string | null
          due_date: string
          status: TaskStatus
          submission_link: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          subject_name: string
          description?: string | null
          due_date: string
          status?: TaskStatus
          submission_link?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          subject_name?: string
          description?: string | null
          due_date?: string
          status?: TaskStatus
          submission_link?: string | null
          created_by?: string | null
        }
      }
      announcements: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          is_urgent: boolean
          is_active: boolean
          author: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          is_urgent?: boolean
          is_active?: boolean
          author?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          is_urgent?: boolean
          is_active?: boolean
          author?: string
        }
      }
      showcases: {
        Row: {
          id: string
          created_at: string
          title: string
          subject_name: string
          student_names: string
          description: string | null
          preview_image_url: string | null
          project_url: string | null
          file_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          subject_name: string
          student_names: string
          description?: string | null
          preview_image_url?: string | null
          project_url?: string | null
          file_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          subject_name?: string
          student_names?: string
          description?: string | null
          preview_image_url?: string | null
          project_url?: string | null
          file_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      day_name: DayName
      task_status: TaskStatus
    }
  }
}
