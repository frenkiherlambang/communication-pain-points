-- Create the topic views that couldn't be created by the automated script
-- Run this in your Supabase SQL Editor

-- View to easily query feedbacks with their topics
CREATE OR REPLACE VIEW customer_feedbacks_with_topics AS
SELECT 
  cf.*,
  array_agg(t.name ORDER BY t.name) AS topics,
  array_agg(t.id ORDER BY t.name) AS topic_ids
FROM customer_feedbacks cf
LEFT JOIN customer_feedback_topic cft ON cf.id = cft.customer_feedback_id
LEFT JOIN topics t ON cft.topic_id = t.id
GROUP BY cf.id;

-- View to see topic statistics (REQUIRED FOR TOPICS PAGE)
CREATE OR REPLACE VIEW topic_statistics AS
SELECT 
  t.id AS topic_id,
  t.name AS topic_name,
  t.category,
  t.created_at,
  t.updated_at,
  COUNT(cft.customer_feedback_id) AS feedback_count,
  COUNT(DISTINCT cf.account_id) AS unique_customers,
  COUNT(CASE WHEN cf.sentiment = 'Positive' THEN 1 END) AS positive_count,
  COUNT(CASE WHEN cf.sentiment = 'Neutral' THEN 1 END) AS neutral_count,
  COUNT(CASE WHEN cf.sentiment = 'Negative' THEN 1 END) AS negative_count,
  ROUND(
    (COUNT(CASE WHEN cf.sentiment = 'Positive' THEN 1 END)::numeric / 
     NULLIF(COUNT(cft.customer_feedback_id), 0)) * 100, 
    2
  ) AS positive_percentage
FROM topics t
LEFT JOIN customer_feedback_topic cft ON t.id = cft.topic_id
LEFT JOIN customer_feedbacks cf ON cft.customer_feedback_id = cf.id
GROUP BY t.id, t.name, t.category, t.created_at, t.updated_at
ORDER BY feedback_count DESC;

