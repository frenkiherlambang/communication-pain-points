-- Customer Feedback Topics Pivot Table
-- This table creates a many-to-many relationship between customer_feedbacks and topics

create table if not exists customer_feedback_topic (
  id uuid primary key default gen_random_uuid(),
  customer_feedback_id uuid not null references customer_feedbacks(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  assigned_at timestamp with time zone default now(),
  unique(customer_feedback_id, topic_id)
);

-- Create indexes for better query performance
create index if not exists idx_customer_feedback_topic_feedback_id on customer_feedback_topic(customer_feedback_id);
create index if not exists idx_customer_feedback_topic_topic_id on customer_feedback_topic(topic_id);

-- Create index on both columns for efficient joins
create index if not exists idx_customer_feedback_topic_both on customer_feedback_topic(customer_feedback_id, topic_id);

