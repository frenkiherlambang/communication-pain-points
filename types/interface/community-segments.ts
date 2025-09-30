export interface CommunitySegment {
  id: string; // uuid
  name: string;
  description?: string;
  criteria?: string;
}

export interface CreateCommunitySegmentInput {
  name: string;
  description?: string;
  criteria?: string;
}

export interface UpdateCommunitySegmentInput {
  name?: string;
  description?: string;
  criteria?: string;
}