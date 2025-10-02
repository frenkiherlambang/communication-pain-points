// Customer Feedback Interface
// Generated from customer_feedbacks_rows.sql

import type { Topic } from './topics';

export type CustomerFeedbackCategory = 'Im' | 'General' | 'Ctv' | 'Da';

export type CustomerFeedbackTypeOfPost = 
  | 'Queries' 
  | 'Complaint' 
  | 'Compliment' 
  | 'Others';

// DEPRECATED: Use Topic interface instead for many-to-many relationship
// This type is kept for backward compatibility with the old topic text column
export type CustomerFeedbackTopicLegacy = 
  | 'Product Info'
  | 'Promo' 
  | 'Technical'
  | 'Product Release'
  | 'E-commerce'
  | 'Service Center'
  | 'Sponsor, Parternship, Job'
  | 'Pricing'
  | 'SES';

export type CustomerFeedbackSentiment = 'Neutral' | 'Negative' | 'Positive';

export type CustomerFeedbackSource = 'DM Facebook' | 'Comment Facebook';

export type CustomerFeedbackStatus = 'Clear' | 'Pending';

export interface CustomerFeedback {
  ID: string;
  Link: string;
  post_copy: string;
  date: string;
  time: string;
  dateResponses: string;
  accountId: string;
  customerId: string;
  category: CustomerFeedbackCategory;
  typeOfPost: CustomerFeedbackTypeOfPost;
  topic: CustomerFeedbackTopicLegacy; // DEPRECATED: Use topics array instead
  product: string;
  sentiment: CustomerFeedbackSentiment;
  source: CustomerFeedbackSource;
  reply: string;
  status: CustomerFeedbackStatus;
  details: string;
}

// Alternative interface with camelCase property names for better TypeScript conventions
export interface CustomerFeedbackCamelCase {
  id: string;
  link: string;
  postCopy: string;
  date: string;
  time: string;
  dateResponses: string;
  accountId: string;
  customerId: string;
  category: CustomerFeedbackCategory;
  typeOfPost: CustomerFeedbackTypeOfPost;
  topic: CustomerFeedbackTopicLegacy; // DEPRECATED: Use topics array instead
  product: string;
  sentiment: CustomerFeedbackSentiment;
  source: CustomerFeedbackSource;
  reply: string;
  status: CustomerFeedbackStatus;
  details: string;
}

// NEW: Enhanced interface with many-to-many topic relationship
export interface CustomerFeedbackWithTopics extends Omit<CustomerFeedbackCamelCase, 'topic'> {
  topics?: Topic[]; // Array of topic objects
  topicIds?: string[]; // Array of topic IDs for quick reference
}

// NEW: Interface for the database view customer_feedbacks_with_topics
export interface CustomerFeedbackWithTopicsView {
  id: string;
  link: string;
  post_copy: string;
  date: string;
  time: string;
  date_responses: string;
  account_id: string;
  customer_id: string;
  category: CustomerFeedbackCategory;
  type_of_post: CustomerFeedbackTypeOfPost;
  product: string;
  sentiment: CustomerFeedbackSentiment;
  source: CustomerFeedbackSource;
  reply: string;
  status: CustomerFeedbackStatus;
  details: string;
  created_at?: string;
  updated_at?: string;
  topics: string[]; // Array of topic names from the view
  topic_ids: string[]; // Array of topic IDs from the view
}

// Utility type for creating new customer feedback entries
export type CreateCustomerFeedback = Omit<CustomerFeedback, 'ID'>;
export type CreateCustomerFeedbackCamelCase = Omit<CustomerFeedbackCamelCase, 'id'>;

// Utility type for updating customer feedback entries
export type UpdateCustomerFeedback = Partial<CustomerFeedback> & { ID: string };
export type UpdateCustomerFeedbackCamelCase = Partial<CustomerFeedbackCamelCase> & { id: string };