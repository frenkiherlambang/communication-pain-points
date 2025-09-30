export interface UserSegment {
  id: string; // uuid
  user_id: string; // uuid, foreign key to users
  segment_id: string; // uuid, foreign key to community_segments
  assigned_at: Date; // timestamp with time zone
}

export interface CreateUserSegmentInput {
  user_id: string;
  segment_id: string;
}

export interface UpdateUserSegmentInput {
  user_id?: string;
  segment_id?: string;
}

// Interface for joined data when querying user segments with related data
export interface UserSegmentWithDetails {
  id: string;
  user_id: string;
  segment_id: string;
  assigned_at: Date;
  user?: {
    id: string;
    account_id: string;
    platform: string;
    profile_url?: string;
  };
  segment?: {
    id: string;
    name: string;
    description?: string;
    criteria?: string;
  };
}