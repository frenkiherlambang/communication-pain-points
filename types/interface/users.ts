export interface User {
  id: string; // uuid
  account_id: string;
  platform: string;
  profile_url?: string;
  first_interaction_date?: Date;
  last_interaction_date?: Date;
  total_interactions: number;
  avg_sentiment: number; // numeric(3,2)
}

export interface CreateUserInput {
  account_id: string;
  platform: string;
  profile_url?: string;
  first_interaction_date?: Date;
  last_interaction_date?: Date;
  total_interactions?: number;
  avg_sentiment?: number;
}

export interface UpdateUserInput {
  account_id?: string;
  platform?: string;
  profile_url?: string;
  first_interaction_date?: Date;
  last_interaction_date?: Date;
  total_interactions?: number;
  avg_sentiment?: number;
}