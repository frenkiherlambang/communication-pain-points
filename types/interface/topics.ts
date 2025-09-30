export interface Topic {
  id: string; // uuid
  name: string;
  category?: string;
}

export interface CreateTopicInput {
  name: string;
  category?: string;
}

export interface UpdateTopicInput {
  name?: string;
  category?: string;
}