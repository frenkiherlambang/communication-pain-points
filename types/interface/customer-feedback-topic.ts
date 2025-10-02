// Customer Feedback Topic Pivot Interface
// Corresponds to the customer_feedback_topic pivot table

export interface CustomerFeedbackTopic {
  id: string;
  customer_feedback_id: string;
  topic_id: string;
  assigned_at?: string;
}

// Utility type for creating new customer feedback topic associations
export type CreateCustomerFeedbackTopic = Omit<CustomerFeedbackTopic, 'id' | 'assigned_at'>;

// Utility type for bulk assignment
export interface BulkAssignTopics {
  customer_feedback_id: string;
  topic_ids: string[];
}


