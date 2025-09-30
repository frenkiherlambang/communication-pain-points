// Customer Feedback Interface
// Generated from customer_feedbacks_rows.sql

export type CustomerFeedbackCategory = 'Im' | 'General' | 'Ctv' | 'Da';

export type CustomerFeedbackTypeOfPost = 
  | 'Queries' 
  | 'Complaint' 
  | 'Compliment' 
  | 'Others';

export type CustomerFeedbackTopic = 
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
  'Post Copy': string;
  Date: string;
  Time: string;
  'Date responses': string;
  'Account ID': string;
  'Customer ID': string;
  Category: CustomerFeedbackCategory;
  'Type of post': CustomerFeedbackTypeOfPost;
  Topic: CustomerFeedbackTopic;
  Product: string;
  Sentiment: CustomerFeedbackSentiment;
  Source: CustomerFeedbackSource;
  Reply: string;
  Status: CustomerFeedbackStatus;
  Details: string;
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
  topic: CustomerFeedbackTopic;
  product: string;
  sentiment: CustomerFeedbackSentiment;
  source: CustomerFeedbackSource;
  reply: string;
  status: CustomerFeedbackStatus;
  details: string;
}

// Utility type for creating new customer feedback entries
export type CreateCustomerFeedback = Omit<CustomerFeedback, 'ID'>;
export type CreateCustomerFeedbackCamelCase = Omit<CustomerFeedbackCamelCase, 'id'>;

// Utility type for updating customer feedback entries
export type UpdateCustomerFeedback = Partial<CustomerFeedback> & { ID: string };
export type UpdateCustomerFeedbackCamelCase = Partial<CustomerFeedbackCamelCase> & { id: string };