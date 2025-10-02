// Topic Interface
// Corresponds to the topics table

export interface Topic {
  id: string;
  name: string;
  category?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Utility type for creating new topics
export type CreateTopic = Omit<Topic, 'id' | 'created_at' | 'updated_at'>;

// Utility type for updating topics
export type UpdateTopic = Partial<Topic> & { id: string };

// Topic with statistics
export interface TopicWithStats extends Topic {
  feedback_count: number;
  unique_customers: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  positive_percentage: number;
}
