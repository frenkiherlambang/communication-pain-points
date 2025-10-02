# Topics Many-to-Many Relationship - Usage Guide

This guide explains how to use the new many-to-many relationship between customer feedbacks and topics in your application code.

## Overview

Previously, each customer feedback had a single `topic` field (text). Now, each feedback can be associated with multiple topics through the `customer_feedback_topic` pivot table.

## TypeScript Interfaces

### Topic Interface
```typescript
interface Topic {
  id: string;
  name: string;
  category?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

### Customer Feedback with Topics
```typescript
interface CustomerFeedbackWithTopics {
  id: string;
  // ... other feedback fields
  topics?: Topic[];
  topicIds?: string[];
}
```

## API Functions

All helper functions are available in `lib/topics-api.ts`:

### Topic Management

```typescript
import { 
  getAllTopics,
  getTopicById,
  getTopicByName,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicsWithStats
} from '@/lib/topics-api';

// Get all topics
const topics = await getAllTopics();

// Create a new topic
const newTopic = await createTopic({
  name: 'Shipping Issues',
  category: 'Logistics'
});

// Update a topic
await updateTopic({
  id: 'topic-uuid',
  name: 'Updated Name'
});

// Get topics with statistics
const statsTopics = await getTopicsWithStats();
// Returns topics with: feedback_count, unique_customers, sentiment breakdown, etc.
```

### Assigning Topics to Feedbacks

```typescript
import {
  assignTopicToFeedback,
  assignTopicsToFeedback,
  removeTopicFromFeedback,
  removeAllTopicsFromFeedback,
  replaceTopicsForFeedback,
  getTopicsForFeedback
} from '@/lib/topics-api';

// Assign a single topic
await assignTopicToFeedback('feedback-uuid', 'topic-uuid');

// Assign multiple topics at once
await assignTopicsToFeedback('feedback-uuid', ['topic-1', 'topic-2', 'topic-3']);

// Get all topics for a feedback
const feedbackTopics = await getTopicsForFeedback('feedback-uuid');

// Remove a specific topic
await removeTopicFromFeedback('feedback-uuid', 'topic-uuid');

// Replace all topics (removes old, adds new)
await replaceTopicsForFeedback('feedback-uuid', ['new-topic-1', 'new-topic-2']);
```

### Utility Functions

```typescript
import { getOrCreateTopic, bulkAssignTopics } from '@/lib/topics-api';

// Get existing topic or create if doesn't exist
const topic = await getOrCreateTopic('Product Info', 'General');

// Bulk assign topics to multiple feedbacks
await bulkAssignTopics([
  { feedbackId: 'feedback-1', topicIds: ['topic-1', 'topic-2'] },
  { feedbackId: 'feedback-2', topicIds: ['topic-3'] },
  { feedbackId: 'feedback-3', topicIds: ['topic-1', 'topic-3'] }
]);
```

## Direct SQL Queries

If you prefer to use Supabase queries directly:

### Query feedbacks with topics
```typescript
const { data } = await supabase
  .from('customer_feedbacks_with_topics')
  .select('*');
// Returns feedbacks with topics as arrays
```

### Query with specific topics
```typescript
const { data } = await supabase
  .from('customer_feedbacks')
  .select(`
    *,
    customer_feedback_topic!inner (
      topics (
        id,
        name,
        category
      )
    )
  `)
  .eq('customer_feedback_topic.topics.name', 'Product Info');
```

### Get topic statistics
```typescript
const { data } = await supabase
  .from('topic_statistics')
  .select('*')
  .order('feedback_count', { ascending: false })
  .limit(10);
```

## Migration from Legacy Code

If you're migrating from the old single-topic field:

### Before (legacy)
```typescript
const feedback = {
  topic: 'Product Info', // single text value
  // ... other fields
};
```

### After (new)
```typescript
// Option 1: Using the API
const feedback = await createFeedback({ /* fields */ });
await assignTopicsToFeedback(feedback.id, [topicId1, topicId2]);

// Option 2: Using the view
const { data } = await supabase
  .from('customer_feedbacks_with_topics')
  .select('*')
  .eq('id', feedbackId)
  .single();
// data.topics will be an array of topic names
```

## Example: Creating a Feedback with Topics

```typescript
import { supabase } from '@/lib/topics-api';
import { getOrCreateTopic, assignTopicsToFeedback } from '@/lib/topics-api';

async function createFeedbackWithTopics(
  feedbackData: any,
  topicNames: string[]
) {
  // 1. Create the feedback
  const { data: feedback, error: feedbackError } = await supabase
    .from('customer_feedbacks')
    .insert(feedbackData)
    .select()
    .single();

  if (feedbackError) throw feedbackError;

  // 2. Get or create topics
  const topicIds = await Promise.all(
    topicNames.map(async (name) => {
      const topic = await getOrCreateTopic(name);
      return topic.id;
    })
  );

  // 3. Assign topics to feedback
  await assignTopicsToFeedback(feedback.id, topicIds);

  return feedback;
}

// Usage
const newFeedback = await createFeedbackWithTopics(
  {
    post_copy: 'Great product!',
    sentiment: 'Positive',
    // ... other fields
  },
  ['Product Info', 'Pricing', 'Technical']
);
```

## Example: Updating Topics for Existing Feedback

```typescript
import { replaceTopicsForFeedback, getOrCreateTopic } from '@/lib/topics-api';

async function updateFeedbackTopics(
  feedbackId: string,
  newTopicNames: string[]
) {
  // Get or create all topics
  const topicIds = await Promise.all(
    newTopicNames.map(async (name) => {
      const topic = await getOrCreateTopic(name);
      return topic.id;
    })
  );

  // Replace all topics for this feedback
  await replaceTopicsForFeedback(feedbackId, topicIds);
}

// Usage
await updateFeedbackTopics('feedback-uuid', ['Technical', 'Support']);
```

## Example: Filtering Feedbacks by Topics

```typescript
import { supabase } from '@/lib/topics-api';

async function getFeedbacksByTopics(topicNames: string[]) {
  const { data, error } = await supabase
    .from('customer_feedbacks_with_topics')
    .select('*');

  if (error) throw error;

  // Filter feedbacks that have any of the specified topics
  const filtered = data.filter(feedback =>
    feedback.topics.some(topic => topicNames.includes(topic))
  );

  return filtered;
}

// Usage
const techFeedbacks = await getFeedbacksByTopics(['Technical', 'Product Info']);
```

## Best Practices

1. **Use `getOrCreateTopic`** when importing data to automatically create topics as needed
2. **Use `replaceTopicsForFeedback`** when updating to avoid manual cleanup
3. **Use the `customer_feedbacks_with_topics` view** for read operations to get topics as arrays
4. **Use `bulkAssignTopics`** for batch operations to reduce database round trips
5. **Cache topic lookups** in your application if you're doing frequent topic name -> ID conversions

## Performance Tips

- The pivot table has indexes on both foreign keys and their combination
- Use the `customer_feedbacks_with_topics` view for efficient topic retrieval
- The `topic_statistics` view provides pre-aggregated data for dashboards
- Consider caching topic lists as they typically don't change frequently


