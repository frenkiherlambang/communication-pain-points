// Topics API
// Helper functions for managing topics and customer feedback topic relationships

import { createClient } from '@supabase/supabase-js';
import type { Topic, CreateTopic, UpdateTopic, TopicWithStats } from '@/types/interface/topics';
import type { CustomerFeedbackTopic } from '@/types/interface/customer-feedback-topic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===========================
// TOPIC MANAGEMENT
// ===========================

/**
 * Fetch all topics
 */
export async function getAllTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single topic by ID
 */
export async function getTopicById(id: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching topic:', error);
    throw error;
  }

  return data;
}

/**
 * Get a topic by name
 */
export async function getTopicByName(name: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('name', name)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching topic by name:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new topic
 */
export async function createTopic(topic: CreateTopic): Promise<Topic> {
  const { data, error } = await supabase
    .from('topics')
    .insert(topic)
    .select()
    .single();

  if (error) {
    console.error('Error creating topic:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing topic
 */
export async function updateTopic(topic: UpdateTopic): Promise<Topic> {
  const { id, ...updates } = topic;
  
  const { data, error } = await supabase
    .from('topics')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating topic:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a topic
 * Note: This will also delete all associations in customer_feedback_topic due to CASCADE
 */
export async function deleteTopic(id: string): Promise<void> {
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
}

/**
 * Get topics with statistics
 */
export async function getTopicsWithStats(): Promise<TopicWithStats[]> {
  const { data, error } = await supabase
    .from('topic_statistics')
    .select('*')
    .order('feedback_count', { ascending: false });

  if (error) {
    console.error('Error fetching topic statistics:', error);
    throw error;
  }

  // Map database field names to interface field names
  return (data || []).map((item: {
    topic_id: string;
    topic_name: string;
    category: string | null;
    feedback_count: number;
    unique_customers: number;
    positive_count: number;
    neutral_count: number;
    negative_count: number;
    positive_percentage: number;
    created_at?: string;
    updated_at?: string;
  }) => ({
    id: item.topic_id,
    name: item.topic_name,
    category: item.category,
    feedback_count: item.feedback_count,
    unique_customers: item.unique_customers,
    positive_count: item.positive_count,
    neutral_count: item.neutral_count,
    negative_count: item.negative_count,
    positive_percentage: item.positive_percentage,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

// ===========================
// CUSTOMER FEEDBACK TOPIC RELATIONSHIPS
// ===========================

/**
 * Get all topics for a specific customer feedback
 */
export async function getTopicsForFeedback(feedbackId: string): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('customer_feedback_topic')
    .select(`
      topics (
        id,
        name,
        category,
        created_at,
        updated_at
      )
    `)
    .eq('customer_feedback_id', feedbackId);

  if (error) {
    console.error('Error fetching topics for feedback:', error);
    throw error;
  }

  // Extract topics from the nested response
  // Supabase returns topics as an array in the relationship
  const result: Topic[] = [];
  if (data) {
    for (const item of data) {
      const topics = (item as { topics: Topic | Topic[] | null }).topics;
      if (topics) {
        if (Array.isArray(topics)) {
          result.push(...topics);
        } else {
          result.push(topics);
        }
      }
    }
  }
  return result;
}

/**
 * Get all customer feedbacks for a specific topic
 */
export async function getFeedbacksForTopic(topicId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('customer_feedback_topic')
    .select('customer_feedback_id')
    .eq('topic_id', topicId);

  if (error) {
    console.error('Error fetching feedbacks for topic:', error);
    throw error;
  }

  return data?.map(item => item.customer_feedback_id) || [];
}

/**
 * Assign a topic to a customer feedback
 */
export async function assignTopicToFeedback(
  feedbackId: string, 
  topicId: string
): Promise<CustomerFeedbackTopic> {
  const { data, error } = await supabase
    .from('customer_feedback_topic')
    .insert({
      customer_feedback_id: feedbackId,
      topic_id: topicId
    })
    .select()
    .single();

  if (error) {
    console.error('Error assigning topic to feedback:', error);
    throw error;
  }

  return data;
}

/**
 * Assign multiple topics to a customer feedback
 */
export async function assignTopicsToFeedback(
  feedbackId: string,
  topicIds: string[]
): Promise<CustomerFeedbackTopic[]> {
  const assignments = topicIds.map(topicId => ({
    customer_feedback_id: feedbackId,
    topic_id: topicId
  }));

  const { data, error } = await supabase
    .from('customer_feedback_topic')
    .insert(assignments)
    .select();

  if (error) {
    console.error('Error assigning topics to feedback:', error);
    throw error;
  }

  return data || [];
}

/**
 * Remove a topic from a customer feedback
 */
export async function removeTopicFromFeedback(
  feedbackId: string,
  topicId: string
): Promise<void> {
  const { error } = await supabase
    .from('customer_feedback_topic')
    .delete()
    .eq('customer_feedback_id', feedbackId)
    .eq('topic_id', topicId);

  if (error) {
    console.error('Error removing topic from feedback:', error);
    throw error;
  }
}

/**
 * Remove all topics from a customer feedback
 */
export async function removeAllTopicsFromFeedback(feedbackId: string): Promise<void> {
  const { error } = await supabase
    .from('customer_feedback_topic')
    .delete()
    .eq('customer_feedback_id', feedbackId);

  if (error) {
    console.error('Error removing all topics from feedback:', error);
    throw error;
  }
}

/**
 * Replace all topics for a customer feedback
 * This removes existing topics and assigns new ones in a single operation
 */
export async function replaceTopicsForFeedback(
  feedbackId: string,
  topicIds: string[]
): Promise<CustomerFeedbackTopic[]> {
  // First, remove all existing topics
  await removeAllTopicsFromFeedback(feedbackId);

  // Then, assign the new topics
  if (topicIds.length === 0) {
    return [];
  }

  return await assignTopicsToFeedback(feedbackId, topicIds);
}

/**
 * Get or create topic by name
 * Useful when importing data or creating topics on the fly
 */
export async function getOrCreateTopic(name: string, category?: string): Promise<Topic> {
  // Try to find existing topic
  let topic = await getTopicByName(name);
  
  // If not found, create it
  if (!topic) {
    topic = await createTopic({ name, category });
  }

  return topic;
}

/**
 * Bulk assign topics to multiple feedbacks
 * Useful for batch operations
 */
export async function bulkAssignTopics(
  assignments: { feedbackId: string; topicIds: string[] }[]
): Promise<void> {
  const allAssignments = assignments.flatMap(({ feedbackId, topicIds }) =>
    topicIds.map(topicId => ({
      customer_feedback_id: feedbackId,
      topic_id: topicId
    }))
  );

  const { error } = await supabase
    .from('customer_feedback_topic')
    .insert(allAssignments);

  if (error) {
    console.error('Error bulk assigning topics:', error);
    throw error;
  }
}


