// Export all interfaces
export * from './users';
export * from './topics';
export * from './interactions';
export * from './community-segments';
export * from './user-segments';
export * from './customer-feedbacks';

// Re-export commonly used types for convenience
export type { User, CreateUserInput, UpdateUserInput } from './users';
export type { Topic, CreateTopicInput, UpdateTopicInput } from './topics';
export type { 
  Interaction, 
  CreateInteractionInput, 
  UpdateInteractionInput, 
  SentimentType 
} from './interactions';
export type { 
  CommunitySegment, 
  CreateCommunitySegmentInput, 
  UpdateCommunitySegmentInput 
} from './community-segments';
export type { 
  UserSegment, 
  CreateUserSegmentInput, 
  UpdateUserSegmentInput,
  UserSegmentWithDetails 
} from './user-segments';
export type {
  CustomerFeedback,
  CustomerFeedbackCamelCase,
  CustomerFeedbackCategory,
  CustomerFeedbackTypeOfPost,
  CustomerFeedbackTopic,
  CustomerFeedbackSentiment,
  CustomerFeedbackSource,
  CustomerFeedbackStatus,
  CreateCustomerFeedback,
  CreateCustomerFeedbackCamelCase,
  UpdateCustomerFeedback,
  UpdateCustomerFeedbackCamelCase
} from './customer-feedbacks';