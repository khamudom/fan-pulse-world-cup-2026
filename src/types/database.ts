export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          favorite_country: string | null;
          secondary_country: string | null;
          favorite_player_ids: string[];
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          favorite_country?: string | null;
          secondary_country?: string | null;
          favorite_player_ids?: string[];
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          favorite_country?: string | null;
          secondary_country?: string | null;
          favorite_player_ids?: string[];
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          predicted_home: number;
          predicted_away: number;
          resolved: boolean;
          correct: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          predicted_home: number;
          predicted_away: number;
          resolved?: boolean;
          correct?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          predicted_home?: number;
          predicted_away?: number;
          resolved?: boolean;
          correct?: boolean | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_stats: {
        Row: {
          user_id: string;
          points: number;
          level: number;
          current_streak: number;
          last_check_in: string | null;
          prediction_accuracy: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          points?: number;
          level?: number;
          current_streak?: number;
          last_check_in?: string | null;
          prediction_accuracy?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          points?: number;
          level?: number;
          current_streak?: number;
          last_check_in?: string | null;
          prediction_accuracy?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      point_events: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          points: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          points: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          points?: number;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          points: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          points: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          points?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      challenge_completions: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          completed_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
          completed_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          completed_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      daily_briefings: {
        Row: {
          id: string;
          user_id: string;
          briefing_date: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          briefing_date: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          briefing_date?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      bracket_predictions: {
        Row: {
          id: string;
          user_id: string;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserStats = Database["public"]["Tables"]["user_stats"]["Row"];
export type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
