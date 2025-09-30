export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export interface Interaction {
  id: string; // uuid
  link?: string;
  post_copy?: string;
  date: Date;
  time: string; // time format
  date_response?: Date;
  user_id?: string; // uuid, foreign key to users
  customer_id?: string;
  category?: string;
  type_of_post?: string;
  topic?: string;
  product?: string;
  sentiment?: SentimentType;
  source?: string;
  reply?: string;
  status?: string;
  details?: string;
  created_at: Date; // timestamp with time zone
}

export interface CreateInteractionInput {
  link?: string;
  post_copy?: string;
  date: Date;
  time: string;
  date_response?: Date;
  user_id?: string;
  customer_id?: string;
  category?: string;
  type_of_post?: string;
  topic?: string;
  product?: string;
  sentiment?: SentimentType;
  source?: string;
  reply?: string;
  status?: string;
  details?: string;
}

export interface UpdateInteractionInput {
  link?: string;
  post_copy?: string;
  date?: Date;
  time?: string;
  date_response?: Date;
  user_id?: string;
  customer_id?: string;
  category?: string;
  type_of_post?: string;
  topic?: string;
  product?: string;
  sentiment?: SentimentType;
  source?: string;
  reply?: string;
  status?: string;
  details?: string;
}